# Migration Guide: From Vanilla Firebase to Optimized Firebase

Step-by-step guide to migrate your existing Firebase app to use the DB Optimizer.

## Overview

**Time required:** 15-30 minutes
**Difficulty:** Easy
**Breaking changes:** None (the optimizer wraps Firebase, doesn't replace it)

---

## Step 1: Install the Package

```bash
npm install @tthbfo2/firebase-cost-trimmer
```

---

## Step 2: Wrap Your Firebase App

### Before (Vanilla Firebase):

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Read a document
const docRef = doc(db, 'products', 'product-1');
const docSnap = await getDoc(docRef);
const data = docSnap.data();
```

### After (With Optimizer):

```typescript
import { initializeApp } from 'firebase/app';
import { quickFirebase } from '@tthbfo2/firebase-cost-trimmer';

const app = initializeApp(firebaseConfig);
const optimizer = quickFirebase(app, 'balanced'); // ← Add this one line!

// Register your user (enables security)
optimizer.registerUser({
  uid: currentUser.uid,
  email: currentUser.email,
  role: 'user'
});

// Read a document (automatically cached!)
const data = await optimizer.readDocument(currentUser.uid, 'products/product-1');
```

**That's it!** You now have 40-50% cost savings with caching + security.

---

## Step 3: Replace Firebase Calls with Optimizer Methods

### Document Reads

**Before:**
```typescript
const docRef = doc(db, 'products', productId);
const docSnap = await getDoc(docRef);
const product = docSnap.data();
```

**After:**
```typescript
const product = await optimizer.readDocument(
  userId,
  `products/${productId}`,
  { cache: true, ttl: 60000 }
);
```

### Collection Queries

**Before:**
```typescript
const q = query(
  collection(db, 'products'),
  where('category', '==', 'electronics'),
  limit(20)
);
const querySnapshot = await getDocs(q);
const products = querySnapshot.docs.map(doc => doc.data());
```

**After:**
```typescript
const products = await optimizer.readCollection(
  userId,
  'products',
  {
    queryConstraints: [
      { field: 'category', operator: '==', value: 'electronics' },
      { type: 'limit', limit: 20 }
    ]
  }
);
```

### Writes

**Before:**
```typescript
const docRef = doc(db, 'products', productId);
await setDoc(docRef, productData);
```

**After:**
```typescript
await optimizer.writeSecure(userId, [{
  type: 'update',
  path: `products/${productId}`,
  data: productData
}]);
```

---

## Step 4: Migrate React Components (if applicable)

### Before (Vanilla Firebase + useEffect):

```jsx
function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      setProduct(docSnap.data());
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  return <div>{product.name}</div>;
}
```

### After (Optimizer Hooks):

```jsx
import { useDocument } from '@tthbfo2/firebase-cost-trimmer/react';

function ProductDetail({ productId }) {
  const { data, loading } = useDocument(
    userId,
    `products/${productId}`,
    { cache: true, ttl: 60000 }
  );

  if (loading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}
```

**Bonus:** Automatic caching, error handling, and refetching built-in!

---

## Step 5: Add User Registration (Required for Security)

The optimizer requires user registration to enforce security rules.

### In your authentication flow:

```typescript
// After user signs in with Firebase Auth
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Register user with optimizer
    optimizer.registerUser({
      uid: user.uid,
      email: user.email,
      role: 'user'  // or 'admin', 'readonly'
    });
  }
});
```

---

## Step 6: Monitor Cache Performance

Add cache monitoring to see your savings:

```typescript
// Get cache statistics
const stats = optimizer.getCacheStats();

console.log('Cache hit rate:', Math.round((stats.cacheHits / stats.totalOperations) * 100) + '%');
console.log('Reads saved:', stats.cacheHits);
console.log('Money saved:', '$' + (stats.cacheHits * 0.000036).toFixed(6));
```

**In React:**
```jsx
import { useCacheStats } from '@tthbfo2/firebase-cost-trimmer/react';

function CacheMonitor() {
  const stats = useCacheStats();

  return (
    <div>
      Cache Hit Rate: {Math.round((stats.cacheHits / stats.totalOperations) * 100)}%
    </div>
  );
}
```

---

## Migration Checklist

- [ ] Install `@tthbfo2/firebase-cost-trimmer`
- [ ] Wrap Firebase app with `quickFirebase()`
- [ ] Add `registerUser()` to authentication flow
- [ ] Replace `getDoc()` calls with `readDocument()`
- [ ] Replace `getDocs()` queries with `readCollection()`
- [ ] Replace `setDoc()/updateDoc()` with `writeSecure()`
- [ ] Migrate React components to use optimizer hooks (if using React)
- [ ] Add cache statistics monitoring
- [ ] Test in development environment
- [ ] Deploy to production

---

## Common Migration Patterns

### Pattern 1: User Profile Data

**Before:**
```typescript
const userDoc = await getDoc(doc(db, 'users', userId));
const profile = userDoc.data();
```

**After:**
```typescript
const profile = await optimizer.readDocument(userId, `users/${userId}`);
// Automatically cached - second access is FREE!
```

### Pattern 2: Product Catalog

**Before:**
```typescript
const productsQuery = query(collection(db, 'products'), limit(50));
const snapshot = await getDocs(productsQuery);
const products = snapshot.docs.map(d => d.data());
```

**After:**
```typescript
const products = await optimizer.readCollection(userId, 'products', {
  queryConstraints: [{ type: 'limit', limit: 50 }]
});
// Automatically cached for repeated catalog browsing!
```

### Pattern 3: Real-time Listeners

**Before:**
```typescript
const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (doc) => {
  setOrder(doc.data());
});
```

**After:**
```typescript
const unsubscribe = await optimizer.listenToDocument(
  userId,
  `orders/${orderId}`,
  (data, error) => {
    if (!error) setOrder(data);
  }
);
```

---

## FAQ

**Q: Do I need to migrate all my Firebase calls at once?**
A: No! The optimizer works alongside vanilla Firebase. Migrate incrementally.

**Q: Will this break my existing Firebase Security Rules?**
A: No. The optimizer adds an additional security layer but doesn't interfere with Firebase rules.

**Q: What if I have complex queries?**
A: The optimizer supports all Firebase query constraints (where, orderBy, limit, etc.)

**Q: Can I still use Firebase Admin SDK for backend?**
A: Yes! The optimizer is client-side only. Your backend code stays the same.

---

## Need Help?

- [GitHub Discussions](https://github.com/tthbfo2/firebase-optimization-examples/discussions)
- [Report Issues](https://github.com/tthbfo2/firebase-optimization-examples/issues)
- [npm Package Documentation](https://www.npmjs.com/package/@tthbfo2/firebase-cost-trimmer)

---

**Next Steps:**
- Check out [real-world examples](../examples/02-real-world-patterns/) for complete implementations
- Read [security best practices](security-best-practices.md) for production deployments
- Learn [how to choose cache TTL](choosing-cache-ttl.md) for optimal performance
