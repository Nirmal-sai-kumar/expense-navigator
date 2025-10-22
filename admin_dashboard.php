<?php
session_start();
include 'db.php';

// Redirect if not admin
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    header("Location: login.php");
    exit();
}

// ----- DELETE HANDLERS -----

// Handle delete user request securely
if (isset($_GET['delete_user'])) {
    $user_id = intval($_GET['delete_user']);
    
    // Delete from users
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->close();

    // Delete related expenses
    $stmt = $conn->prepare("DELETE FROM expenses WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->close();

    echo "<script>alert('User deleted!'); window.location.href='admin_dashboard.php';</script>";
    exit();
}

// Handle delete expense request securely
if (isset($_GET['delete_expense'])) {
    $expense_id = intval($_GET['delete_expense']);

    $stmt = $conn->prepare("DELETE FROM expenses WHERE id = ?");
    $stmt->bind_param("i", $expense_id);
    $stmt->execute();
    $stmt->close();

    echo "<script>alert('Expense deleted!'); window.location.href='admin_dashboard.php';</script>";
    exit();
}

// ----- FETCH DATA -----

// Fetch all users
$users = $conn->query("SELECT id, username, email, role FROM users");
if (!$users) {
    die("Error fetching users: " . $conn->error);
}

// Fetch all expenses (fixed column name: date instead of expense_date)
$query = "SELECT expenses.id, users.username, expenses.date, expenses.source, expenses.amount 
          FROM expenses 
          JOIN users ON expenses.user_id = users.id";
$expenses = $conn->query($query);
if (!$expenses) {
    die("Error fetching expenses: " . $conn->error);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard</title>
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
            width: 90%;
            margin: 0 auto;
            padding: 20px;
        }

        h2, h3 {
            text-align: center;
            color: #2c3e50;
        }

        /* Table Styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        th, td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: left;
        }

        th {
            background-color: #3498db;
            color: white;
        }

        tr:hover {
            background-color: #f1f1f1;
        }

        a {
            text-decoration: none;
            color: #2980b9;
            font-weight: bold;
            transition: 0.3s;
        }

        a:hover {
            color: #e74c3c;
        }

        .btn {
            display: inline-block;
            padding: 8px 12px;
            background: #27ae60;
            color: white;
            border: none;
            border-radius: 4px;
            text-decoration: none;
            transition: 0.3s;
        }

        .btn:hover {
            background: #2ecc71;
        }

        .btn-danger {
            background: #e74c3c;
        }

        .btn-danger:hover {
            background: #c0392b;
        }

        .logout {
            display: block;
            width: 150px;
            margin: 20px auto;
            text-align: center;
            background: #e67e22;
            color: white;
            padding: 10px 0;
            border-radius: 5px;
            transition: 0.3s;
        }

        .logout:hover {
            background: #d35400;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            table {
                width: 100%;
                display: block;
                overflow-x: auto;
            }

            th, td {
                white-space: nowrap;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Admin Dashboard</h2>

    <h3>All Users</h3>
    <?php if ($users->num_rows > 0): ?>
        <table>
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
            <?php while ($user = $users->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($user['id']) ?></td>
                <td><?= htmlspecialchars($user['username']) ?></td>
                <td><?= htmlspecialchars($user['email']) ?></td>
                <td><?= htmlspecialchars($user['role']) ?></td>
                <td>
                    <a href="edit_user.php?user_id=<?= urlencode($user['id']) ?>" class="btn">Edit</a>
                    <a href="?delete_user=<?= urlencode($user['id']) ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this user?');">Delete</a>
                </td>
            </tr>
            <?php endwhile; ?>
        </table>
    <?php else: ?>
        <p>No users found.</p>
    <?php endif; ?>

    <h3>All Expenses</h3>
    <?php if ($expenses->num_rows > 0): ?>
        <table>
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Date</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Actions</th>
            </tr>
            <?php while ($expense = $expenses->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($expense['id']) ?></td>
                <td><?= htmlspecialchars($expense['username']) ?></td>
                <td><?= htmlspecialchars($expense['date']) ?></td>
                <td><?= htmlspecialchars($expense['source']) ?></td>
                <td>₹<?= number_format($expense['amount'], 2) ?></td>
                <td>
                    <a href="edit_expense.php?expense_id=<?= urlencode($expense['id']) ?>" class="btn">Edit</a>
                    <a href="?delete_expense=<?= urlencode($expense['id']) ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this expense?');">Delete</a>
                </td>
            </tr>
            <?php endwhile; ?>
        </table>
    <?php else: ?>
        <p>No expenses found.</p>
    <?php endif; ?>

    <a href="logout.php" class="logout">Logout</a>
</div>

</body>
</html>
