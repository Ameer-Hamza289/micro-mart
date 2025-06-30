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
    console.error('Cart app error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong in Cart.</div>;
    }
    return this.props.children;
  }
}

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Sample coupons for demo
  const coupons = {
    'SAVE10': { discount: 0.1, description: '10% off' },
    'WELCOME20': { discount: 0.2, description: '20% off' },
    'STUDENT15': { discount: 0.15, description: '15% student discount' }
  };

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Wait a bit for shared-utils to be available
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { globalState, cartService } = await System.import('@micro-mart/shared-utils');
        
        // Subscribe to cart changes
        const cartSubscription = globalState.cart.subscribe((cart) => {
          setCartItems(cart);
          calculateTotal(cart);
          setIsLoading(false);
        });

        return () => {
          cartSubscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing cart:', error);
        setIsLoading(false);
      }
    };

    initializeServices();
  }, []);

  const calculateTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * discount;
    setTotal(subtotal - discountAmount);
  };

  useEffect(() => {
    calculateTotal(cartItems);
  }, [cartItems, discount]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const { cartService } = await System.import('@micro-mart/shared-utils');
      cartService.updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { cartService } = await System.import('@micro-mart/shared-utils');
      cartService.removeFromCart(productId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const applyCoupon = () => {
    const coupon = coupons[couponCode.toUpperCase()];
    if (coupon) {
      setDiscount(coupon.discount);
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // For demo purposes, just show success message
    alert(`Checkout successful! Total: $${total.toFixed(2)}`);
    
    // In a real app, you would integrate with payment processor
    // and clear the cart after successful payment
  };

  const continueShopping = () => {
    history.pushState(null, null, '/products');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (isLoading) {
    return (
      <div className="cart loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button onClick={continueShopping} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <div className="item-category">{item.category}</div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                </div>

                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="coupon-section">
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-field"
                  />
                  <button onClick={applyCoupon} className="apply-coupon-btn">
                    Apply
                  </button>
                </div>
                
                {appliedCoupon && (
                  <div className="applied-coupon">
                    <span className="coupon-info">
                      {appliedCoupon.code}: {appliedCoupon.description}
                    </span>
                    <button onClick={removeCoupon} className="remove-coupon-btn">
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="summary-line discount">
                  <span>Discount ({(discount * 100).toFixed(0)}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="summary-line shipping">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <div className="summary-line total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
              
              <button onClick={continueShopping} className="continue-btn">
                Continue Shopping
              </button>
            </div>

            <div className="shipping-info">
              <h4>🚚 Free Shipping</h4>
              <p>On orders over $50</p>
              <h4>🔒 Secure Checkout</h4>
              <p>Your payment information is safe</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CartWithErrorBoundary = () => (
  <ErrorBoundary>
    <Cart />
  </ErrorBoundary>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: CartWithErrorBoundary,
  errorBoundary(err, info, props) {
    console.error('Cart error boundary:', err, info);
    return <div>Cart failed to load</div>;
  },
  domElementLocation: () => {
    // Use the container provided by shell app
    let container = document.getElementById('cart-container');
    if (!container) {
      // Fallback: wait for shell to create it
      const checkForContainer = () => {
        container = document.getElementById('cart-container');
        if (container) return container;
        
        // If still not found, create it temporarily
        container = document.createElement('div');
        container.id = 'cart-container';
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