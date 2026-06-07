<?php
// backend/api/admin/contacts.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce auth check
admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    try {
        $stmt = $conn->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $messages]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch contact messages: " . $e->getMessage()]);
        exit();
    }
} elseif ($method === "DELETE") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Valid message ID is required."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM contact_messages WHERE id = :id");
        $stmt->execute([":id" => $id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Message deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Message not found or already deleted."]);
        }
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete message: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
