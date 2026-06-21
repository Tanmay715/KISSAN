const express = require('express');
const OrderService = require('../services/OrderService');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const order_service = new OrderService();

router.post('/', authenticate, authorize('buyer'), async (req, res, next) => {
  try {
    const order = await order_service.create(req.user.id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.get('/my-orders', authenticate, authorize('buyer'), async (req, res, next) => {
  try {
    const orders = await order_service.listByBuyer(req.user.id);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.get('/farmer-orders', authenticate, authorize('farmer'), async (req, res, next) => {
  try {
    const orders = await order_service.listByFarmer(req.user.id);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await order_service.getById(req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', authenticate, async (req, res, next) => {
  try {
    const order = await order_service.updateStatus(req.params.id, req.body.status, req.user);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
