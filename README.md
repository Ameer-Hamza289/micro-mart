# Micro-Mart - Micro-Frontend E-commerce Application

A modern e-commerce application built using micro-frontend architecture with Single-SPA and React 18.

## Architecture

This application demonstrates a complete micro-frontend architecture with the following applications:

### Micro-Frontends

1. **Root Config** (Port 9000) - Single-SPA root configuration and routing
2. **Shell App** (Port 8080) - Main application shell and layout
3. **Header App** (Port 8081) - Navigation header with cart count and user status
4. **Home Page App** (Port 8087) - Landing page with hero section, featured products, and categories
5. **Product Catalog App** (Port 8082) - Product listing with search, filtering, and sorting
6. **Product Details App** (Port 8083) - Individual product detail pages
7. **Cart App** (Port 8084) - Shopping cart with coupon system
8. **User Auth App** (Port 8085) - User authentication and registration
9. **Shared Utils** (Port 8086) - Shared services, state management, and utilities

### Routing Structure

- `/` - Home page with welcome content and featured products
- `/products` - Full product catalog with search and filtering
- `/product/:id` - Individual product details
- `/cart` - Shopping cart and checkout
- `/auth` - User authentication (login/register)

## Features

### Home Page
- Hero section with company stats and call-to-action buttons
- Browse by category cards with navigation to filtered product views
- Featured products showcase with quick add-to-cart functionality
- Company features and benefits section
- Newsletter subscription form

### Product Catalog
- Advanced search functionality across product names and descriptions
- Category-based filtering with dynamic category extraction
- Multi-criteria sorting (price, name, rating)
- Responsive product grid with hover effects
- Quick add-to-cart from product cards

### Shopping Cart
- Real-time cart updates across all micro-frontends
- Quantity management with live total calculations
- Coupon system with multiple discount codes:
  - `SAVE10` - 10% discount
  - `WELCOME20` - 20% discount for new users
  - `STUDENT15` - 15% student discount
- Order summary with tax and shipping calculations

### User Authentication
- Login and registration forms with validation
- Demo credentials: `demo@micromart.com` / `demo123`
- Persistent login state across micro-frontends
- Social login placeholders (Google, Facebook, Twitter)

### Responsive Design
- Mobile-first responsive design
- Modern gradient color scheme with purple/blue theme
- Smooth animations and hover effects
- Optimized for all screen sizes

## Technology Stack

- **Framework**: React 18 with Single-SPA
- **State Management**: RxJS for reactive state sharing
- **Bundling**: Webpack 5 with Module Federation
- **Styling**: CSS3 with modern features (Grid, Flexbox, Gradients)
- **Development**: Hot reloading and live development servers

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start all applications:**
   
   **Option A - Using concurrently:**
   ```bash
   npm start
   ```
   
   **Option B - Using batch script (Windows):**
   ```bash
   start.bat
   ```
   
   **Option C - Using shell script (Unix/Linux/macOS):**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Access the application:**
   Open http://localhost:9000 in your browser

### Manual Installation & Start

If you prefer to install and start applications individually:

```bash
# Install dependencies for each app
cd root-config && npm install && cd ..
cd shell-app && npm install && cd ..
cd header-app && npm install && cd ..
cd home-page-app && npm install && cd ..
cd product-catalog-app && npm install && cd ..
cd product-details-app && npm install && cd ..
cd cart-app && npm install && cd ..
cd user-auth-app && npm install && cd ..
cd shared-utils && npm install && cd ..

# Start each app (each in a separate terminal)
cd root-config && npm start
cd shell-app && npm start
cd header-app && npm start
cd home-page-app && npm start
cd product-catalog-app && npm start
cd product-details-app && npm start
cd cart-app && npm start
cd user-auth-app && npm start
cd shared-utils && npm start
```

## Application Ports

| Application | Port | Purpose |
|-------------|------|---------|
| Root Config | 9000 | Main entry point and routing |
| Shell App | 8080 | Application layout and shell |
| Header App | 8081 | Navigation and user status |
| Home Page | 8087 | Landing page and featured content |
| Product Catalog | 8082 | Product listing and search |
| Product Details | 8083 | Individual product pages |
| Cart App | 8084 | Shopping cart functionality |
| User Auth | 8085 | Authentication system |
| Shared Utils | 8086 | Shared services and state |

## Development

### Adding New Features
1. Shared functionality should be added to `shared-utils`
2. UI components should be self-contained within their respective micro-frontends
3. State sharing happens through RxJS observables in shared-utils
4. Navigation between micro-frontends uses HTML5 history API

### State Management
The application uses RxJS for reactive state management:
- `globalState.products` - Product catalog and search state
- `globalState.cart` - Shopping cart items and totals
- `globalState.user` - User authentication state

### Demo Data
The application includes realistic demo data:
- 20+ sample products across multiple categories
- Product images, descriptions, and specifications
- User authentication with demo credentials
- Working coupon codes for testing checkout flow

## Testing

Access the application and test:
1. **Home Page**: Visit `/` to see the landing page
2. **Product Browsing**: Click "Products" or category cards to browse
3. **Search**: Use the search bar in the product catalog
4. **Cart**: Add items and test coupon codes
5. **Authentication**: Use `demo@micromart.com` / `demo123` to login

## Production Build

To build all applications for production:

```bash
# Build individual apps
cd root-config && npm run build
cd shell-app && npm run build
cd header-app && npm run build
cd home-page-app && npm run build
cd product-catalog-app && npm run build
cd product-details-app && npm run build
cd cart-app && npm run build
cd user-auth-app && npm run build
cd shared-utils && npm run build
```

## Architecture Benefits

This micro-frontend architecture provides:
- **Independent Development**: Teams can work on different features simultaneously
- **Technology Flexibility**: Each micro-frontend can use different technologies
- **Scalable Deployments**: Individual applications can be deployed independently
- **Fault Isolation**: Issues in one micro-frontend don't crash the entire application
- **Team Autonomy**: Different teams can own different parts of the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across all micro-frontends
5. Submit a pull request

## License

MIT License - see LICENSE file for details 