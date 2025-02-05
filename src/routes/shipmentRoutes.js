import express from 'express';
import shipmentController from '../controllers/shipmentController.js';

const router = express.Router();

router.post('/calculate', shipmentController.calculatePrice);
router.post('/pricing', shipmentController.createPricing);
router.get('/pricing', shipmentController.getAllPricing);

export default router; 