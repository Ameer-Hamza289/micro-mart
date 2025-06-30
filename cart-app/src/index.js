let domEl;
let unsubscribe;

export const mount = async (props) => {
  const { globalState, cartService } = await System.import('@micro-mart/shared-utils');
  
  domEl = document.createElement('div');
  domEl.innerHTML = `
    <div id="cart-app">
      <h2>Shopping Cart</h2>
      <div id="cart-content">Loading...</div>
    </div>
  `;
  
  const cartContainer = document.getElementById('cart-container');
  if (cartContainer) {
    cartContainer.appendChild(domEl);
  }
  
  const renderCart = (cart) => {
    const content = document.getElementById('cart-content');
    
    if (cart.length === 0) {
      if (content) {
        content.innerHTML = `
          <div style="text-align: center; padding: 2rem;">
            <h3>Your cart is empty</h3>
            <button onclick="continueShopping()" 
                    style="background: #3498db; color: white; border: none; padding: 1rem 2rem; border-radius: 4px; cursor: pointer;">
              Continue Shopping
            </button>
          </div>
        `;
      }
      return;
    }
    
    const total = cartService.getCartTotal();
    
    if (content) {
      content.innerHTML = `
        <div style="max-width: 800px;">
          ${cart.map(item => `
            <div style="display: flex; align-items: center; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 1rem; background: white;">
              <img src="${item.image}" alt="${item.name}" 
                   style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 1rem;">
              <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0;">${item.name}</h4>
                <p style="color: #666; margin: 0;">$${item.price} each</p>
              </div>
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" 
                          style="background: #95a5a6; color: white; border: none; width: 30px; height: 30px; border-radius: 4px; cursor: pointer;">-</button>
                  <span style="min-width: 40px; text-align: center;">${item.quantity}</span>
                  <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" 
                          style="background: #95a5a6; color: white; border: none; width: 30px; height: 30px; border-radius: 4px; cursor: pointer;">+</button>
                </div>
                <div style="min-width: 80px; text-align: right; font-weight: bold;">
                  $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button onclick="removeItem(${item.id})" 
                        style="background: #e74c3c; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
                  Remove
                </button>
              </div>
            </div>
          `).join('')}
          
          <div style="border-top: 2px solid #2c3e50; padding: 1rem 0; margin-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3>Total: $${total.toFixed(2)}</h3>
              <div style="display: flex; gap: 1rem;">
                <button onclick="continueShopping()" 
                        style="background: #95a5a6; color: white; border: none; padding: 1rem 2rem; border-radius: 4px; cursor: pointer;">
                  Continue Shopping
                </button>
                <button onclick="checkout()" 
                        style="background: #27ae60; color: white; border: none; padding: 1rem 2rem; border-radius: 4px; cursor: pointer;">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };
  
  window.updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      cartService.removeFromCart(productId);
    } else {
      cartService.updateQuantity(productId, newQuantity);
    }
  };
  
  window.removeItem = (productId) => {
    cartService.removeFromCart(productId);
  };
  
  window.continueShopping = () => {
    window.navigateTo('/products');
  };
  
  window.checkout = () => {
    alert('Checkout functionality would be implemented here!');
  };
  
  // Subscribe to cart changes
  unsubscribe = globalState.cart.subscribe(renderCart);
  
  return Promise.resolve();
};

export const unmount = () => {
  if (unsubscribe) {
    unsubscribe();
  }
  if (domEl && domEl.parentNode) {
    domEl.parentNode.removeChild(domEl);
  }
  return Promise.resolve();
};