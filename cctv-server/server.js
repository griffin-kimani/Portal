require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cameraRoutes = require('./routes/cameraRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const logoutRoutes = require('./routes/logoutRoutes');
const streamRoutes = require('./routes/streamRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/stream', streamRoutes);

app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!` });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
