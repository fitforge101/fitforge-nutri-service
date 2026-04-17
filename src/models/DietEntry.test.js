const mongoose = require('mongoose');
const DietEntry = require('../../src/models/DietEntry');

describe('DietEntry Model', () => {
  describe('Schema Validation', () => {
    it('should have required fields: userId and mealType', () => {
      const schema = DietEntry.schema;
      
      expect(schema.paths.userId.isRequired).toBe(true);
      expect(schema.paths.mealType.isRequired).toBe(true);
    });

    it('should have mealType enum with valid options', () => {
      const schema = DietEntry.schema;
      const mealTypeEnum = schema.paths.mealType.enumValues;
      
      expect(mealTypeEnum).toContain('breakfast');
      expect(mealTypeEnum).toContain('lunch');
      expect(mealTypeEnum).toContain('dinner');
      expect(mealTypeEnum).toContain('snack');
    });

    it('should have default date as current timestamp', () => {
      const schema = DietEntry.schema;
      
      expect(schema.paths.date.defaultValue).toBeDefined();
    });

    it('should have foodItems as array with nested properties', () => {
      const schema = DietEntry.schema;
      const foodItemsSchema = schema.paths.foodItems;
      
      expect(Array.isArray(foodItemsSchema.schema.obj)).toBe(true);
      expect(foodItemsSchema.schema.obj[0]).toHaveProperty('name');
      expect(foodItemsSchema.schema.obj[0]).toHaveProperty('calories');
      expect(foodItemsSchema.schema.obj[0]).toHaveProperty('proteinG');
      expect(foodItemsSchema.schema.obj[0]).toHaveProperty('carbsG');
      expect(foodItemsSchema.schema.obj[0]).toHaveProperty('fatG');
    });

    it('should have timestamps enabled', () => {
      const schema = DietEntry.schema;
      
      expect(schema.paths.createdAt).toBeDefined();
      expect(schema.paths.updatedAt).toBeDefined();
    });
  });

  describe('Field Properties', () => {
    it('should have userId as String type', () => {
      const schema = DietEntry.schema;
      
      expect(schema.paths.userId.instance).toBe('String');
    });

    it('should have totalCalories as Number type', () => {
      const schema = DietEntry.schema;
      
      expect(schema.paths.totalCalories.instance).toBe('Number');
    });

    it('should have notes as String type', () => {
      const schema = DietEntry.schema;
      
      expect(schema.paths.notes.instance).toBe('String');
    });

    it('should have date as Date type', () => {
      const schema = DietEntry.schema;
      
      expect(schema.paths.date.instance).toBe('Date');
    });
  });

  describe('Model Creation', () => {
    it('should create a valid DietEntry instance with required fields', () => {
      const entryData = {
        userId: 'user123',
        mealType: 'breakfast',
        foodItems: [],
        totalCalories: 200
      };

      const entry = new DietEntry(entryData);

      expect(entry.userId).toBe('user123');
      expect(entry.mealType).toBe('breakfast');
      expect(entry.totalCalories).toBe(200);
    });

    it('should create a valid DietEntry with all optional fields', () => {
      const entryData = {
        userId: 'user123',
        mealType: 'lunch',
        foodItems: [
          {
            name: 'Chicken Salad',
            calories: 350,
            proteinG: 35,
            carbsG: 20,
            fatG: 10
          }
        ],
        totalCalories: 350,
        notes: 'Delicious and healthy'
      };

      const entry = new DietEntry(entryData);

      expect(entry.notes).toBe('Delicious and healthy');
      expect(entry.foodItems).toHaveLength(1);
      expect(entry.foodItems[0].name).toBe('Chicken Salad');
    });
  });

  describe('Validation Errors', () => {
    it('should validate schema on required fields', async () => {
      const entryData = {
        mealType: 'breakfast'
        // Missing userId which is required
      };

      const entry = new DietEntry(entryData);
      
      try {
        await entry.validate();
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.errors.userId).toBeDefined();
        expect(error.errors.userId.kind).toBe('required');
      }
    });

    it('should validate mealType enum', async () => {
      const entryData = {
        userId: 'user123',
        mealType: 'invalid_meal_type'
      };

      const entry = new DietEntry(entryData);
      
      try {
        await entry.validate();
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.errors.mealType).toBeDefined();
      }
    });
  });
});
