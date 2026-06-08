<?php
// backend/api/admin/auth_debug.php
// ─────────────────────────────────────────────────────────────────
// TEMPORARY DEBUG ENDPOINT — DELETE AFTER USE
// ─────────────────────────────────────────────────────────────────
// Upload this file to: public_html/backend/api/admin/auth_debug.php
// Call via: POST https://yourdomain.com/backend/api/admin/auth_debug.php
// Body: { "email": "admin@bookworm.com", "password": "admin123" }
// Delete from server immediately after diagnosing the issue.
// ─────────────────────────────────────────────────────────────────

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200); exit();
}

require_once __DIR__ . "/../../config/db.php";

$debug = [];

// ── STEP 1: Read raw POST body ───────────────────────────────────
$raw = file_get_contents("php://input");
$debug["step1_raw_body_length"]  = strlen($raw);
$debug["step1_raw_body_preview"] = substr($raw, 0, 100);
$debug["step1_content_type"]     = $_SERVER["CONTENT_TYPE"] ?? "not set";
$debug["step1_request_method"]   = $_SERVER["REQUEST_METHOD"];

// ── STEP 2: Parse JSON ───────────────────────────────────────────
$input = json_decode($raw, true);
$debug["step2_json_parse_error"] = json_last_error_msg();
$debug["step2_email_received"]   = $input["email"] ?? "MISSING";
$debug["step2_password_received"]= isset($input["password"]) ? "SET (length=" . strlen($input["password"]) . ")" : "MISSING";

if (!isset($input["email"]) || !isset($input["password"])) {
    $debug["result"] = "FAIL — email or password missing from JSON body";
    echo json_encode($debug, JSON_PRETTY_PRINT);
    exit();
}

$email    = trim($input["email"]);
$password = $input["password"];

// ── STEP 3: Query user from database ────────────────────────────
try {
    $stmt = $conn->prepare("SELECT id, email, password, role FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([":email" => $email]);
    $user = $stmt->fetch();

    $debug["step3_user_found"]        = $user ? "YES" : "NO — email not in users table";
    $debug["step3_email_queried"]     = $email;

    if ($user) {
        $debug["step3_role_in_db"]    = $user["role"];
        $debug["step3_hash_length"]   = strlen($user["password"]);
        // Show first 10 chars of hash only — enough to diagnose truncation
        $debug["step3_hash_prefix"]   = substr($user["password"], 0, 10) . "...";
        $debug["step3_hash_valid_bcrypt"] = (substr($user["password"], 0, 4) === '$2y$') ? "YES" : "NO — not a bcrypt hash";
    }
} catch (PDOException $e) {
    $debug["step3_db_error"] = $e->getMessage();
    echo json_encode($debug, JSON_PRETTY_PRINT);
    exit();
}

if (!$user) {
    $debug["result"] = "FAIL — no user found with email: " . $email;
    echo json_encode($debug, JSON_PRETTY_PRINT);
    exit();
}

// ── STEP 4: Verify password ──────────────────────────────────────
$verify_result = password_verify($password, $user["password"]);
$debug["step4_password_verify"] = $verify_result ? "PASS" : "FAIL — hash does not match password";
$debug["step4_php_version"]     = PHP_VERSION;
$debug["step4_password_algo"]   = password_get_info($user["password"])["algoName"] ?? "unknown";

if (!$verify_result) {
    $debug["result"] = "FAIL — password_verify() returned false. Hash is corrupted or password is wrong.";
    $debug["fix"]    = "Run the SQL in password_reset.php to regenerate the bcrypt hash.";
    echo json_encode($debug, JSON_PRETTY_PRINT);
    exit();
}

// ── STEP 5: Check role ───────────────────────────────────────────
$debug["step5_role_check"] = ($user["role"] === "admin") ? "PASS" : "FAIL — role is '" . $user["role"] . "', expected 'admin'";

if ($user["role"] !== "admin") {
    $debug["result"] = "FAIL — user exists and password matches, but role is not 'admin'";
    $debug["fix"]    = "Run: UPDATE users SET role='admin' WHERE email='admin@bookworm.com';";
    echo json_encode($debug, JSON_PRETTY_PRINT);
    exit();
}

// ── ALL CHECKS PASSED ────────────────────────────────────────────
$debug["result"] = "ALL CHECKS PASS — auth.php should work. If it still fails, the issue is elsewhere.";
echo json_encode($debug, JSON_PRETTY_PRINT);
exit();
