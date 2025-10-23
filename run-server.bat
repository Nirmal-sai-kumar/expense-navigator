@echo off
echo Starting ExpenseNavigator with PHP built-in server...
echo Server address: http://localhost:8000
echo Press Ctrl+C to stop the server

cd /d "%~dp0"
php -S localhost:8000