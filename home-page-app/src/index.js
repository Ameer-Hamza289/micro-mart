import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import './styles.css';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Home page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong on the home page.</div>;
    }
    return this.props.children;
  }
}

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Wait a bit for shared-utils to be available
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { globalState } = await System.import('@micro-mart/shared-utils');
        
        // Subscribe to products and user data
        const productsSubscription = globalState.products.subscribe((products) => {
          // Get featured products (first 6 products)
          const featured = products.slice(0, 6);
          setFeaturedProducts(featured);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(products.map(p => p.category))];
          setCategories(uniqueCategories);
          
          setIsLoading(false);
        });

        const userSubscription = globalState.user.subscribe((userData) => {
          setUser(userData);
        });

        return () => {
          productsSubscription.unsubscribe();
          userSubscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing home page:', error);
        setIsLoading(false);
      }
    };

    initializeServices();
  }, []);

  const navigateToProducts = (category = null) => {
    const url = category ? `/products?category=${category}` : '/products';
    history.pushState(null, null, url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const navigateToProduct = (productId) => {
    history.pushState(null, null, `/product/${productId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const addToCart = async (product) => {
    try {
      const { cartService } = await System.import('@micro-mart/shared-utils');
      cartService.addToCart(product);
      
      // Show feedback
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="home-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Micro-Mart</h1>
            <p>Your ultimate destination for quality products at amazing prices</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
            </div>
            <div className="hero-buttons">
              <button onClick={() => navigateToProducts()} className="btn-primary">
                Shop Now
              </button>
              {!user && (
                <button 
                  onClick={() => {
                    history.pushState(null, null, '/auth');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }} 
                  className="btn-secondary"
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="floating-card">🛒</div>
              <div className="floating-card">💳</div>
              <div className="floating-card">🚚</div>
              <div className="floating-card">⭐</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Explore our wide range of product categories</p>
        </div>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={category} className="category-card" onClick={() => navigateToProducts(category)}>
              <div className="category-icon">
                {getCategoryIcon(category)}
              </div>
              <h3>{category}</h3>
              <p>Discover amazing {category.toLowerCase()} products</p>
              <button className="category-btn">
                Explore {category}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked products just for you</p>
        </div>
        <div className="featured-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="featured-card">
              <div className="featured-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onClick={() => navigateToProduct(product.id)}
                />
                <div className="featured-badge">Featured</div>
              </div>
              <div className="featured-info">
                <div className="featured-category">{product.category}</div>
                <h4 onClick={() => navigateToProduct(product.id)}>{product.name}</h4>
                <div className="featured-price">${product.price.toFixed(2)}</div>
                <button 
                  onClick={() => addToCart(product)}
                  className="featured-add-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="section-footer">
          <button onClick={() => navigateToProducts()} className="view-all-btn">
            View All Products
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Micro-Mart?</h2>
          <p>We provide the best shopping experience for our customers</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Free shipping on orders over $50. Fast and reliable delivery worldwide.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payment</h3>
            <p>Your payment information is safe with our advanced security measures.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">↩️</div>
            <h3>Easy Returns</h3>
            <p>30-day return policy. Not satisfied? Return it hassle-free.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Quality Products</h3>
            <p>Carefully curated products from trusted brands and sellers.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for the latest deals and product updates</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
          <div className="newsletter-benefits">
            <span>✨ Exclusive deals</span>
            <span>📦 New arrivals</span>
            <span>🏷️ Special offers</span>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (category) => {
  const icons = {
    'Electronics': '📱',
    'Home': '🏠',
    'Sports': '⚽',
    'Books': '📚',
    'Clothing': '👕',
    'Toys': '🧸',
    'Beauty': '💄',
    'Health': '💊'
  };
  return icons[category] || '🛍️';
};

const HomePageWithErrorBoundary = () => (
  <ErrorBoundary>
    <HomePage />
  </ErrorBoundary>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: HomePageWithErrorBoundary,
  errorBoundary(err, info, props) {
    console.error('Home page error boundary:', err, info);
    return <div>Home page failed to load</div>;
  },
  domElementLocation: (props) => {
    // Check if we're in standalone mode
    if (props && props.domElement) {
      return props.domElement;
    }
    
    // Use the container provided by shell app
    let container = document.getElementById('home-page-container');
    if (!container) {
      // Fallback: wait for shell to create it
      const checkForContainer = () => {
        container = document.getElementById('home-page-container');
        if (container) return container;
        
        // If still not found, create it temporarily
        container = document.createElement('div');
        container.id = 'home-page-container';
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.appendChild(container);
        } else {
          document.body.appendChild(container);
        }
        return container;
      };
      return checkForContainer();
    }
    return container;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

// Support for standalone mode (when accessed directly via localhost:8087)
if (typeof window !== 'undefined' && !window.singleSpaNavigate) {
  // We're in standalone mode
  console.log('Home page running in standalone mode');
} 