let domEl;
let unsubscribe;

export const mount = async (props) => {
  const { globalState, cartService } = await System.import('@micro-mart/shared-utils');
  
  const productId = parseInt(window.location.pathname.split('/').pop());
  
  domEl = document.createElement('div');
  domEl.innerHTML = `
    <div id="product-details">
      <button onclick="goBack()" style="margin-bottom: 2rem; background: #95a5a6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
        ← Back to Products
      </button>
      <div id="product-detail-content">Loading...</div>
    </div>
  `;
  
  const detailsContainer = document.getElementById('product-details-container');
  if (detailsContainer) {
    detailsContainer.appendChild(domEl);
  }
  
  window.goBack = () => {
    window.navigateTo('/products');
  };
  
  const renderProductDetail = (products) => {
    const product = products.find(p => p.id === productId);
    const content = document.getElementById('product-detail-content');
    
    if (!product) {
      if (content) {
        content.innerHTML = '<h2>Product not found</h2>';
      }
      return;
    }
    
    if (content) {
      content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 1000px;">
          <div>
            <img src="${product.image}" alt="${product.name}" 
                 style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px;">
          </div>
          <div>
            <h1 style="margin: 0 0 1rem 0;">${product.name}</h1>
            <p style="color: #666; font-size: 1.1rem; margin-bottom: 1rem;">${product.category}</p>
            <p style="font-size: 2rem; font-weight: bold; color: #2c3e50; margin-bottom: 2rem;">$${product.price}</p>
            
            <div style="margin-bottom: 2rem;">
              <h3>Description</h3>
              <p>This is a high-quality ${product.name.toLowerCase()} perfect for your needs. 
                 Features premium materials and excellent craftsmanship.</p>
            </div>
            
            <div style="margin-bottom: 2rem;">
              <h3>Features</h3>
              <ul>
                <li>Premium quality materials</li>
                <li>Excellent durability</li>
                <li>Great value for money</li>
                <li>Customer satisfaction guaranteed</li>
              </ul>
            </div>
            
            <button onclick="addToCartDetail(${product.id})" 
                    style="background: #3498db; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 4px; cursor: pointer; width: 100%;">
              Add to Cart - $${product.price}
            </button>
          </div>
        </div>
      `;
    }
  };
  
  window.addToCartDetail = async (productId) => {
    const products = globalState.products.value;
    const product = products.find(p => p.id === productId);
    if (product) {
      cartService.addToCart(product);
      alert(`${product.name} added to cart!`);
    }
  };
  
  // Subscribe to products
  unsubscribe = globalState.products.subscribe(renderProductDetail);
  
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