require('dotenv').config();

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const cvAnalysisRoutes = require('./routes/cvAnalysisRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const multer = require('multer');

const app = express();

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 'failed', message: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, 
  message: { status: 'failed', message: 'Too many attempts, please try again in 15 minutes' },
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  message: { status: 'failed', message: 'Too many OTP requests, please try again in 1 hour' },
});

app.use(globalLimiter);
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/authentications/login', authLimiter);
app.use('/authentications/google', authLimiter);
app.use('/users/register', authLimiter);
app.use('/users/forgot-password', authLimiter);
app.use('/users/reset-password', authLimiter);
app.use('/users/verify', otpLimiter);
app.use('/users/resend-otp', otpLimiter);

app.use('/users', userRoutes);
app.use('/authentications', authRoutes);
app.use('/api/cv', cvAnalysisRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'KAVA API is running!' });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'failed',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'failed',
        message: 'File size exceeds 5MB limit',
      });
    }
    return res.status(400).json({ status: 'failed', message: err.message });
  }
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ status: 'failed', message: err.message });
  }
  next(err);
});

app.use(errorMiddleware);

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, HOST, () => {
  console.log(`KAVA Backend is running at http://${HOST}:${PORT}`);
});

module.exports = app;