require('dotenv').config();
const app = require('./app');
const { getPool } = require('./db');

const PORT = process.env.PORT || 3002;

async function start() {
  try {
    await getPool();
    app.listen(PORT, () => {
      console.log(`Shipment API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start Shipment API:', err.message);
    process.exit(1);
  }
}

start();