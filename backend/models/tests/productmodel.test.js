import mongoose from 'mongoose';
import Product from '../productModel.js';

describe('Product Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  it('calculate average rating correctly', async () => {
    const productData = {
      user: mongoose.Types.ObjectId(),
      name: 'Test product',
      image: 'test.jpg',
      brand: 'Test Brand',
      category: 'Test Category',
      description: 'Test Description',
      reviews: [
        { name: 'Test User 1', rating: 5, comment: 'Great product!', user: mongoose.Types.ObjectId() },
        { name: 'Test User 2', rating: 4, comment: 'Good product!', user: mongoose.Types.ObjectId() },
      ],
      price: 9.99,
      countInStock: 10,
    };
    const validProduct = new Product(productData);
    const savedProduct = await validProduct.save();

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.rating).toBe((5 + 4) / 2);
  });

  // Cleanup the test database
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
