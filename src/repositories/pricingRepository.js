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

  async getAllPricing() {
    try {
      const pricing = await Pricing.find({});
      return {
        success: true,
        data: pricing
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