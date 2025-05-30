@echo off
echo Starting Q&A Application for network access...
echo.

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found_ip
)
:found_ip
set IP=%IP:~1%

echo Your local IP address is: %IP%
echo.
echo To access the application from other devices on your network:
echo Client: http://%IP%:5173
echo Server: http://%IP%:3000
echo.

REM Start the server in a new window
start cmd /k "cd server && npm start"

REM Wait a moment for the server to start
timeout /t 3 /nobreak > nul

REM Start the client in a new window
start cmd /k "cd client && npm run dev"

echo.
echo Application started! Press any key to exit this window...
pause > nul
