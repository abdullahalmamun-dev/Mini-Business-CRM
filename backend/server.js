const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'Mini Business CRM API is live.' 
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);

// Global error HanDling Middleware
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[server]: Application is listening on port ${PORT}`);
});
