const express = require('express');
const { sql, getPool } = require('../db');
const router = express.Router();

// GET /inventory — current stock for ALL medicines
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        p.MedicineCode,
        p.MedicineName,
        m.ManufacturerName,
        ISNULL(SUM(s.Quantity), 0) AS CurrentStock
      FROM ProductMaster p
      JOIN Manufacturers m ON p.ManufacturerId = m.ManufacturerId
      LEFT JOIN ShipmentEvents s
        ON s.MedicineCode = p.MedicineCode AND s.Status = 'DISPATCHED'
      GROUP BY p.MedicineCode, p.MedicineName, m.ManufacturerName
      ORDER BY p.MedicineCode
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching inventory' });
  }
});

// GET /inventory/:medicineCode — current stock for ONE medicine
router.get('/:medicineCode', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('code', sql.VarChar, req.params.medicineCode)
      .query(`
        SELECT
          p.MedicineCode,
          p.MedicineName,
          m.ManufacturerName,
          ISNULL(SUM(s.Quantity), 0) AS CurrentStock
        FROM ProductMaster p
        JOIN Manufacturers m ON p.ManufacturerId = m.ManufacturerId
        LEFT JOIN ShipmentEvents s
          ON s.MedicineCode = p.MedicineCode AND s.Status = 'DISPATCHED'
        WHERE p.MedicineCode = @code
        GROUP BY p.MedicineCode, p.MedicineName, m.ManufacturerName
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: `Product ${req.params.medicineCode} not found` });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching inventory' });
  }
});

// // GET /shipments/summary — total quantity shipped, grouped by manufacturer
// router.get('/summary/by-manufacturer', async (req, res) => {
//   try {
//     const pool = await getPool();
//     const result = await pool.request().query(`
//       SELECT
//         m.ManufacturerId,
//         m.ManufacturerName,
//         COUNT(s.ShipmentId) AS TotalShipments,
//         ISNULL(SUM(s.Quantity), 0) AS TotalQuantityShipped
//       FROM Manufacturers m
//       LEFT JOIN ShipmentEvents s
//         ON s.ManufacturerId = m.ManufacturerId AND s.Status = 'DISPATCHED'
//       GROUP BY m.ManufacturerId, m.ManufacturerName
//       ORDER BY TotalQuantityShipped DESC
//     `);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error while fetching shipment summary' });
//   }
// });

// // GET /shipments/summary/by-manufacturer/:manufacturerId — one manufacturer's totals
// router.get('/summary/by-manufacturer/:manufacturerId', async (req, res) => {
//   try {
//     const pool = await getPool();
//     const result = await pool.request()
//       .input('manufacturerId', sql.VarChar, req.params.manufacturerId)
//       .query(`
//         SELECT
//           m.ManufacturerId,
//           m.ManufacturerName,
//           COUNT(s.ShipmentId) AS TotalShipments,
//           ISNULL(SUM(s.Quantity), 0) AS TotalQuantityShipped
//         FROM Manufacturers m
//         LEFT JOIN ShipmentEvents s
//           ON s.ManufacturerId = m.ManufacturerId AND s.Status = 'DISPATCHED'
//         WHERE m.ManufacturerId = @manufacturerId
//         GROUP BY m.ManufacturerId, m.ManufacturerName
//       `);

//     if (result.recordset.length === 0) {
//       return res.status(404).json({ error: `Manufacturer ${req.params.manufacturerId} not found` });
//     }
//     res.json(result.recordset[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error while fetching shipment summary' });
//   }
// });

module.exports = router;