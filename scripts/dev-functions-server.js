// Minimal local server to mount Netlify-style functions for frontend integration during dev.
// Usage: node ./scripts/dev-functions-server.js
const http = require('http')
const url = require('url')
const path = require('path')

const PORT = process.env.FUNCTIONS_PORT ? parseInt(process.env.FUNCTIONS_PORT, 10) : 8888

function sendJson(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, Object.assign({ 'Content-Type': 'application/json' }, headers))
  res.end(typeof body === 'string' ? body : JSON.stringify(body))
}

async function handleFunction(funcName, req, res) {
  try {
    // require the function module
    const fnPath = path.join(__dirname, '..', 'functions', funcName + '.js')
    const mod = require(fnPath)
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const rawBody = Buffer.concat(chunks).toString() || ''

    const event = {
      httpMethod: req.method,
      path: req.url,
      headers: req.headers,
      body: rawBody || undefined,
      queryStringParameters: url.parse(req.url, true).query || {}
    }

    const context = {}
    const result = await mod.handler(event, context)
    // result expected to be { statusCode, headers?, body }
    const status = result && result.statusCode ? result.statusCode : 200
    const headers = (result && result.headers) || {}
    const body = result && result.body ? result.body : ''
    // ensure body is string
    const parsedBody = typeof body === 'string' ? body : JSON.stringify(body)
    res.writeHead(status, headers)
    res.end(parsedBody)
  } catch (err) {
    console.error('Function server error:', err)
    sendJson(res, 500, { error: 'Function error', message: err.message })
  }
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url)
  // match /.netlify/functions/<name>
  const match = parsed.pathname.match(/^\/.netlify\/functions\/(.+)$/)
  if (match) {
    const funcName = match[1]
    return handleFunction(funcName, req, res)
  }
  // simple root responder
  if (parsed.pathname === '/') {
    return sendJson(res, 200, { status: 'dev functions server', url: req.url })
  }
  sendJson(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`Dev functions server listening on http://localhost:${PORT}`)
  console.log('Available functions: signup, login (mounted at /.netlify/functions/<name>)')
})
