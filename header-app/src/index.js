let domEl;
let unsubscribe;

export const mount = async (props) => {
  const { globalState, cartService } = await System.import('@micro-mart/shared-utils');
  
  domEl = document.createElement('div');
  domEl.innerHTML = `
    <header style="padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; background: #2c3e50; color: white;">
      <div>
        <h1 style="margin: 0; cursor: pointer;" onclick="navigateTo('/')">🛒 Micro-Marty</h1>
      </div>
      <nav style="display: flex; gap: 2rem; align-items: center;">
        <a href="/" style="color: white; text-decoration: none;" onclick="navigateTo('/')">Home</a>
        <a href="/products" style="color: white; text-decoration: none;" onclick="navigateTo('/products')">Products</a>
        <div style="position: relative;">
          <a href="/cart" style="color: white; text-decoration: none;" onclick="navigateTo('/cart')">
            Cart (<span id="cart-count">0</span>)
          </a>
        </div>
        <div id="user-section">
          <a href="/auth" style="color: white; text-decoration: none;" onclick="navigateTo('/auth')">Login</a>
        </div>
      </nav>
    </header>
  `;
  
  // Add navigation function to global scope
  window.navigateTo = (path) => {
    history.pushState(null, null, path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.appendChild(domEl);
  }
  
  // Subscribe to cart changes
  unsubscribe = globalState.cart.subscribe((cart) => {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
      cartCountEl.textContent = cartCount;
    }
  });
  
  // Subscribe to user changes
  globalState.user.subscribe((user) => {
    const userSection = document.getElementById('user-section');
    if (userSection) {
      if (user) {
        userSection.innerHTML = `
          <span style="margin-right: 1rem;">Hello, ${user.name}</span>
          <button onclick="logout()" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Logout</button>
        `;
      } else {
        userSection.innerHTML = `
          <a href="/auth" style="color: white; text-decoration: none;" onclick="navigateTo('/auth')">Login</a>
        `;
      }
    }
  });
  
  // Add logout function
  window.logout = async () => {
    const { authService } = await System.import('@micro-mart/shared-utils');
    authService.logout();
  };
  
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