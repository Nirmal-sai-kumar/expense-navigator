<?php
session_start();
include __DIR__ . '/../config/db.php';

// Redirect if not admin
if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    header("Location: ../public/login.php");
    exit();
}

// Check if an expense_id is provided
if (!isset($_GET['expense_id'])) {
    die("Expense ID is required.");
}

$expense_id = intval($_GET['expense_id']);

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $date   = trim($_POST['date']);
    $source = trim($_POST['source']);
    $amount = trim($_POST['amount']);

    // Update expense record using a prepared statement
    $stmt = $conn->prepare("UPDATE expenses SET date = ?, source = ?, amount = ? WHERE id = ?");
    $stmt->bind_param("ssdi", $date, $source, $amount, $expense_id);
    
    if ($stmt->execute()) {
        echo "<script>alert('Expense updated successfully!'); window.location.href='admin_dashboard.php';</script>";
        exit();
    } else {
        echo "Error updating expense: " . $conn->error;
    }
    $stmt->close();
} else {
    // Fetch the current details of the expense
    $stmt = $conn->prepare("SELECT date, source, amount FROM expenses WHERE id = ?");
    $stmt->bind_param("i", $expense_id);
    $stmt->execute();
    $stmt->bind_result($date, $source, $amount);
    
    if (!$stmt->fetch()) {
        die("Expense not found.");
    }
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Expense</title>
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
            width: 70%;
            margin: 50px auto;
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

        input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        }

        input:focus {
            outline: none;
            border-color: #2980b9;
        }

        button {
            padding: 10px 15px;
            background-color: #27ae60;
            color: white;
            border: none;
            border-radius: 5px;
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
    <h2>Edit Expense Record</h2>

    <form action="edit_expense.php?expense_id=<?= urlencode($expense_id) ?>" method="POST">
        <label>Date (YYYY-MM-DD):</label>
        <input type="date" name="date" value="<?= htmlspecialchars($date) ?>" required>

        <label>Source:</label>
        <input type="text" name="source" value="<?= htmlspecialchars($source) ?>" required>

        <label>Amount:</label>
        <input type="number" step="0.01" name="amount" value="<?= htmlspecialchars($amount) ?>" required>

        <button type="submit">Update Expense</button>
    </form>

    <a href="admin_dashboard.php">Back to Dashboard</a>
</div>

</body>
</html>
