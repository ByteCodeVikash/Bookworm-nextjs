<?php
// backend/api/cart.php
require_once __DIR__ . "/../config/db.php";

$method = $_SERVER["REQUEST_METHOD"];

try {
    if ($method === "GET") {
        $userId = isset($_GET["userId"]) ? (int)$_GET["userId"] : null;
        if (!$userId) {
            http_response_code(400);
            echo json_encode(["error" => "Missing userId parameter"]);
            exit();
        }

        $stmt = $conn->prepare("
            SELECT 
                ci.book_id AS id,
                b.title AS name,
                a.name AS author,
                b.price,
                ci.quantity,
                b.image_url AS image
            FROM cart_items ci
            JOIN books b ON ci.book_id = b.id
            LEFT JOIN authors a ON b.author_id = a.id
            WHERE ci.user_id = :user_id
        ");
        $stmt->execute([":user_id" => $userId]);
        $items = $stmt->fetchAll();

        foreach ($items as &$item) {
            $item["price"] = (float)$item["price"];
            $item["quantity"] = (int)$item["quantity"];
        }

        echo json_encode($items);

    } else if ($method === "POST") {
        $input = json_decode(file_get_contents("php://input"), true);
        $userId = isset($input["userId"]) ? (int)$input["userId"] : null;
        $bookId = isset($input["bookId"]) ? $input["bookId"] : null;
        $quantity = isset($input["quantity"]) ? (int)$input["quantity"] : 1;

        if (!$userId || !$bookId) {
            http_response_code(400);
            echo json_encode(["error" => "userId and bookId are required."]);
            exit();
        }

        // Check if item exists in cart
        $stmt = $conn->prepare("SELECT id, quantity FROM cart_items WHERE user_id = :user_id AND book_id = :book_id");
        $stmt->execute([":user_id" => $userId, ":book_id" => $bookId]);
        $existing = $stmt->fetch();

        if ($existing) {
            $newQuantity = $existing["quantity"] + $quantity;
            if ($newQuantity <= 0) {
                // Delete if quantity goes to 0 or less
                $delStmt = $conn->prepare("DELETE FROM cart_items WHERE id = :id");
                $delStmt->execute([":id" => $existing["id"]]);
            } else {
                $upStmt = $conn->prepare("UPDATE cart_items SET quantity = :quantity WHERE id = :id");
                $upStmt->execute([":quantity" => $newQuantity, ":id" => $existing["id"]]);
            }
        } else {
            if ($quantity > 0) {
                $insStmt = $conn->prepare("INSERT INTO cart_items (user_id, book_id, quantity) VALUES (:user_id, :book_id, :quantity)");
                $insStmt->execute([":user_id" => $userId, ":book_id" => $bookId, ":quantity" => $quantity]);
            }
        }

        echo json_encode(["success" => true, "message" => "Cart updated successfully."]);

    } else if ($method === "DELETE") {
        $userId = isset($_GET["userId"]) ? (int)$_GET["userId"] : null;
        $bookId = isset($_GET["bookId"]) ? $_GET["bookId"] : null;

        if (!$userId) {
            http_response_code(400);
            echo json_encode(["error" => "userId parameter is required."]);
            exit();
        }

        if ($bookId) {
            $stmt = $conn->prepare("DELETE FROM cart_items WHERE user_id = :user_id AND book_id = :book_id");
            $stmt->execute([":user_id" => $userId, ":book_id" => $bookId]);
        } else {
            // Clear entire cart
            $stmt = $conn->prepare("DELETE FROM cart_items WHERE user_id = :user_id");
            $stmt->execute([":user_id" => $userId]);
        }

        echo json_encode(["success" => true, "message" => "Item(s) removed from cart successfully."]);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
