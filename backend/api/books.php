<?php
// backend/api/books.php
require_once __DIR__ . "/../config/db.php";

$id = isset($_GET["id"]) ? $_GET["id"] : null;
$group = isset($_GET["group"]) ? $_GET["group"] : null;
$newReleaseTab = isset($_GET["new_release_tab"]) ? $_GET["new_release_tab"] : null;

try {
    if ($id) {
        // Query details for a single book
        $stmt = $conn->prepare("
            SELECT 
                b.id, 
                b.title, 
                b.price, 
                b.original_price AS originalPrice, 
                b.price_range AS priceRange,
                b.format, 
                b.image_url AS imageUrl, 
                b.rating, 
                b.stock_status AS stockStatus,
                b.publisher, 
                b.publication_date AS publicationDate, 
                b.language, 
                b.description,
                a.name AS author,
                c.name AS category
            FROM books b
            LEFT JOIN authors a ON b.author_id = a.id
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.id = :id
        ");
        $stmt->execute([":id" => $id]);
        $book = $stmt->fetch();

        if ($book) {
            // Map values to appropriate types for JSON (numbers and booleans)
            $book["price"] = (float)$book["price"];
            if ($book["originalPrice"] !== null) $book["originalPrice"] = (float)$book["originalPrice"];
            if ($book["rating"] !== null) $book["rating"] = (int)$book["rating"];
            $book["stockStatus"] = (bool)$book["stockStatus"];
            
            echo json_encode($book);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Book not found"]);
        }
    } else {
        // Query list of books
        $sql = "
            SELECT 
                b.id, 
                b.title, 
                b.price, 
                b.original_price AS originalPrice, 
                b.price_range AS priceRange,
                b.format, 
                b.image_url AS imageUrl, 
                b.rating, 
                b.stock_status AS stockStatus,
                b.publisher, 
                b.publication_date AS publicationDate, 
                b.language, 
                b.description,
                a.name AS author,
                c.name AS category
            FROM books b
            LEFT JOIN authors a ON b.author_id = a.id
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE 1=1
        ";
        $params = [];

        // Apply group flag filters
        if ($group) {
            switch ($group) {
                case "bestsellers":
                    $sql .= " AND b.is_bestseller = 1";
                    break;
                case "featured":
                    $sql .= " AND b.is_featured = 1";
                    break;
                case "onsale":
                    $sql .= " AND b.is_onsale = 1";
                    break;
                case "mostviewed":
                    $sql .= " AND b.is_mostviewed = 1";
                    break;
                case "deal_of_week":
                    $sql .= " AND b.is_deal_of_week = 1";
                    break;
                case "biographies":
                    $sql .= " AND b.is_biography = 1";
                    break;
                case "new_release":
                    $sql .= " AND b.is_new_release = 1";
                    if ($newReleaseTab) {
                        $sql .= " AND b.new_release_tab = :new_release_tab";
                        $params[":new_release_tab"] = $newReleaseTab;
                    }
                    break;
            }
        }

        // Apply sorting
        $sql .= " ORDER BY b.id ASC";

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $books = $stmt->fetchAll();

        // Format data types correctly
        foreach ($books as &$book) {
            $book["price"] = (float)$book["price"];
            if ($book["originalPrice"] !== null) $book["originalPrice"] = (float)$book["originalPrice"];
            if ($book["rating"] !== null) $book["rating"] = (int)$book["rating"];
            $book["stockStatus"] = (bool)$book["stockStatus"];
        }

        echo json_encode($books);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
