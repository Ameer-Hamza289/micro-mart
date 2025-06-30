@echo off
echo 🛒 Starting Micro-Mart E-commerce Application...
echo.
echo Installing dependencies...
call npm install
call npm run install-all
echo.
echo Starting all micro-frontends...
echo.
echo The application will be available at: http://localhost:9000
echo.
echo Demo Credentials:
echo Email: demo@micromart.com
echo Password: demo123
echo.
call npm start 