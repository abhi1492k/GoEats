const fs = require('fs')
const path = require('path')
const { handler } = require('../orders')

const ordersFile = path.join(__dirname, '..', 'data', 'orders.json')

describe('orders function', () => {
  test('GET returns array (200)', async () => {
    const res = await handler({ httpMethod: 'GET' })
    expect(res).toBeDefined()
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(Array.isArray(body)).toBe(true)
  })

  test('POST with Chennai succeeds (201) and writes order', async () => {
    const before = JSON.parse(fs.readFileSync(ordersFile, 'utf8') || '[]')
    const payload = { items: [{ id: 1, name: 'Test' }], total: 100, city: 'Chennai', customer: { name: 'Test' } }
    const res = await handler({ httpMethod: 'POST', body: JSON.stringify(payload) })
    expect(res).toBeDefined()
    expect(res.statusCode).toBe(201)
    const order = JSON.parse(res.body)
    expect(order).toHaveProperty('id')
    // verify file contains the new order
    const after = JSON.parse(fs.readFileSync(ordersFile, 'utf8') || '[]')
    expect(after.length).toBeGreaterThanOrEqual(before.length + 1)
  })
})
