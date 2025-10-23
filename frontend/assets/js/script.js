document.addEventListener("DOMContentLoaded", function () {
    // Registration form validation
    document.getElementById("registerForm")?.addEventListener("submit", function (e) {
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            e.preventDefault();
        }
    });

    // Login form validation
    document.getElementById("loginForm")?.addEventListener("submit", function (e) {
        let username = document.getElementById("username").value.trim();
        let password = document.getElementById("password").value.trim();
        
        if (username === "" || password === "") {
            alert("Both fields are required!");
            e.preventDefault();
        }
    });
});
