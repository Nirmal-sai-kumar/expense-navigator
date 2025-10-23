<?php
session_start();
include __DIR__ . '/../config/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $role     = trim($_POST['role']);

    // Prepared statement to prevent SQL injection
    $sql  = "SELECT * FROM users WHERE username = ? AND role = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $role);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row             = $result->fetch_assoc();
        $hashed_password = $row['password']; // stored hashed password in DB

        if (password_verify($password, $hashed_password)) {
            // Store user details in session
            $_SESSION['user_id']  = $row['id'];
            $_SESSION['username'] = $row['username'];
            $_SESSION['role']     = $row['role'];

            // If admin, set a specific flag for admin checks
            if ($role === 'admin') {
                $_SESSION['admin'] = true;

                echo "<script>alert('Admin Login Successful!'); window.location.href='../admin/admin_dashboard.php';</script>";
            } else {
                // Normal user
                echo "<script>alert('User Login Successful!'); window.location.href='../../frontend/public/dashboard.html';</script>";
            }
        } else {
            echo "<script>alert('Invalid Password! Please try again.'); window.location.href='../../frontend/public/login.html';</script>";
        }
    } else {
        echo "<script>alert('Invalid Username or Role!'); window.location.href='../../frontend/public/login.html';</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
