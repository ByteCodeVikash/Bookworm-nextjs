<?php
// backend/api/settings.php
// Public endpoint — no auth required — returns only safe, public-facing store settings
require_once __DIR__ . "/../config/db.php";

// Only expose these keys publicly (never payment credentials)
$allowedKeys = [
    "store_name",
    "store_email",
    "store_phone",
    "store_address",
    "currency_symbol",
    "social_instagram",
    "social_facebook",
    "social_youtube",
    "social_twitter",
];

try {
    $placeholders = implode(",", array_map(fn($k) => ":k_$k", $allowedKeys));
    $sql = "SELECT `key`, `value` FROM settings WHERE `key` IN (" .
        implode(",", array_map(fn($k) => "'$k'", $allowedKeys)) .
    ")";

    $stmt = $conn->query($sql);
    $rows = $stmt->fetchAll();

    $settings = [];
    foreach ($rows as $row) {
        $settings[$row["key"]] = $row["value"];
    }

    echo json_encode($settings);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch settings: " . $e->getMessage()]);
}
