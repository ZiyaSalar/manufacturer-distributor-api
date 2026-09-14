const express = require('express');
const { sql, getPool } = require('../db');
const router = express.Router();

// POST /shipments — record a new shipment
router.post('/', async (req, res) => {
  const { shipmentId, medicineCode, manufacturerId, distributorId, quantity } = req.body;

  // Validate required fields
  if (!shipmentId || !medicineCode || !manufacturerId || quantity === undefined) {
    return res.status(400).json({
      error: 'shipmentId, medicineCode, manufacturerId and quantity are required'
    });
  }

  // Validate quantity is a positive number BEFORE hitting the database
  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({
      error: 'quantity must be a positive number'
    });
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('shipmentId', sql.VarChar, shipmentId)
      .input('medicineCode', sql.VarChar, medicineCode)
      .input('manufacturerId', sql.VarChar, manufacturerId)
      .input('distributorId', sql.VarChar, distributorId || 'DIST-01')
      .input('quantity', sql.Int, quantity)
      .query(`
        INSERT INTO ShipmentEvents (ShipmentId, MedicineCode, ManufacturerId, DistributorId, Quantity)
        VALUES (@shipmentId, @medicineCode, @manufacturerId, @distributorId, @quantity)
      `);

    res.status(201).json({
      shipmentId, medicineCode, manufacturerId,
      distributorId: distributorId || 'DIST-01',
      quantity, status: 'DISPATCHED'
    });
  } catch (err) {
    if (err.number === 2627) {
      return res.status(409).json({ error: `Shipment ${shipmentId} already exists` });
    }
    if (err.number === 547) {
      // Fires if medicineCode OR manufacturerId doesn't exist — either FK can trigger this
      return res.status(400).json({
        error: `Invalid medicineCode or manufacturerId — one of them does not exist`
      });
    }
    console.error(err);
    res.status(500).json({ error: 'Database error while creating shipment' });
  }
});

// GET /shipments — list all shipments
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM ShipmentEvents ORDER BY ShipmentDate DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching shipments' });
  }
});

// GET /shipments/:id — get one shipment by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('SELECT * FROM ShipmentEvents WHERE ShipmentId = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: `Shipment ${req.params.id} not found` });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error while fetching shipment' });
  }
});

module.exports = router;