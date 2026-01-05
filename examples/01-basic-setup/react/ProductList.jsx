/**
 * Product List Component
 *
 * Demonstrates useCollection hook for querying collections with pagination.
 * Results are cached, so re-visiting this page is FREE!
 */

import React from 'react';
import { useCollection, useCacheStats } from '@tthbfo2/firebase-db-optimizer/react';

function ProductList({ onProductClick }) {
  const [category, setCategory] = React.useState('all');

  // Build query constraints based on selected category
  const constraints = category === 'all'
    ? [{ type: 'limit', limit: 20 }]
    : [
        { field: 'category', operator: '==', value: category },
        { type: 'limit', limit: 20 }
      ];

  // useCollection automatically handles caching, loading, pagination
  const { data, loading, error, hasMore, loadMore } = useCollection(
    'user-123',
    'products',
    {
      constraints,
      cache: true,
      ttl: 30000  // Cache for 30 seconds
    }
  );

  // Get cache statistics
  const cacheStats = useCacheStats();

  // Show loading spinner
  if (loading && !data.length) {
    return <div className="loading">Loading products...</div>;
  }

  // Show error message
  if (error) {
    return <div className="error">Error loading products: {error.message}</div>;
  }

  return (
    <div className="product-list">
      {/* Category filter */}
      <div className="filters">
        <label>Filter by category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="home">Home & Garden</option>
        </select>
      </div>

      {/* Cache statistics */}
      <div className="cache-stats">
        <h3>📊 Cache Performance</h3>
        <p>
          <strong>Cache Hit Rate:</strong> {
            cacheStats.totalOperations > 0
              ? Math.round((cacheStats.cacheHits / cacheStats.totalOperations) * 100)
              : 0
          }%
        </p>
        <p>
          <strong>Reads Saved:</strong> {cacheStats.cacheHits}
          (${(cacheStats.cacheHits * 0.000036).toFixed(6)} saved)
        </p>
        <p className="tip">
          💡 The more you browse, the higher your cache hit rate!
        </p>
      </div>

      {/* Product grid */}
      <div className="products-grid">
        {data.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => onProductClick(product.id)}
          >
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="category">{product.category}</p>
          </div>
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <button
          className="load-more"
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More Products'}
        </button>
      )}

      {/* Results count */}
      <p className="results-info">
        Showing {data.length} products
        {category !== 'all' && ` in ${category}`}
      </p>
    </div>
  );
}

export default ProductList;
