<?php
// backend/config/db.production.php
// ─────────────────────────────────────────────────────────────────
// HOSTINGER PRODUCTION DATABASE CONFIGURATION
// ─────────────────────────────────────────────────────────────────
//
// HOW TO USE:
//   1. Rename this file to db.local.php on the server
//   2. Fill in your actual Hostinger credentials below
//   3. This file is loaded automatically by db.php
//      (db.local.php is in .gitignore — never commit credentials)
// ─────────────────────────────────────────────────────────────────

$host     = 'localhost';          // Hostinger MySQL is always localhost
$db_name  = 'u123456789_bookworm';  // Replace with your actual DB name
$username = 'u123456789_bwuser';    // Replace with your actual DB user
$password = 'YOUR_STRONG_PASSWORD'; // Replace with your actual password
