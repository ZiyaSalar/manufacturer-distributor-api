const express = require('express');
const { sql, getPool } = require('../db');
const router = express.Router();

// POST /products — create a new medicine
router.post('/', async (req, res) => {
  const { medicineCode, medicineName, manufacturerId, status } = req.body;

  if (!medicineCode || !medicineName || !manufacturerId) {
    return res.status(400).json({
      error: 'medicineCode, medicineName and manufacturerId are required'
    });
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('medicineCode', sql.VarChar, medicineCode)
      .input('medicineName', sql.VarChar, medicineName)
      .input('manufacturerId', sql.VarChar, manufacturerId)
      .input('status', sql.VarChar, status || 'ACTIVE')
      .query(`
        INSERT INTO ProductMaster (MedicineCode, MedicineName, ManufacturerId, Status)
        VALUES (@medicineCode, @medicineName, @manufacturerId, @status)
      `);

    res.status(201).json({ medicineCode, medicineName, manufacturerId, status: status || 'ACTIVE' });
  } catch (err) {
    if (err.number === 2627) {
      // SQL Server's duplicate primary key error code
      return res.status(409).json({ error: `Product ${medicineCode} already exists` });
    }
    if (err.number === 547) {
      // SQL Server's foreign key violation error code
      return res.status(400).json({ error: `manufacturerId ${manufacturerId} does not exist` });
    }
    console.error(err);
    res.status(500).json({ error: 'Database error while creating product' });
  }
});

// GET /products — list all medicines
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM ProductMaster');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching products' });
  }
});

// GET /products/:code — get one medicine by code
router.get('/:code', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('code', sql.VarChar, req.params.code)
      .query('SELECT * FROM ProductMaster WHERE MedicineCode = @code');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: `Product ${req.params.code} not found` });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching product' });
  }
});

module.exports = router;