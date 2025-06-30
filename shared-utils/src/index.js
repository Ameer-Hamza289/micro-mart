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
      item.quantity = quantity;
      globalState.cart.next([...currentCart]);
    }
  },
  
  getCartTotal: () => {
    return globalState.cart.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
};

// Sample products data
export const sampleProducts = [
  { id: 1, name: 'Laptop', price: 999.99, image: 'https://via.placeholder.com/300x200', category: 'Electronics' },
  { id: 2, name: 'Smartphone', price: 599.99, image: 'https://via.placeholder.com/300x200', category: 'Electronics' },
  { id: 3, name: 'Headphones', price: 199.99, image: 'https://via.placeholder.com/300x200', category: 'Electronics' },
  { id: 4, name: 'Coffee Maker', price: 89.99, image: 'https://via.placeholder.com/300x200', category: 'Home' },
  { id: 5, name: 'Running Shoes', price: 129.99, image: 'https://via.placeholder.com/300x200', category: 'Sports' },
  { id: 6, name: 'Book', price: 19.99, image: 'https://via.placeholder.com/300x200', category: 'Books' },
];

// Initialize products
globalState.products.next(sampleProducts);

// User authentication
export const authService = {
  login: (email, password) => {
    // Simulate login
    const user = { id: 1, email, name: 'John Doe' };
    globalState.user.next(user);
    localStorage.setItem('micro-mart-user', JSON.stringify(user));
    return Promise.resolve(user);
  },
  
  logout: () => {
    globalState.user.next(null);
    localStorage.removeItem('micro-mart-user');
  },
  
  checkAuth: () => {
    const user = localStorage.getItem('micro-mart-user');
    if (user) {
      globalState.user.next(JSON.parse(user));
    }
  }
};