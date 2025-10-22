<?php
include 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo "<script>alert('Please log in first!'); window.location.href='login.html';</script>";
    exit();
}

$user_id = $_SESSION['user_id'];

// Ensure the user_id column exists
$sql_check = "SHOW COLUMNS FROM expenses LIKE 'user_id'";
$result_check = $conn->query($sql_check);

if ($result_check->num_rows === 0) {
    $alter_query = "ALTER TABLE expenses ADD COLUMN user_id INT NOT NULL";
    $conn->query($alter_query);
}

// Handle Delete Action
if (isset($_GET['delete_id'])) {
    $delete_id = intval($_GET['delete_id']);
    $stmt = $conn->prepare("DELETE FROM expenses WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $delete_id, $user_id);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo "<script>alert('Expense deleted successfully!'); window.location.href='edit_expense1.php';</script>";
    } else {
        echo "<script>alert('Failed to delete expense!'); window.location.href='edit_expense1.php';</script>";
    }
    
    $stmt->close();
    exit();
}

// Handle Update Action
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['update_id'])) {
    $update_id = intval($_POST['update_id']);
    $expense_date = $_POST['expense_date'];
    $source = $_POST['source'];
    $amount = $_POST['amount'];

    // use `date` column instead of `expense_date`
    $stmt = $conn->prepare("UPDATE expenses SET date = ?, source = ?, amount = ? WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ssdii", $expense_date, $source, $amount, $update_id, $user_id);
    
    if ($stmt->execute()) {
        echo "<script>alert('Expense updated successfully!'); window.location.href='edit_expense1.php';</script>";
    } else {
        echo "<script>alert('Failed to update expense!'); window.location.href='edit_expense1.php';</script>";
    }
    
    $stmt->close();
    exit();
}

// Fetch Expense Records
$sql = "SELECT id, date, source, amount FROM expenses WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// Fetch data for editing
$edit_data = null;
if (isset($_GET['edit_id'])) {
    $edit_id = intval($_GET['edit_id']);
    $stmt = $conn->prepare("SELECT * FROM expenses WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $edit_id, $user_id);
    $stmt->execute();
    $edit_result = $stmt->get_result();
    $edit_data = $edit_result->fetch_assoc();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Expenses</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        h2 {
            text-align: center;
            margin-top: 20px;
            color: purple;
        }
        table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
            box-shadow: 0 0 10px #ccc;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid black;
        }
        th {
            background: purple;
            color: white;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .btn {
            padding: 8px 12px;
            border: none;
            cursor: pointer;
            color: white;
            text-decoration: none;
        }
        .edit {
            background: #4CAF50;
        }
        .delete {
            background: #f44336;
        }
        .btn:hover {
            opacity: 0.9;
        }
        form {
            width: 80%;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            background: #f9f9f9;
            box-shadow: 0 0 10px #ccc;
        }
        label {
            display: block;
            margin-bottom: 8px;
        }
        input {
            width: 100%;
            padding: 8px;
            margin-bottom: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background: #45a049;
        }
        .back-link {
            display: block;
            text-align: center;
            margin: 20px;
            color: #007BFF;
            text-decoration: none;
            font-size: 16px;
        }
        .back-link:hover {
            color: #0056b3;
        }
    </style>
</head>
<body>

<h2>Manage Your Expenses</h2>

<!-- Edit Form -->
<?php if ($edit_data): ?>
    <form method="POST" action="edit_expense1.php">
        <input type="hidden" name="update_id" value="<?= $edit_data['id'] ?>">
        
        <label for="expense_date">Date:</label>
        <input type="date" name="expense_date" value="<?= htmlspecialchars($edit_data['date']) ?>" required>

        <label for="source">Source:</label>
        <input type="text" name="source" value="<?= htmlspecialchars($edit_data['source']) ?>" required>

        <label for="amount">Amount:</label>
        <input type="number" step="0.01" name="amount" value="<?= htmlspecialchars($edit_data['amount']) ?>" required>

        <button type="submit">Save</button>
        <a href="edit_expense1.php" class="btn">Cancel</a>
    </form>
<?php endif; ?>

<!-- Display Expense Records -->
<?php if ($result->num_rows > 0): ?>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($row['date']) ?></td>
                <td><?= htmlspecialchars($row['source']) ?></td>
                <td>₹<?= number_format($row['amount'], 2) ?></td>
                <td>
                    <a href="?edit_id=<?= $row['id'] ?>" class="btn edit">Edit</a>
                    <a href="?delete_id=<?= $row['id'] ?>" class="btn delete" onclick="return confirm('Are you sure?')">Delete</a>
                </td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>
<?php else: ?>
    <p style="text-align: center; color: red;">No expense records found!</p>
<?php endif; ?>

<!-- Go Back to Dashboard Link -->
<a href="dashboard.html" class="back-link"> Go Back to Dashboard</a>

<?php
$stmt->close();
$conn->close();
?>

</body>
</html>
