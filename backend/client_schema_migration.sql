-- ============================================================
-- CLIENT SCHEMA ALIGNMENT MIGRATION
-- Safe to run on existing databases — no data will be lost.
-- Run AFTER schema.sql and admin_migration.sql have been applied.
-- ============================================================

-- -------------------------------------------------------
-- PHASE 2A: UPDATE EXISTING TABLE — categories
-- Add image_url column
-- -------------------------------------------------------
ALTER TABLE `categories`
  ADD COLUMN IF NOT EXISTS `image_url` VARCHAR(255) DEFAULT NULL AFTER `icon_class`;

-- -------------------------------------------------------
-- PHASE 2B: UPDATE EXISTING TABLE — books
-- Add is_biography_book flag
-- -------------------------------------------------------
ALTER TABLE `books`
  ADD COLUMN IF NOT EXISTS `is_biography_book` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_new_release`,
  ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- -------------------------------------------------------
-- PHASE 2C: UPDATE EXISTING TABLE — orders
-- Add transaction_id column (links to transactions table)
-- -------------------------------------------------------
ALTER TABLE `orders`
  ADD COLUMN IF NOT EXISTS `transaction_id` VARCHAR(100) DEFAULT NULL AFTER `payment_method`,
  ADD COLUMN IF NOT EXISTS `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`;

-- -------------------------------------------------------
-- PHASE 1A: CREATE NEW TABLE — transactions
-- Stores payment transaction records linked to orders
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL,
  `transaction_ref` VARCHAR(100) NOT NULL UNIQUE,
  `payment_gateway` VARCHAR(50) NOT NULL DEFAULT 'manual',
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `gateway_response` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_transactions_order_id` (`order_id`),
  INDEX `idx_transactions_status` (`status`),
  INDEX `idx_transactions_created_at` (`created_at`),
  CONSTRAINT `fk_transactions_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- PHASE 1B: CREATE NEW TABLE — banners
-- Stores homepage/promotional banner slides
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title_prefix` VARCHAR(100) DEFAULT NULL,
  `title_highlighted` VARCHAR(100) DEFAULT NULL,
  `title_suffix` VARCHAR(100) DEFAULT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `action_url` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_banners_is_active` (`is_active`),
  INDEX `idx_banners_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- PHASE 1C: CREATE NEW TABLE — wishlist
-- Stores user-saved books for later
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `book_id` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_wishlist_user_book` (`user_id`, `book_id`),
  INDEX `idx_wishlist_user_id` (`user_id`),
  INDEX `idx_wishlist_book_id` (`book_id`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_book` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- Seed default banners (mirrors existing PromoSlide mockData)
-- -------------------------------------------------------
INSERT INTO `banners` (`title_prefix`, `title_highlighted`, `title_suffix`, `subtitle`, `image_url`, `action_url`, `sort_order`, `is_active`)
VALUES 
  ('Books that make you', 'think,', 'feel, and grow.', 'Explore thousands of curated titles — from timeless classics to today\'s bestsellers.', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80', '/shop', 1, 1),
  ('Discover your next', 'great', 'read today.', 'Browse our hand-picked selection of fiction, non-fiction, and more.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80', '/shop', 2, 1)
ON DUPLICATE KEY UPDATE `id`=`id`;
