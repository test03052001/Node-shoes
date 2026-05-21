CREATE DATABASE IF NOT EXISTS shoes_store;
USE shoes_store;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  size VARCHAR(20) NOT NULL,
  color VARCHAR(50) NOT NULL,
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_shoes_category (category_id),
  INDEX idx_shoes_brand (brand),
  INDEX idx_shoes_price (price)
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  shoe_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (shoe_id) REFERENCES shoes(id) ON DELETE RESTRICT
);

INSERT INTO categories (name, slug, description) VALUES
  ('Running', 'running', 'Performance running footwear'),
  ('Casual', 'casual', 'Everyday comfort shoes'),
  ('Formal', 'formal', 'Business and dress shoes'),
  ('Sports', 'sports', 'Athletic and training shoes'),
  ('Kids', 'kids', 'Footwear for children');

INSERT INTO shoes (category_id, name, brand, description, price, discount_percent, stock, size, color, image_url, is_featured) VALUES
  (1, 'Air Sprint Pro', 'Nike', 'Lightweight running shoe with responsive cushioning.', 129.99, 10, 50, '42', 'Black/White', 'https://example.com/nike-sprint.jpg', TRUE),
  (1, 'Velocity Runner', 'Adidas', 'Breathable mesh upper for long-distance runs.', 119.99, 0, 35, '41', 'Blue', 'https://example.com/adidas-velocity.jpg', FALSE),
  (2, 'Urban Walk Classic', 'Clarks', 'Premium leather casual shoe for daily wear.', 89.99, 15, 60, '43', 'Brown', 'https://example.com/clarks-urban.jpg', TRUE),
  (2, 'Street Flex', 'Puma', 'Modern street-style sneaker with soft sole.', 79.99, 5, 45, '40', 'Grey', 'https://example.com/puma-street.jpg', FALSE),
  (3, 'Executive Oxford', 'Cole Haan', 'Handcrafted oxford for formal occasions.', 199.99, 0, 25, '44', 'Black', 'https://example.com/cole-oxford.jpg', TRUE),
  (4, 'Court Master', 'Jordan', 'Basketball-inspired high-top with ankle support.', 149.99, 20, 30, '42', 'Red/Black', 'https://example.com/jordan-court.jpg', TRUE),
  (5, 'Kids Fun Step', 'Skechers', 'Colorful and durable shoes for active kids.', 49.99, 0, 80, '32', 'Multicolor', 'https://example.com/skechers-kids.jpg', FALSE);
