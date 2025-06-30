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
    console.error('Product Details error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong in Product Details.</div>;
    }
    return this.props.children;
  }
}

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Wait a bit for shared-utils to be available
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const productId = getProductIdFromPath();
        if (!productId) {
          // Redirect to products page if no valid product ID
          history.pushState(null, null, '/products');
          window.dispatchEvent(new PopStateEvent('popstate'));
          return;
        }

        const { globalState } = await System.import('@micro-mart/shared-utils');
        
        // Subscribe to products
        const productsSubscription = globalState.products.subscribe((products) => {
          const foundProduct = products.find(p => p.id === parseInt(productId));
          
          if (foundProduct) {
            // Enhance product with additional details for demo
            const enhancedProduct = {
              ...foundProduct,
              description: getProductDescription(foundProduct),
              features: getProductFeatures(foundProduct),
              images: [foundProduct.image, foundProduct.image, foundProduct.image], // Demo multiple images
              specifications: getProductSpecifications(foundProduct),
              rating: Math.floor(Math.random() * 2) + 4, // 4-5 star rating
              reviews: Math.floor(Math.random() * 100) + 20, // 20-120 reviews
              inStock: Math.random() > 0.1, // 90% chance in stock
              stockCount: Math.floor(Math.random() * 50) + 1,
            };
            
            setProduct(enhancedProduct);
            
            // Get related products from same category
            const related = products
              .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
              .slice(0, 4);
            setRelatedProducts(related);
          } else {
            // Product not found, redirect to products
            history.pushState(null, null, '/products');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
          
          setIsLoading(false);
        });

        return () => {
          productsSubscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error loading product:', error);
        setIsLoading(false);
      }
    };

    loadProduct();
  }, []);

  const getProductIdFromPath = () => {
    const path = window.location.pathname;
    const match = path.match(/\/product\/(\d+)/);
    return match ? match[1] : null;
  };

  const getProductDescription = (product) => {
    const descriptions = {
      'Electronics': `Experience cutting-edge technology with this premium ${product.name}. Designed for performance and reliability, this product offers exceptional value for both professional and personal use.`,
      'Home': `Transform your living space with this beautiful ${product.name}. Crafted with attention to detail and built to last, it combines functionality with style.`,
      'Sports': `Elevate your fitness journey with this high-quality ${product.name}. Engineered for performance and comfort, it's perfect for athletes of all levels.`,
      'Books': `Dive into an engaging world with this captivating ${product.name}. A must-read that will entertain, educate, and inspire readers of all ages.`,
    };
    return descriptions[product.category] || `High-quality ${product.name} that exceeds expectations in both form and function.`;
  };

  const getProductFeatures = (product) => {
    const features = {
      'Electronics': ['High Performance', 'Energy Efficient', 'Modern Design', 'Easy Setup'],
      'Home': ['Premium Materials', 'Durable Construction', 'Stylish Design', 'Easy Maintenance'],
      'Sports': ['Lightweight', 'Ergonomic Design', 'High Durability', 'Professional Grade'],
      'Books': ['Engaging Content', 'Expert Author', 'High-Quality Print', 'Comprehensive Coverage'],
    };
    return features[product.category] || ['High Quality', 'Great Value', 'Reliable', 'User Friendly'];
  };

  const getProductSpecifications = (product) => {
    const specs = {
      'Electronics': { 'Warranty': '2 Years', 'Power': '100W', 'Connectivity': 'WiFi, Bluetooth' },
      'Home': { 'Material': 'Premium Wood', 'Dimensions': '60" x 30" x 12"', 'Weight': '25 lbs' },
      'Sports': { 'Material': 'Carbon Fiber', 'Weight': '2.5 lbs', 'Size': 'One Size Fits All' },
      'Books': { 'Pages': '320', 'Publisher': 'Premium Publishing', 'Language': 'English' },
    };
    return specs[product.category] || { 'Quality': 'Premium', 'Origin': 'USA', 'Warranty': '1 Year' };
  };

  const addToCart = async () => {
    if (!product || isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      const { cartService } = await System.import('@micro-mart/shared-utils');
      
      // Add multiple quantities if needed
      for (let i = 0; i < quantity; i++) {
        cartService.addToCart(product);
      }
      
      // Show success feedback
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const navigateToProducts = () => {
    history.pushState(null, null, '/products');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const navigateToProduct = (productId) => {
    history.pushState(null, null, `/product/${productId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (isLoading) {
    return (
      <div className="product-details loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={navigateToProducts} className="back-to-products-btn">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="breadcrumb">
        <button onClick={navigateToProducts} className="breadcrumb-link">
          Products
        </button>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-main">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              className="product-image"
            />
            {!product.inStock && (
              <div className="out-of-stock-overlay">Out of Stock</div>
            )}
          </div>
          
          <div className="image-thumbnails">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <div className="product-category">{product.category}</div>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`star ${i < product.rating ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-text">
                {product.rating}.0 ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="product-price">
            <span className="current-price">${product.price.toFixed(2)}</span>
            <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
            <span className="discount">17% off</span>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-features">
            <h3>Key Features</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="product-stock">
            {product.inStock ? (
              <div className="in-stock">
                ✅ In Stock ({product.stockCount} available)
              </div>
            ) : (
              <div className="out-of-stock">
                ❌ Currently Out of Stock
              </div>
            )}
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="quantity-btn"
                  disabled={quantity >= product.stockCount || !product.inStock}
                >
                  +
                </button>
              </div>
            </div>

            <button 
              onClick={addToCart}
              className="add-to-cart-btn"
              disabled={!product.inStock || isAddingToCart}
            >
              {isAddingToCart ? (
                <span className="loading-text">
                  <span className="spinner-small"></span>
                  Adding to Cart...
                </span>
              ) : (
                `Add to Cart - $${(product.price * quantity).toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="product-specifications">
        <h3>Specifications</h3>
        <div className="specs-grid">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="spec-item">
              <span className="spec-label">{key}:</span>
              <span className="spec-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>Related Products</h3>
          <div className="related-grid">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.id} className="related-item">
                <img 
                  src={relatedProduct.image} 
                  alt={relatedProduct.name}
                  onClick={() => navigateToProduct(relatedProduct.id)}
                />
                <h4>{relatedProduct.name}</h4>
                <div className="related-price">${relatedProduct.price.toFixed(2)}</div>
                <button 
                  onClick={() => navigateToProduct(relatedProduct.id)}
                  className="view-product-btn"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetailsWithErrorBoundary = () => (
  <ErrorBoundary>
    <ProductDetails />
  </ErrorBoundary>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: ProductDetailsWithErrorBoundary,
  errorBoundary(err, info, props) {
    console.error('Product Details error boundary:', err, info);
    return <div>Product Details failed to load</div>;
  },
  domElementLocation: () => {
    // Use the container provided by shell app
    let container = document.getElementById('product-details-container');
    if (!container) {
      // Fallback: wait for shell to create it
      const checkForContainer = () => {
        container = document.getElementById('product-details-container');
        if (container) return container;
        
        // If still not found, create it temporarily
        container = document.createElement('div');
        container.id = 'product-details-container';
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