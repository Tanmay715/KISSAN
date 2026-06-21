const express = require('express');
const AuthService = require('../services/AuthService');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const auth_service = new AuthService();

router.post('/register', async (req, res, next) => {
  try {
    const result = await auth_service.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await auth_service.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await auth_service.getProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
