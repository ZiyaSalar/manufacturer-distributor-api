const express = require('express');
const { sql, getPool } = require('../db');
const router = express.Router();

// POST /manufacturers — register a new manufacturer
router.post('/', async (req, res) => {
  const { manufacturerId, manufacturerName } = req.body;

  if (!manufacturerId || !manufacturerName) {
    return res.status(400).json({
      error: 'manufacturerId and manufacturerName are required'
    });
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('manufacturerId', sql.VarChar, manufacturerId)
      .input('manufacturerName', sql.VarChar, manufacturerName)
      .query(`
        INSERT INTO Manufacturers (ManufacturerId, ManufacturerName)
        VALUES (@manufacturerId, @manufacturerName)
      `);

    res.status(201).json({ manufacturerId, manufacturerName });
  } catch (err) {
    if (err.number === 2627) {
      return res.status(409).json({ error: `Manufacturer ${manufacturerId} already exists` });
    }
    console.error(err);
    res.status(500).json({ error: 'Database error while creating manufacturer' });
  }
});

// GET /manufacturers — list all manufacturers (needed for the dropdown)
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Manufacturers ORDER BY ManufacturerName');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching manufacturers' });
  }
});

module.exports = router;