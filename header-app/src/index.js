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
    console.error('Header app error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong in Header.</div>;
    }
    return this.props.children;
  }
}

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Wait a bit for shared-utils to be available
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { globalState, authService } = await System.import('@micro-mart/shared-utils');
        
        // Subscribe to cart changes
        const cartSubscription = globalState.cart.subscribe((cart) => {
          const count = cart.reduce((total, item) => total + item.quantity, 0);
          setCartCount(count);
        });

        // Subscribe to user changes
        const userSubscription = globalState.user.subscribe((userData) => {
          setUser(userData);
        });

        // Check for existing auth
        authService.checkAuth();
        setIsLoading(false);

        // Cleanup subscriptions
        return () => {
          cartSubscription.unsubscribe();
          userSubscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing header services:', error);
        setIsLoading(false);
      }
    };

    initializeServices();
  }, []);

  const navigateTo = (path) => {
    history.pushState(null, null, path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleLogout = async () => {
    try {
      const { authService } = await System.import('@micro-mart/shared-utils');
      authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return (
      <header className="header loading">
        <div className="header-content">
          <div className="logo-section">
            <h1>🛒 Micro-Mart</h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1 onClick={() => navigateTo('/')} className="logo">
            🛒 Micro-Mart
          </h1>
          <span className="tagline">Your Digital Marketplace</span>
        </div>
        
        <nav className="navigation">
          <button onClick={() => navigateTo('/')} className="nav-link">
            Home
          </button>
          <button onClick={() => navigateTo('/products')} className="nav-link">
            Products
          </button>
          
          <div className="cart-section">
            <button onClick={() => navigateTo('/cart')} className="cart-button">
              <span className="cart-icon">🛒</span>
              <span className="cart-text">Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
          
          <div className="user-section">
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Hello, {user.name}</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => navigateTo('/auth')} className="login-button">
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

const HeaderWithErrorBoundary = () => (
  <ErrorBoundary>
    <Header />
  </ErrorBoundary>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: HeaderWithErrorBoundary,
  errorBoundary(err, info, props) {
    console.error('Header error boundary:', err, info);
    return <div>Header failed to load</div>;
  },
  domElementLocation: () => {
    // Use the container provided by shell app
    let container = document.getElementById('header-container');
    if (!container) {
      // Fallback: wait for shell to create it
      const checkForContainer = () => {
        container = document.getElementById('header-container');
        if (container) return container;
        
        // If still not found, create it temporarily
        container = document.createElement('div');
        container.id = 'header-container';
        document.body.appendChild(container);
        return container;
      };
      return checkForContainer();
    }
    return container;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;