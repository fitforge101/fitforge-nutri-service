const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const nutritionRoutes = require('../../src/routes/nutrition');
const DietEntry = require('../../src/models/DietEntry');

jest.mock('../../src/models/DietEntry');

const JWT_SECRET = 'fitforge_dev_secret';

describe('Nutrition Routes', () => {
  let app;
  const validToken = jwt.sign({ userId: 'user123', email: 'test@example.com' }, JWT_SECRET);

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/nutrition', nutritionRoutes);
    jest.clearAllMocks();
  });

  describe('GET /nutrition/diet/:userId', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .get('/nutrition/diet/user123')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No token, authorization denied' });
    });

    it('should return 401 when invalid token is provided', async () => {
      const response = await request(app)
        .get('/nutrition/diet/user123')
        .set('Authorization', 'Bearer invalid_token')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Token is not valid' });
    });

    it('should return diet entries when valid token is provided', async () => {
      const mockEntries = [
        {
          _id: 'entry1',
          userId: 'user123',
          mealType: 'breakfast',
          totalCalories: 300,
          date: new Date()
        },
        {
          _id: 'entry2',
          userId: 'user123',
          mealType: 'lunch',
          totalCalories: 500,
          date: new Date()
        }
      ];

      DietEntry.find.mockResolvedValue(mockEntries);

      const response = await request(app)
        .get('/nutrition/diet/user123')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEntries);
      expect(DietEntry.find).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('should return empty array when user has no diet entries', async () => {
      DietEntry.find.mockResolvedValue([]);

      const response = await request(app)
        .get('/nutrition/diet/user123')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 500 when database error occurs', async () => {
      DietEntry.find.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/nutrition/diet/user123')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Database connection failed' });
    });
  });

  describe('POST /nutrition/diet', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/nutrition/diet')
        .set('Content-Type', 'application/json')
        .send({
          userId: 'user123',
          mealType: 'breakfast',
          totalCalories: 300
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No token, authorization denied' });
    });

    it('should create a new diet entry when valid token is provided', async () => {
      const newEntry = {
        _id: 'newEntry1',
        userId: 'user123',
        mealType: 'breakfast',
        foodItems: [{ name: 'Oatmeal', calories: 150 }],
        totalCalories: 150,
        notes: 'Healthy breakfast'
      };

      DietEntry.create.mockResolvedValue(newEntry);

      const response = await request(app)
        .post('/nutrition/diet')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .send(newEntry);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newEntry);
      expect(DietEntry.create).toHaveBeenCalledWith(newEntry);
    });

    it('should return 500 when creation fails', async () => {
      DietEntry.create.mockRejectedValue(new Error('Validation failed'));

      const response = await request(app)
        .post('/nutrition/diet')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'application/json')
        .send({
          userId: 'user123',
          mealType: 'breakfast'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Validation failed' });
    });
  });

  describe('DELETE /nutrition/diet/:entryId', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .delete('/nutrition/diet/entry123')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'No token, authorization denied' });
    });

    it('should delete diet entry when valid token is provided', async () => {
      DietEntry.findByIdAndDelete.mockResolvedValue({ _id: 'entry123' });

      const response = await request(app)
        .delete('/nutrition/diet/entry123')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Entry deleted' });
      expect(DietEntry.findByIdAndDelete).toHaveBeenCalledWith('entry123');
    });

    it('should return 500 when deletion fails', async () => {
      DietEntry.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

      const response = await request(app)
        .delete('/nutrition/diet/entry123')
        .set('Authorization', `Bearer ${validToken}`)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Delete failed' });
    });
  });
});
