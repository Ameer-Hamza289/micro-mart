let domEl;

export const mount = (props) => {
  domEl = document.createElement('div');
  domEl.id = 'shell-app';
  domEl.innerHTML = `
    <div style="min-height: 100vh; display: flex; flex-direction: column;">
      <div id="header-container" style="background: #fff; border-bottom: 1px solid #ddd;"></div>
      <div style="flex: 1; display: flex;">
        <main id="main-content" style="flex: 1; padding: 20px;">
          <div id="product-catalog-container"></div>
          <div id="product-details-container"></div>
          <div id="cart-container"></div>
          <div id="user-auth-container"></div>
        </main>
      </div>
    </div>
  `;
  document.body.appendChild(domEl);
  
  return Promise.resolve();
};

export const unmount = () => {
  if (domEl) {
    document.body.removeChild(domEl);
  }
  return Promise.resolve();
};