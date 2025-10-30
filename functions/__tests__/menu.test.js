const { handler } = require('../menu')

describe('menu function', () => {
  test('returns 200 and an array of menu items', async () => {
    const res = await handler()
    expect(res).toBeDefined()
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
    expect(body[0]).toHaveProperty('id')
    expect(body[0]).toHaveProperty('name')
  })
})
