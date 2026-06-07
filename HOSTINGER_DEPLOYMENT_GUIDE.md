# Bookworm — Hostinger Shared Hosting Deployment Guide

> **Target:** Hostinger Shared Hosting (cPanel + Apache + PHP + MySQL)  
> **Stack:** Next.js Static Export (frontend) + PHP REST API (backend) + MySQL

---

## Overview

| Layer     | Technology         | Hostinger Location                  |
|-----------|--------------------|-------------------------------------|
| Frontend  | Next.js (static)   | `public_html/` (or subdomain root)  |
| Backend   | PHP 8.x API        | `public_html/backend/`              |
| Database  | MySQL 8.x          | Hostinger hPanel → MySQL Databases  |
| Uploads   | PHP file system    | `public_html/backend/uploads/books/`|

---

## STEP 1 — Create MySQL Database

1. Log in to **Hostinger hPanel** → go to **Hosting → Manage → MySQL Databases**
2. Click **Create a new database**
   - **Database name:** `bookworm` (Hostinger prefixes it: `u123456789_bookworm`)
   - **Username:** `bwuser` (Hostinger prefixes it: `u123456789_bwuser`)
   - **Password:** Generate a strong password — **save it now**
3. Click **Create** → then assign the user to the database with **All Privileges**
4. Note down all three values:
   ```
   DB_NAME  = u123456789_bookworm
   DB_USER  = u123456789_bwuser
   DB_PASS  = your_strong_password
   DB_HOST  = localhost
   ```

---

## STEP 2 — Import SQL Files

Import in this exact order via **hPanel → phpMyAdmin**:

### Order of Import

| Order | File                              | Purpose                                  |
|-------|-----------------------------------|------------------------------------------|
| 1st   | `backend/schema.sql`              | Creates all tables + seeds book data     |
| 2nd   | `backend/admin_migration.sql`     | Adds `role` column, `settings` table, admin user |
| 3rd   | `backend/client_schema_migration.sql` | Adds `banners`, `transactions`, `wishlist` tables |

### How to Import

1. In hPanel, open **phpMyAdmin** for your database
2. Select your database (`u123456789_bookworm`) from the left sidebar
3. Click the **Import** tab
4. Click **Choose File** → select `backend/schema.sql` → click **Go**
5. Repeat for `admin_migration.sql`, then `client_schema_migration.sql`
6. Verify: The left sidebar should show these tables:
   - `users`, `user_addresses`, `categories`, `authors`, `books`
   - `cart_items`, `orders`, `order_items`, `contact_messages`
   - `newsletter_subscribers`, `settings`, `banners`, `transactions`, `wishlist`

> **Default Admin Credentials** (created by admin_migration.sql):  
> Email: `admin@bookworm.com` | Password: `admin123`  
> ⚠️ **Change this password immediately after first login!**

---

## STEP 3 — Build & Upload Frontend

### 3a. Set the Production API URL (CRITICAL)

Before building, edit `.env.production` in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/backend
```

Replace `yourdomain.com` with your actual Hostinger domain. This value is **baked into the static JS bundle** — the wrong URL means API calls will fail silently.

> **Subdomain example:** `https://api.yourdomain.com` (if backend is on a subdomain)  
> **Subfolder example:** `https://yourdomain.com/backend` (most common setup)

### 3b. Build the Static Export

```bash
cd /path/to/book-ecom-template
npm install
npm run build
```

This generates a `/out` folder — a fully static HTML/CSS/JS site.

### 3c. Upload Frontend Files

Using Hostinger **File Manager** or **FTP** (FileZilla):

- Upload **all contents** of the `/out` folder → `public_html/`
- Do **NOT** upload the `/out` folder itself, only its contents

```
public_html/
├── index.html
├── shop/
│   └── index.html
├── product/
│   └── index.html
├── admin/
│   └── index.html        ← Admin panel
├── _next/
│   ├── static/
│   └── ...
└── ...
```

### 3d. Upload `public_html/.htaccess` for Next.js Routing

Create a file at `public_html/.htaccess` with this content:

```apache
Options -Indexes

# Handle Next.js static export routing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Don't rewrite files or directories that exist
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d

    # Try adding /index.html (trailingSlash: true in next.config.ts)
    RewriteCond %{REQUEST_FILENAME}/index.html -f
    RewriteRule ^(.*)$ $1/index.html [L]

    # Fallback to root index.html for SPA-style 404 handling
    RewriteRule . /index.html [L]
</IfModule>
```

> **Why needed?** Next.js with `trailingSlash: true` generates `page/index.html` files. Apache needs this rule to serve them correctly when users navigate directly to a URL or refresh the page.

---

## STEP 4 — Upload Backend

### 4a. Upload PHP Files

Upload the entire `backend/` folder to `public_html/`:

```
public_html/
└── backend/
    ├── .htaccess             ← IMPORTANT: protect config
    ├── config/
    │   ├── db.php
    │   └── db.local.php      ← YOU CREATE THIS (see Step 5)
    ├── api/
    │   ├── .htaccess         ← IMPORTANT: Authorization header fix
    │   ├── books.php
    │   ├── banners.php
    │   ├── categories.php
    │   ├── authors.php
    │   ├── cart.php
    │   ├── orders.php
    │   ├── contact.php
    │   ├── newsletter.php
    │   ├── search.php
    │   ├── settings.php
    │   └── admin/
    │       ├── .htaccess     ← CRITICAL: Authorization header CGI fix
    │       ├── auth.php
    │       ├── auth_helper.php
    │       ├── books.php
    │       ├── banners.php
    │       ├── categories.php
    │       ├── authors.php
    │       ├── orders.php
    │       ├── dashboard.php
    │       ├── settings.php
    │       ├── users.php
    │       ├── contacts.php
    │       ├── subscribers.php
    │       ├── transactions.php
    │       ├── wishlist.php
    │       └── upload.php
    └── uploads/
        ├── .htaccess         ← Blocks PHP execution in uploads
        └── books/            ← Book cover images go here
            └── .gitkeep
```

> ⚠️ **Do NOT upload** `backend/config/db.local.php` from your local machine — it contains your dev credentials. Create it fresh on the server (see Step 5).

---

## STEP 5 — Configure Environment (Database Credentials)

### Create `db.local.php` on the Server

Using Hostinger **File Manager**, navigate to:
```
public_html/backend/config/
```

Create a **new file** named `db.local.php` with this content:

```php
<?php
// backend/config/db.local.php
// Hostinger production database credentials — NEVER commit this file to git
$host     = 'localhost';
$db_name  = 'u123456789_bookworm';   // Your actual DB name from hPanel
$username = 'u123456789_bwuser';     // Your actual DB user from hPanel
$password = 'YOUR_STRONG_PASSWORD';   // Password you set in Step 1
```

> **Why `db.local.php`?** On Hostinger shared hosting, Apache `SetEnv` directives don't reliably pass through to PHP via `getenv()`. The `db.local.php` override is the most reliable credential method.

### Change the Admin JWT Secret

In `public_html/backend/api/admin/auth_helper.php`, find line 5:

```php
define('ADMIN_JWT_SECRET', 'bookworm-store-admin-super-secret-key-12345!');
```

Change to a strong, unique secret (use a password generator — minimum 32 characters):

```php
define('ADMIN_JWT_SECRET', 'your-unique-production-secret-key-min-32-chars');
```

---

## STEP 6 — Configure Uploads Folder Permissions

Using Hostinger **File Manager**:

1. Navigate to `public_html/backend/uploads/`
2. Right-click the `uploads` folder → **Change Permissions**
3. Set to `755` (owner: rwx, group: r-x, other: r-x)
4. Navigate into `uploads/books/`
5. Set `books/` folder to `755` as well

Using FTP (FileZilla):
```
Right-click uploads/   → File permissions → 755
Right-click books/     → File permissions → 755
```

> **Why 755?** PHP needs write permission to save uploaded book cover images. 755 allows the web server user to write while keeping other permissions restrictive.

### Verify Upload Works

After deployment, test via the Admin Panel:
1. Log in at `https://yourdomain.com/admin/login/`
2. Go to Books → Add New Book
3. Click "Upload Cover Image" and upload a test image
4. If successful, the image appears at: `https://yourdomain.com/backend/uploads/books/bookcover_XXXX.jpg`

---

## STEP 7 — Final Testing Checklist

### Frontend Tests

| Test | URL | Expected |
|------|-----|----------|
| Homepage loads | `https://yourdomain.com/` | Renders homepage with banners + books |
| Shop page | `https://yourdomain.com/shop/` | Lists books from database |
| Product page | `https://yourdomain.com/product/?id=bs1` | Shows book detail |
| Admin login | `https://yourdomain.com/admin/login/` | Login form renders |
| Direct URL refresh | Reload `/shop/` in browser | Does NOT show Apache 404 |

### Backend API Tests

Open these URLs directly in your browser (should return JSON):

```
https://yourdomain.com/backend/api/books.php
https://yourdomain.com/backend/api/categories.php
https://yourdomain.com/backend/api/authors.php
https://yourdomain.com/backend/api/banners.php
https://yourdomain.com/backend/api/settings.php
```

### Admin Panel Tests

1. Log in at `/admin/login/` with `admin@bookworm.com` / `admin123`
2. Verify Dashboard stats load (orders, books, users counts)
3. Add a test book with an image upload
4. Verify the book appears on the storefront `/shop/`

### Common Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| White page / 404 on refresh | Missing `.htaccess` in `public_html/` | Add the Apache rewrite `.htaccess` (Step 3d) |
| API returns HTML not JSON | Wrong `API_BASE_URL` in build | Rebuild with correct `.env.production` |
| Admin 401 on every request | Authorization header stripped | Verify all 3 `.htaccess` files are uploaded |
| Images not loading | Wrong image URL prefix | Check `NEXT_PUBLIC_API_BASE_URL` in build |
| DB connection error | Wrong credentials in `db.local.php` | Double-check hPanel DB name/user/password |
| Upload fails (permission error) | `uploads/books/` not writable | Set permissions to 755 (Step 6) |
| Can't login as admin | `admin_migration.sql` not imported | Re-import `admin_migration.sql` |

---

## File Structure Summary

```
public_html/                          ← Hostinger webroot
├── .htaccess                         ← Next.js routing (CREATE in Step 3d)
├── index.html                        ← Homepage (from /out build)
├── shop/index.html
├── admin/index.html
├── _next/                            ← Next.js assets (from /out build)
└── backend/                          ← PHP backend
    ├── .htaccess                     ← Protect config files
    ├── config/
    │   ├── db.php                    ← DB connector (uploaded)
    │   └── db.local.php              ← Credentials (CREATE on server, Step 5)
    ├── api/
    │   ├── .htaccess                 ← Authorization header fix
    │   ├── *.php                     ← Public API endpoints
    │   └── admin/
    │       ├── .htaccess             ← CGI Authorization fix (CRITICAL)
    │       └── *.php                 ← Admin API endpoints
    └── uploads/
        ├── .htaccess                 ← Block PHP execution (security)
        └── books/                   ← Uploaded book cover images (chmod 755)
```

---

## SQL Files Reference

| File | When to Run | What It Does |
|------|-------------|--------------|
| `backend/schema.sql` | Fresh install | Creates all tables, seeds categories/authors/books/users |
| `backend/admin_migration.sql` | After schema.sql | Adds `role` column, `settings` table, default admin user |
| `backend/client_schema_migration.sql` | After admin_migration.sql | Adds `banners`, `transactions`, `wishlist` tables |

> **Existing database?** Run only `admin_migration.sql` and `client_schema_migration.sql` (they use `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS` — safe to run on existing data).

---

## Security Checklist

- [ ] `db.local.php` exists only on the server, never in git
- [ ] Admin JWT secret changed from default in `auth_helper.php`
- [ ] Admin password changed from `admin123` after first login
- [ ] `uploads/.htaccess` is uploaded (blocks PHP execution in uploads)
- [ ] `backend/.htaccess` is uploaded (blocks direct config access)
- [ ] `backend/api/admin/.htaccess` is uploaded (Authorization header fix)
- [ ] `uploads/books/` has `755` permissions, not `777`
- [ ] CORS header in `db.php` changed from `*` to your specific domain (optional hardening)

---

*Generated for Bookworm Bookstore — Hostinger Shared Hosting Deployment*
