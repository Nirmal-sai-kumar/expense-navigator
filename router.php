<?php
// This is a simple router for the PHP built-in server
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Allow direct access to PHP files
if (preg_match('/\.php$/', $path)) {
    // This is a PHP file request, let the server handle it directly
    return false;
}

// Route frontend requests
if ($path == '/' || $path == '') {
    // Serve the main index page
    include __DIR__ . '/frontend/public/index.html';
    return true;
}

// Check if this is a frontend asset request (HTML, CSS, JS, images)
if (file_exists(__DIR__ . $path)) {
    // File exists, let the server serve it directly
    return false;
}

// If we get here, the path wasn't recognized
http_response_code(404);
echo '404 - Not Found';
?>