const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const manufacturersRouter = require('./routes/manufacturers');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'product-api' });
});

app.use('/products', productsRouter);
app.use('/manufacturers', manufacturersRouter);

module.exports = app;