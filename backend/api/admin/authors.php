<?php
// backend/api/admin/authors.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce auth check
admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    try {
        $stmt = $conn->query("
            SELECT a.*, COUNT(b.id) AS books_count 
            FROM authors a 
            LEFT JOIN books b ON a.id = b.author_id 
            GROUP BY a.id 
            ORDER BY a.name ASC
        ");
        $authors = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $authors]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch authors: " . $e->getMessage()]);
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
    $name = isset($input["name"]) ? trim($input["name"]) : "";
    $image_url = isset($input["image_url"]) ? trim($input["image_url"]) : null;
    $bio = isset($input["bio"]) ? trim($input["bio"]) : null;

    if ($name === "") {
        http_response_code(400);
        echo json_encode(["error" => "Author name is required."]);
        exit();
    }

    if ($method === "POST") {
        if ($id === "") {
            $id = "auth_" . uniqid();
        }

        try {
            $stmt = $conn->prepare("INSERT INTO authors (id, name, image_url, bio) VALUES (:id, :name, :image_url, :bio)");
            $stmt->execute([
                ":id" => $id,
                ":name" => $name,
                ":image_url" => $image_url,
                ":bio" => $bio
            ]);
            echo json_encode(["status" => "success", "message" => "Author created successfully.", "id" => $id]);
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create author: " . $e->getMessage()]);
            exit();
        }
    } else {
        // PUT
        $id = isset($_GET["id"]) ? trim($_GET["id"]) : $id;
        if ($id === "") {
            http_response_code(400);
            echo json_encode(["error" => "Author ID is required for updates."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("UPDATE authors SET name = :name, image_url = :image_url, bio = :bio WHERE id = :id");
            $stmt->execute([
                ":id" => $id,
                ":name" => $name,
                ":image_url" => $image_url,
                ":bio" => $bio
            ]);
            echo json_encode(["status" => "success", "message" => "Author updated successfully."]);
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update author: " . $e->getMessage()]);
            exit();
        }
    }
} elseif ($method === "DELETE") {
    $id = isset($_GET["id"]) ? trim($_GET["id"]) : "";
    if ($id === "") {
        http_response_code(400);
        echo json_encode(["error" => "Author ID is required for deletion."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM authors WHERE id = :id");
        $stmt->execute([":id" => $id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Author deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Author not found or already deleted."]);
        }
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete author: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
