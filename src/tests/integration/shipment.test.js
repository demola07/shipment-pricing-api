import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../app.js';

// Mock helmet using Vitest's vi.mock
vi.mock('helmet', () => ({
  __esModule: true,
  default: () => (req, res, next) => next(),
}));

describe('Shipment API Integration Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    // Close any existing connections
    await mongoose.disconnect();

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Ensure we close the connection and stop the server
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    // Clear all collections before each test
    if (mongoose.connection.readyState === 1) {
      const collections = await mongoose.connection.db.collections();
      for (let collection of collections) {
        await collection.deleteMany({});
      }
    }
  });

  describe('POST /api/shipments/pricing', () => {
    it('should create new pricing configuration', async () => {
      const response = await request(app)
        .post('/api/shipments/pricing')
        .send({
          cargoType: 'standard',
          basePrice: 5000,
          pricePerKm: 100,
          pricePerKg: 200
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.cargoType).toBe('standard');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/shipments/pricing')
        .send({
          cargoType: 'standard'
          // Missing required fields
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/shipments/calculate', () => {
    beforeEach(async () => {
      // Create test pricing
      await request(app)
        .post('/api/shipments/pricing')
        .send({
          cargoType: 'standard',
          basePrice: 5000,
          pricePerKm: 100,
          pricePerKg: 200
        });
    });

    it('should calculate shipping cost correctly', async () => {
      const response = await request(app)
        .post('/api/shipments/calculate')
        .send({
          weight: 10,
          distance: 100,
          cargoType: 'standard',
          currency: 'USD'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.currency).toBe('USD');
      expect(response.body.data.breakdown).toBeDefined();
    });
  });
}); 