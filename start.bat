@echo off
echo Starting Micro-Mart applications...

REM Start each micro-frontend in a new terminal window
start "Root Config" cmd /k "cd root-config && npm start"
start "Shell App" cmd /k "cd shell-app && npm start"
start "Header App" cmd /k "cd header-app && npm start"
start "Home Page App" cmd /k "cd home-page-app && npm start"
start "Product Catalog" cmd /k "cd product-catalog-app && npm start"
start "Product Details" cmd /k "cd product-details-app && npm start"
start "Cart App" cmd /k "cd cart-app && npm start"
start "User Auth" cmd /k "cd user-auth-app && npm start"
start "Shared Utils" cmd /k "cd shared-utils && npm start"

echo All applications started. Access the app at http://localhost:9000
pause 