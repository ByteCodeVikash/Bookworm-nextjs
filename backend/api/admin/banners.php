<?php
// backend/api/admin/banners.php
require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

admin_require_auth();

$method = $_SERVER["REQUEST_METHOD"];

// ── GET: list all banners ────────────────────────────────────────────────────
if ($method === "GET") {
    try {
        $stmt = $conn->query("SELECT * FROM banners ORDER BY sort_order ASC, id ASC");
        $banners = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $banners]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch banners: " . $e->getMessage()]);
        exit();
    }
}

// ── POST: create banner ──────────────────────────────────────────────────────
if ($method === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload."]);
        exit();
    }

    $image_url = isset($input["image_url"]) ? trim($input["image_url"]) : "";
    if ($image_url === "") {
        http_response_code(400);
        echo json_encode(["error" => "image_url is required."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("
            INSERT INTO banners (title_prefix, title_highlighted, title_suffix, subtitle, image_url, action_url, sort_order, is_active)
            VALUES (:title_prefix, :title_highlighted, :title_suffix, :subtitle, :image_url, :action_url, :sort_order, :is_active)
        ");
        $stmt->execute([
            ":title_prefix"      => isset($input["title_prefix"]) ? trim($input["title_prefix"]) : null,
            ":title_highlighted" => isset($input["title_highlighted"]) ? trim($input["title_highlighted"]) : null,
            ":title_suffix"      => isset($input["title_suffix"]) ? trim($input["title_suffix"]) : null,
            ":subtitle"          => isset($input["subtitle"]) ? trim($input["subtitle"]) : null,
            ":image_url"         => $image_url,
            ":action_url"        => isset($input["action_url"]) ? trim($input["action_url"]) : null,
            ":sort_order"        => isset($input["sort_order"]) ? (int)$input["sort_order"] : 0,
            ":is_active"         => isset($input["is_active"]) ? (int)$input["is_active"] : 1,
        ]);
        echo json_encode(["status" => "success", "message" => "Banner created.", "id" => (string)$conn->lastInsertId()]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to create banner: " . $e->getMessage()]);
        exit();
    }
}

// ── PUT: update banner ───────────────────────────────────────────────────────
if ($method === "PUT") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Banner ID is required."]);
        exit();
    }

    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("
            UPDATE banners SET
                title_prefix      = :title_prefix,
                title_highlighted = :title_highlighted,
                title_suffix      = :title_suffix,
                subtitle          = :subtitle,
                image_url         = :image_url,
                action_url        = :action_url,
                sort_order        = :sort_order,
                is_active         = :is_active
            WHERE id = :id
        ");
        $stmt->execute([
            ":id"                => $id,
            ":title_prefix"      => isset($input["title_prefix"]) ? trim($input["title_prefix"]) : null,
            ":title_highlighted" => isset($input["title_highlighted"]) ? trim($input["title_highlighted"]) : null,
            ":title_suffix"      => isset($input["title_suffix"]) ? trim($input["title_suffix"]) : null,
            ":subtitle"          => isset($input["subtitle"]) ? trim($input["subtitle"]) : null,
            ":image_url"         => isset($input["image_url"]) ? trim($input["image_url"]) : "",
            ":action_url"        => isset($input["action_url"]) ? trim($input["action_url"]) : null,
            ":sort_order"        => isset($input["sort_order"]) ? (int)$input["sort_order"] : 0,
            ":is_active"         => isset($input["is_active"]) ? (int)$input["is_active"] : 1,
        ]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Banner updated."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Banner not found."]);
        }
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update banner: " . $e->getMessage()]);
        exit();
    }
}

// ── DELETE: remove banner ────────────────────────────────────────────────────
if ($method === "DELETE") {
    $id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Banner ID is required."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM banners WHERE id = :id");
        $stmt->execute([":id" => $id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Banner deleted."]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Banner not found."]);
        }
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete banner: " . $e->getMessage()]);
        exit();
    }
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed."]);
exit();
