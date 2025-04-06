# Expense Navigator

Expense Navigator is a comprehensive web-based expense management system that streamlines the process of tracking, managing, and analyzing personal and professional expenses. It offers a secure and user-friendly interface for both end users and administrators.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)


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
- **Backend:** PHP
- **Database:** MySQL
- **Server Environment:** XAMPP (Apache + MySQL)

## Project Structure

expense-navigator/
├── admin/                       # Files specific to the admin panel

│   ├── admin_dashboard.php      # Admin dashboard interface

│   ├── edit_user.php            # Edit user functionality

├── user/                        # Files specific to regular user functionalities

│   ├── dashboard.php            # User dashboard interface

│   ├── view_expense.php         # Viewing expense details

│   ├── edit_expense.php         # Editing expense entries

├── assets/                      # Static resources for the project

│   ├── css/                     # Stylesheets

│   │   ├── styles.css           # Global styles

│   │   ├── dashboard.css        # Dashboard-specific styles

│   │   └── login.css            # Login and registration styles

│   ├── js/                      # JavaScript files

│   │   └── script.js            # General JS functions

│   └── images/                  # Images and screenshots

│       └── logo.png             # Example image file

├── config/                      # Configuration files

│   └── db.php                   # Database connection and configuration

├── sql/                         # SQL scripts for setting up the database

│   └── database.sql             # Database schema and sample data

├── public/                      # Publicly accessible files (if needed)

│   ├── index.php                # Landing page

│   ├── login.php                # Login script and form

│   ├── register.php             # Registration script and form

│   └── logout.php               # Logout functionality

└── README.md                    # Project documentation



Database Setup:

Import the database.sql file into your MySQL server to create the necessary tables.
Update the db.php file with your database credentials.

Run the Project:

Use a local server environment like XAMPP or WAMP.
Place the project folder in the server’s root directory.
Open your browser and navigate to http://localhost/expense-navigator/.

Usage

User Interface:

Register or log in to access your personalized dashboard.
Use the dashboard to add new expenses, view existing records, or update/delete entries.

Admin Interface:

Admins can log in to view, manage, and validate all users' expense data through a dedicated dashboard.
For testing purposes, use the following admin credentials:

Username: admin

Password: admin

Testing

To test the application, ensure your local server is running and perform the following steps:

Register a new user and log in.
Add, edit, and delete expense entries.
Use the provided admin credentials to test the administrative functionalities.
Verify that all functionalities, including database interactions and user authentication, are working as expected.
