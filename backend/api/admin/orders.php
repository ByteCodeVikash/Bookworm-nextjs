<?php
// backend/api/admin/orders.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce auth check
admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    if (isset($_GET["id"])) {
        // Fetch single order details and its line items
        $id = trim($_GET["id"]);
        try {
            $stmt = $conn->prepare("SELECT * FROM orders WHERE id = :id LIMIT 1");
            $stmt->execute([":id" => $id]);
            $order = $stmt->fetch();
            
            if ($order) {
                // Fetch linked transaction (if any)
                $txStmt = $conn->prepare("SELECT * FROM transactions WHERE order_id = :order_id LIMIT 1");
                $txStmt->execute([":order_id" => $id]);
                $order["transaction"] = $txStmt->fetch() ?: null;

                // Fetch line items
                $itemsStmt = $conn->prepare("
                    SELECT oi.*, b.image_url 
                    FROM order_items oi 
                    LEFT JOIN books b ON oi.book_id = b.id 
                    WHERE oi.order_id = :order_id
                ");
                $itemsStmt->execute([":order_id" => $id]);
                $order["items"] = $itemsStmt->fetchAll();
                
                echo json_encode(["status" => "success", "data" => $order]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Order not found."]);
            }
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to fetch order: " . $e->getMessage()]);
            exit();
        }
    }

    // Fetch list of orders
    $search = isset($_GET["search"]) ? trim($_GET["search"]) : "";
    $status = isset($_GET["status"]) ? trim($_GET["status"]) : "";
    $page = isset($_GET["page"]) ? (int)$_GET["page"] : 1;
    $limit = isset($_GET["limit"]) ? (int)$_GET["limit"] : 15;
    $offset = ($page - 1) * $limit;

    try {
        $queryStr = "SELECT * FROM orders";
        $countStr = "SELECT COUNT(*) AS total FROM orders";
        
        $where = [];
        $params = [];
        
        if ($search !== "") {
            $where[] = "(id LIKE :search OR first_name LIKE :search OR last_name LIKE :search OR email LIKE :search)";
            $params[":search"] = "%" . $search . "%";
        }
        
        if ($status !== "") {
            $where[] = "status = :status";
            $params[":status"] = $status;
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

        // Fetch items
        $stmt = $conn->prepare($queryStr);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        $orders = $stmt->fetchAll();

        echo json_encode([
            "status" => "success",
            "data" => [
                "orders" => $orders,
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
        echo json_encode(["error" => "Failed to fetch orders: " . $e->getMessage()]);
        exit();
    }
} elseif ($method === "PUT") {
    // Update order status
    $id = isset($_GET["id"]) ? trim($_GET["id"]) : "";
    if ($id === "") {
        http_response_code(400);
        echo json_encode(["error" => "Order ID is required."]);
        exit();
    }

    $input = json_decode(file_get_contents("php://input"), true);
    if (!isset($input["status"])) {
        http_response_code(400);
        echo json_encode(["error" => "Status field is required."]);
        exit();
    }

    $status = trim($input["status"]);
    $validStatuses = ["On hold", "Completed", "Processing", "Cancelled"];
    if (!in_array($status, $validStatuses)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid order status value."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("UPDATE orders SET status = :status WHERE id = :id");
        $stmt->execute([":status" => $status, ":id" => $id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Order status updated successfully."]);
        } else {
            echo json_encode(["status" => "success", "message" => "Order status remains unchanged or order not found."]);
        }
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update order: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
