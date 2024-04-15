const productController = require('./productController.js');
const { mockReq, mockRes } = require('@jest-mock/express'); 
const Product = require('../models/productModel.js');

jest.mock('../models/productModel.js'); // Mockup

describe('productController', () => {
  describe('getProducts', () => {
    it('should return all products with pagination and search', async () => {
      const req = mockReq({ query: { pageNumber: 1, keyword: 'test' } });
      const res = mockRes();
      Product.countDocuments.mockResolvedValueOnce(10);
      Product.find.mockResolvedValueOnce([{ name: 'Test Product' }]);

      await productController.getProducts(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          products: expect.any(Array),
          page: 1,
          pages: 1,
        })
      );
    });

    it('should return 400 for invalid page number', async () => {
      const req = mockReq({ query: { pageNumber: 'invalid' } });
      const res = mockRes();

      await productController.getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(400); 
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      const req = mockReq({ params: { id: '123' } });
      const res = mockRes();
      const mockProduct = { name: 'Test Product' };
      Product.findById.mockResolvedValueOnce(mockProduct);

      await productController.getProductById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 for non-existent product', async () => {
      const req = mockReq({ params: { id: '123' } });
      const res = mockRes();
      Product.findById.mockResolvedValueOnce(null);

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createProduct', () => {
    it('should create a new product (Admin only)', async () => {
      const req = mockReq({ user: { _id: 'admin' }, body: { name: 'Test Product' } });
      const res = mockRes();
      const mockProduct = { save: jest.fn().mockResolvedValue({}) };
      Product.mockConstructor(() => mockProduct);

      await productController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 401 for non-admin users', async () => {
      const req = mockReq({ user: {}, body: { name: 'Test Product' } });
      const res = mockRes();

      await productController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(401); 
    });
  });

  describe('updateProduct', () => {
    it('should update a product (Admin only)', async () => {
      const req = mockReq({ user: { _id: 'admin' }, params: { id: '123' }, body: { name: 'Updated Product' } });
      const res = mockRes();
      const mockProduct = { name: 'Test Product', save: jest.fn().mockResolvedValue({}) };
      Product.findById.mockResolvedValueOnce(mockProduct);

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 401 for non-admin users', async () => {
      const req = mockReq({ user: {}, params: { id: '123' }, body: { name: 'Updated Product' } });
      const res = mockRes();

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

});
