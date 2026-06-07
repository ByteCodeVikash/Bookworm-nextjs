<?php
// backend/api/newsletter.php
require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$email = isset($input["email"]) ? trim($input["email"]) : "";

if (empty($email)) {
    http_response_code(400);
    echo json_encode(["error" => "Email address is required."]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email address."]);
    exit();
}

try {
    // Check if email already exists to prevent duplicate key errors
    $checkStmt = $conn->prepare("SELECT id FROM newsletter_subscribers WHERE email = :email");
    $checkStmt->execute([":email" => $email]);
    if ($checkStmt->fetch()) {
        echo json_encode(["success" => true, "message" => "You are already subscribed!"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO newsletter_subscribers (email) VALUES (:email)");
    $stmt->execute([":email" => $email]);

    echo json_encode(["success" => true, "message" => "Subscribed successfully!"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
