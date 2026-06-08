<?php
// backend/api/admin/password_reset.php
// ─────────────────────────────────────────────────────────────────
// ONE-TIME PASSWORD RESET TOOL — DELETE AFTER USE
// ─────────────────────────────────────────────────────────────────
// Upload to: public_html/backend/api/admin/password_reset.php
// Open in browser: https://yourdomain.com/backend/api/admin/password_reset.php
// It generates a fresh bcrypt hash and updates the admin user.
// *** DELETE THIS FILE FROM THE SERVER IMMEDIATELY AFTER USE ***
// ─────────────────────────────────────────────────────────────────

header("Content-Type: application/json; charset=UTF-8");

// ── Configuration ─────────────────────────────────────────────────
$admin_email    = "admin@bookworm.com";
$new_password   = "admin123"; // Password to set (change this if desired)

require_once __DIR__ . "/../../config/db.php";

try {
    // 1. Generate a fresh bcrypt hash
    $fresh_hash = password_hash($new_password, PASSWORD_BCRYPT, ["cost" => 10]);

    // 2. Update the admin user's password AND ensure role is 'admin'
    $stmt = $conn->prepare("
        UPDATE users
        SET password = :password,
            role     = 'admin'
        WHERE email = :email
    ");
    $stmt->execute([
        ":password" => $fresh_hash,
        ":email"    => $admin_email,
    ]);

    $rows_updated = $stmt->rowCount();

    if ($rows_updated === 0) {
        // User doesn't exist — insert them
        $stmt2 = $conn->prepare("
            INSERT INTO users (first_name, last_name, display_name, email, password, role)
            VALUES ('Admin', 'Bookworm', 'admin', :email, :password, 'admin')
        ");
        $stmt2->execute([
            ":email"    => $admin_email,
            ":password" => $fresh_hash,
        ]);
        $action = "INSERTED new admin user";
    } else {
        $action = "UPDATED existing admin user password";
    }

    // 3. Verify it immediately
    $check = $conn->prepare("SELECT email, role, password FROM users WHERE email = :email LIMIT 1");
    $check->execute([":email" => $admin_email]);
    $user = $check->fetch();

    $verify_ok = password_verify($new_password, $user["password"]);

    echo json_encode([
        "status"            => "success",
        "action"            => $action,
        "email"             => $admin_email,
        "password_set_to"   => $new_password,
        "role_in_db"        => $user["role"],
        "verify_check"      => $verify_ok ? "PASS — password_verify() confirms hash is correct" : "FAIL — hash mismatch after update",
        "hash_prefix"       => substr($user["password"], 0, 10) . "...",
        "php_version"       => PHP_VERSION,
        "WARNING"           => "DELETE THIS FILE FROM THE SERVER NOW",
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "error"  => $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}
exit();
