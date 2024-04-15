const orderController = require('./orderController');
const { mockReq, mockRes } = require('@jest-mock/express'); 

jest.mock('../models/orderModel.js'); 
jest.mock('../models/productModel.js'); 
jest.mock('../utils/calcPrices.js');
jest.mock('../utils/paypal.js'); 

describe('orderController', () => {
  describe('addOrderItems', () => {
    it('should return 400 for empty order items', async () => {
      const req = mockReq({ body: { orderItems: [] } });
      const res = mockRes();
      await orderController.addOrderItems(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No order items' });
    });

    it('should return 400 for invalid product IDs', async () => {
      const req = mockReq({ body: { orderItems: [{ _id: 'invalid' }] } });
      const res = mockRes();
      Product.find.mockResolvedValueOnce([]);
      await orderController.addOrderItems(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toMatchObject({ message: expect.stringContaining('not found') });
    });

    it('should create order successfully', async () => {
      const req = mockReq({ body: { orderItems: [{ _id: '123' }] } });
      const res = mockRes();
      const mockProduct = { price: 10 };
      const mockOrder = { save: jest.fn().mockResolvedValue({}) };
      Product.find.mockResolvedValueOnce([mockProduct]);
      calcPrices.mockReturnValue({});
      Order.mockConstructor(() => mockOrder);
      await orderController.addOrderItems(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });



  describe('updateOrderToPaid', () => {
    it('should return 400 for failed payment verification', async () => {
      const req = mockReq({ body: { id: 'paymentID' } });
      const res = mockRes();
      verifyPayPalPayment.mockResolvedValueOnce({ verified: false });
      await orderController.updateOrderToPaid(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveProperty('message', 'Payment not verified');
    });

    it('should return 404 if order is not found', async () => {
      const req = mockReq({ params: { id: 'orderId' }, body: { id: 'paymentID' } });
      const res = mockRes();
      Order.findById.mockResolvedValueOnce(null);
      await orderController.updateOrderToPaid(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order not found' });
    });

 
  });

  describe('updateOrderToDelivered', () => {
    it('should update order to delivered successfully', async () => {
      const req = mockReq({ params: { id: 'orderId' } });
      const res = mockRes();
      const mockOrder = { isDelivered: false, save: jest.fn().mockResolvedValue({}) };
      Order.findById.mockResolvedValueOnce(mockOrder);
      await orderController.updateOrderToDelivered(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 404 if order is not found', async () => {
      const req = mockReq({ params: { id: 'orderId' } });
      const res = mockRes();
      Order.findById.mockResolvedValueOnce(null);
      await orderController.updateOrderToDelivered(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order not found' });
    });
  });
});