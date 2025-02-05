import CurrencyConverter from './currencyConverter.js';

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP']; // Add more currencies as needed

export const validatePricingPayload = (payload) => {
  const { cargoType, basePrice, pricePerKm, pricePerKg } = payload;

  if (!cargoType || !basePrice || !pricePerKm || !pricePerKg) {
    return {
      error: 'All fields (cargoType, basePrice, pricePerKm, pricePerKg) are required'
    };
  }

  if (!['standard', 'express', 'bulk', 'fragile'].includes(cargoType)) {
    return {
      error: 'Invalid cargo type. Must be one of: standard, express, bulk, fragile'
    };
  }

  if (basePrice < 0 || pricePerKm < 0 || pricePerKg < 0) {
    return {
      error: 'Price values cannot be negative'
    };
  }

  return { error: null };
};

export const validateCurrency = (currency) => {
  if (!currency) return true; // Default currency (NGN) will be used
  return CurrencyConverter.isValidCurrency(currency);
}; 