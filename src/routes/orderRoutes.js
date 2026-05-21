const express = require('express');
const orderController = require('../controllers/orderController');
const { createOrderRules, updateStatusRules } = require('../validators/orderValidators');

const router = express.Router();

router.get('/', orderController.listOrders);
router.get('/:id', orderController.getOrder);
router.post('/', createOrderRules, orderController.createOrder);
router.patch('/:id/status', updateStatusRules, orderController.updateOrderStatus);

module.exports = router;
