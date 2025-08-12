@echo off
echo Starting Electricity Record App...

echo Starting backend server on port 5000...
start "Backend Server" cmd /k "npm run server"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend on port 3000...
start "Frontend Server" cmd /k "cd client && set PORT=3000 && npm start"

echo Both servers should now be running:
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
echo Press any key to exit this script...
pause > nul 