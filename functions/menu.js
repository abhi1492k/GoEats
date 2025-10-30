const fs = require('fs');
const path = require('path');

exports.handler = async function (event, context) {
  try {
    const dataPath = path.join(__dirname, 'data', 'menu.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const menu = JSON.parse(raw);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menu),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read menu' }),
    };
  }
};
