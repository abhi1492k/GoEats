const https = require('https')

const hook = process.argv[2] || process.env.NETLIFY_BUILD_HOOK
if (!hook) {
  console.error('Usage: node trigger-netlify-build.js <build_hook_url>')
  console.error('Or set NETLIFY_BUILD_HOOK env var')
  process.exit(1)
}

const url = new URL(hook)
const opts = {
  method: 'POST',
  hostname: url.hostname,
  path: url.pathname + (url.search || ''),
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': 2,
  },
}

const req = https.request(opts, (res) => {
  console.log('status', res.statusCode)
  let body = ''
  res.on('data', (c) => (body += c))
  res.on('end', () => {
    if (body) console.log('body', body)
  })
})

req.on('error', (err) => {
  console.error('Request error:', err.message)
  process.exit(1)
})

req.write('{}')
req.end()
