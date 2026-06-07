-- backend/admin_migration.sql

-- 1. Add User Role field to enable role-based authorization
ALTER TABLE `users` 
ADD COLUMN `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer' AFTER `password`;

-- 2. Create Settings table to store custom e-commerce configurations
CREATE TABLE IF NOT EXISTS `settings` (
  `key` VARCHAR(100) PRIMARY KEY,
  `value` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Populate default admin user (Seed)
-- Password is 'admin123' hashed using PHP bcrypt (PASSWORD_BCRYPT)
INSERT INTO `users` (`first_name`, `last_name`, `display_name`, `email`, `password`, `role`)
VALUES ('Admin', 'Bookworm', 'admin', 'admin@bookworm.com', '$2y$10$WpZ686Wl5sX069DsnfQWKeX5Q/FvR3L8iXf.Yk6g4Uq5.z6Fp3Pye', 'admin')
ON DUPLICATE KEY UPDATE
    `role`     = 'admin',
    `password` = '$2y$10$WpZ686Wl5sX069DsnfQWKeX5Q/FvR3L8iXf.Yk6g4Uq5.z6Fp3Pye';

-- 4. Populate default system configurations
-- Keys must match exactly what SettingsPage.tsx reads/writes:
-- store_name, store_email, store_phone, store_address,
-- shipping_cost_flat, currency_symbol, paypal_client_id, stripe_public_key
INSERT INTO `settings` (`key`, `value`) VALUES 
('store_name', 'Bookworm Bookstore'),
('store_email', 'contact@bookworm.com'),
('store_phone', ''),
('store_address', ''),
('shipping_cost_flat', '5.00'),
('currency_symbol', '$'),
('paypal_client_id', ''),
('stripe_public_key', '')
ON DUPLICATE KEY UPDATE `key`=`key`;

-- NOTE for existing databases: if you already ran the old migration,
-- run this block to rename/migrate the stale keys to the correct ones:
-- INSERT INTO `settings` (`key`, `value`)
--   SELECT 'store_email', `value` FROM `settings` WHERE `key` = 'contact_email'
--   ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
-- INSERT INTO `settings` (`key`, `value`)
--   SELECT 'shipping_cost_flat', `value` FROM `settings` WHERE `key` = 'shipping_fee'
--   ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
-- INSERT INTO `settings` (`key`, `value`) VALUES ('currency_symbol', '$') ON DUPLICATE KEY UPDATE `key`=`key`;
-- DELETE FROM `settings` WHERE `key` IN ('contact_email', 'currency', 'shipping_fee', 'free_shipping_min');
