SHOW DATABASES;
CREATE DATABASE expense_navigator;
USE expense_navigator;

SELECT * FROM users;
SELECT * FROM income;
SELECT * FROM expenses;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    gender VARCHAR(10),
    email VARCHAR(100),
    phone VARCHAR(15),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE income (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,  -- Added user_id column
    date DATE,
    job_title VARCHAR(100),
    amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,  -- Added user_id column
    date DATE,
    source VARCHAR(100),
    amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

USE expense_navigator;

ALTER TABLE users
ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
DESCRIBE users;

SHOW TABLES;
DESCRIBE users;
DESCRIBE income;
DESCRIBE expenses;
