import { BehaviorSubject } from 'rxjs';

// Global state management
export const globalState = {
  cart: new BehaviorSubject([]),
  user: new BehaviorSubject(null),
  products: new BehaviorSubject([]),
};

// Cart management
export const cartService = {
  addToCart: (product) => {
    const currentCart = globalState.cart.value;
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    
    globalState.cart.next([...currentCart]);
  },
  
  removeFromCart: (productId) => {
    const currentCart = globalState.cart.value;
    const updatedCart = currentCart.filter(item => item.id !== productId);
    globalState.cart.next(updatedCart);
  },
  
  updateQuantity: (productId, quantity) => {
    const currentCart = globalState.cart.value;
    const item = currentCart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        globalState.cart.next([...currentCart]);
      }
    }
  },
  
  getCartTotal: () => {
    return globalState.cart.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  clearCart: () => {
    globalState.cart.next([]);
  }
};

// Enhanced sample products data
export const sampleProducts = [
  { 
    id: 1, 
    name: 'MacBook Pro 16"', 
    price: 2399.99, 
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop',
    category: 'Electronics',
    description: 'Powerful laptop for professionals'
  },
  { 
    id: 2, 
    name: 'iPhone 15 Pro', 
    price: 999.99, 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=300&fit=crop',
    category: 'Electronics',
    description: 'Latest iPhone with advanced features'
  },
  { 
    id: 3, 
    name: 'Sony WH-1000XM5', 
    price: 349.99, 
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=300&fit=crop',
    category: 'Electronics',
    description: 'Premium noise-canceling headphones'
  },
  { 
    id: 4, 
    name: 'Breville Espresso Machine', 
    price: 799.99, 
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop',
    category: 'Home',
    description: 'Professional-grade espresso maker'
  },
  { 
    id: 5, 
    name: 'Nike Air Max 270', 
    price: 159.99, 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=300&fit=crop',
    category: 'Sports',
    description: 'Comfortable running shoes'
  },
  { 
    id: 6, 
    name: 'Clean Code Book', 
    price: 29.99, 
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=300&fit=crop',
    category: 'Books',
    description: 'Essential programming guide'
  },
  { 
    id: 7, 
    name: 'Samsung 4K Smart TV', 
    price: 1299.99, 
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=300&fit=crop',
    category: 'Electronics',
    description: '65" Crystal UHD Smart TV'
  },
  { 
    id: 8, 
    name: 'KitchenAid Stand Mixer', 
    price: 449.99, 
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
    category: 'Home',
    description: 'Professional stand mixer for baking'
  },
];

// Initialize products
globalState.products.next(sampleProducts);

// User authentication with demo credentials
export const authService = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        // Demo credentials
        const validCredentials = [
          { email: 'demo@micromart.com', password: 'demo123', name: 'Demo User' },
          { email: 'john@example.com', password: 'password123', name: 'John Doe' },
          { email: 'admin@micromart.com', password: 'admin123', name: 'Admin User' },
        ];

        const user = validCredentials.find(
          cred => cred.email === email && cred.password === password
        );

        if (user) {
          const userData = { 
            id: Math.floor(Math.random() * 1000), 
            email: user.email, 
            name: user.name 
          };
          
          globalState.user.next(userData);
          localStorage.setItem('micro-mart-user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },
  
  register: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo, just simulate registration and auto-login
        const newUser = {
          id: Math.floor(Math.random() * 1000),
          email: userData.email,
          name: userData.name
        };
        
        globalState.user.next(newUser);
        localStorage.setItem('micro-mart-user', JSON.stringify(newUser));
        resolve(newUser);
      }, 1000);
    });
  },
  
  logout: () => {
    globalState.user.next(null);
    localStorage.removeItem('micro-mart-user');
    // Optionally clear cart on logout
    // cartService.clearCart();
  },
  
  checkAuth: () => {
    const user = localStorage.getItem('micro-mart-user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        globalState.user.next(userData);
        return userData;
      } catch (error) {
        localStorage.removeItem('micro-mart-user');
        return null;
      }
    }
    return null;
  },

  getCurrentUser: () => {
    return globalState.user.value;
  }
};