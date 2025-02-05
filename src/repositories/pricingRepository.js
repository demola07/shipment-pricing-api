import Pricing from '../models/pricing.js';

class PricingRepository {
  async getPricingByCargoType(cargoType) {
    try {
      const pricing = await Pricing.findOne({ cargoType });
      return {
        success: true,
        data: pricing
      };
    } catch (error) {
      return {
        success: false,
        message: `Error fetching pricing: ${error.message}`
      };
    }
  }

  async createPricing(pricingData) {
    try {
      const pricing = new Pricing(pricingData);
      const savedPricing = await pricing.save();
      return {
        success: true,
        data: savedPricing
      };
    } catch (error) {
      return {
        success: false,
        message: `Error creating pricing: ${error.message}`
      };
    }
  }

  async getAllPricing(page = 1, limit = 10) {
    try {
      const pricing = await Pricing.find({}, 'cargoType basePrice pricePerKm pricePerKg currency')
        .skip((page - 1) * limit) // Skip the records for the current page
        .limit(limit) // Limit the number of records returned
        .lean();
      const total = await Pricing.countDocuments(); // Get total count for pagination info
      return {
        success: true,
        data: {
          total,
          page,
          limit,
          pricing
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Error fetching all pricing: ${error.message}`
      };
    }
  }
}

export default new PricingRepository(); 