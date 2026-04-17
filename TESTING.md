# Testing Guide for Nutrition Service

## Setup

### Install Dependencies
```bash
npm install
```

This will install Jest, Supertest, and other testing libraries.

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test:watch
```

### Run Tests with Coverage Report
```bash
npm test:coverage
```

## Test Coverage

The project is configured to maintain the following coverage thresholds:
- **Branches**: 70%
- **Functions**: 75%
- **Lines**: 75%
- **Statements**: 75%

Coverage reports are generated in the `coverage/` directory.

## Test Files Overview

### 1. **Auth Middleware Tests** (`src/middleware/auth.test.js`)

Tests for JWT authentication middleware:

**Passing Cases:**
- ✅ Valid token with correct payload

**Failure Cases:**
- ❌ No Authorization header
- ❌ Invalid Bearer format
- ❌ Invalid/tampered token
- ❌ Expired token
- ❌ Empty Bearer token

### 2. **Nutrition Routes Tests** (`src/routes/nutrition.test.js`)

Tests for all nutrition endpoints using Supertest:

**GET /nutrition/diet/:userId**
- ❌ No authentication token
- ❌ Invalid token
- ✅ Returns user's diet entries with valid token
- ✅ Returns empty array when no entries exist
- ❌ Database error handling

**POST /nutrition/diet**
- ❌ No authentication token
- ✅ Creates new diet entry with valid token
- ❌ Creation failure handling

**DELETE /nutrition/diet/:entryId**
- ❌ No authentication token
- ✅ Deletes entry with valid token
- ❌ Deletion failure handling

### 3. **DietEntry Model Tests** (`src/models/DietEntry.test.js`)

Tests for Mongoose schema validation:

**Schema Validation:**
- ✅ Required fields (userId, mealType)
- ✅ Enum values for mealType
- ✅ Default date timestamp
- ✅ Nested foodItems array structure
- ✅ Timestamps (createdAt, updatedAt)

**Field Properties:**
- ✅ Field types verification
- ✅ Optional fields handling

**Validation:**
- ❌ Missing required fields
- ❌ Invalid enum values

## Test Examples

### Running Specific Test Suite
```bash
npm test -- auth.test.js
```

### Running Tests Matching Pattern
```bash
npm test -- --testNamePattern="GET /nutrition"
```

### Debugging Tests
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Mocking Strategy

The tests use Jest mocks for:
- **DietEntry Model**: All database operations are mocked to avoid actual DB calls
- **HTTP Requests**: Supertest is used to make HTTP calls to the Express app without starting a server
- **JWT Tokens**: Tokens are generated using the same JWT_SECRET as the app

## CI/CD Integration

These tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Best Practices Implemented

1. **Isolation**: Each test is independent and uses `beforeEach` to reset mocks
2. **Clarity**: Test names clearly describe what is being tested
3. **Coverage**: All critical paths are tested (success + failure scenarios)
4. **Mocking**: External dependencies are mocked to speed up tests
5. **Assertions**: Multiple assertions per test verify expected behavior
6. **Error Handling**: Both success and error paths are tested

## Adding New Tests

When adding new features:

1. Create test file: `src/feature/feature.test.js`
2. Write tests following the existing patterns
3. Ensure coverage meets thresholds
4. Run `npm test:coverage` to verify

Example:
```javascript
describe('New Feature', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Troubleshooting

### Tests Timing Out
- Increase timeout: `jest.setTimeout(20000);` in test file
- Check for unresolved promises

### Mock Not Working
- Clear mocks: `jest.clearAllMocks()` in beforeEach
- Verify mock path matches actual import path

### Coverage Threshold Failed
- Check `npm test:coverage` report in `coverage/` directory
- Add tests for uncovered lines/branches

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [MongoDB Testing Patterns](https://docs.mongodb.com/ecosystem/tools/mongodb-testing/)
