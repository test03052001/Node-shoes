const express = require('express');
const shoeController = require('../controllers/shoeController');
const { createShoeRules, updateShoeRules } = require('../validators/shoeValidators');

const router = express.Router();

router.get('/', shoeController.listShoes);
router.get('/:id', shoeController.getShoe);
router.post('/', createShoeRules, shoeController.createShoe);
router.put('/:id', updateShoeRules, shoeController.updateShoe);
router.delete('/:id', shoeController.deleteShoe);

module.exports = router;
