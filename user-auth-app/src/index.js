let domEl;
let unsubscribe;

export const mount = async (props) => {
  const { globalState, authService } = await System.import('@micro-mart/shared-utils');
  
  domEl = document.createElement('div');
  domEl.innerHTML = `
    <div id="auth-app">
      <div id="auth-content">Loading...</div>
    </div>
  `;
  
  const authContainer = document.getElementById('user-auth-container');
  if (authContainer) {
    authContainer.appendChild(domEl);
  }
  
  const renderAuthForm = (user) => {
    const content = document.getElementById('auth-content');
    
    if (user) {
      if (content) {
        content.innerHTML = `
          <div style="max-width: 400px; margin: 0 auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; background: white;">
            <h2>Welcome, ${user.name}!</h2>
            <p>You are successfully logged in.</p>
            <div style="margin-top: 2rem;">
              <h3>Account Information</h3>
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
            </div>
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
              <button onclick="goToProducts()" 
                      style="flex: 1; background: #3498db; color: white; border: none; padding: 1rem; border-radius: 4px; cursor: pointer;">
                Browse Products
              </button>
              <button onclick="logout()" 
                      style="flex: 1; background: #e74c3c; color: white; border: none; padding: 1rem; border-radius: 4px; cursor: pointer;">
                Logout
              </button>
            </div>
          </div>
        `;
      }
    } else {
      if (content) {
        content.innerHTML = `
          <div style="max-width: 400px; margin: 0 auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; background: white;">
            <h2>Login to Micro-Mart</h2>
            <form id="login-form">
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Email:</label>
                <input type="email" id="email" required 
                       style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Password:</label>
                <input type="password" id="password" required 
                       style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
              </div>
              <button type="submit" 
                      style="width: 100%; background: #3498db; color: white; border: none; padding: 1rem; border-radius: 4px; cursor: pointer; font-size: 1rem;">
                Login
              </button>
            </form>
            <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 4px; font-size: 0.9rem;">
              <strong>Demo Credentials:</strong><br>
              Email: demo@micromart.com<br>
              Password: demo123
            </div>
          </div>
        `;
      }
      
      const form = document.getElementById('login-form');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          
          try {
            await authService.login(email, password);
            alert('Login successful!');
            window.navigateTo('/');
          } catch (error) {
            alert('Login failed. Please try again.');
          }
        });
      }
    }
  };
  
  window.goToProducts = () => {
    window.navigateTo('/products');
  };
  
  // Subscribe to user changes
  unsubscribe = globalState.user.subscribe(renderAuthForm);
  
  // Check for existing authentication
  authService.checkAuth();
  
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