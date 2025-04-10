<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST['first_name']) && !empty($_POST['last_name']) && !empty($_POST['gender']) &&
        !empty($_POST['email']) && !empty($_POST['phone']) && !empty($_POST['username']) && 
        !empty($_POST['password']) && !empty($_POST['role'])) {

        $first_name = $conn->real_escape_string($_POST['first_name']);
        $last_name = $conn->real_escape_string($_POST['last_name']);
        $gender = $conn->real_escape_string($_POST['gender']);
        $email = $conn->real_escape_string($_POST['email']);
        $phone = $conn->real_escape_string($_POST['phone']);
        $username = $conn->real_escape_string($_POST['username']);
        $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
        $role = $conn->real_escape_string($_POST['role']);

        // Check for existing email
        $emailCheck = $conn->prepare("SELECT id FROM users1 WHERE email = ?");
        $emailCheck->bind_param("s", $email);
        $emailCheck->execute();
        $emailResult = $emailCheck->get_result();

        // Check for existing username
        $usernameCheck = $conn->prepare("SELECT id FROM users1 WHERE username = ?");
        $usernameCheck->bind_param("s", $username);
        $usernameCheck->execute();
        $usernameResult = $usernameCheck->get_result();

        if ($emailResult->num_rows > 0 && $usernameResult->num_rows > 0) {
            // Both email and username exist
            echo "<script>alert('Email and Username already exist! Please use different details.'); window.location.href='register.html';</script>";
        } elseif ($emailResult->num_rows > 0) {
            // Only email exists
            echo "<script>alert('Email already exists! Please use a different email.'); window.location.href='register.html';</script>";
        } elseif ($usernameResult->num_rows > 0) {
            // Only username exists
            echo "<script>alert('Username already exists! Please use a different username.'); window.location.href='register.html';</script>";
        } else {
            // Proceed with insertion
            $stmt = $conn->prepare("INSERT INTO users1 (first_name, last_name, gender, email, phone, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssssss", $first_name, $last_name, $gender, $email, $phone, $username, $password, $role);

            if ($stmt->execute()) {
                echo "<script>alert('Registration successful!'); window.location.href='login.html';</script>";
            } else {
                echo "<script>alert('An error occurred. Please try again.'); window.location.href='register.html';</script>";
            }
            $stmt->close();
        }

        $emailCheck->close();
        $usernameCheck->close();
    } else {
        echo "<script>alert('Please fill in all required fields!'); window.history.back();</script>";
    }
}

$conn->close();
?>
