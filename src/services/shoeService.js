const pool = require('../config/database');
const AppError = require('../utils/AppError');

function effectivePrice(price, discountPercent) {
  const discount = parseFloat(discountPercent) || 0;
  return parseFloat((price * (1 - discount / 100)).toFixed(2));
}

async function getAllShoes(filters = {}) {
  let sql = `
    SELECT s.*, c.name AS category_name, c.slug AS category_slug
    FROM shoes s
    JOIN categories c ON s.category_id = c.id
    WHERE s.is_active = TRUE
  `;
  const params = [];

  if (filters.category) {
    sql += ' AND c.slug = ?';
    params.push(filters.category);
  }
  if (filters.brand) {
    sql += ' AND s.brand LIKE ?';
    params.push(`%${filters.brand}%`);
  }
  if (filters.minPrice) {
    sql += ' AND s.price >= ?';
    params.push(filters.minPrice);
  }
  if (filters.maxPrice) {
    sql += ' AND s.price <= ?';
    params.push(filters.maxPrice);
  }
  if (filters.featured === 'true') {
    sql += ' AND s.is_featured = TRUE';
  }
  if (filters.search) {
    sql += ' AND (s.name LIKE ? OR s.brand LIKE ? OR s.description LIKE ?)';
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY s.created_at DESC';

  const [rows] = await pool.query(sql, params);
  return rows.map(formatShoe);
}

async function getShoeById(id) {
  const [rows] = await pool.query(
    `SELECT s.*, c.name AS category_name, c.slug AS category_slug
     FROM shoes s
     JOIN categories c ON s.category_id = c.id
     WHERE s.id = ? AND s.is_active = TRUE`,
    [id]
  );
  if (!rows.length) throw new AppError('Shoe not found', 404);
  return formatShoe(rows[0]);
}

async function createShoe(data) {
  const [result] = await pool.query(
    `INSERT INTO shoes
     (category_id, name, brand, description, price, discount_percent, stock, size, color, image_url, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category_id,
      data.name,
      data.brand,
      data.description || null,
      data.price,
      data.discount_percent || 0,
      data.stock,
      data.size,
      data.color,
      data.image_url || null,
      data.is_featured || false,
    ]
  );
  return getShoeById(result.insertId);
}

async function updateShoe(id, data) {
  const existing = await getShoeById(id);
  const fields = [];
  const values = [];

  const allowed = [
    'category_id', 'name', 'brand', 'description', 'price',
    'discount_percent', 'stock', 'size', 'color', 'image_url', 'is_featured', 'is_active',
  ];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (!fields.length) return existing;

  values.push(id);
  await pool.query(`UPDATE shoes SET ${fields.join(', ')} WHERE id = ?`, values);
  return getShoeById(id);
}

async function deleteShoe(id) {
  await getShoeById(id);
  await pool.query('UPDATE shoes SET is_active = FALSE WHERE id = ?', [id]);
  return { message: 'Shoe deactivated successfully' };
}

function formatShoe(row) {
  return {
    id: row.id,
    category_id: row.category_id,
    category_name: row.category_name,
    category_slug: row.category_slug,
    name: row.name,
    brand: row.brand,
    description: row.description,
    price: parseFloat(row.price),
    discount_percent: parseFloat(row.discount_percent),
    sale_price: effectivePrice(row.price, row.discount_percent),
    stock: row.stock,
    size: row.size,
    color: row.color,
    image_url: row.image_url,
    is_featured: Boolean(row.is_featured),
    is_active: Boolean(row.is_active),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

module.exports = {
  getAllShoes,
  getShoeById,
  createShoe,
  updateShoe,
  deleteShoe,
};
