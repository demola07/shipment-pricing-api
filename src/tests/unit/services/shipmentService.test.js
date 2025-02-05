import shipmentService from '../../../services/shipmentService.js';
import pricingRepository from '../../../repositories/pricingRepository.js';
import { EXCHANGE_RATES } from '../../../utils/currencyConverter.js';

// Use vi.mock instead of jest.mock for ES modules
vi.mock('../../../repositories/pricingRepository.js', () => ({
  default: {
    getPricingByCargoType: vi.fn(),
    createPricing: vi.fn(),
    getAllPricing: vi.fn()
  }
}));

describe('ShipmentService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('calculateShipmentCost', () => {
    it('should calculate cost correctly in NGN', async () => {
      // Arrange
      const mockPricing = {
        cargoType: 'standard',
        basePrice: 5000,
        pricePerKm: 100,
        pricePerKg: 200,
        currency: 'NGN'
      };

      pricingRepository.getPricingByCargoType.mockResolvedValue({
        success: true,
        data: mockPricing
      });

      // Act
      const result = await shipmentService.calculateShipmentCost(10, 100, 'standard', 'NGN');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.totalCost).toBe(17000); // 5000 + (100 * 100) + (200 * 10)
      expect(result.data.currency).toBe('NGN');
    });

    it('should convert cost correctly to USD', async () => {
      // Arrange
      const mockPricing = {
        cargoType: 'standard',
        basePrice: 5000,
        pricePerKm: 100,
        pricePerKg: 200,
        currency: 'NGN'
      };

      pricingRepository.getPricingByCargoType.mockResolvedValue({
        success: true,
        data: mockPricing
      });

      // Act
      const result = await shipmentService.calculateShipmentCost(10, 100, 'standard', 'USD');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.currency).toBe('USD');
      expect(result.data.exchangeRate).toBe(EXCHANGE_RATES.USD);
    });

    it('should handle pricing not found', async () => {
      // Arrange
      pricingRepository.getPricingByCargoType.mockResolvedValue({
        success: true,
        data: null
      });

      // Act
      const result = await shipmentService.calculateShipmentCost(10, 100, 'nonexistent');

      // Assert
      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
    });
  });
}); 