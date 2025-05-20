const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(200).json({ message: 'Successfully logged out. Please remove token on client side.' });
});

module.exports = router;

