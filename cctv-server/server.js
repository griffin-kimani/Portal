require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cameraRoutes = require('./routes/cameraRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const streamRoutes = require('./routes/streamRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/stream', streamRoutes);


app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!` });
});


app.get('/', (req, res) => {
  res.send('📡 Smart CCTV API is live.');
});


app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
