import pricingRepository from '../repositories/pricingRepository.js';
import CurrencyConverter, { EXCHANGE_RATES } from '../utils/currencyConverter.js';

class ShipmentService {
  async calculateShipmentCost(weight, distance, cargoType, targetCurrency = 'NGN') {
    const pricingResult = await pricingRepository.getPricingByCargoType(cargoType);

    if (!pricingResult.success) {
      return pricingResult;
    }

    if (!pricingResult.data) {
      return {
        success: false,
        message: 'Pricing not found for the specified cargo type',
        statusCode: 404
      };
    }

    try {
      const pricing = pricingResult.data;

      // Calculate cost in NGN
      const costInNGN = pricing.basePrice +
        (pricing.pricePerKm * distance) +
        (pricing.pricePerKg * weight);

      let totalCost = costInNGN;
      let baseCost = pricing.basePrice;
      let distanceCost = pricing.pricePerKm * distance;
      let weightCost = pricing.pricePerKg * weight;

      // Only convert if target currency is different from NGN
      if (targetCurrency !== 'NGN') {
        totalCost = CurrencyConverter.convertAmount(costInNGN, 'NGN', targetCurrency);
        baseCost = CurrencyConverter.convertAmount(pricing.basePrice, 'NGN', targetCurrency);
        distanceCost = CurrencyConverter.convertAmount(pricing.pricePerKm * distance, 'NGN', targetCurrency);
        weightCost = CurrencyConverter.convertAmount(pricing.pricePerKg * weight, 'NGN', targetCurrency);
      }

      return {
        success: true,
        data: {
          totalCost: parseFloat(totalCost.toFixed(2)),
          currency: targetCurrency,
          breakdown: {
            baseCost: parseFloat(baseCost.toFixed(2)),
            distanceCost: parseFloat(distanceCost.toFixed(2)),
            weightCost: parseFloat(weightCost.toFixed(2))
          },
          originalCurrency: 'NGN',
          exchangeRate: targetCurrency === 'NGN' ? 1 : EXCHANGE_RATES[targetCurrency]
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: 400
      };
    }
  }

  async createPricing(pricingData) {
    // Ensure currency is NGN for storage
    pricingData.currency = 'NGN';
    return await pricingRepository.createPricing(pricingData);
  }

  async getAllPricing(targetCurrency = 'NGN') {
    const result = await pricingRepository.getAllPricing();

    if (!result.success) {
      return result;
    }

    if (!result.data.length) {
      return {
        success: false,
        message: 'No pricing configurations found',
        statusCode: 404
      };
    }

    try {
      // Convert prices to target currency if not NGN
      const convertedPricing = result.data.map(pricing => ({
        ...pricing.toObject(),
        basePrice: parseFloat(CurrencyConverter.convertAmount(pricing.basePrice, 'NGN', targetCurrency).toFixed(2)),
        pricePerKm: parseFloat(CurrencyConverter.convertAmount(pricing.pricePerKm, 'NGN', targetCurrency).toFixed(2)),
        pricePerKg: parseFloat(CurrencyConverter.convertAmount(pricing.pricePerKg, 'NGN', targetCurrency).toFixed(2)),
        displayCurrency: targetCurrency,
        originalCurrency: 'NGN'
      }));

      return {
        success: true,
        data: convertedPricing
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: 400
      };
    }
  }
}

export default new ShipmentService(); 