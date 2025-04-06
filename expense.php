<?php
include 'db.php';
session_start();

// Ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    die("<script>alert('Please log in first!'); window.location.href='login.html';</script>");
}

$user_id = $_SESSION['user_id'];  // Get the current logged-in user ID

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_expense'])) {
    $date = $_POST['expense_date'];
    $source = $_POST['source'];
    $amount = $_POST['expense_amount'];

    //  Validate inputs
    if (empty($date) || empty($source) || empty($amount)) {
        die("<script>alert('All fields are required!'); window.location.href='expense.html';</script>");
    }

    // Check if 'expenses' table exists
    $checkTable = "SHOW TABLES LIKE 'expenses'";
    $result = $conn->query($checkTable);

    if ($result->num_rows == 0) {
        die("<script>alert('Error: Table `expenses` does not exist! Please check your database.'); window.location.href='expense.html';</script>");
    }

    // Use prepared statement to insert data with `user_id`
    $sql = "INSERT INTO expenses (user_id, expense_date, source, amount) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("issd", $user_id, $date, $source, $amount);

        if ($stmt->execute()) {
            echo "<script>alert('Expense added successfully!'); window.location.href='dashboard.html';</script>";
        } else {
            echo "<script>alert('Error adding expense: " . $stmt->error . "'); window.location.href='expense.html';</script>";
        }

        // Close statement
        $stmt->close();
    } else {
        echo "<script>alert('Database query failed!'); window.location.href='expense.html';</script>";
    }

    //  Close connection
    $conn->close();
}
?>
