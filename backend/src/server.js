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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {status: 'failed', message: 'Too many requests, please try again later'}
});

app.use(limiter);
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
        message: 'File size exceeds 5MB limit'
      });
    }
    return res.status(400).json({
      status: 'failed',
      message: err.message
    });
  }
  if (err.message === 'Only .pdf files are allowed!') {
    return res.status(400).json({
      status: 'failed',
      message: err.message
    });
  }
  next(err);
})

app.use(errorMiddleware);

const HOST = process.env.HOST 
const PORT = process.env.PORT 

app.listen(PORT, HOST, () => {
  console.log(`KAVA Backend is running at http://${HOST}:${PORT}`);
});

module.exports = app;