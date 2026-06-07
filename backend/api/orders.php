<?php
// backend/api/orders.php
require_once __DIR__ . "/../config/db.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {
    // Create new order
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload"]);
        exit();
    }

    // Required fields validation
    $reqFields = ["firstName", "lastName", "country", "streetAddress", "city", "postcode", "phone", "email", "shippingMethod", "paymentMethod", "subtotal", "grandTotal", "items"];
    foreach ($reqFields as $field) {
        if (!isset($input[$field])) {
            http_response_code(400);
            echo json_encode(["error" => "Field '{$field}' is required"]);
            exit();
        }
    }

    $userId = isset($input["userId"]) ? (int)$input["userId"] : null;
    $firstName = trim($input["firstName"]);
    $lastName = trim($input["lastName"]);
    $companyName = isset($input["companyName"]) ? trim($input["companyName"]) : null;
    $country = trim($input["country"]);
    $streetAddress = trim($input["streetAddress"]);
    $apartment = isset($input["apartment"]) ? trim($input["apartment"]) : null;
    $city = trim($input["city"]);
    $county = isset($input["county"]) ? trim($input["county"]) : null;
    $postcode = trim($input["postcode"]);
    $phone = trim($input["phone"]);
    $email = trim($input["email"]);
    $orderNotes = isset($input["orderNotes"]) ? trim($input["orderNotes"]) : null;
    $shippingMethod = trim($input["shippingMethod"]);
    $shippingCost = (float)$input["shippingCost"];
    $paymentMethod = trim($input["paymentMethod"]);
    $couponCode = isset($input["couponCode"]) ? trim($input["couponCode"]) : null;
    $discountAmount = isset($input["discountAmount"]) ? (float)$input["discountAmount"] : 0.00;
    $subtotal = (float)$input["subtotal"];
    $grandTotal = (float)$input["grandTotal"];
    $items = $input["items"];

    if (empty($items)) {
        http_response_code(400);
        echo json_encode(["error" => "Order must contain at least one item"]);
        exit();
    }

    try {
        $conn->beginTransaction();

        // Generate unique order ID (e.g. BW-30785 or similar)
        $orderId = "BW-" . rand(10000, 99999);
        // Ensure uniqueness
        $checkStmt = $conn->prepare("SELECT id FROM orders WHERE id = :id");
        while (true) {
            $checkStmt->execute([":id" => $orderId]);
            if (!$checkStmt->fetch()) {
                break;
            }
            $orderId = "BW-" . rand(10000, 99999);
        }

        // Insert order record
        $stmtOrder = $conn->prepare("
            INSERT INTO orders (
                id, user_id, first_name, last_name, company_name, country, street_address, 
                apartment, city, county, postcode, phone, email, order_notes, 
                shipping_method, shipping_cost, payment_method, coupon_code, 
                discount_amount, subtotal, grand_total, status
            ) VALUES (
                :id, :user_id, :first_name, :last_name, :company_name, :country, :street_address,
                :apartment, :city, :county, :postcode, :phone, :email, :order_notes,
                :shipping_method, :shipping_cost, :payment_method, :coupon_code,
                :discount_amount, :subtotal, :grand_total, 'On hold'
            )
        ");

        $stmtOrder->execute([
            ":id" => $orderId,
            ":user_id" => $userId,
            ":first_name" => $firstName,
            ":last_name" => $lastName,
            ":company_name" => $companyName,
            ":country" => $country,
            ":street_address" => $streetAddress,
            ":apartment" => $apartment,
            ":city" => $city,
            ":county" => $county,
            ":postcode" => $postcode,
            ":phone" => $phone,
            ":email" => $email,
            ":order_notes" => $orderNotes,
            ":shipping_method" => $shippingMethod,
            ":shipping_cost" => $shippingCost,
            ":payment_method" => $paymentMethod,
            ":coupon_code" => $couponCode,
            ":discount_amount" => $discountAmount,
            ":subtotal" => $subtotal,
            ":grand_total" => $grandTotal
        ]);

        // Insert items
        $stmtItem = $conn->prepare("
            INSERT INTO order_items (
                order_id, book_id, book_title, price, quantity
            ) VALUES (
                :order_id, :book_id, :book_title, :price, :quantity
            )
        ");

        foreach ($items as $item) {
            $stmtItem->execute([
                ":order_id" => $orderId,
                ":book_id" => $item["id"],
                ":book_title" => $item["name"],
                ":price" => (float)$item["price"],
                ":quantity" => (int)$item["quantity"]
            ]);
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            "success" => true,
            "orderId" => $orderId,
            "message" => "Order placed successfully!"
        ]);

    } catch (Exception $e) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }

} else if ($method === "GET") {
    // Retrieve orders
    $userId = isset($_GET["userId"]) ? (int)$_GET["userId"] : null;
    $orderId = isset($_GET["orderId"]) ? $_GET["orderId"] : null;

    try {
        if ($orderId) {
            // Get single order details
            $stmtOrder = $conn->prepare("SELECT * FROM orders WHERE id = :id");
            $stmtOrder->execute([":id" => $orderId]);
            $order = $stmtOrder->fetch();

            if ($order) {
                // Get order items
                $stmtItems = $conn->prepare("
                    SELECT 
                        oi.id, 
                        oi.book_id AS id, 
                        oi.book_title AS name, 
                        oi.price, 
                        oi.quantity, 
                        b.image_url AS image, 
                        b.author
                    FROM order_items oi
                    LEFT JOIN books b ON oi.book_id = b.id
                    WHERE oi.order_id = :order_id
                ");
                $stmtItems->execute([":order_id" => $orderId]);
                $order["items"] = $stmtItems->fetchAll();

                echo json_encode($order);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Order not found"]);
            }
        } else if ($userId) {
            // Get order list for user
            $stmt = $conn->prepare("
                SELECT 
                    o.id, 
                    o.created_at AS date, 
                    o.status, 
                    o.grand_total AS total,
                    (SELECT SUM(quantity) FROM order_items WHERE order_id = o.id) AS itemsCount
                FROM orders o
                WHERE o.user_id = :user_id
                ORDER BY o.created_at DESC
            ");
            $stmt->execute([":user_id" => $userId]);
            $orders = $stmt->fetchAll();

            // Format timestamp/dates nicely
            foreach ($orders as &$o) {
                $o["total"] = (float)$o["total"];
                $o["itemsCount"] = (int)$o["itemsCount"];
                $o["date"] = date("F d, Y", strtotime($o["date"]));
            }

            echo json_encode($orders);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Missing userId or orderId parameter"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
