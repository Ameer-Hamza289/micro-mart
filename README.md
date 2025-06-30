# Micro-Mart - Micro-Frontend E-commerce Application

A modern e-commerce application built using **true micro-frontend architecture** with Single-SPA and React 18. Each micro-frontend can run **independently** or be **orchestrated together** for the complete experience.

## 🏗️ Architecture Overview

This application demonstrates a complete micro-frontend implementation where **each component is truly independent**:

### 🚀 Micro-Frontends

| **Micro-Frontend** | **Port** | **Standalone URL** | **Description** |
|-------------------|----------|-------------------|-----------------|
| 🏠 **Home Page** | 8087 | http://localhost:8087 | Landing page with hero section, featured products, and categories |
| 🛍️ **Product Catalog** | 8082 | http://localhost:8082 | Product listing with search, filtering, and sorting |
| 🛒 **Shopping Cart** | 8084 | http://localhost:8084 | Cart management with coupon system |
| 🧭 **Header** | 8081 | http://localhost:8081 | Navigation header with cart count and user status |
| 📱 **Product Details** | 8083 | http://localhost:8083 | Individual product detail pages |
| 🔐 **User Auth** | 8085 | http://localhost:8085 | Login and registration forms |
| 🏗️ **Shell App** | 8080 | http://localhost:8080 | Main application shell and layout |
| ⚙️ **Shared Utils** | 8086 | http://localhost:8086 | Shared services, state management, and utilities |
| 🎯 **Root Config** | 9000 | http://localhost:9000 | **Main orchestrated app** |

### 🛣️ Routing Structure

- **`/`** - Home page with welcome content, hero section, and featured products
- **`/products`** - Full product catalog with search and filtering
- **`/products?category=Sports`** - Filtered products by category (works from home page!)
- **`/product/:id`** - Individual product details
- **`/cart`** - Shopping cart and checkout
- **`/auth`** - User authentication (login/register)

## ✨ Features

### 🏠 Home Page
- **Hero Section** with company stats and animated floating cards
- **Category Browse Cards** that navigate to filtered product views
- **Featured Products** showcase with quick add-to-cart functionality
- **Company Features** section highlighting benefits
- **Newsletter Subscription** form

### 🛍️ Product Catalog
- **Advanced Search** functionality across product names and descriptions
- **Category Filtering** with automatic URL parameter support
- **Multi-Criteria Sorting** (price, name, rating)
- **Responsive Product Grid** with hover effects
- **Quick Add-to-Cart** from product cards

### 🛒 Shopping Cart
- **Real-time Cart Updates** across all micro-frontends
- **Quantity Management** with live total calculations
- **Coupon System** with multiple discount codes:
  - `SAVE10` - 10% discount
  - `WELCOME20` - 20% discount for new users
  - `STUDENT15` - 15% student discount
- **Order Summary** with tax and shipping calculations

### 🔐 User Authentication
- **Login and Registration** forms with validation
- **Demo Credentials**: `demo@micromart.com` / `demo123`
- **Persistent Login State** across micro-frontends
- **Social Login** placeholders (Google, Facebook, Twitter)

### 🎨 Responsive Design
- **Mobile-First** responsive design
- **Modern Gradient** color scheme with purple/blue theme
- **Smooth Animations** and hover effects
- **Optimized** for all screen sizes

## 🚀 Technology Stack

- **Framework**: React 18 with Single-SPA
- **State Management**: RxJS for reactive state sharing
- **Bundling**: Webpack 5 with Module Federation
- **Styling**: CSS3 with modern features (Grid, Flexbox, Gradients)
- **Development**: Hot reloading and live development servers
- **Architecture**: True micro-frontend independence

## ⚡ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 🎯 Quick Start - Full Application

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start all applications:**
   
   **Option A - Using concurrently (Recommended):**
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

3. **Access the full application:**
   Open **http://localhost:9000** in your browser

### 🔧 Individual Micro-Frontend Development

Each micro-frontend can be developed and tested **independently**:

#### Start Individual Apps:
```bash
# Shared Utils (start this first for full functionality)
cd shared-utils && npm start     # Port 8086

# Any individual micro-frontend
cd home-page-app && npm start          # Port 8087
cd product-catalog-app && npm start   # Port 8082
cd cart-app && npm start              # Port 8084
cd header-app && npm start            # Port 8081
cd product-details-app && npm start   # Port 8083
cd user-auth-app && npm start         # Port 8085
cd shell-app && npm start             # Port 8080
```

#### Standalone Features:
✅ **Independent HTML Pages** - Each micro-frontend has its own HTML template  
✅ **Standalone Headers** - Shows which micro-frontend you're viewing  
✅ **Context Notices** - Explains standalone vs orchestrated mode  
✅ **Full Functionality** - Each works independently (with shared-utils)  
✅ **Quick Navigation** - Links to full orchestrated experience  

### 📦 Manual Installation & Start

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

## 🎮 Development Workflow

### Adding New Features
1. **Shared functionality** → Add to `shared-utils`
2. **UI components** → Keep self-contained within respective micro-frontends
3. **State sharing** → Use RxJS observables in shared-utils
4. **Navigation** → Use HTML5 history API between micro-frontends

### State Management
The application uses **RxJS** for reactive state management:
- `globalState.products` - Product catalog and search state
- `globalState.cart` - Shopping cart items and totals
- `globalState.user` - User authentication state

### Demo Data
The application includes **realistic demo data**:
- 20+ sample products across multiple categories
- Product images, descriptions, and specifications
- User authentication with demo credentials
- Working coupon codes for testing checkout flow

## 🧪 Testing Guide

### Full Application Testing:
1. **Main App**: Visit http://localhost:9000
2. **Home Page**: Test hero section, category navigation, featured products
3. **Category Navigation**: Click category cards → should filter products
4. **Product Browsing**: Search, filter, and sort products
5. **Cart Functionality**: Add items, apply coupon codes
6. **Authentication**: Use `demo@micromart.com` / `demo123`

### Individual Micro-Frontend Testing:
1. **Start shared-utils**: `cd shared-utils && npm start`
2. **Start any micro-frontend**: `cd home-page-app && npm start`
3. **Visit standalone URL**: http://localhost:8087
4. **Test isolated functionality**: Each component works independently

## 🏗️ Production Build

Build all applications for production:

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

## 💡 Architecture Benefits

This **true micro-frontend architecture** provides:

✅ **Independent Development** - Teams can work on different features simultaneously  
✅ **Technology Flexibility** - Each micro-frontend can use different technologies  
✅ **Scalable Deployments** - Individual applications can be deployed independently  
✅ **Fault Isolation** - Issues in one micro-frontend don't crash the entire application  
✅ **Team Autonomy** - Different teams can own different parts of the application  
✅ **Individual Testing** - Test components in complete isolation  
✅ **Incremental Migration** - Gradually migrate from monolith to micro-frontends  

## 🔧 Advanced Features

### URL Parameter Handling
- **Category filtering** from home page works seamlessly
- **Product details** can be accessed directly via URL
- **Deep linking** supported across all micro-frontends

### Error Boundaries
- **Individual error isolation** - One component failure doesn't crash others
- **Graceful degradation** - Failed components show helpful error messages
- **Development debugging** - Detailed error logging in development mode

### Performance Optimizations
- **Lazy loading** of product images
- **Efficient re-rendering** with React hooks
- **Minimal bundle sizes** with webpack optimization
- **CDN loading** of common dependencies (React, ReactDOM)

## 🎯 Project Structure

```
micro-mart/
├── root-config/          # Single-SPA orchestration (Port 9000)
├── shell-app/           # Application layout (Port 8080)
├── header-app/          # Navigation header (Port 8081)
├── home-page-app/       # Landing page (Port 8087) ✨ NEW
├── product-catalog-app/ # Product listing (Port 8082)
├── product-details-app/ # Product details (Port 8083)
├── cart-app/           # Shopping cart (Port 8084)
├── user-auth-app/      # Authentication (Port 8085)
├── shared-utils/       # Shared services (Port 8086)
├── start.bat           # Windows start script
├── start.sh            # Unix start script
└── package.json        # Root package with scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across all micro-frontends (both standalone and orchestrated)
5. Submit a pull request

## 📚 Additional Resources

- **MICRO-FRONTEND-STANDALONE.md** - Detailed standalone mode documentation
- **Individual README files** - Each micro-frontend has specific documentation
- **Demo credentials** - Available in individual app standalone pages

## 📄 License

MIT License - see LICENSE file for details

---

## 🌟 Key Highlights

🚀 **True Micro-Frontend Architecture** - Each component is genuinely independent  
🏠 **Dedicated Home Page** - Professional landing page separate from product catalog  
🔄 **Seamless Category Navigation** - Click category → filtered products automatically  
⚡ **Standalone + Orchestrated** - Best of both worlds  
🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations  
🛍️ **Complete E-commerce** - Full shopping experience with cart, coupons, auth  

**Happy coding!** 🚀 Visit any individual port to see micro-frontends in action, or http://localhost:9000 for the complete experience! 