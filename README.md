# Shipping Cost Calculation API

This API calculates shipping costs based on weight, distance, and cargo type. It also provides endpoints for managing pricing configurations stored in MongoDB.

## Project Structure

```
shipping-api/
├── src/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   │   └── pricing.js          # Pricing schema
│   ├── controllers/
│   │   └── shipmentController.js  # API request handlers
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handling
│   ├── models/
│   │   └── pricing.js          # Pricing schema
│   ├── repositories/
│   │   └── pricingRepository.js   # Database operations
│   ├── routes/
│   │   └── shipmentRoutes.js   # Route definitions
│   ├── services/
│   │   └── shipmentService.js  # Business logic
│   ├── tests/
│   │   ├── integration/
│   │   │   └── shipment.test.js  # API endpoint tests
│   │   └── unit/
│   │       ├── services/
│   │       │   └── shipmentService.test.js  # Service
│   │       └── utils/
│   │           └── currencyConverter.test.js  # Utility
│   ├── utils/
│   │   ├── appError.js         # Custom error class
│   │   ├── currencyConverter.js  # Currency conversion
│   │   └── response.js         # Response formatting
│   └── app.js                  # Application entry point
├── .env                        # Environment variables
├── .gitignore                 
├── package.json               
├── README.md                  
└── vitest.config.js           # Test configuration
```

## Features

- Calculate shipping costs dynamically.
- Store and retrieve pricing configurations.
- Convert shipping costs to different currencies.
- Optimized MongoDB queries for performance.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/) (Atlas or Local Instance)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/demola07/shipment-pricing-api
   cd shipment-pricing-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```sh
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/<database_name>
   ```

   Replace `MONGO_URI` with your actual MongoDB connection string.

4. Start the MongoDB server if running locally:

   ```sh
   mongod --dbpath=/your/db/path
   ```

## Running the API

### Development Mode

Start the API with:

```sh
npm run dev
```

This will run the server with `nodemon` for hot reloading.

### Production Mode

Run:

```sh
npm start
```

## API Endpoints

### Calculate Shipping Cost

**POST** `/api/shipments/calculate`

#### Request Body:

### **Calculating Shipping Cost**
To calculate the shipping cost, send a `POST` request to:

```
POST /api/shipments/calculate
```


#### **Example Request**
##### **With Currency**
```json
{
  "weight": 10,
  "distance": 50,
  "cargoType": "standard",
  "currency": "USD"
}
```

##### **Without Currency (Defaults to NGN)**
```json
{
  "weight": 10,
  "distance": 50,
  "cargoType": "standard"
}
```

#### **Example Response**
```json
{
    "message": "Pricing calculated successfully",
    "data": {
        "totalCost": 17000,
        "currency": "NGN",
        "breakdown": {
            "baseCost": 5000,
            "distanceCost": 10000,
            "weightCost": 2000
        },
        "originalCurrency": "NGN",
        "exchangeRate": 1
    },
    "success": true
}
```

#### **Behavior**
- If `currency` is provided, the system converts the total cost accordingly.
- If `currency` is omitted, the system defaults to `NGN`.
- If an unsupported currency is used, the API returns a `400 Bad Request` error.


#### Response:

```json
{
    "message": "Pricing calculated successfully",
    "data": {
        "totalCost": 10.63,
        "currency": "USD",
        "breakdown": {
            "baseCost": 3.13,
            "distanceCost": 6.25,
            "weightCost": 1.25
        },
        "originalCurrency": "NGN",
        "exchangeRate": 1600
    },
    "success": true
}
```

---

### Create Pricing Configuration

**POST** `/api/shipments/pricing`

#### Request Body:

```json
{
  "cargoType": "standard",
  "basePrice": 5000,
  "pricePerKm": 100,
  "pricePerKg": 200
}
```

#### Response:

```json
{
    "message": "Pricing created successfully",
    "data": {
        "cargoType": "standard",
        "basePrice": 5000,
        "pricePerKm": 100,
        "pricePerKg": 200,
        "currency": "NGN",
        "_id": "67a38bc73f0bfc4f422d1676",
        "createdAt": "2025-02-05T16:03:19.995Z",
        "__v": 0
    },
    "success": true
}
```

---

### Get All Pricing Configurations

**GET** `/api/shipments/pricing?page=1&limit=10`

#### Query Parameters:
- `page`: The page number to retrieve (default is 1).
- `limit`: The number of records per page (default is 10).

#### Response:
```json
{
    "success": true,
    "message": "Pricing retrieved successfully",
    "data": {
        "total": 50, // Total number of records
        "page": 1,   // Current page
        "limit": 10, // Records per page
        "pricing": [
            {
                "cargoType": "standard",
                "basePrice": 5000,
                "pricePerKm": 100,
                "pricePerKg": 200,
                "currency": "NGN"
            }
        ]
    }
}
```


#### **Running Tests**
This project uses [Vitest](https://vitest.dev/) for unit testing and [Supertest](https://github.com/ladjs/supertest) for API integration testing. The following test scripts are available in `package.json`:

```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js",
  "test": "vitest",
  "test:watch": "vitest watch",
  "test:coverage": "vitest run --coverage"
}
```

### Test Structure

- `src/tests/unit/`: Unit tests for individual components
  - `services/`: Service layer tests
  - `utils/`: Utility function tests
- `src/tests/integration/`: API endpoint integration tests

#### **Test Categories**
1. **Unit Tests**  
   - Tests for utility functions such as `CurrencyConverter`
   - Tests for services like `shipmentService`
   - Uses `vi.mock` for mocking dependencies  

2. **Integration Tests**  
   - Tests for API endpoints (`/api/shipments/pricing`, `/api/shipments/calculate`)  
   - Uses `MongoMemoryServer` for an in-memory MongoDB instance  
   - Uses `Supertest` to simulate HTTP requests  

#### **Running Tests**
Run all tests:
```sh
npm test
```

Run tests in watch mode:
```sh
npm run test:watch
```

Run tests with coverage:
```sh
npm run test:coverage
```

## Security Features

### Helmet
- Helmet is used to secure HTTP headers in your Express application, helping to protect against common vulnerabilities.

### Rate Limiting
- The API implements rate limiting to prevent abuse. Each IP address is limited to 100 requests per 15 minutes. If the limit is exceeded, a `429 Too Many Requests` response is returned.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.