
const request = require('supertest');
const app = require('../server.js');

describe('Server', () => {
  it('should be running and return a message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('API is running....');
  });

  it('should return a PayPal client ID', async () => {
    const res = await request(app).get('/api/config/paypal');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('clientId');
  });


});
