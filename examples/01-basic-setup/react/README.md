# React Hooks Integration

Production-ready React example showing how to use Firebase DB Optimizer with React hooks.

## Installation

```bash
npm install @tthbfo2/firebase-db-optimizer firebase react react-dom
```

## What This Example Includes

- **OptimizerProvider** - Wrap your app to provide optimizer context
- **useDocument** - Read single documents with caching
- **useCollection** - Query collections with pagination
- **useWrite** - Secure write operations
- **useCacheStats** - Monitor cache performance

## Files

- [App.jsx](App.jsx) - Main app setup with OptimizerProvider
- [ProductDetail.jsx](ProductDetail.jsx) - Single document example (useDocument)
- [ProductList.jsx](ProductList.jsx) - Collection query with pagination (useCollection)
- [package.json](package.json) - Dependencies

## Quick Start

### 1. Set up the provider

```jsx
import { initializeApp } from 'firebase/app';
import { quickFirebase } from '@tthbfo2/firebase-db-optimizer';
import { OptimizerProvider } from '@tthbfo2/firebase-db-optimizer/react';

const app = initializeApp({ /* your config */ });
const optimizer = quickFirebase(app, 'balanced');

optimizer.registerUser({
  uid: 'user-123',
  email: 'user@example.com',
  role: 'user'
});

function App() {
  return (
    <OptimizerProvider optimizer={optimizer}>
      <YourComponents />
    </OptimizerProvider>
  );
}
```

### 2. Use hooks in components

```jsx
import { useDocument } from '@tthbfo2/firebase-db-optimizer/react';

function ProductDetail({ productId }) {
  const { data, loading, error } = useDocument(
    'user-123',
    `products/${productId}`,
    { cache: true, ttl: 60000 }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.name} - ${data.price}</div>;
}
```

## Real-World Cost Savings

**Scenario:** E-commerce product page with 1,000 daily views

**Without optimizer:**
- Each page view = 3 reads (product + related products + reviews)
- 1,000 views × 3 reads = 3,000 reads/day
- 3,000 × 30 days = 90,000 reads/month
- Cost: 90,000 × $0.000036 = **$3.24/month**

**With optimizer (50% cache hit rate):**
- Cache hits: 45,000 reads (FREE!)
- Cache misses: 45,000 reads
- Cost: 45,000 × $0.000036 = **$1.62/month**

**Monthly savings: $1.62** (50% reduction) per 1,000 daily visitors

Scale this to 100,000 daily visitors = **$162/month savings!**

## Running the Example

```bash
# 1. Install dependencies
npm install

# 2. Update firebase config in App.jsx

# 3. Start development server
npm start
```

## Next Steps

- See [E-commerce example](../../02-real-world-patterns/ecommerce/) for complete app
- Check [Security guide](../../../guides/security-best-practices.md) for production security
- Read [Migration guide](../../../guides/migration-guide.md) to convert existing Firebase apps
