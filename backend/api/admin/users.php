<?php
// backend/api/admin/users.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce auth check
$auth_payload = admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    if (isset($_GET["id"])) {
        // Fetch single user detail with their address
        $id = (int)$_GET["id"];
        try {
            $stmt = $conn->prepare("SELECT id, first_name, last_name, display_name, email, role, created_at FROM users WHERE id = :id LIMIT 1");
            $stmt->execute([":id" => $id]);
            $user = $stmt->fetch();
            
            if ($user) {
                // Fetch addresses
                $addrStmt = $conn->prepare("SELECT * FROM user_addresses WHERE user_id = :user_id");
                $addrStmt->execute([":user_id" => $id]);
                $user["addresses"] = $addrStmt->fetchAll();
                
                echo json_encode(["status" => "success", "data" => $user]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "User not found."]);
            }
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch user: " . $e->getMessage()]);
            exit();
        }
    }

    // List users
    $search = isset($_GET["search"]) ? trim($_GET["search"]) : "";
    $role = isset($_GET["role"]) ? trim($_GET["role"]) : "";
    $page = isset($_GET["page"]) ? (int)$_GET["page"] : 1;
    $limit = isset($_GET["limit"]) ? (int)$_GET["limit"] : 15;
    $offset = ($page - 1) * $limit;

    try {
        $queryStr = "SELECT id, first_name, last_name, display_name, email, role, created_at FROM users";
        $countStr = "SELECT COUNT(*) AS total FROM users";
        
        $where = [];
        $params = [];
        
        if ($search !== "") {
            $where[] = "(first_name LIKE :search OR last_name LIKE :search OR display_name LIKE :search OR email LIKE :search)";
            $params[":search"] = "%" . $search . "%";
        }
        
        if ($role !== "") {
            $where[] = "role = :role";
            $params[":role"] = $role;
        }

        if (count($where) > 0) {
            $clause = " WHERE " . implode(" AND ", $where);
            $queryStr .= $clause;
            $countStr .= $clause;
        }

        $queryStr .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";

        // Total count
        $countStmt = $conn->prepare($countStr);
        $countStmt->execute($params);
        $totalItems = (int)$countStmt->fetch()["total"];
        $totalPages = ceil($totalItems / $limit);

        // Fetch users
        $stmt = $conn->prepare($queryStr);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        $users = $stmt->fetchAll();

        echo json_encode([
            "status" => "success",
            "data" => [
                "users" => $users,
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
        echo json_encode(["error" => "Failed to fetch users: " . $e->getMessage()]);
        exit();
    }
} elseif ($method === "PUT") {
    // Modify user role
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Valid user ID is required."]);
        exit();
    }

    $input = json_decode(file_get_contents("php://input"), true);
    if (!isset($input["role"])) {
        http_response_code(400);
        echo json_encode(["error" => "Role field is required."]);
        exit();
    }

    $role = trim($input["role"]);
    if ($role !== "admin" && $role !== "customer") {
        http_response_code(400);
        echo json_encode(["error" => "Invalid user role."]);
        exit();
    }

    // Safety check: Prevent admin from demoting themselves
    if ($id === (int)$auth_payload["user_id"] && $role !== "admin") {
        http_response_code(400);
        echo json_encode(["error" => "Safety constraint: You cannot revoke administrative privileges from your own account."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("UPDATE users SET role = :role WHERE id = :id");
        $stmt->execute([":role" => $role, ":id" => $id]);
        echo json_encode(["status" => "success", "message" => "User role updated successfully."]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update user: " . $e->getMessage()]);
        exit();
    }
} elseif ($method === "DELETE") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Valid user ID is required for deletion."]);
        exit();
    }

    // Safety check: Prevent admin from deleting themselves
    if ($id === (int)$auth_payload["user_id"]) {
        http_response_code(400);
        echo json_encode(["error" => "Safety constraint: You cannot delete your own admin account."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute([":id" => $id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "User deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "User not found or already deleted."]);
        }
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete user: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
