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
    console.error('Product Catalog error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong in Product Catalog.</div>;
    }
    return this.props.children;
  }
}

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Check URL parameters for initial category filter
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
          setSelectedCategory(categoryParam);
        }
        
        // Wait a bit for shared-utils to be available
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const { globalState, cartService } = await System.import('@micro-mart/shared-utils');
        
        // Subscribe to products
        const productsSubscription = globalState.products.subscribe((productsData) => {
          setProducts(productsData);
          setFilteredProducts(productsData);
          
          // Extract categories
          const uniqueCategories = [...new Set(productsData.map(p => p.category))];
          setCategories(uniqueCategories);
          
          setIsLoading(false);
        });

        return () => {
          productsSubscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing product catalog:', error);
        setIsLoading(false);
      }
    };

    initializeServices();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const addToCart = async (product) => {
    try {
      const { cartService } = await System.import('@micro-mart/shared-utils');
      cartService.addToCart(product);
      
      // Show feedback
      const button = document.querySelector(`[data-product-id="${product.id}"]`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#27ae60';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
        }, 1000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const viewProduct = (productId) => {
    history.pushState(null, null, `/product/${productId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (isLoading) {
    return (
      <div className="product-catalog loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h2>Product Catalog</h2>
        <p>Discover our amazing collection of products</p>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="products-count">
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                />
                <div className="product-overlay">
                  <button 
                    onClick={() => viewProduct(product.id)}
                    className="view-product-btn"
                  >
                    View Details
                  </button>
                </div>
              </div>
              
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">${product.price.toFixed(2)}</div>
                
                <button
                  onClick={() => addToCart(product)}
                  className="add-to-cart-btn"
                  data-product-id={product.id}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProductCatalogWithErrorBoundary = () => (
  <ErrorBoundary>
    <ProductCatalog />
  </ErrorBoundary>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: ProductCatalogWithErrorBoundary,
  errorBoundary(err, info, props) {
    console.error('Product Catalog error boundary:', err, info);
    return <div>Product Catalog failed to load</div>;
  },
  domElementLocation: () => {
    // Use the container provided by shell app
    let container = document.getElementById('product-catalog-container');
    if (!container) {
      // Fallback: wait for shell to create it
      const checkForContainer = () => {
        container = document.getElementById('product-catalog-container');
        if (container) return container;
        
        // If still not found, create it temporarily  
        container = document.createElement('div');
        container.id = 'product-catalog-container';
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