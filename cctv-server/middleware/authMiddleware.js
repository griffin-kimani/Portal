const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set in your .env');
}

module.exports = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
