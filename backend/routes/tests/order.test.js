
const request = require('supertest');
const express = require('express');
const orderRoutes = require('../routes/orderRoutes.js'); 

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order Routes', () => {
  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        orderItems: [{ product: '123', name: 'Test Product', qty: 1, price: 9.99 }],
        shippingAddress: { address: '123 Test St', city: 'Test City', postalCode: '12345', country: 'Test Country' },
        paymentMethod: 'PayPal',
        itemsPrice: 9.99,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 9.99,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('orderItems');
  });

 
});

