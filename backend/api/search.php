<?php
// backend/api/search.php
require_once __DIR__ . "/../config/db.php";

$query = isset($_GET["q"]) ? trim($_GET["q"]) : "";

if (empty($query)) {
    echo json_encode([
        "books" => [],
        "authors" => [],
        "categories" => []
    ]);
    exit();
}

try {
    $searchPattern = "%" . $query . "%";

    // 1. Search Books
    $stmtBooks = $conn->prepare("
        SELECT 
            b.id, 
            b.title, 
            b.price, 
            b.image_url AS imageUrl, 
            a.name AS author
        FROM books b
        LEFT JOIN authors a ON b.author_id = a.id
        WHERE b.title LIKE :query OR b.description LIKE :query
        LIMIT 5
    ");
    $stmtBooks->execute([":query" => $searchPattern]);
    $books = $stmtBooks->fetchAll();

    // 2. Search Authors
    $stmtAuthors = $conn->prepare("
        SELECT id, name, image_url AS imageUrl
        FROM authors
        WHERE name LIKE :query
        LIMIT 3
    ");
    $stmtAuthors->execute([":query" => $searchPattern]);
    $authors = $stmtAuthors->fetchAll();

    // 3. Search Categories
    $stmtCategories = $conn->prepare("
        SELECT id, name, slug
        FROM categories
        WHERE name LIKE :query
        LIMIT 3
    ");
    $stmtCategories->execute([":query" => $searchPattern]);
    $categories = $stmtCategories->fetchAll();

    echo json_encode([
        "books" => $books,
        "authors" => $authors,
        "categories" => $categories
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
