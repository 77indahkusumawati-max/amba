-- CREATE DATABASE IF NOT EXISTS minuman_db;   ← kasih comment
USE minuman_db;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) DEFAULT 'minuman',
    image VARCHAR(500),
    stock INT DEFAULT 99,
    badge VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100) DEFAULT 'Customer',
    customer_email VARCHAR(100),
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'QRIS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO products (name, description, price, category, image, badge) VALUES
('STMJ Telur Ayam Kampung (1 Telur)', 'Susu Telur Madu Jahe dengan 1 telur ayam kampung asli', 16000, 'stmj-ayam', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f80b?w=400&h=300&fit=crop', '⭐ Favorite'),
('STMJ Telur Ayam Kampung (2 Telur)', 'Double telur ayam kampung', 19000, 'stmj-ayam', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', '🔥 Double'),
('STMJ Telur Ayam Kampung (3 Telur)', 'Triple telur ayam kampung', 22000, 'stmj-ayam', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop', '💪 Triple'),
('STMJ Telur Bebek (1 Telur)', 'Telur bebek premium', 18000, 'stmj-bebek', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', NULL),
('STMJ Telur Bebek (2 Telur)', 'Double telur bebek creamy', 22000, 'stmj-bebek', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f80b?w=400&h=300&fit=crop', '🦆 Premium'),
('STMJ Telur Bebek (3 Telur)', 'Triple telur bebek ultimate', 26000, 'stmj-bebek', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop', '👑 Ultimate'),
('Susu Sapi Murni', 'Susu sapi segar hangat', 9000, 'susu', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop', NULL),
('Susu Madu', 'Susu dengan madu pilihan', 11000, 'susu', 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop', NULL),
('Susu Jahe', 'Susu dengan jahe merah', 11000, 'susu', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', '🫚 Hangat'),
('Susu Madu Jahe', 'Kombinasi susu, madu, jahe', 13000, 'susu', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop', '🍯 Combo'),
('Tambahan Majun', 'Rempah majun vitalitas', 5000, 'rempah', 'https://images.unsplash.com/photo-1515377905703-c4788c4bda1e?w=400&h=300&fit=crop', NULL),
('Tambahan Ginseng', 'Ginseng premium stamina', 10000, 'rempah', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', '💪 Vitalitas'),
('Wedang Uwuh', 'Rempah khas Jogja', 10000, 'minuman', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop', '👑 Raja'),
('Teh Jahe', 'Teh dengan jahe merah', 8000, 'minuman', 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop', NULL),
('Kopi Jahe', 'Kopi hitam campur jahe', 8000, 'minuman', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', NULL),
('Wedang Sereh Jahe', 'Sereh & jahe', 10000, 'minuman', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', NULL),
('Wedang Telang', 'Bunga telang biru', 10000, 'minuman', 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=300&fit=crop', '💙 Cantik');

SELECT '✅ Data berhasil diimport!' AS status;
SELECT COUNT(*) AS total_products FROM products;