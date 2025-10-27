@echo off
cls
echo.
echo ================================================================
echo           ExpenseNavigator - Server Startup
echo ================================================================
echo.

REM Check Node.js version
echo Checking Node.js version...
node --version > temp_version.txt
set /p NODE_VERSION=<temp_version.txt
del temp_version.txt

echo Current Node.js version: %NODE_VERSION%
echo.

REM Check if Node.js 22 is being used
echo %NODE_VERSION% | findstr /C:"v22." >nul
if %errorlevel% == 0 (
    echo.
    echo ================================================================
    echo   WARNING: Node.js v22 detected!
    echo ================================================================
    echo.
    echo   Node.js v22 has SSL/TLS compatibility issues with MongoDB Atlas.
    echo   This will cause "Server error occurred during login" errors.
    echo.
    echo   RECOMMENDED ACTION:
    echo   1. Download Node.js v20 LTS from https://nodejs.org
    echo   2. Uninstall Node.js v22
    echo   3. Install Node.js v20 LTS
    echo   4. Run this script again
    echo.
    echo ================================================================
    echo.
    echo   Press Ctrl+C to cancel, or
    pause
    echo.
    echo   Attempting to start with workarounds...
    echo.
    
    REM Set workaround environment variables
    set NODE_OPTIONS=--tls-min-v1.0
    set NODE_TLS_REJECT_UNAUTHORIZED=0
)

echo Starting ExpenseNavigator server...
echo.
echo Server will be available at: http://localhost:5001
echo.
echo ================================================================
echo.

REM Start the server
node backend/server.js

pause
