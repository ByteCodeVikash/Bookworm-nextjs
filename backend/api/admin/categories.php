<?php
// backend/api/admin/categories.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce auth check
admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    try {
        $stmt = $conn->query("
            SELECT c.*, COUNT(b.id) AS books_count 
            FROM categories c 
            LEFT JOIN books b ON c.id = b.category_id 
            GROUP BY c.id 
            ORDER BY c.name ASC
        ");
        $categories = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $categories]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch categories: " . $e->getMessage()]);
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
    $icon_class = isset($input["icon_class"]) ? trim($input["icon_class"]) : null;
    $image_url = isset($input["image_url"]) ? trim($input["image_url"]) : null;
    $slug = isset($input["slug"]) ? trim($input["slug"]) : "";

    if ($name === "" || $slug === "") {
        http_response_code(400);
        echo json_encode(["error" => "Category name and slug are required."]);
        exit();
    }

    if ($method === "POST") {
        if ($id === "") {
            // Generate id from slug
            $id = strtolower(preg_replace('/[^a-zA-Z0-9\-]/', '', $slug));
        }

        try {
            $stmt = $conn->prepare("INSERT INTO categories (id, name, icon_class, image_url, slug) VALUES (:id, :name, :icon_class, :image_url, :slug)");
            $stmt->execute([
                ":id" => $id,
                ":name" => $name,
                ":icon_class" => $icon_class,
                ":image_url" => $image_url,
                ":slug" => $slug
            ]);
            echo json_encode(["status" => "success", "message" => "Category created successfully.", "id" => $id]);
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create category: " . $e->getMessage()]);
            exit();
        }
    } else {
        // PUT
        $id = isset($_GET["id"]) ? trim($_GET["id"]) : $id;
        if ($id === "") {
            http_response_code(400);
            echo json_encode(["error" => "Category ID is required for updates."]);
            exit();
        }

        try {
            $stmt = $conn->prepare("UPDATE categories SET name = :name, icon_class = :icon_class, image_url = :image_url, slug = :slug WHERE id = :id");
            $stmt->execute([
                ":id" => $id,
                ":name" => $name,
                ":icon_class" => $icon_class,
                ":image_url" => $image_url,
                ":slug" => $slug
            ]);
            echo json_encode(["status" => "success", "message" => "Category updated successfully."]);
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update category: " . $e->getMessage()]);
            exit();
        }
    }
} elseif ($method === "DELETE") {
    $id = isset($_GET["id"]) ? trim($_GET["id"]) : "";
    if ($id === "") {
        http_response_code(400);
        echo json_encode(["error" => "Category ID is required for deletion."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM categories WHERE id = :id");
        $stmt->execute([":id" => $id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Category deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Category not found or already deleted."]);
        }
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete category: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
