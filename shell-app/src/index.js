import React from 'react';
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
    console.error('Shell app error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong with the shell app.</h2>
          <p>Please refresh the page to try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Shell = () => {
  return (
    <div className="app-container">
      <div id="header-container" className="header-container"></div>
      <div className="main-wrapper">
        <main id="main-content" className="main-content">
          <div id="product-catalog-container" className="micro-frontend-container"></div>
          <div id="product-details-container" className="micro-frontend-container"></div>
          <div id="cart-container" className="micro-frontend-container"></div>
          <div id="user-auth-container" className="micro-frontend-container"></div>
        </main>
      </div>
    </div>
  );
};

const ShellWithErrorBoundary = () => (
  <ErrorBoundary>
    <Shell />
  </ErrorBoundary>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: ShellWithErrorBoundary,
  errorBoundary(err, info, props) {
    console.error('Shell error boundary:', err, info);
    return <div>Shell failed to load</div>;
  },
  domElementLocation: () => {
    let container = document.getElementById('root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'root';
      document.body.appendChild(container);
    }
    return container;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;