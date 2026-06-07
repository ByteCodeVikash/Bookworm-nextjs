<?php
// backend/api/admin/transactions.php
// Read-only admin viewer for payment transactions
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method !== "GET") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed. Transactions viewer is read-only."]);
    exit();
}

$search = isset($_GET["search"]) ? trim($_GET["search"]) : "";
$status = isset($_GET["status"]) ? trim($_GET["status"]) : "";
$page   = max(1, isset($_GET["page"]) ? (int)$_GET["page"] : 1);
$limit  = max(1, min(100, isset($_GET["limit"]) ? (int)$_GET["limit"] : 20));
$offset = ($page - 1) * $limit;

try {
    $conditions = [];
    $params     = [];

    if ($search !== "") {
        $conditions[] = "(t.transaction_ref LIKE :search OR t.order_id LIKE :search)";
        $params[":search"] = "%" . $search . "%";
    }

    if ($status !== "") {
        $conditions[] = "t.status = :status";
        $params[":status"] = $status;
    }

    $where = count($conditions) > 0 ? "WHERE " . implode(" AND ", $conditions) : "";

    // Total count
    $countStmt = $conn->prepare("SELECT COUNT(*) FROM transactions t $where");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // Main query
    $params[":limit"]  = $limit;
    $params[":offset"] = $offset;

    $stmt = $conn->prepare("
        SELECT
            t.id,
            t.order_id,
            t.transaction_ref,
            t.payment_gateway,
            t.amount,
            t.currency,
            t.status,
            t.gateway_response,
            t.created_at,
            t.updated_at,
            o.first_name,
            o.last_name,
            o.email,
            o.grand_total AS order_total
        FROM transactions t
        LEFT JOIN orders o ON t.order_id = o.id
        $where
        ORDER BY t.created_at DESC
        LIMIT :limit OFFSET :offset
    ");
    $stmt->execute($params);
    $transactions = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data"   => [
            "transactions" => $transactions,
            "pagination"   => [
                "total"       => $total,
                "page"        => $page,
                "limit"       => $limit,
                "total_pages" => (int)ceil($total / $limit),
            ],
        ],
    ]);
    exit();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch transactions: " . $e->getMessage()]);
    exit();
}
