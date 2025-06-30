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
    console.error('User Auth app error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong in User Auth.</div>;
    }
    return this.props.children;
  }
}

const UserAuth = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Wait a bit for shared-utils to be available
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const { globalState } = await System.import('@micro-mart/shared-utils');
        
        // Subscribe to user changes
        const userSubscription = globalState.user.subscribe((userData) => {
          setUser(userData);
        });

        return () => {
          userSubscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth services:', error);
      }
    };

    initializeServices();
  }, []);

  // If user is logged in, redirect to home
  useEffect(() => {
    if (user) {
      history.pushState(null, null, '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration-specific validation
    if (mode === 'register') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { authService } = await System.import('@micro-mart/shared-utils');
      
      if (mode === 'login') {
        await authService.login(formData.email, formData.password);
        // Success message will be handled by redirect
      } else {
        // For demo purposes, we'll just simulate registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        await authService.login(formData.email, formData.password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    });
    setErrors({});
  };

  const handleSocialLogin = (provider) => {
    // Demo social login
    alert(`${provider} login would be implemented here!`);
  };

  if (user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-success">
            <div className="success-icon">✅</div>
            <h2>Welcome back, {user.name}!</h2>
            <p>You are successfully logged in.</p>
            <button 
              onClick={() => {
                history.pushState(null, null, '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="continue-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {mode === 'login' 
              ? 'Sign in to your account to continue shopping' 
              : 'Join us and discover amazing products'
            }
          </p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode()}
            disabled={mode === 'login'}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode()}
            disabled={mode === 'register'}
          >
            Register
          </button>
        </div>

        {errors.general && (
          <div className="error-message general">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner">
                <span className="spinner-small"></span>
                Processing...
              </span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-login">
          <button 
            onClick={() => handleSocialLogin('Google')}
            className="social-btn google"
          >
            <span className="social-icon">G</span>
            Google
          </button>
          <button 
            onClick={() => handleSocialLogin('Facebook')}
            className="social-btn facebook"
          >
            <span className="social-icon">f</span>
            Facebook
          </button>
        </div>

        <div className="auth-footer">
          <p>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={switchMode} className="switch-mode-btn">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="demo-info">
          <h4>Demo Credentials</h4>
          <p>Email: demo@micromart.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
};

const UserAuthWithErrorBoundary = () => (
  <ErrorBoundary>
    <UserAuth />
  </ErrorBoundary>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: UserAuthWithErrorBoundary,
  errorBoundary(err, info, props) {
    console.error('User Auth error boundary:', err, info);
    return <div>User Auth failed to load</div>;
  },
  domElementLocation: () => {
    // Use the container provided by shell app
    let container = document.getElementById('user-auth-container');
    if (!container) {
      // Fallback: wait for shell to create it
      const checkForContainer = () => {
        container = document.getElementById('user-auth-container');
        if (container) return container;
        
        // If still not found, create it temporarily
        container = document.createElement('div');
        container.id = 'user-auth-container';
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