const { body } = require('express-validator');

const createOrderRules = [
  body('customer.full_name').trim().notEmpty().withMessage('Customer full name is required'),
  body('customer.phone').optional().trim(),
  body('customer.address').optional().trim(),
  body('shipping_address').trim().notEmpty().withMessage('Shipping address is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('items.*.shoe_id').isInt({ min: 1 }).withMessage('Valid shoe_id is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('notes').optional().trim(),
];

const updateStatusRules = [
  body('status')
    .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

module.exports = { createOrderRules, updateStatusRules };
