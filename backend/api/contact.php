<?php
// backend/api/contact.php
require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

$name = isset($input["name"]) ? trim($input["name"]) : "";
$email = isset($input["email"]) ? trim($input["email"]) : "";
$subject = isset($input["subject"]) ? trim($input["subject"]) : "";
$text = isset($input["text"]) ? trim($input["text"]) : "";

if (empty($name) || empty($email) || empty($subject) || empty($text)) {
    http_response_code(400);
    echo json_encode(["error" => "All fields (name, email, subject, text) are required."]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email address."]);
    exit();
}

try {
    $stmt = $conn->prepare("
        INSERT INTO contact_messages (name, email, subject, text) 
        VALUES (:name, :email, :subject, :text)
    ");
    $stmt->execute([
        ":name" => $name,
        ":email" => $email,
        ":subject" => $subject,
        ":text" => $text
    ]);

    echo json_encode(["success" => true, "message" => "Message sent successfully!"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
