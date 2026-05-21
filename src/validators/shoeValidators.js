const { body } = require('express-validator');

const createShoeRules = [
  body('category_id').isInt({ min: 1 }).withMessage('Valid category_id is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('stock').isInt({ min: 0 }).withMessage('Valid stock is required'),
  body('size').trim().notEmpty().withMessage('Size is required'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('discount_percent').optional().isFloat({ min: 0, max: 100 }),
  body('is_featured').optional().isBoolean(),
];

const updateShoeRules = [
  body('category_id').optional().isInt({ min: 1 }),
  body('name').optional().trim().notEmpty(),
  body('brand').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('size').optional().trim().notEmpty(),
  body('color').optional().trim().notEmpty(),
  body('discount_percent').optional().isFloat({ min: 0, max: 100 }),
  body('is_featured').optional().isBoolean(),
  body('is_active').optional().isBoolean(),
];

module.exports = { createShoeRules, updateShoeRules };
