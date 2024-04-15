
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../server.js'); 
const User = require('../models/userModel.js');

describe('userController', () => {
  describe('protect middleware', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/users/profile'); 
      expect(res.statusCode).toEqual(401);
    });

    it('should return 401 if token is invalid', async () => {
      const res = await request(app).get('/api/users/profile').set('Authorization', 'Bearer invalidtoken');
      expect(res.statusCode).toEqual(401);
    });

    it('should return user profile if token is valid', async () => {
      const user = new User({ name: 'Test User', email: 'test@example.com', password: 'password' });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const res = await request(app).get('/api/users/profile').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', user.name);
    });
  });

  describe('admin middleware', () => {
    it('should return 401 if user is not an admin', async () => {
      const user = new User({ name: 'Test User', email: 'test@example.com', password: 'password', isAdmin: false });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`); 
      expect(res.statusCode).toEqual(401);
    });

    it('should return users if user is an admin', async () => {
      const user = new User({ name: 'Test User', email: 'test@example.com', password: 'password', isAdmin: true });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`); 
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });


  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
