const express = require('express');
const db = require('../config/database');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await db('categories').orderBy('name');
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
