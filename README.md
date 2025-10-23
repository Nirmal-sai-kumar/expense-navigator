# Expense Navigator

Expense Navigator is a comprehensive web-based expense management system that streamlines the process of tracking, managing, and analyzing personal and professional expenses. It offers a secure and user-friendly interface for both end users and administrators.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)


## Introduction

Expense Navigator was designed to address the challenges of manual expense tracking. By automating the data entry process and providing intuitive dashboards for both users and administrators, the application simplifies financial management. This project is part of a project-based learning initiative undertaken by Tavva Vinay and Teeti Nirmal Sai Kumar, under the guidance of Dr. B. Srinivas at MVGR College of Engineering.

## Features

- **User Registration & Login:** Secure sign-up and login functionalities.
- **Expense Management:** Add, edit, and delete expense entries.
- **Dashboard Views:** Separate dashboards for users and administrators.
- **Real-time Reporting:** Graphical and tabular reports for expense tracking.
- **Multi-user Support:** Allows collaboration with role-based access control.
- **Data Security:** Secure authentication and session management using PHP and MySQL.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP (Version 7.4 or higher recommended)
- **Database:** MySQL (Version 5.7 or higher)
- **Server Options:** 
  - PHP's built-in development server
  - XAMPP/WAMP/MAMP (Apache + MySQL)

## Project Structure

```
expense-navigator/
├── backend/                     # Backend code
│   └── php/                     # PHP files
│       ├── admin/               # Admin-specific functionality
│       │   ├── admin_dashboard.php
│       │   ├── edit_expense.php
│       │   └── edit_user.php
│       ├── config/              # Configuration files
│       │   └── db.php           # Database connection settings
│       ├── public/              # Public access PHP files
│       │   ├── db_test.php      # Database connection test
│       │   ├── login.php        # Login handler
│       │   ├── logout.php       # Logout handler
│       │   └── register.php     # Registration handler
│       └── user/                # User-specific functionality
│           ├── edit_expense1.php
│           ├── expense.php
│           └── view_expense.php
├── frontend/                    # Frontend code
│   ├── assets/                  # Static resources
│   │   ├── css/                 # Stylesheets
│   │   │   ├── dashboard.css
│   │   │   ├── login.css
│   │   │   ├── register.css
│   │   │   └── styles.css
│   │   ├── images/              # Image files
│   │   └── js/                  # JavaScript files
│   │       └── script.js
│   └── public/                  # HTML entry points
│       ├── dashboard.html
│       ├── index.html
│       ├── login.html
│       └── register.html
├── sql/                         # SQL scripts
│   └── expense_navigator.sql    # Database schema and sample data
├── router.php                   # Router for PHP's built-in server
├── run-server.bat               # Batch file to start the server (Windows)
├── start_server.ps1             # PowerShell script to start the server
└── README.md                    # Project documentation
```

## Prerequisites

Before installing and running Expense Navigator, ensure you have the following prerequisites installed on your system:

1. **PHP** (Version 7.4 or higher)
   - For Windows: Download from [PHP for Windows](https://windows.php.net/download/)
   - For macOS: `brew install php` (using Homebrew)
   - For Linux: `sudo apt install php` (Ubuntu/Debian) or `sudo dnf install php` (Fedora)

2. **MySQL** (Version 5.7 or higher)
   - For Windows: Download MySQL Community Server from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
   - For macOS: `brew install mysql` (using Homebrew)
   - For Linux: `sudo apt install mysql-server` (Ubuntu/Debian) or `sudo dnf install mysql-server` (Fedora)

3. **Git** (optional, for cloning the repository)

## Installation

Follow these steps to set up Expense Navigator on your local system:

1. **Clone or download the repository:**
   ```bash
   git clone https://github.com/Nirmal-sai-kumar/expense-navigator.git
   cd expense-navigator
   ```
   Or download and extract the ZIP file from the repository.

2. **Database Setup:**
   - Start your MySQL server (make sure it's running on port 3306 or 3307)
   - Create a new database:
     ```sql
     CREATE DATABASE expense_navigator;
     ```
   - Import the database schema:
     ```bash
     # Using command line
     mysql -u root -p expense_navigator < sql/expense_navigator.sql
     
     # Or using a GUI tool like phpMyAdmin, MySQL Workbench, etc.
     ```

3. **Configure Database Connection:**
   - Open `backend/php/config/db.php`
   - Update the database connection settings:
     ```php
     $host = '127.0.0.1';       // Use 'localhost' or '127.0.0.1'
     $port = 3307;              // Default is 3306, change if needed
     $username = 'root';        // Your MySQL username
     $password = 'your_password'; // Your MySQL password
     $database = 'expense_navigator';
```

## Running the Application

You can run Expense Navigator using one of the following methods:

### Method 1: Using PHP's Built-in Web Server (Recommended for Development)

1. **Open a terminal/command prompt** and navigate to your project directory:
   ```bash
   cd path/to/expense-navigator
   ```

2. **Start the PHP development server**:
   - Using the command line:
     ```bash
     # Windows
     php -S localhost:8000
     
     # macOS/Linux
     php -S localhost:8000
     ```
   - Or run the provided batch file (Windows):
     ```bash
     run-server.bat
     ```
   - Or run the PowerShell script:
     ```powershell
     .\start_server.ps1
     ```

3. **Access the application** in your web browser:
   - Main page: [http://localhost:8000/frontend/public/index.html](http://localhost:8000/frontend/public/index.html)
   - Login page: [http://localhost:8000/frontend/public/login.html](http://localhost:8000/frontend/public/login.html)
   - Registration page: [http://localhost:8000/frontend/public/register.html](http://localhost:8000/frontend/public/register.html)
   - Test database connection: [http://localhost:8000/backend/php/public/db_test.php](http://localhost:8000/backend/php/public/db_test.php)

### Method 2: Using XAMPP/WAMP/MAMP

1. **Install XAMPP, WAMP, or MAMP** based on your operating system.

2. **Copy the project files** to your web server directory:
   - XAMPP: `C:\xampp\htdocs\expense-navigator\` (Windows)
   - WAMP: `C:\wamp64\www\expense-navigator\` (Windows)
   - MAMP: `/Applications/MAMP/htdocs/expense-navigator/` (macOS)
   - LAMP: `/var/www/html/expense-navigator/` (Linux)

3. **Start Apache and MySQL services** from the control panel.

4. **Access the application** in your web browser:
   - Main page: [http://localhost/expense-navigator/frontend/public/index.html](http://localhost/expense-navigator/frontend/public/index.html)
   - Login page: [http://localhost/expense-navigator/frontend/public/login.html](http://localhost/expense-navigator/frontend/public/login.html)
   - Registration page: [http://localhost/expense-navigator/frontend/public/register.html](http://localhost/expense-navigator/frontend/public/register.html)
   - Test database connection: [http://localhost/expense-navigator/backend/php/public/db_test.php](http://localhost/expense-navigator/backend/php/public/db_test.php)

## Usage

1. **Register a new user** by visiting the registration page.
2. **Log in** with your newly created account.
3. **Add expenses** through the user dashboard.
4. **View and manage expenses** in the user interface.

### Admin Interface

Admins can log in to view, manage, and validate all users' expense data through a dedicated dashboard.

**For testing purposes, use the following admin credentials:**

- **Username:** admin
- **Password:** admin

## Testing

To verify your setup is working correctly:

1. **Test the database connection** by visiting the db_test.php page:
   - PHP Built-in Server: [http://localhost:8000/backend/php/public/db_test.php](http://localhost:8000/backend/php/public/db_test.php)
   - XAMPP/WAMP/MAMP: [http://localhost/expense-navigator/backend/php/public/db_test.php](http://localhost/expense-navigator/backend/php/public/db_test.php)

2. **Try registering a new user** and logging in.

3. **Add a test expense** to verify that database operations are working correctly.

4. **Test admin functionalities** using the admin credentials.

## Troubleshooting

If you encounter any issues while setting up or running Expense Navigator, try the following solutions:

### Database Connection Issues

1. **Verify MySQL is running** and accessible on the configured port.
2. **Check database credentials** in `backend/php/config/db.php`.
3. **Make sure the database exists** and has been properly imported.
4. **Try connecting with a different client** to verify the MySQL server is working correctly.

### Page Not Found or Blank Pages

1. **Enable PHP error reporting** by adding these lines at the top of PHP files:
   ```php
   ini_set('display_errors', 1);
   ini_set('display_startup_errors', 1);
   error_reporting(E_ALL);
   ```

2. **Check file paths** in include statements and HTML links.
3. **Verify the server is running** and accessible at the expected URL.
4. **Clear browser cache** or try in incognito/private browsing mode.

### Form Submission Problems

1. **Check form action URLs** to ensure they're pointing to the correct handlers.
2. **Inspect browser console** for JavaScript errors.
3. **Verify POST/GET variables** are being received by form handlers.
