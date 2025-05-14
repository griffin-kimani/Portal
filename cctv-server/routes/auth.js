const express = require('express');
const { body, validationResult } = require('express-validator');
const { signup, login, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post(
  '/signup',
  [
    body('username', 'Username is required').trim().notEmpty(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await signup(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);


router.post(
  '/login',
  [
    body('username', 'Username is required').trim().notEmpty(),
    body('password', 'Password is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await login(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post('/logout', authMiddleware, (req, res) => {
  try {
    logout(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
