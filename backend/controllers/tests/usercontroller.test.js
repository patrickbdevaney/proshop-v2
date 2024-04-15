const userController = require('./userController.js');
const { mockReq, mockRes } = require('@jest-mock/express'); 
const User = require('../models/userModel.js'); 
const generateToken = jest.fn(); // Mock generateToken function

jest.mock('../models/userModel.js'); // Mock User model
jest.mock('../utils/generateToken.js', () => ({ generateToken })); // Mock generateToken

describe('userController', () => {
  describe('authUser', () => {
    it('should login user with valid credentials', async () => {
      const req = mockReq({ body: { email: 'test@example.com', password: 'password' } });
      const res = mockRes();
      const user = { _id: '123', name: 'Test User', email: 'test@example.com', matchPassword: jest.fn().mockReturnValue(true) };
      User.findOne.mockResolvedValueOnce(user);

      await userController.authUser(req, res);

      expect(generateToken).toHaveBeenCalledWith(res, user._id);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: user._id, name: user.name, email: user.email, isAdmin: false })); 
    });

    it('should return 401 for invalid credentials', async () => {
      const req = mockReq({ body: { email: 'test@example.com', password: 'wrongpassword' } });
      const res = mockRes();
      const user = { matchPassword: jest.fn().mockReturnValue(false) };
      User.findOne.mockResolvedValueOnce(user);

      await userController.authUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const req = mockReq({ body: { name: 'Test User', email: 'test@example.com', password: 'password' } });
      const res = mockRes();
      const savedUser = { _id: '123', name: 'Test User', email: 'test@example.com' };
      User.findOne.mockResolvedValueOnce(null); // No existing user
      User.create.mockResolvedValueOnce(savedUser);

      await userController.registerUser(req, res);

      expect(generateToken).toHaveBeenCalledWith(res, savedUser._id);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: savedUser._id, name: savedUser.name, email: savedUser.email, isAdmin: false })); 
    });

    it('should return 400 for existing user', async () => {
      const req = mockReq({ body: { name: 'Test User', email: 'test@example.com', password: 'password' } });
      const res = mockRes();
      const existingUser = { email: 'test@example.com' };
      User.findOne.mockResolvedValueOnce(existingUser);

      await userController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });


  describe('getUserProfile', () => {
    it('should get user profile for authorized user', async () => {
      const req = mockReq({ user: { _id: '123' } });
      const res = mockRes();
      const user = { _id: '123', name: 'Test User', email: 'test@example.com' };
      User.findById.mockResolvedValueOnce(user);

      await userController.getUserProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: user._id, name: user.name, email: user.email, isAdmin: false })); 
    });

    it('should return 404 for non-existent user', async () => {
        const req = mockReq({ user: { _id: '123' } });
        const res = mockRes();
        User.findById.mockResolvedValueOnce(null);
      
        await userController.getUserProfile(req, res);
      
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
      });
    });     
    
    describe('logoutUser', () => {
        it('should logout a user', async () => {
          const req = mockReq();
          const res = mockRes();
      
          await userController.logoutUser(req, res);
      
          expect(res.clearCookie).toHaveBeenCalledWith('token');
          expect(res.json).toHaveBeenCalledWith({ message: 'User logged out' });
        });
      });
      
      describe('updateUserProfile', () => {
        it('should update user profile', async () => {
          const req = mockReq({ user: { _id: '123', name: 'Test User', email: 'test@example.com' }, body: { name: 'Updated User', email: 'updated@example.com' } });
          const res = mockRes();
          const user = { _id: '123', name: 'Test User', email: 'test@example.com', save: jest.fn().mockResolvedValue({}) };
          User.findById.mockResolvedValueOnce(user);
      
          await userController.updateUserProfile(req, res);
      
          expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: user._id, name: req.body.name, email: req.body.email }));
        });
      
        it('should return 404 for non-existent user', async () => {
          const req = mockReq({ user: { _id: '123' } });
          const res = mockRes();
          User.findById.mockResolvedValueOnce(null);
      
          await userController.updateUserProfile(req, res);
      
          expect(res.status).toHaveBeenCalledWith(404);
        });
      });
      
      describe('getUsers', () => {
        it('should get all users (Admin only)', async () => {
          const req = mockReq({ user: { _id: 'admin' } });
          const res = mockRes();
          const users = [{ _id: '123', name: 'Test User', email: 'test@example.com' }];
          User.find.mockResolvedValueOnce(users);
      
          await userController.getUsers(req, res);
      
          expect(res.json).toHaveBeenCalledWith(users);
        });
      
        it('should return 401 for non-admin users', async () => {
          const req = mockReq({ user: {} });
          const res = mockRes();
      
          await userController.getUsers(req, res);
      
          expect(res.status).toHaveBeenCalledWith(401); 
      })});});