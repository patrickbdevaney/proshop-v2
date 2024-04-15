
const request = require('supertest');
const express = require('express');
const uploadRoutes = require('../routes/uploadRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/upload', uploadRoutes);

describe('Upload Routes', () => {
  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app).post('/api/upload');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'No file uploaded');
  });


});
