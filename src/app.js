import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/appError.js';

const app = express();

// Only connect to MongoDB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/shipments', shipmentRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app; 