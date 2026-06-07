<?php
// backend/api/banners.php
// Public endpoint — no auth required — returns active banners for the storefront
require_once __DIR__ . "/../config/db.php";

try {
    $stmt = $conn->query("
        SELECT 
            id,
            title_prefix,
            title_highlighted,
            title_suffix,
            subtitle,
            image_url,
            action_url,
            sort_order
        FROM banners
        WHERE is_active = 1
        ORDER BY sort_order ASC, id ASC
    ");
    $banners = $stmt->fetchAll();

    // Cast types
    foreach ($banners as &$b) {
        $b["id"]         = (string)$b["id"];
        $b["sort_order"] = (int)$b["sort_order"];
    }

    echo json_encode($banners);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch banners: " . $e->getMessage()]);
}
