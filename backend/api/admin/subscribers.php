<?php
// backend/api/admin/subscribers.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce auth check
admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    try {
        // Check for CSV export request
        if (isset($_GET["export"]) && $_GET["export"] === "csv") {
            // Set headers for file download
            header("Content-Type: text/csv; charset=UTF-8");
            header("Content-Disposition: attachment; filename=subscribers_export_" . date("Y-m-d") . ".csv");
            header("Pragma: no-cache");
            header("Expires: 0");
            
            $output = fopen("php://output", "w");
            
            // Write column headers
            fputcsv($output, ["ID", "Email", "Subscribed At"]);
            
            $stmt = $conn->query("SELECT id, email, created_at FROM newsletter_subscribers ORDER BY created_at DESC");
            while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
                fputcsv($output, $row);
            }
            
            fclose($output);
            exit();
        }
        
        // Return JSON
        $stmt = $conn->query("SELECT * FROM newsletter_subscribers ORDER BY created_at DESC");
        $subscribers = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $subscribers]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch subscribers: " . $e->getMessage()]);
        exit();
    }
} elseif ($method === "DELETE") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Valid subscriber ID is required."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM newsletter_subscribers WHERE id = :id");
        $stmt->execute([":id" => $id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Subscriber unsubscribed successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Subscriber not found or already removed."]);
        }
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to remove subscriber: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
