# PowerShell start script for ExpenseNavigator
Write-Host "Starting ExpenseNavigator with PHP built-in server..." -ForegroundColor Green
Write-Host "Server address: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
php -S localhost:8000 -t . router.php