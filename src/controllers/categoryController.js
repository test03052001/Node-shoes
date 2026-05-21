const categoryService = require('../services/categoryService');

async function listCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
}

async function getCategory(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, getCategory };
