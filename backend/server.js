const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const scheduleRoutes = require('./routes/scheduleRoutes');
const fsRoutes = require('./routes/fsRoutes');
const mongoose = require('mongoose');

// Connect to MongoDB if MONGODB_URI provided
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myosfs';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.warn('MongoDB connection failed:', err.message));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', scheduleRoutes);
app.use('/api/fs', fsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CPU Scheduler Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

