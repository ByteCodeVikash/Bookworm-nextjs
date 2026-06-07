<?php
// backend/api/admin/auth_helper.php

// A static encryption secret key. In production, this can be overridden.
define('ADMIN_JWT_SECRET', 'bookworm-store-admin-super-secret-key-12345!');

function admin_generate_token($user_id, $role) {
    $payload = json_encode([
        'user_id' => $user_id,
        'role' => $role,
        'exp' => time() + (86400 * 7) // Valid for 7 days
    ]);
    
    $cipher = "aes-256-cbc";
    $iv_length = openssl_cipher_iv_length($cipher);
    $iv = openssl_random_pseudo_bytes($iv_length);
    
    $encrypted = openssl_encrypt($payload, $cipher, ADMIN_JWT_SECRET, 0, $iv);
    
    // Combine IV and encrypted payload, encode to base64url
    return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($iv . '::' . $encrypted));
}

function admin_verify_token($token) {
    try {
        $cipher = "aes-256-cbc";
        $token_decoded = base64_decode(str_replace(['-', '_'], ['+', '/'], $token));
        if (!$token_decoded) return false;
        
        $parts = explode('::', $token_decoded, 2);
        if (count($parts) !== 2) return false;
        
        list($iv, $encrypted) = $parts;
        $decrypted = openssl_decrypt($encrypted, $cipher, ADMIN_JWT_SECRET, 0, $iv);
        if (!$decrypted) return false;
        
        $data = json_decode($decrypted, true);
        if (!$data || !isset($data['user_id']) || !isset($data['role']) || !isset($data['exp'])) {
            return false;
        }
        
        // Check expiration
        if ($data['exp'] < time()) {
            return false;
        }
        
        return $data;
    } catch (Exception $e) {
        return false;
    }
}

function admin_require_auth() {
    // ── Read Authorization header ─────────────────────────────────────
    // Hostinger shared hosting runs PHP via CGI/FastCGI which STRIPS the
    // Authorization header. We have multiple fallback sources:
    //   1. getallheaders()             — works on Apache mod_php
    //   2. HTTP_AUTHORIZATION          — injected by our .htaccess RewriteRule
    //   3. REDIRECT_HTTP_AUTHORIZATION — another .htaccess injection method
    //   4. Direct $_SERVER lookup      — some Hostinger configs expose it here
    // ─────────────────────────────────────────────────────────────────
    $auth_header = null;

    // Method 1: getallheaders() (mod_php)
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $key => $val) {
            if (strcasecmp($key, 'Authorization') === 0) {
                $auth_header = $val;
                break;
            }
        }
    }

    // Method 2: $_SERVER['HTTP_AUTHORIZATION'] (set by .htaccess RewriteRule)
    if (!$auth_header && isset($_SERVER['HTTP_AUTHORIZATION']) && $_SERVER['HTTP_AUTHORIZATION'] !== '') {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    }

    // Method 3: $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] (CGI redirect env)
    if (!$auth_header && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) && $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] !== '') {
        $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    // Method 4: Apache-specific AUTHORIZATION env (some Hostinger setups)
    if (!$auth_header && isset($_SERVER['AUTHORIZATION']) && $_SERVER['AUTHORIZATION'] !== '') {
        $auth_header = $_SERVER['AUTHORIZATION'];
    }

    if (!$auth_header) {
        http_response_code(401);
        echo json_encode(["error" => "Authorization header is missing."]);
        exit(0);
    }
    
    // Parse Bearer token
    if (!preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid Authorization header format."]);
        exit(0);
    }
    
    $token = $matches[1];
    $payload = admin_verify_token($token);
    
    if (!$payload || $payload['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["error" => "Access denied. Invalid or unauthorized session."]);
        exit(0);
    }
    
    return $payload;
}
