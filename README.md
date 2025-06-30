# 🛒 Micro-Mart - Micro-Frontend E-commerce Application

A modern, scalable e-commerce application built using micro-frontend architecture with Single-SPA and React.

## 🏗️ Architecture

This project demonstrates a complete micro-frontend implementation with the following applications:

- **Root Config** (Port 9000): Main orchestrator that manages all micro-frontends
- **Shell App** (Port 8080): Layout container and global styling
- **Header App** (Port 8081): Navigation header with cart count and user authentication
- **Product Catalog** (Port 8082): Product listing with search and filtering
- **Product Details** (Port 8083): Detailed product view with specifications
- **Cart App** (Port 8084): Shopping cart with checkout functionality
- **User Auth** (Port 8085): Login and registration forms
- **Shared Utils** (Port 8086): Shared state management and services

## ✨ Features

### 🎨 Modern UI/UX
- Beautiful, responsive design with CSS Grid and Flexbox
- Smooth animations and transitions
- Mobile-first responsive layout
- Modern gradient color schemes

### 🛍️ E-commerce Functionality
- Product catalog with search and filtering
- Detailed product pages with image galleries
- Shopping cart with quantity management
- Coupon system with discounts
- User authentication (login/register)
- Real-time cart updates across all components

### 🔧 Technical Features
- Micro-frontend architecture with Single-SPA
- React 18 with hooks and modern patterns
- Shared state management with RxJS
- Module federation for micro-frontend communication
- TypeScript-ready webpack configurations
- Hot module replacement for development

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd micro-mart
   ```

2. **Install all dependencies**
   ```bash
   npm install
   npm run install-all
   ```

3. **Start all applications**
   ```bash
   npm start
   ```

   This will start all micro-frontends concurrently on their respective ports.

4. **Access the application**
   Open your browser and navigate to: `http://localhost:9000`

## 🔐 Demo Credentials

Use these credentials to test the authentication:

- **Email:** `demo@micromart.com`
- **Password:** `demo123`

Alternative credentials:
- `john@example.com` / `password123`
- `admin@micromart.com` / `admin123`

## 📱 Application Structure

```
micro-mart/
├── root-config/          # Main orchestrator (Single-SPA root)
├── shell-app/           # Layout and global styles
├── header-app/          # Navigation and user menu
├── product-catalog-app/ # Product listing and search
├── product-details-app/ # Individual product pages
├── cart-app/           # Shopping cart functionality
├── user-auth-app/      # Authentication forms
├── shared-utils/       # Shared services and state
└── package.json        # Root package with scripts
```

## 🛠️ Development

### Running Individual Applications

Each micro-frontend can be run independently:

```bash
# Root config
cd root-config && npm start

# Shell app
cd shell-app && npm start

# Header
cd header-app && npm start

# Product catalog
cd product-catalog-app && npm start

# Product details
cd product-details-app && npm start

# Cart
cd cart-app && npm start

# User authentication
cd user-auth-app && npm start

# Shared utilities
cd shared-utils && npm start
```

### Port Configuration

| Application | Port | URL |
|-------------|------|-----|
| Root Config | 9000 | http://localhost:9000 |
| Shell App | 8080 | http://localhost:8080 |
| Header App | 8081 | http://localhost:8081 |
| Product Catalog | 8082 | http://localhost:8082 |
| Product Details | 8083 | http://localhost:8083 |
| Cart App | 8084 | http://localhost:8084 |
| User Auth | 8085 | http://localhost:8085 |
| Shared Utils | 8086 | http://localhost:8086 |

## 🎯 Usage Guide

### 1. **Home Page**
- Navigate to `http://localhost:9000`
- Browse the product catalog
- Use search and filters to find products

### 2. **Product Details**
- Click on any product to view details
- See product specifications and features
- Add items to cart with quantity selection

### 3. **Shopping Cart**
- Click the cart icon in the header
- Manage quantities and remove items
- Apply coupon codes for discounts
- Try coupon codes: `SAVE10`, `WELCOME20`, `STUDENT15`

### 4. **User Authentication**
- Click "Login" in the header
- Use demo credentials or register new account
- Toggle between login and registration forms

### 5. **Navigation**
- Use the header navigation to move between sections
- Browser back/forward buttons work correctly
- Cart count updates in real-time

## 🔧 Customization

### Adding New Products
Edit `shared-utils/src/index.js` and modify the `sampleProducts` array:

```javascript
export const sampleProducts = [
  {
    id: 9,
    name: 'Your Product',
    price: 99.99,
    image: 'https://your-image-url.com',
    category: 'Your Category',
    description: 'Your product description'
  },
  // ... other products
];
```

### Styling
Each micro-frontend has its own CSS file that can be customized:
- `header-app/src/styles.css`
- `product-catalog-app/src/styles.css`
- `cart-app/src/styles.css`
- etc.

### Adding New Routes
Modify `root-config/src/index.js` to add new route patterns:

```javascript
registerApplication({
  name: '@micro-mart/new-app',
  app: () => System.import('@micro-mart/new-app'),
  activeWhen: location => location.pathname.startsWith('/new-route'),
});
```

## 🏗️ Building for Production

```bash
npm run build
```

This will create production builds for all micro-frontends.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📦 Technologies Used

- **Single-SPA**: Micro-frontend framework
- **React 18**: UI library
- **RxJS**: Reactive state management
- **Webpack 5**: Module bundler
- **Babel**: JavaScript transpiler
- **CSS3**: Styling with modern features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🎉 Features Showcase

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Cart updates across all components instantly
- **Modern Animations**: Smooth transitions and hover effects
- **Search & Filter**: Advanced product filtering capabilities
- **User Authentication**: Secure login/logout functionality
- **Shopping Cart**: Full cart management with coupons
- **Product Details**: Rich product pages with image galleries
- **Micro-frontend Architecture**: Truly independent, deployable components

---

**Happy coding!** 🚀 If you encounter any issues, please check the console for error messages and ensure all ports are available. 