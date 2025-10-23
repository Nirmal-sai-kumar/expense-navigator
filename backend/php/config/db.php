<?php
// db.php - update these if needed
$host = '127.0.0.1';        // use 127.0.0.1 (recommended)
$port = 3307;              // set to 3306 or 3307 depending on Workbench
$username = 'root';
$password = 'Sai@8499';
$database = 'expense_navigator';

// Create connection (note port passed as fifth parameter)
$conn = new mysqli($host, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
mysqli_set_charset($conn, 'utf8mb4');
?>
