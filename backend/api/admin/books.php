<?php
// backend/api/admin/books.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce auth check
admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    // 1. Fetch single book
    if (isset($_GET["id"])) {
        $id = trim($_GET["id"]);
        try {
            $stmt = $conn->prepare("SELECT * FROM books WHERE id = :id LIMIT 1");
            $stmt->execute([":id" => $id]);
            $book = $stmt->fetch();
            if ($book) {
                echo json_encode(["status" => "success", "data" => $book]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Book not found."]);
            }
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch book: " . $e->getMessage()]);
            exit();
        }
    }

    // 2. Fetch list of books (with search & pagination)
    $search = isset($_GET["search"]) ? trim($_GET["search"]) : "";
    $page = isset($_GET["page"]) ? (int)$_GET["page"] : 1;
    $limit = isset($_GET["limit"]) ? (int)$_GET["limit"] : 15;
    $offset = ($page - 1) * $limit;

    try {
        $queryStr = "SELECT b.*, a.name AS author_name, c.name AS category_name 
                     FROM books b
                     LEFT JOIN authors a ON b.author_id = a.id
                     LEFT JOIN categories c ON b.category_id = c.id";
        $countStr = "SELECT COUNT(*) AS total FROM books b";
        
        $params = [];
        if ($search !== "") {
            $whereClause = " WHERE b.title LIKE :search OR b.id LIKE :search OR a.name LIKE :search";
            $queryStr .= $whereClause;
            $countStr .= " LEFT JOIN authors a ON b.author_id = a.id " . $whereClause;
            $params[":search"] = "%" . $search . "%";
        }

        // Add sorting
        $queryStr .= " ORDER BY b.created_at DESC LIMIT :limit OFFSET :offset";

        // Count total records
        $countStmt = $conn->prepare($countStr);
        $countStmt->execute($params);
        $totalItems = (int)$countStmt->fetch()["total"];
        $totalPages = ceil($totalItems / $limit);

        // Fetch paginated records
        $stmt = $conn->prepare($queryStr);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        $books = $stmt->fetchAll();

        echo json_encode([
            "status" => "success",
            "data" => [
                "books" => $books,
                "pagination" => [
                    "totalItems" => $totalItems,
                    "totalPages" => $totalPages,
                    "currentPage" => $page,
                    "limit" => $limit
                ]
            ]
        ]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch books: " . $e->getMessage()]);
        exit();
    }
} elseif ($method === "POST" || $method === "PUT") {
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload."]);
        exit();
    }

    $id = isset($input["id"]) ? trim($input["id"]) : "";
    $title = isset($input["title"]) ? trim($input["title"]) : "";
    $author_id = isset($input["author_id"]) && $input["author_id"] !== "" ? trim($input["author_id"]) : null;
    $category_id = isset($input["category_id"]) && $input["category_id"] !== "" ? trim($input["category_id"]) : null;
    $price = isset($input["price"]) ? (float)$input["price"] : 0.0;
    $original_price = isset($input["original_price"]) && $input["original_price"] !== "" ? (float)$input["original_price"] : null;
    $price_range = isset($input["price_range"]) ? trim($input["price_range"]) : null;
    $format = isset($input["format"]) ? trim($input["format"]) : "";
    $image_url = isset($input["image_url"]) ? trim($input["image_url"]) : "";
    $rating = isset($input["rating"]) ? (int)$input["rating"] : 5;
    $stock_status = isset($input["stock_status"]) ? (int)$input["stock_status"] : 1;
    $publisher = isset($input["publisher"]) ? trim($input["publisher"]) : null;
    $publication_date = isset($input["publication_date"]) && $input["publication_date"] !== "" ? trim($input["publication_date"]) : null;
    $language = isset($input["language"]) ? trim($input["language"]) : "English";
    $description = isset($input["description"]) ? trim($input["description"]) : null;

    // Server-side HTML sanitization: strip any tags not in the allow-list.
    // This is a defence-in-depth measure alongside client-side DOMPurify.
    if ($description !== null && $description !== "") {
        $allowed_tags = '<h1><h2><h3><h4><p><br><strong><em><u><s><ul><ol><li><blockquote><a>';
        $description = strip_tags($description, $allowed_tags);
        // Remove any href attributes containing javascript: or data: URIs
        $description = preg_replace(
            '/href\s*=\s*["\']?\s*(javascript|data):[^"\'>\s]*/i',
            'href="#"',
            $description
        );
    }

    $is_bestseller = isset($input["is_bestseller"]) ? (int)$input["is_bestseller"] : 0;
    $is_featured = isset($input["is_featured"]) ? (int)$input["is_featured"] : 0;
    $is_onsale = isset($input["is_onsale"]) ? (int)$input["is_onsale"] : 0;
    $is_mostviewed = isset($input["is_mostviewed"]) ? (int)$input["is_mostviewed"] : 0;
    $is_deal_of_week = isset($input["is_deal_of_week"]) ? (int)$input["is_deal_of_week"] : 0;
    $is_new_release = isset($input["is_new_release"]) ? (int)$input["is_new_release"] : 0;
    $is_biography_book = isset($input["is_biography_book"]) ? (int)$input["is_biography_book"] : 0;
    $new_release_tab = isset($input["new_release_tab"]) ? trim($input["new_release_tab"]) : null;

    if ($title === "" || $format === "" || $image_url === "") {
        http_response_code(400);
        echo json_encode(["error" => "Title, format, and image URL are required fields."]);
        exit();
    }

    if ($method === "POST") {
        if ($id === "") {
            // Generate id (e.g. book_123456)
            $id = "book_" . uniqid();
        }
        
        try {
            $stmt = $conn->prepare("
                INSERT INTO books (id, title, author_id, category_id, price, original_price, price_range, format, image_url, rating, stock_status, publisher, publication_date, language, description, is_bestseller, is_featured, is_onsale, is_mostviewed, is_deal_of_week, is_new_release, is_biography_book, new_release_tab) 
                VALUES (:id, :title, :author_id, :category_id, :price, :original_price, :price_range, :format, :image_url, :rating, :stock_status, :publisher, :publication_date, :language, :description, :is_bestseller, :is_featured, :is_onsale, :is_mostviewed, :is_deal_of_week, :is_new_release, :is_biography_book, :new_release_tab)
            ");
            $stmt->execute([
                ":id" => $id,
                ":title" => $title,
                ":author_id" => $author_id,
                ":category_id" => $category_id,
                ":price" => $price,
                ":original_price" => $original_price,
                ":price_range" => $price_range,
                ":format" => $format,
                ":image_url" => $image_url,
                ":rating" => $rating,
                ":stock_status" => $stock_status,
                ":publisher" => $publisher,
                ":publication_date" => $publication_date,
                ":language" => $language,
                ":description" => $description,
                ":is_bestseller" => $is_bestseller,
                ":is_featured" => $is_featured,
                ":is_onsale" => $is_onsale,
                ":is_mostviewed" => $is_mostviewed,
                ":is_deal_of_week" => $is_deal_of_week,
                ":is_new_release" => $is_new_release,
                ":is_biography_book" => $is_biography_book,
                ":new_release_tab" => $new_release_tab
            ]);
            echo json_encode(["status" => "success", "message" => "Book created successfully.", "id" => $id]);
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create book: " . $e->getMessage()]);
            exit();
        }
    } else {
        // PUT (Update)
        $id = isset($_GET["id"]) ? trim($_GET["id"]) : $id;
        if ($id === "") {
            http_response_code(400);
            echo json_encode(["error" => "Book ID is required for updates."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("
                UPDATE books SET 
                    title = :title, 
                    author_id = :author_id, 
                    category_id = :category_id, 
                    price = :price, 
                    original_price = :original_price, 
                    price_range = :price_range, 
                    format = :format, 
                    image_url = :image_url, 
                    rating = :rating, 
                    stock_status = :stock_status, 
                    publisher = :publisher, 
                    publication_date = :publication_date, 
                    language = :language, 
                    description = :description, 
                    is_bestseller = :is_bestseller, 
                    is_featured = :is_featured, 
                    is_onsale = :is_onsale, 
                    is_mostviewed = :is_mostviewed, 
                    is_deal_of_week = :is_deal_of_week, 
                    is_new_release = :is_new_release, 
                    is_biography_book = :is_biography_book,
                    new_release_tab = :new_release_tab 
                WHERE id = :id
            ");
            $stmt->execute([
                ":id" => $id,
                ":title" => $title,
                ":author_id" => $author_id,
                ":category_id" => $category_id,
                ":price" => $price,
                ":original_price" => $original_price,
                ":price_range" => $price_range,
                ":format" => $format,
                ":image_url" => $image_url,
                ":rating" => $rating,
                ":stock_status" => $stock_status,
                ":publisher" => $publisher,
                ":publication_date" => $publication_date,
                ":language" => $language,
                ":description" => $description,
                ":is_bestseller" => $is_bestseller,
                ":is_featured" => $is_featured,
                ":is_onsale" => $is_onsale,
                ":is_mostviewed" => $is_mostviewed,
                ":is_deal_of_week" => $is_deal_of_week,
                ":is_new_release" => $is_new_release,
                ":is_biography_book" => $is_biography_book,
                ":new_release_tab" => $new_release_tab
            ]);
            echo json_encode(["status" => "success", "message" => "Book updated successfully."]);
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update book: " . $e->getMessage()]);
            exit();
        }
    }
} elseif ($method === "DELETE") {
    $id = isset($_GET["id"]) ? trim($_GET["id"]) : "";
    if ($id === "") {
        http_response_code(400);
        echo json_encode(["error" => "Book ID is required for deletion."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM books WHERE id = :id");
        $stmt->execute([":id" => $id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Book deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Book not found or already deleted."]);
        }
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete book: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
