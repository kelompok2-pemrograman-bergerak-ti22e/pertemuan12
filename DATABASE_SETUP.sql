-- ============================================
-- DATABASE SETUP UNTUK SISTEM LOGIN & REGISTER
-- ============================================

-- 1. Buat Database
CREATE DATABASE IF NOT EXISTS db_kampus;
USE db_kampus;

-- 2. Buat Tabel Users
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- QUERIES UNTUK TESTING
-- ============================================

-- Lihat semua users
SELECT id, username, created_at FROM users;

-- Lihat struktur tabel
DESCRIBE users;

-- Hapus user tertentu (pakai dengan hati-hati)
DELETE FROM users WHERE username = 'testuser';

-- Truncate table (hapus semua data, pakai dengan hati-hati)
-- TRUNCATE TABLE users;

-- ============================================
-- SQL UNTUK FITUR TAMBAHAN (Optional)
-- ============================================

-- Tambahan: Tabel untuk menyimpan log login
CREATE TABLE IF NOT EXISTS login_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tambahan: Tabel untuk password reset token
CREATE TABLE IF NOT EXISTS password_resets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
