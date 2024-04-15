const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes.js'); 

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test User');
  });

  it('should authenticate a user', async () => {
    const res = await request(app)
      .post('/api/users/auth')
      .send({
        email: 'test@example.com',
        password: 'password',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  
});
