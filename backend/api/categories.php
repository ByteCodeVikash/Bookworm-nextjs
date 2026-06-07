<?php
// backend/api/categories.php
require_once __DIR__ . "/../config/db.php";

try {
    // Select categories with book counts
    $stmt = $conn->prepare("
        SELECT 
            c.id, 
            c.name, 
            c.icon_class AS iconClass,
            (SELECT COUNT(*) FROM books b WHERE b.category_id = c.id) AS booksCount
        FROM categories c
    ");
    $stmt->execute();
    $categories = $stmt->fetchAll();

    echo json_encode($categories);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
