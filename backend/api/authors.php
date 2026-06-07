<?php
// backend/api/authors.php
require_once __DIR__ . "/../config/db.php";

$id = isset($_GET["id"]) ? $_GET["id"] : null;

try {
    if ($id) {
        $stmt = $conn->prepare("
            SELECT 
                a.id, 
                a.name, 
                a.image_url AS imageUrl, 
                a.bio,
                (SELECT COUNT(*) FROM books b WHERE b.author_id = a.id) AS booksCount
            FROM authors a 
            WHERE a.id = :id
        ");
        $stmt->execute([":id" => $id]);
        $author = $stmt->fetch();

        if ($author) {
            echo json_encode($author);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Author not found"]);
        }
    } else {
        $stmt = $conn->prepare("
            SELECT 
                a.id, 
                a.name, 
                a.image_url AS imageUrl, 
                (SELECT COUNT(*) FROM books b WHERE b.author_id = a.id) AS booksCount
            FROM authors a
        ");
        $stmt->execute();
        $authors = $stmt->fetchAll();
        echo json_encode($authors);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
