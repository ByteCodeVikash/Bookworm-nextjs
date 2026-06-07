<?php
// backend/api/admin/auth.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {
    // Login operation
    $input = json_decode(file_get_contents("php://input"), true);
    if (!isset($input["email"]) || !isset($input["password"])) {
        http_response_code(400);
        echo json_encode(["error" => "Email and password are required."]);
        exit();
    }

    $email = trim($input["email"]);
    $password = $input["password"];

    try {
        $stmt = $conn->prepare("SELECT id, first_name, last_name, email, password, role FROM users WHERE email = :email LIMIT 1");
        $stmt->execute([":email" => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user["password"])) {
            if ($user["role"] !== "admin") {
                http_response_code(403);
                echo json_encode(["error" => "Access denied. User does not have administrative privileges."]);
                exit();
            }

            $token = admin_generate_token($user["id"], $user["role"]);
            echo json_encode([
                "status" => "success",
                "token" => $token,
                "user" => [
                    "id" => $user["id"],
                    "first_name" => $user["first_name"],
                    "last_name" => $user["last_name"],
                    "email" => $user["email"]
                ]
            ]);
            exit();
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid email or password."]);
            exit();
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Authentication failed: " . $e->getMessage()]);
        exit();
    }
} elseif ($method === "GET") {
    // Validate session
    $payload = admin_require_auth();
    echo json_encode([
        "status" => "success",
        "valid" => true,
        "user_id" => $payload["user_id"],
        "role" => $payload["role"]
    ]);
    exit();
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
