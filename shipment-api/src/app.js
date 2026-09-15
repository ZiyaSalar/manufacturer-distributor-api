const express = require('express');
const cors = require('cors');
const shipmentsRouter = require('./routes/shipments');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'shipment-api' });
});

app.use('/shipments', shipmentsRouter);

module.exports = app;