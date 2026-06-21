const express = require('express');
const MandiService = require('../services/MandiService');

const router = express.Router();
const mandi_service = new MandiService();

router.get('/prices', async (req, res, next) => {
  try {
    const { crop, state, limit } = req.query;
    const prices = await mandi_service.searchPrices({ crop, state, limit: limit || 50 });
    res.json({ success: true, data: prices, source: 'Agmarknet via data.gov.in' });
  } catch (error) {
    next(error);
  }
});

router.get('/prices/state/:state', async (req, res, next) => {
  try {
    const prices = await mandi_service.getPricesByState(req.params.state);
    res.json({ success: true, data: prices, source: 'Agmarknet via data.gov.in' });
  } catch (error) {
    next(error);
  }
});

router.get('/prices/crop/:crop', async (req, res, next) => {
  try {
    const prices = await mandi_service.getPricesByCrop(req.params.crop);
    res.json({ success: true, data: prices, source: 'Agmarknet via data.gov.in' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
