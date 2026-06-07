<?php
// backend/api/admin/upload.php
// Dedicated image upload endpoint for book covers
// DO NOT mix with CRUD endpoints

require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/auth_helper.php";

// Enforce admin auth
admin_require_auth();

// Only accept POST (multipart/form-data)
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed. Use POST."]);
    exit();
}

// ── Configuration ──────────────────────────────────────────────────────────────
$ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
$ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
$MAX_FILE_SIZE      = 5 * 1024 * 1024; // 5 MB in bytes

// Resolve upload directory relative to this file's location
// Stores at: backend/uploads/books/
// IMPORTANT: Do NOT use realpath() here — it returns false if the directory
// doesn't exist yet, which breaks mkdir() on first upload.
$uploadDir = dirname(__FILE__) . "/../../uploads/books/";

// ── Validate incoming file ──────────────────────────────────────────────────────
if (!isset($_FILES["image"]) || $_FILES["image"]["error"] === UPLOAD_ERR_NO_FILE) {
    http_response_code(400);
    echo json_encode(["error" => "No image file was provided. Expected field name: 'image'."]);
    exit();
}

$file  = $_FILES["image"];
$error = $file["error"];

// PHP upload error codes
if ($error !== UPLOAD_ERR_OK) {
    $phpErrors = [
        UPLOAD_ERR_INI_SIZE   => "File exceeds the server's upload_max_filesize limit.",
        UPLOAD_ERR_FORM_SIZE  => "File exceeds the form MAX_FILE_SIZE limit.",
        UPLOAD_ERR_PARTIAL    => "File was only partially uploaded.",
        UPLOAD_ERR_NO_TMP_DIR => "Missing a temporary folder on the server.",
        UPLOAD_ERR_CANT_WRITE => "Failed to write file to disk.",
        UPLOAD_ERR_EXTENSION  => "Upload blocked by a PHP extension.",
    ];
    http_response_code(500);
    echo json_encode(["error" => $phpErrors[$error] ?? "Unknown upload error (code {$error})."]);
    exit();
}

// 1. Size check
if ($file["size"] > $MAX_FILE_SIZE) {
    http_response_code(413);
    echo json_encode(["error" => "File is too large. Maximum allowed size is 5 MB."]);
    exit();
}

// 2. MIME type check — use finfo for reliable detection (not the browser-provided value)
$finfo    = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file["tmp_name"]);

if (!in_array($mimeType, $ALLOWED_MIME_TYPES, true)) {
    http_response_code(415);
    echo json_encode([
        "error" => "Unsupported file type '{$mimeType}'. Allowed: JPG, JPEG, PNG, WEBP."
    ]);
    exit();
}

// 3. Extension check (secondary guard)
$originalName = $file["name"];
$ext          = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

if (!in_array($ext, $ALLOWED_EXTENSIONS, true)) {
    http_response_code(415);
    echo json_encode([
        "error" => "Unsupported file extension '.{$ext}'. Allowed: .jpg, .jpeg, .png, .webp."
    ]);
    exit();
}

// ── Ensure upload directory exists ─────────────────────────────────────────────
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(["error" => "Could not create uploads directory on the server."]);
        exit();
    }
}

if (!is_writable($uploadDir)) {
    http_response_code(500);
    echo json_encode(["error" => "Uploads directory is not writable."]);
    exit();
}

// ── Generate unique filename (no collisions) ────────────────────────────────────
// Format: bookcover_<timestamp>_<random8hex>.<ext>
$uniqueName = sprintf(
    "bookcover_%s_%s.%s",
    date("YmdHis"),       // timestamp for rough ordering
    bin2hex(random_bytes(4)), // 8 hex chars of randomness
    $ext
);

$destPath = $uploadDir . $uniqueName;

// ── Move uploaded file ──────────────────────────────────────────────────────────
if (!move_uploaded_file($file["tmp_name"], $destPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save the uploaded file. Please try again."]);
    exit();
}

// ── Build the public URL ────────────────────────────────────────────────────────
// The URL returned is relative to the backend root so the frontend can prepend
// NEXT_PUBLIC_API_BASE_URL. e.g. /uploads/books/bookcover_20260605_ab12cd34.jpg
$relativeUrl = "/uploads/books/" . $uniqueName;

echo json_encode([
    "status"   => "success",
    "message"  => "Image uploaded successfully.",
    "url"      => $relativeUrl,
    "filename" => $uniqueName,
]);
exit();
