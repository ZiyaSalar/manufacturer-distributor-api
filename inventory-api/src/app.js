const express = require('express');
const cors = require('cors');
const inventoryRouter = require('./routes/inventory');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'inventory-api' });
});

app.use('/inventory', inventoryRouter);

module.exports = app;