<?php
// backend/config/db.php
// ─────────────────────────────────────────────────────────────────
// DATABASE CONFIGURATION — HOSTINGER SHARED HOSTING COMPATIBLE
// ─────────────────────────────────────────────────────────────────
//
// CREDENTIAL PRIORITY (highest → lowest):
//   1. db.local.php   ← USE THIS on Hostinger (hardcoded credentials)
//   2. getenv()       ← For VPS/Docker environments with env vars set
//   3. Defaults below ← Local dev fallback only
//
// HOSTINGER SETUP:
//   Copy backend/config/db.production.php → backend/config/db.local.php
//   on the server and fill in your hPanel database credentials.
//   NOTE: On Hostinger shared hosting, SetEnv in .htaccess does NOT
//   reliably propagate to PHP via getenv(). Always use db.local.php.
// ─────────────────────────────────────────────────────────────────

// CORS and response headers
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit(0);
}

// Step 1: Set default (dev) credentials
$host     = "127.0.0.1";
$db_name  = "bookworm_db";
$username = "root";
$password = "";

// Step 2: Override with environment variables if available (VPS/Docker)
if (getenv("DB_HOST") !== false)  $host     = getenv("DB_HOST");
if (getenv("DB_NAME") !== false)  $db_name  = getenv("DB_NAME");
if (getenv("DB_USER") !== false)  $username = getenv("DB_USER");
if (getenv("DB_PASS") !== false)  $password = getenv("DB_PASS");

// Step 3: Override with db.local.php if it exists (Hostinger + local dev)
// This file is in .gitignore — never committed to git.
if (file_exists(__DIR__ . "/db.local.php")) {
    include __DIR__ . "/db.local.php";
}

try {
    $conn = new PDO(
        "mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4",
        $username,
        $password
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failure: " . $exception->getMessage()
    ]);
    exit();
}
