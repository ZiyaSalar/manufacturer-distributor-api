require('dotenv').config();
const app = require('./app');
const { getPool } = require('./db');

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await getPool(); // fail fast if DB connection is bad
    app.listen(PORT, () => {
      console.log(`Product API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start Product API:', err.message);
    process.exit(1);
  }
}

start();