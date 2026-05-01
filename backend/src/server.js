require('dotenv').config();

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/authentications', authRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'KAVA API is running!' });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'failed',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

app.use(errorMiddleware);

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;

app.listen(PORT, HOST, () => {
  console.log(`KAVA Backend is running at http://${HOST}:${PORT}`);
});

module.exports = app;