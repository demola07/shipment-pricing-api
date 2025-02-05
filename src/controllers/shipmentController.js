import shipmentService from '../services/shipmentService.js';
import { validatePricingPayload } from '../utils/shipmentPricingValidation.js';
import Response from '../utils/response.js';
import AppError from '../utils/appError.js';

class ShipmentController {
  async calculatePrice(req, res, next) {
    try {
      const { weight, distance, cargoType, currency } = req.body;

      if (!weight || !distance || !cargoType) {
        throw new AppError('Weight, distance, and cargo type are required', 400);
      }

      const result = await shipmentService.calculateShipmentCost(
        weight,
        distance,
        cargoType,
        currency
      );

      if (!result.success) {
        throw new AppError(result.message, result.statusCode || 500);
      }

      return Response.success(res, 'Pricing calculated successfully', result.data);
    } catch (error) {
      next(error);
    }
  }

  async createPricing(req, res, next) {
    try {
      const validationResult = validatePricingPayload(req.body);
      if (validationResult.error) {
        throw new AppError(validationResult.error, 400);
      }

      const result = await shipmentService.createPricing(req.body);

      if (!result.success) {
        throw new AppError(result.message, result.statusCode || 500);
      }

      return Response.created(res, 'Pricing created successfully', result.data);
    } catch (error) {
      next(error);
    }
  }

  async getAllPricing(req, res, next) {
    try {
      const result = await shipmentService.getAllPricing();

      if (!result.success) {
        throw new AppError(result.message, result.statusCode || 500);
      }

      return Response.success(res, 'Pricing retrieved successfully', result.data);
    } catch (error) {
      next(error);
    }
  }
}

export default new ShipmentController(); 