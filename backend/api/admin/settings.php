<?php
// backend/api/admin/settings.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce auth check
admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    try {
        $stmt = $conn->query("SELECT `key`, `value` FROM settings");
        $rows = $stmt->fetchAll();
        
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row["key"]] = $row["value"];
        }
        
        echo json_encode(["status" => "success", "data" => $settings]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch settings: " . $e->getMessage()]);
        exit();
    }
} elseif ($method === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload."]);
        exit();
    }

    try {
        $conn->beginTransaction();
        
        $stmt = $conn->prepare("INSERT INTO settings (`key`, `value`) VALUES (:key, :value) ON DUPLICATE KEY UPDATE `value` = :value");
        
        foreach ($input as $key => $value) {
            $stmt->execute([
                ":key" => $key,
                ":value" => (string)$value
            ]);
        }
        
        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Settings updated successfully."]);
        exit();
    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Failed to update settings: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
