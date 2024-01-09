import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    itemsPrice,
    totalPrice,
    card,
    sid,
    userID
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
    return
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      itemsPrice,
      totalPrice,
      card,
      sid,
      userID
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// THIS IS RAND API

const getOrderByUserId = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ userID: req.params.userID }).populate('user');

  if (order) {
    // Destructure the required fields
    const { card, user: { rand, isControl } } = order;

    // Calculate new rand value
    const dripPrice = 0.05 * rand + 6.85;

    // Construct a new object with the required fields
    const orderDetails = {
      purchasedItem: card,
      dripPrice: dripPrice,
      isControl
    };

    res.json(orderDetails);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


// @desc    Get order by SID
// @route   GET /api/orders/sid/:sid
// @access  Private
const getOrderBySid = asyncHandler(async (req, res) => {
  // Assuming 'orderItems' is an array and 'sid' is a field within the objects in that array
  const order = await Order.findOne({ 'orderItems.sid': req.params.sid }).populate(
    'user',
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found with the given SID');
  }
});


// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrderBySid,
  getOrderByUserId
}
