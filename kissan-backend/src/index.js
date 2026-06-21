require('dotenv').config();

const express = require('express');
const cors = require('cors');
const auth_routes = require('./routes/auth');
const category_routes = require('./routes/categories');
const product_routes = require('./routes/products');
const order_routes = require('./routes/orders');
const mandi_routes = require('./routes/mandi');
const { error_handler, not_found_handler } = require('./middleware/error_handler');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'KISSAN API is running' });
});

app.use('/api/auth', auth_routes);
app.use('/api/categories', category_routes);
app.use('/api/products', product_routes);
app.use('/api/orders', order_routes);
app.use('/api/mandi', mandi_routes);

app.use(not_found_handler);
app.use(error_handler);

app.listen(port, () => {
  console.log(`KISSAN API listening on http://localhost:${port}`);
});
