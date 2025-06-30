import { registerApplication, start } from 'single-spa';

function registerApps() {
  // Register the shell application first (main layout)
  registerApplication({
    name: '@micro-mart/shell',
    app: () => System.import('@micro-mart/shell'),
    activeWhen: () => true,
  });

  // Register header application
  registerApplication({
    name: '@micro-mart/header',
    app: () => System.import('@micro-mart/header'),
    activeWhen: () => true,
  });

  // Register product catalog
  registerApplication({
    name: '@micro-mart/product-catalog',
    app: () => System.import('@micro-mart/product-catalog'),
    activeWhen: location => location.pathname === '/' || location.pathname.startsWith('/products'),
  });

  // Register product details
  registerApplication({
    name: '@micro-mart/product-details',
    app: () => System.import('@micro-mart/product-details'),
    activeWhen: location => location.pathname.startsWith('/product/'),
  });

  // Register cart application
  registerApplication({
    name: '@micro-mart/cart',
    app: () => System.import('@micro-mart/cart'),
    activeWhen: location => location.pathname.startsWith('/cart'),
  });

  // Register user authentication
  registerApplication({
    name: '@micro-mart/user-auth',
    app: () => System.import('@micro-mart/user-auth'),
    activeWhen: location => location.pathname.startsWith('/auth'),
  });

  // Start single-spa
  start({
    urlRerouteOnly: true,
  });
}

// Register applications once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerApps);
} else {
  // DOM is already loaded
  registerApps();
}