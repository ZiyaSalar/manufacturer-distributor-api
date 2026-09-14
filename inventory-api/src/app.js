const express = require('express');
const inventoryRouter = require('./routes/inventory');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'inventory-api' });
});

app.use('/inventory', inventoryRouter);

module.exports = app;