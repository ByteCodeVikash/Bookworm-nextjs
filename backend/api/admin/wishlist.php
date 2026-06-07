<?php
// backend/api/admin/wishlist.php
// Read-only admin viewer for user wishlists
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method !== "GET") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed. Wishlist viewer is read-only."]);
    exit();
}

// Optional: filter by user_id
$user_id = isset($_GET["user_id"]) ? (int)$_GET["user_id"] : 0;

// Pagination
$page  = max(1, isset($_GET["page"]) ? (int)$_GET["page"] : 1);
$limit = max(1, min(100, isset($_GET["limit"]) ? (int)$_GET["limit"] : 20));
$offset = ($page - 1) * $limit;

try {
    // Build WHERE clause
    $where = "";
    $params = [];
    if ($user_id > 0) {
        $where = "WHERE w.user_id = :user_id";
        $params[":user_id"] = $user_id;
    }

    // Total count
    $countStmt = $conn->prepare("SELECT COUNT(*) FROM wishlist w $where");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // Main query with joins
    $params[":limit"]  = $limit;
    $params[":offset"] = $offset;

    $stmt = $conn->prepare("
        SELECT
            w.id,
            w.user_id,
            w.book_id,
            w.created_at,
            CONCAT(u.first_name, ' ', u.last_name) AS user_name,
            u.email AS user_email,
            b.title  AS book_title,
            b.price  AS book_price,
            b.image_url AS book_image_url
        FROM wishlist w
        LEFT JOIN users u ON w.user_id = u.id
        LEFT JOIN books b ON w.book_id = b.id
        $where
        ORDER BY w.created_at DESC
        LIMIT :limit OFFSET :offset
    ");
    $stmt->execute($params);
    $items = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data"   => [
            "wishlist" => $items,
            "pagination" => [
                "total"       => $total,
                "page"        => $page,
                "limit"       => $limit,
                "total_pages" => (int)ceil($total / $limit),
            ],
        ],
    ]);
    exit();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch wishlist: " . $e->getMessage()]);
    exit();
}
