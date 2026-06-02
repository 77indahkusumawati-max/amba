-- ============================================
-- STMJ NINGRAT - DATABASE SEED
-- ============================================

-- Gunakan database
USE minuman_db;

-- ============================================
-- HAPUS TABEL LAMA (HATI-HATI!)
-- ============================================
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

-- ============================================
-- BUAT TABEL PRODUCTS
-- ============================================
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

-- ============================================
-- BUAT TABEL ORDERS
-- ============================================
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

-- ============================================
-- BUAT TABEL ORDER_ITEMS
-- ============================================
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

-- ============================================
-- INSERT DATA PRODUK
-- ============================================
INSERT INTO products (name, description, price, category, image, stock, badge) VALUES
('STMJ Telur Ayam Kampung (1 Telur)', 'Susu Telur Madu Jahe dengan 1 telur ayam kampung asli', 16000, 'stmj-ayam', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f80b?w=400&h=300&fit=crop', 99, '⭐ Favorite'),
('STMJ Telur Ayam Kampung (2 Telur)', 'Susu Telur Madu Jahe double telur ayam kampung, lebih nikmat!', 19000, 'stmj-ayam', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', 99, '🔥 Double'),
('STMJ Telur Ayam Kampung (3 Telur)', 'Susu Telur Madu Jahe triple telur ayam kampung, super puas!', 22000, 'stmj-ayam', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop', 99, '💪 Triple Power'),
('STMJ Telur Bebek (1 Telur)', 'Susu Telur Madu Jahe dengan 1 telur bebek premium', 18000, 'stmj-bebek', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', 99, NULL),
('STMJ Telur Bebek (2 Telur)', 'Susu Telur Madu Jahe double telur bebek, extra creamy!', 22000, 'stmj-bebek', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f80b?w=400&h=300&fit=crop', 99, '🦆 Premium'),
('STMJ Telur Bebek (3 Telur)', 'Susu Telur Madu Jahe triple telur bebek, ultimate stamina!', 26000, 'stmj-bebek', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop', 99, '👑 Ultimate'),
('Susu Sapi Murni', 'Susu sapi segar murni, hangat & creamy', 9000, 'susu', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop', 99, NULL),
('Susu Madu', 'Susu sapi murni dengan madu pilihan, manis alami', 11000, 'susu', 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop', 99, NULL),
('Susu Jahe', 'Susu sapi murni dengan jahe merah, hangat maksimal', 11000, 'susu', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', 99, '🫚 Hangat'),
('Susu Madu Jahe', 'Kombinasi lengkap susu, madu, dan jahe merah', 13000, 'susu', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop', 99, '🍯 Best Combo'),
('Tambahan Majun', 'Rempah majun untuk vitalitas & kehangatan ekstra', 5000, 'rempah', 'https://images.unsplash.com/photo-1515377905703-c4788c4bda1e?w=400&h=300&fit=crop', 99, NULL),
('Tambahan Ginseng', 'Ginseng premium untuk stamina & daya tahan tubuh', 10000, 'rempah', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', 99, '💪 Vitalitas'),
('Wedang Uwuh', 'Minuman rempah khas Jogja dengan campuran daun & rempah pilihan', 10000, 'minuman', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop', 99, '👑 Raja'),
('Teh Jahe', 'Teh pilihan dengan jahe merah segar, klasik & menghangatkan', 8000, 'minuman', 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=300&fit=crop', 99, NULL),
('Kopi Jahe', 'Kopi hitam dengan campuran jahe, nikmat & berkhasiat', 8000, 'minuman', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', 99, NULL),
('Wedang Sereh Jahe', 'Perpaduan sereh & jahe yang menyegarkan dan menghangatkan', 10000, 'minuman', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', 99, NULL),
('Wedang Telang', 'Minuman bunga telang biru yang cantik & menyegarkan', 10000, 'minuman', 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=300&fit=crop', 99, '💙 Cantik');

-- ============================================
-- SELESAI
-- ============================================
SELECT '✅ Seed data berhasil diimport!' AS status;
SELECT COUNT(*) AS total_products FROM products;