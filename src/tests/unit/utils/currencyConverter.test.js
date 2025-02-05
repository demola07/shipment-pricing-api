import CurrencyConverter from '../../../utils/currencyConverter.js';

describe('CurrencyConverter', () => {
  describe('convertAmount', () => {
    it('should return same amount when currencies are the same', () => {
      const amount = 1000;
      const result = CurrencyConverter.convertAmount(amount, 'NGN', 'NGN');
      expect(result).toBe(amount);
    });

    it('should convert from NGN to USD correctly', () => {
      const amountInNGN = 1600;
      const result = CurrencyConverter.convertAmount(amountInNGN, 'NGN', 'USD');
      expect(result).toBe(1); // 1600 NGN = 1 USD
    });

    it('should convert from USD to NGN correctly', () => {
      const amountInUSD = 1;
      const result = CurrencyConverter.convertAmount(amountInUSD, 'USD', 'NGN');
      expect(result).toBe(1600); // 1 USD = 1600 NGN
    });

    it('should throw error for invalid currency', () => {
      expect(() => {
        CurrencyConverter.convertAmount(1000, 'NGN', 'INVALID');
      }).toThrow('Invalid currency specified');
    });
  });

  describe('isValidCurrency', () => {
    it('should return true for valid currencies', () => {
      expect(CurrencyConverter.isValidCurrency('NGN')).toBe(true);
      expect(CurrencyConverter.isValidCurrency('USD')).toBe(true);
    });

    it('should return false for invalid currencies', () => {
      expect(CurrencyConverter.isValidCurrency('INVALID')).toBe(false);
    });
  });
}); 