const pool = require('../config/database');
const AppError = require('../utils/AppError');

async function createOrder({ customer, items, shipping_address, notes }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let [customers] = await connection.query(
      'SELECT id FROM customers WHERE email = ?',
      [customer.email]
    );

    let customerId;
    if (customers.length) {
      customerId = customers[0].id;
      await connection.query(
        'UPDATE customers SET full_name = ?, phone = ?, address = ? WHERE id = ?',
        [customer.full_name, customer.phone || null, customer.address || null, customerId]
      );
    } else {
      const [insertCustomer] = await connection.query(
        'INSERT INTO customers (email, full_name, phone, address) VALUES (?, ?, ?, ?)',
        [customer.email, customer.full_name, customer.phone || null, customer.address || null]
      );
      customerId = insertCustomer.insertId;
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const [shoes] = await connection.query(
        'SELECT id, name, price, discount_percent, stock FROM shoes WHERE id = ? AND is_active = TRUE FOR UPDATE',
        [item.shoe_id]
      );

      if (!shoes.length) {
        throw new AppError(`Shoe ID ${item.shoe_id} not found`, 404);
      }

      const shoe = shoes[0];
      if (shoe.stock < item.quantity) {
        throw new AppError(`Insufficient stock for "${shoe.name}"`, 400);
      }

      const unitPrice = parseFloat(
        (shoe.price * (1 - (shoe.discount_percent || 0) / 100)).toFixed(2)
      );
      totalAmount += unitPrice * item.quantity;

      orderItems.push({ shoe_id: shoe.id, quantity: item.quantity, unit_price: unitPrice });

      await connection.query(
        'UPDATE shoes SET stock = stock - ? WHERE id = ?',
        [item.quantity, shoe.id]
      );
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, total_amount, shipping_address, notes) VALUES (?, ?, ?, ?)',
      [customerId, totalAmount.toFixed(2), shipping_address, notes || null]
    );

    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, shoe_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.shoe_id, item.quantity, item.unit_price]
      );
    }

    await connection.commit();
    return getOrderById(orderId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function getOrderById(id) {
  const [orders] = await pool.query(
    `SELECT o.*, c.email, c.full_name, c.phone
     FROM orders o
     JOIN customers c ON o.customer_id = c.id
     WHERE o.id = ?`,
    [id]
  );
  if (!orders.length) throw new AppError('Order not found', 404);

  const [items] = await pool.query(
    `SELECT oi.*, s.name AS shoe_name, s.brand, s.image_url
     FROM order_items oi
     JOIN shoes s ON oi.shoe_id = s.id
     WHERE oi.order_id = ?`,
    [id]
  );

  return {
    ...orders[0],
    total_amount: parseFloat(orders[0].total_amount),
    items: items.map((i) => ({
      ...i,
      unit_price: parseFloat(i.unit_price),
      subtotal: parseFloat((i.unit_price * i.quantity).toFixed(2)),
    })),
  };
}

async function getAllOrders() {
  const [orders] = await pool.query(
    `SELECT o.id, o.status, o.total_amount, o.created_at,
            c.email, c.full_name
     FROM orders o
     JOIN customers c ON o.customer_id = c.id
     ORDER BY o.created_at DESC`
  );
  return orders.map((o) => ({
    ...o,
    total_amount: parseFloat(o.total_amount),
  }));
}

async function updateOrderStatus(id, status) {
  const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    throw new AppError(`Invalid status. Allowed: ${valid.join(', ')}`, 400);
  }
  await getOrderById(id);
  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  return getOrderById(id);
}

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
