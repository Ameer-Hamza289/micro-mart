#!/bin/bash

echo "Starting Micro-Mart applications..."

# Function to run each app in background
run_app() {
    local app_name=$1
    local app_dir=$2
    echo "Starting $app_name..."
    (cd $app_dir && npm start) &
}

# Start each micro-frontend
run_app "Root Config" "root-config"
run_app "Shell App" "shell-app"
run_app "Header App" "header-app"
run_app "Home Page App" "home-page-app"
run_app "Product Catalog" "product-catalog-app"
run_app "Product Details" "product-details-app"
run_app "Cart App" "cart-app"
run_app "User Auth" "user-auth-app"
run_app "Shared Utils" "shared-utils"

echo "All applications started. Access the app at http://localhost:9000"
echo "Press Ctrl+C to stop all applications"

# Wait for all background processes
wait 