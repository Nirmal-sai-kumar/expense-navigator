<?php
session_start();
include __DIR__ . '/../config/db.php';

// Redirect if not admin
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    header("Location: ../public/login.php");
    exit();
}

// Check if a user_id is provided
if (!isset($_GET['user_id'])) {
    die("User ID is required.");
}

$user_id = intval($_GET['user_id']);

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $email    = trim($_POST['email']);
    $role     = trim($_POST['role']);

    // Update user details using a prepared statement
    $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?");
    $stmt->bind_param("sssi", $username, $email, $role, $user_id);
    
    if ($stmt->execute()) {
        echo "<script>alert('User updated successfully!'); window.location.href='admin_dashboard.php';</script>";
        exit();
    } else {
        echo "Error updating user: " . $conn->error;
    }
    $stmt->close();
} else {
    // Fetch the current details of the user
    $stmt = $conn->prepare("SELECT username, email, role FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($username, $email, $role);
    if (!$stmt->fetch()) {
        die("User not found.");
    }
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit User</title>
    <style>
        /* General Page Styling */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            width: 80%;
            margin: 30px auto;
            padding: 30px;
            background: white;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        h2 {
            text-align: center;
            color: #2c3e50;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        label {
            font-weight: bold;
            color: #34495e;
        }

        input, select, button {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        }

        input:focus, select:focus, button:focus {
            outline: none;
            border-color: #2980b9;
        }

        button {
            background-color: #27ae60;
            color: white;
            cursor: pointer;
            transition: 0.3s;
        }

        button:hover {
            background-color: #2ecc71;
        }

        a {
            display: inline-block;
            text-align: center;
            margin-top: 15px;
            color: #2980b9;
            text-decoration: none;
            transition: 0.3s;
        }

        a:hover {
            color: #e74c3c;
        }

        @media (max-width: 768px) {
            .container {
                width: 90%;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Edit User Details</h2>

    <form action="edit_user.php?user_id=<?= urlencode($user_id) ?>" method="POST">
        <label>Username:</label>
        <input type="text" name="username" value="<?= htmlspecialchars($username) ?>" required>
        
        <label>Email:</label>
        <input type="email" name="email" value="<?= htmlspecialchars($email) ?>" required>
        
        <label>Role:</label>
        <select name="role" required>
            <option value="user" <?= ($role === 'user') ? 'selected' : '' ?>>User</option>
            <option value="admin" <?= ($role === 'admin') ? 'selected' : '' ?>>Admin</option>
        </select>
        
        <button type="submit">Update User</button>
    </form>

    <a href="admin_dashboard.php">Back to Dashboard</a>
</div>

</body>
</html>
