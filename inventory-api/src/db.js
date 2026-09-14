const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
};

let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config)
      .then(pool => {
        console.log('Inventory API connected to Azure SQL');
        return pool;
      })
      .catch(err => {
        console.error('Database connection failed:', err.message);
        throw err;
      });
  }
  return poolPromise;
}

module.exports = { sql, getPool };