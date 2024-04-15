import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc  Create new order
// @route  POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Get the ordered items from our database
  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  // Validate product existence (optional)
  const missingItems = orderItems.filter(
    (item) => !itemsFromDB.some((dbItem) => dbItem._id.toString() === item._id)
  );
  if (missingItems.length > 0) {
    const missingItemIds = missingItems.map((item) => item._id);
    return res.status(400).json({
      message: `Products with IDs ${missingItemIds.join(', ')} not found`,
    });
  }

  // Map over the order items and use the price from our items from database
  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );
    return {
      ...itemFromClient,
      product: itemFromClient._id,
      price: matchingItemFromDB.price,
      _id: undefined,
    };
  });

  // Calculate prices
  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  try {
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// @desc  Get logged in user orders
// @route  GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('user', 'name email');
  res.json(orders);
});

// @desc  Get order by ID
// @route  GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// @desc  Update order to paid
// @route  PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // Verify the payment was made to PayPal before marking the order as paid
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) {
    return res.status(400).json({ message: 'Payment not verified' });
  }

  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) {
    return res.status(400).json({ message: 'Transaction has been used before' });
  }

  const order = await Order.findById(req.params.id);


  if (order) {
    // Check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) {
      return res.status(400).json({ message: 'Incorrect amount paid' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    try {
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating order' });
    }
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// @desc  Update order to delivered
// @route  GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    try {
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating order' });
    }
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// @desc  Get all orders (for Admin)
// @route  GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  // Consider pagination for large datasets
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};