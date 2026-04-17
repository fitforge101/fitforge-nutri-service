const jwt = require('jsonwebtoken');
const auth = require('../../src/middleware/auth');

const JWT_SECRET = 'fitforge_dev_secret';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('Successful Authentication', () => {
    it('should call next() when valid token is provided', () => {
      const token = jwt.sign({ userId: 'user123', email: 'test@example.com' }, JWT_SECRET);
      req.header.mockReturnValue(`Bearer ${token}`);

      auth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(expect.objectContaining({
        userId: 'user123',
        email: 'test@example.com'
      }));
    });
  });

  describe('Failed Authentication', () => {
    it('should return 401 when no Authorization header is provided', () => {
      req.header.mockReturnValue(null);

      auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when Authorization header does not start with Bearer', () => {
      req.header.mockReturnValue('Basic token123');

      auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', () => {
      req.header.mockReturnValue('Bearer invalid_token_xyz');

      auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is expired', () => {
      const expiredToken = jwt.sign({ userId: 'user123' }, JWT_SECRET, { expiresIn: '0s' });
      
      // Wait a bit to ensure token is expired
      setTimeout(() => {
        req.header.mockReturnValue(`Bearer ${expiredToken}`);
        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
        expect(next).not.toHaveBeenCalled();
      }, 100);
    });

    it('should return 401 when Bearer token is empty', () => {
      req.header.mockReturnValue('Bearer ');

      auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
