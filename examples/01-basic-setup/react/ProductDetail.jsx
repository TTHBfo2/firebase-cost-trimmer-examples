/**
 * Product Detail Component
 *
 * Demonstrates useDocument hook for reading a single document with caching.
 * The second time you view the same product, it comes from cache (FREE!)
 */

import React from 'react';
import { useDocument } from '@tthbfo2/firebase-db-optimizer/react';

function ProductDetail({ productId, onBack }) {
  // useDocument automatically handles caching, loading states, and errors
  const { data, loading, error, refetch } = useDocument(
    'user-123',
    `products/${productId}`,
    {
      cache: true,      // Enable caching
      ttl: 60000        // Cache for 60 seconds
    }
  );

  // Show loading spinner
  if (loading) {
    return (
      <div className="product-detail">
        <button onClick={onBack}>← Back to Products</button>
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="product-detail">
        <button onClick={onBack}>← Back to Products</button>
        <div className="error">
          Error loading product: {error.message}
          <button onClick={refetch}>Retry</button>
        </div>
      </div>
    );
  }

  // Show product details
  return (
    <div className="product-detail">
      <button onClick={onBack}>← Back to Products</button>

      <h2>{data.name}</h2>

      <div className="product-image">
        <img src={data.imageUrl} alt={data.name} />
      </div>

      <div className="product-info">
        <p className="price">${data.price}</p>
        <p className="description">{data.description}</p>
        <p className="category">Category: {data.category}</p>
        <p className="stock">
          {data.inStock ? '✅ In Stock' : '❌ Out of Stock'}
        </p>
      </div>

      <button className="add-to-cart">Add to Cart</button>

      <div className="cache-info">
        💡 <strong>Tip:</strong> Navigate back and forth between products.
        The second time you view a product, it loads instantly from cache
        (no Firebase read cost!)
      </div>
    </div>
  );
}

export default ProductDetail;
