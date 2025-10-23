@echo off
:: Start script for ExpenseNavigator with PHP built-in server
echo Starting ExpenseNavigator with PHP built-in server...
echo Server address: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
php -S localhost:8000 -t . router.php