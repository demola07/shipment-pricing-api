export const EXCHANGE_RATES = {
  NGN: 1,
  USD: 1600, // 1 USD = 1600 NGN
  EUR: 1750, // 1 EUR = 1750 NGN
  GBP: 2000, // 1 GBP = 2000 NGN
};

class CurrencyConverter {
  static convertAmount(amount, fromCurrency = 'NGN', toCurrency = 'NGN') {
    if (fromCurrency === toCurrency) return amount;

    // Validate currencies
    if (!EXCHANGE_RATES[fromCurrency] || !EXCHANGE_RATES[toCurrency]) {
      throw new Error('Invalid currency specified');
    }

    if (fromCurrency === 'NGN') {
      // Converting from NGN to another currency
      return amount / EXCHANGE_RATES[toCurrency];
    } else if (toCurrency === 'NGN') {
      // Converting from another currency to NGN
      return amount * EXCHANGE_RATES[fromCurrency];
    } else {
      // Converting between two non-NGN currencies
      // First convert to NGN, then to target currency
      const amountInNGN = amount * EXCHANGE_RATES[fromCurrency];
      return amountInNGN / EXCHANGE_RATES[toCurrency];
    }
  }

  static getSupportedCurrencies() {
    return Object.keys(EXCHANGE_RATES);
  }

  static isValidCurrency(currency) {
    return currency in EXCHANGE_RATES;
  }

  static getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return 1;

    if (!EXCHANGE_RATES[fromCurrency] || !EXCHANGE_RATES[toCurrency]) {
      throw new Error('Invalid currency specified');
    }

    if (toCurrency === 'NGN') {
      return EXCHANGE_RATES[fromCurrency];
    } else if (fromCurrency === 'NGN') {
      return 1 / EXCHANGE_RATES[toCurrency];
    } else {
      return EXCHANGE_RATES[fromCurrency] / EXCHANGE_RATES[toCurrency];
    }
  }
}

export default CurrencyConverter; 