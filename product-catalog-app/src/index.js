let domEl;
let unsubscribe;

export const mount = async (props) => {
  const { globalState, cartService } = await System.import('@micro-mart/shared-utils');
  
  domEl = document.createElement('div');
  domEl.innerHTML = `
    <div id="product-catalog">
      <h2>Products</h2>
      <div style="margin-bottom: 2rem;">
        <input type="text" id="search-input" placeholder="Search products..." 
               style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; width: 300px;">
        <select id="category-filter" style="padding: 0.5rem; margin-left: 1rem; border: 1px solid #ddd; border-radius: 4px;">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Home">Home</option>
          <option value="Sports">Sports</option>
          <option value="Books">Books</option>
        </select>
      </div>
      <div id="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
      </div>
    </div>
  `;
  
  const catalogContainer = document.getElementById('product-catalog-container');
  if (catalogContainer) {
    catalogContainer.appendChild(domEl);
  }
  
  let allProducts = [];
  
  const renderProducts = (products) => {
    const grid = document.getElementById('products-grid');
    if (grid) {
      grid.innerHTML = products.map(product => `
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem; background: white;">
          <img src="${product.image}" alt="${product.name}" 
               style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;">
          <h3 style="margin: 1rem 0 0.5rem 0;">${product.name}</h3>
          <p style="color: #666; margin: 0.5rem 0;">${product.category}</p>
          <p style="font-size: 1.2rem; font-weight: bold; margin: 0.5rem 0;">$${product.price}</p>
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button onclick="addToCart(${product.id})" 
                    style="flex: 1; background: #3498db; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              Add to Cart
            </button>
            <button onclick="viewProduct(${product.id})" 
                    style="flex: 1; background: #2c3e50; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>
      `).join('');
    }
  };
  
  const filterProducts = () => {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    
    renderProducts(filtered);
  };
  
  // Add event listeners
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterProducts);
  }
  
  // Global functions
  window.addToCart = async (productId) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      cartService.addToCart(product);
      alert(`${product.name} added to cart!`);
    }
  };
  
  window.viewProduct = (productId) => {
    window.navigateTo(`/product/${productId}`);
  };
  
  // Subscribe to products
  unsubscribe = globalState.products.subscribe((products) => {
    allProducts = products;
    filterProducts();
  });
  
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