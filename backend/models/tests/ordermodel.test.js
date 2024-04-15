import mongoose from 'mongoose';
import Order from '../orderModel.js';

describe('Order Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  it('calculate total price correctly', async () => {
    const orderData = {
      user: mongoose.Types.ObjectId(),
      orderItems: [
        { name: 'Test product 1', qty: 1, image: 'test.jpg', price: 9.99, product: mongoose.Types.ObjectId() },
        { name: 'Test product 2', qty: 2, image: 'test.jpg', price: 19.99, product: mongoose.Types.ObjectId() },
      ],
      shippingAddress: {
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country',
      },
      paymentMethod: 'Test',
    };
    const validOrder = new Order(orderData);
    const savedOrder = await validOrder.save();

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.totalPrice).toBe((9.99 * 1 + 19.99 * 2).toFixed(2));
  });

 
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
