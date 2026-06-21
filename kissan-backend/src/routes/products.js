const express = require('express');
const ProductService = require('../services/ProductService');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const product_service = new ProductService();

router.get('/', async (req, res, next) => {
  try {
    const result = await product_service.list(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/farmer/my-products', authenticate, authorize('farmer'), async (req, res, next) => {
  try {
    const products = await product_service.listByFarmer(req.user.id);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await product_service.getById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, authorize('farmer'), async (req, res, next) => {
  try {
    const product = await product_service.create(req.user.id, req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize('farmer'), async (req, res, next) => {
  try {
    const product = await product_service.update(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize('farmer'), async (req, res, next) => {
  try {
    const result = await product_service.delete(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
