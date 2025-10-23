<?php
// Database connection test
require_once __DIR__ . '/../config/db.php'; // Include db.php with correct path

// Test connection
if ($conn) {
    echo "Database connection successful!";
    echo "<pre>";
    echo "Host: " . $servername . "\n";
    echo "Database: " . $database . "\n";
    echo "User: " . $username . "\n";
    echo "</pre>";
} else {
    echo "Database connection failed!";
}
?>
