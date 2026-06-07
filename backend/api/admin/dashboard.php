<?php
// backend/api/admin/dashboard.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce auth check
admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    try {
        // 1. KPI Counters
        // Total Sales (excluding Cancelled)
        $salesStmt = $conn->query("SELECT SUM(grand_total) AS total_sales FROM orders WHERE status != 'Cancelled'");
        $totalSales = (float)($salesStmt->fetch()["total_sales"] ?? 0.0);

        // Total Orders
        $ordersCountStmt = $conn->query("SELECT COUNT(*) AS total_orders FROM orders");
        $totalOrders = (int)($ordersCountStmt->fetch()["total_orders"] ?? 0);

        // Total Books
        $booksCountStmt = $conn->query("SELECT COUNT(*) AS total_books FROM books");
        $totalBooks = (int)($booksCountStmt->fetch()["total_books"] ?? 0);

        // Total Customers (excluding admins)
        $customersCountStmt = $conn->query("SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'");
        $totalCustomers = (int)($customersCountStmt->fetch()["total_customers"] ?? 0);

        // Total Subscribers
        $subsCountStmt = $conn->query("SELECT COUNT(*) AS total_subscribers FROM newsletter_subscribers");
        $totalSubscribers = (int)($subsCountStmt->fetch()["total_subscribers"] ?? 0);

        // Low Stock Count
        $lowStockStmt = $conn->query("SELECT COUNT(*) AS low_stock FROM books WHERE stock_status = 0");
        $lowStockCount = (int)($lowStockStmt->fetch()["low_stock"] ?? 0);

        // 2. Sales Chart Data (Last 7 Days)
        $salesChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = date("Y-m-d", strtotime("-$i days"));
            $chartStmt = $conn->prepare("SELECT SUM(grand_total) AS daily_total FROM orders WHERE DATE(created_at) = :date AND status != 'Cancelled'");
            $chartStmt->execute([":date" => $date]);
            $dailyTotal = (float)($chartStmt->fetch()["daily_total"] ?? 0.0);
            $salesChart[] = [
                "date" => date("M d", strtotime($date)),
                "sales" => $dailyTotal
            ];
        }

        // 3. Recent Orders (Last 5)
        $recentOrdersStmt = $conn->query("
            SELECT o.id, o.first_name, o.last_name, o.grand_total, o.status, o.created_at 
            FROM orders o 
            ORDER BY o.created_at DESC 
            LIMIT 5
        ");
        $recentOrders = $recentOrdersStmt->fetchAll();

        // 4. Low Stock Books List (First 5)
        $lowStockBooksStmt = $conn->query("
            SELECT id, title, price, image_url 
            FROM books 
            WHERE stock_status = 0 
            LIMIT 5
        ");
        $lowStockBooks = $lowStockBooksStmt->fetchAll();

        // 5. Popular Categories (Top 5 based on sales)
        $popularCategoriesStmt = $conn->query("
            SELECT c.name, COUNT(oi.id) AS sales_count
            FROM order_items oi
            JOIN books b ON oi.book_id = b.id
            JOIN categories c ON b.category_id = c.id
            GROUP BY c.id
            ORDER BY sales_count DESC
            LIMIT 5
        ");
        $popularCategories = $popularCategoriesStmt->fetchAll();

        echo json_encode([
            "status" => "success",
            "data" => [
                "kpis" => [
                    "totalSales" => $totalSales,
                    "totalOrders" => $totalOrders,
                    "totalBooks" => $totalBooks,
                    "totalCustomers" => $totalCustomers,
                    "totalSubscribers" => $totalSubscribers,
                    "lowStockCount" => $lowStockCount
                ],
                "salesChart" => $salesChart,
                "recentOrders" => $recentOrders,
                "lowStockBooks" => $lowStockBooks,
                "popularCategories" => $popularCategories
            ]
        ]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to load dashboard statistics: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}
