const orderService = require('../services/orderService');
const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

async function listOrders(req, res, next) {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

async function createOrder(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
    }
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array().map((e) => e.msg).join(', '), 400);
    }
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
};
