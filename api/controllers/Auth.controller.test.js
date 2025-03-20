import { Login } from './Auth.controller.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../models/user.model.js'); // Mock User Model
jest.mock('bcryptjs'); // Mock bcrypt
jest.mock('jsonwebtoken'); // Mock JWT

describe('Auth Controller - Login (Passing Test Case)', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
    jest.restoreAllMocks(); // Restore original implementations
  });

  it('should return 200 and a token when valid credentials are provided', async () => {
    const mockUser = {
      _id: '1234567890',
      email: 'test@example.com',
      password: 'hashedPassword', // Simulated hashed password
    };

    // Mock dependencies
    User.findOne.mockResolvedValue(mockUser); // Simulate finding user in DB
    bcryptjs.compare.mockResolvedValue(true); // Simulate correct password check
    jwt.sign.mockReturnValue('mockGeneratedToken'); // Simulate JWT generation

    const req = { body: { email: 'test@example.com', password: 'password123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await Login(req, res, next);

    // Debugging: Log the response
    console.log('Response:', res.json.mock.calls);

    expect(res.status).toHaveBeenCalledWith(200); // Expect 200 response
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user: { email: 'test@example.com' }, // Ensure user object is returned
      token: 'mockGeneratedToken', // Ensure correct token is returned
    });

    // Ensure the mocked methods were called as expected
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcryptjs.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: '1234567890', email: 'test@example.com' },
      expect.any(String), // Secret key (mocked)
      { expiresIn: '1h' }
    );
  });

  it('should return 401 if credentials are invalid', async () => {
    // Mock dependencies
    User.findOne.mockResolvedValue(null); // Simulate user not found

    const req = { body: { email: 'invalid@example.com', password: 'wrongpassword' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await Login(req, res, next);

    // Debugging: Log the response
    console.log('Response:', res.json.mock.calls);

    expect(res.status).toHaveBeenCalledWith(401); // Ensure 401 status is returned
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Invalid credentials' }));
  });
});
