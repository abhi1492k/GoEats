const fs = require('fs')
const path = require('path')

async function run() {
  const usersPath = path.join(__dirname, '..', 'functions', 'data', 'users.json')
  // reset users
  fs.writeFileSync(usersPath, '[]')

  const signup = require('../functions/signup')
  const login = require('../functions/login')

  console.log('Running signup test...')
  const signupEvent = { httpMethod: 'POST', body: JSON.stringify({ name: 'Test User', email: 'smoketest@example.com', password: 'secret123' }) }
  const sres = await signup.handler(signupEvent)
  console.log('Signup status:', sres.statusCode)
  try { console.log('Signup body:', JSON.parse(sres.body)) } catch(e){ console.log('Signup raw body', sres.body) }

  console.log('\nRunning login test...')
  const loginEvent = { httpMethod: 'POST', body: JSON.stringify({ email: 'smoketest@example.com', password: 'secret123' }) }
  const lres = await login.handler(loginEvent)
  console.log('Login status:', lres.statusCode)
  try { console.log('Login body:', JSON.parse(lres.body)) } catch(e){ console.log('Login raw body', lres.body) }
}

run().catch(err=>{ console.error(err); process.exit(1) })
