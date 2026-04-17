const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fitforge_dev_secret';

/**
 * Generates a valid JWT token for testing
 * @param {Object} payload - Token payload
 * @param {Object} options - JWT options
 * @returns {string} JWT token
 */
const generateValidToken = (payload = {}, options = {}) => {
  const defaultPayload = {
    userId: 'testUser123',
    email: 'test@example.com',
    ...payload
  };
  
  return jwt.sign(defaultPayload, JWT_SECRET, { expiresIn: '1h', ...options });
};

/**
 * Mock diet entry data for testing
 */
const mockDietEntry = {
  userId: 'testUser123',
  mealType: 'breakfast',
  foodItems: [
    {
      name: 'Oatmeal',
      calories: 150,
      proteinG: 5,
      carbsG: 27,
      fatG: 3
    }
  ],
  totalCalories: 150,
  notes: 'Healthy breakfast',
  date: new Date(),
  timestamps: true
};

/**
 * Mock diet entries collection
 */
const mockDietEntries = [
  {
    _id: 'entry1',
    userId: 'testUser123',
    mealType: 'breakfast',
    foodItems: [{ name: 'Eggs', calories: 155 }],
    totalCalories: 155,
    date: new Date('2024-01-15')
  },
  {
    _id: 'entry2',
    userId: 'testUser123',
    mealType: 'lunch',
    foodItems: [{ name: 'Chicken Salad', calories: 350 }],
    totalCalories: 350,
    date: new Date('2024-01-15')
  },
  {
    _id: 'entry3',
    userId: 'testUser123',
    mealType: 'dinner',
    foodItems: [{ name: 'Salmon', calories: 450 }],
    totalCalories: 450,
    date: new Date('2024-01-15')
  }
];

/**
 * Creates a mock Express request object
 * @param {Object} options - Request configuration
 * @returns {Object} Mock request object
 */
const createMockRequest = (options = {}) => {
  return {
    user: options.user || { userId: 'testUser123' },
    params: options.params || {},
    body: options.body || {},
    query: options.query || {},
    header: jest.fn((name) => options.headers?.[name] || null),
    headers: options.headers || {},
    ...options
  };
};

/**
 * Creates a mock Express response object
 * @returns {Object} Mock response object
 */
const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    statusCode: 200,
    _getStatusCode() { return this.statusCode; },
    _getJSONData() { return this.json.mock.calls[0]?.[0]; }
  };
  return res;
};

/**
 * Creates a mock next function for Express middleware
 * @returns {Function} Mock next function
 */
const createMockNext = () => jest.fn();

module.exports = {
  generateValidToken,
  mockDietEntry,
  mockDietEntries,
  createMockRequest,
  createMockResponse,
  createMockNext,
  JWT_SECRET
};
