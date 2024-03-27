const request = require('supertest');
const app = require('../../../index');

// Mocking bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mocking jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fakeToken'),
}));

// Mocking the User model initially without specifying implementation
jest.mock('../../models/User');

const User = require('../../../models/User'); // Import after mocking

describe('User Controller Tests', () => {
  beforeEach(() => {
    // Define mockUser within beforeEach to ensure it's freshly initialized for each test
    const mockUser = {
      _id: 'someUserId',
      firstname: 'Test',
      lastname: 'User',
      contact: 'test@example.com',
      password: 'hashedPassword', // Assuming the password is hashed
      dateofbirth: '1990-01-01',
      gender: 'male',
      save: jest.fn().mockResolvedValue(true),
    };

    // Use mockImplementation to define how mocks behave for each test
    User.findOne.mockResolvedValue(mockUser);
    // Mock any other necessary User model functions here
  });

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          firstname: 'Test',
          lastname: 'User',
          contact: 'test@example.com',
          password: 'password123',
          dateofbirth: '1990-01-01',
          gender: 'male',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('message', 'Register successful');
    });
  });

  describe('POST /api/users/login', () => {
    it('should log in an existing user successfully', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          contact: 'test@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('message', 'Login successful');
    });
  });

});
