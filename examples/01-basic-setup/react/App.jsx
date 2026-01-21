/**
 * React App Setup with Firebase DB Optimizer
 *
 * This shows the basic setup pattern for integrating the optimizer
 * into a React application.
 */

import React from 'react';
import { initializeApp } from 'firebase/app';
import { quickFirebase } from '@tthbfo2/firebase-cost-trimmer';
import { OptimizerProvider } from '@tthbfo2/firebase-cost-trimmer/react';
import ProductDetail from './ProductDetail';
import ProductList from './ProductList';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Wrap with optimizer (one line!)
const optimizer = quickFirebase(app, 'balanced');

// Register your user (in production, do this after authentication)
optimizer.registerUser({
  uid: 'user-123',
  email: 'user@example.com',
  role: 'user'
});

function App() {
  const [view, setView] = React.useState('list'); // 'list' or 'detail'
  const [selectedProductId, setSelectedProductId] = React.useState(null);

  const showProductDetail = (productId) => {
    setSelectedProductId(productId);
    setView('detail');
  };

  const showProductList = () => {
    setView('list');
  };

  return (
    <OptimizerProvider optimizer={optimizer}>
      <div className="app">
        <header>
          <h1>Firebase DB Optimizer - React Example</h1>
          <p>Check your browser console for cache statistics!</p>
        </header>

        <main>
          {view === 'list' ? (
            <ProductList onProductClick={showProductDetail} />
          ) : (
            <ProductDetail
              productId={selectedProductId}
              onBack={showProductList}
            />
          )}
        </main>
      </div>
    </OptimizerProvider>
  );
}

export default App;
