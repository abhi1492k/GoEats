const fs = require('fs');
const path = require('path');

const ordersFile = path.join(__dirname, 'data', 'orders.json');

function readOrders() {
  try {
    const raw = fs.readFileSync(ordersFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

exports.handler = async function (event) {
  if (event.httpMethod === 'GET') {
    const orders = readOrders();
    return { statusCode: 200, body: JSON.stringify(orders) };
  }

  if (event.httpMethod === 'POST') {
    try {
      const payload = JSON.parse(event.body);
      // Enforce Chennai-only delivery
      if (!payload.city || payload.city.toLowerCase() !== 'chennai') {
        return { statusCode: 400, body: JSON.stringify({ error: 'Delivery allowed only within Chennai' }) };
      }

      const orders = readOrders();
      const newOrder = {
        id: Date.now(),
        items: payload.items || [],
        total: payload.total || 0,
        city: payload.city,
        customer: payload.customer || {},
        createdAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      writeOrders(orders);
      return { statusCode: 201, body: JSON.stringify(newOrder) };
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid order payload' }) };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
