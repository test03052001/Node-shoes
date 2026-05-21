const express = require('express');
const shoeRoutes = require('./shoeRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Shoes Store API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/categories', categoryRoutes);
router.use('/shoes', shoeRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
