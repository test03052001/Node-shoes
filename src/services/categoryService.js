const pool = require('../config/database');
const AppError = require('../utils/AppError');

async function getAllCategories() {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
  return rows;
}

async function getCategoryById(id) {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  if (!rows.length) throw new AppError('Category not found', 404);
  return rows[0];
}

async function getCategoryBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [slug]);
  if (!rows.length) throw new AppError('Category not found', 404);
  return rows[0];
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
};
