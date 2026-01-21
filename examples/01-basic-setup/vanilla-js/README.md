# Vanilla JavaScript Setup

Basic Node.js setup showing how to integrate the Firebase DB Optimizer in under 5 minutes.

## Installation

```bash
npm install @tthbfo2/firebase-cost-trimmer firebase
```

## Complete Working Example

See [index.js](index.js) for the full code.

## What This Example Does

1. Initializes Firebase with your project config
2. Wraps Firebase with the optimizer
3. Registers a user for security
4. Performs read operations with automatic caching
5. Shows cache statistics

## Running the Example

```bash
# 1. Install dependencies
npm install

# 2. Add your Firebase config to index.js (replace placeholder)

# 3. Run the example
node index.js
```

## Expected Output

```
✅ Optimizer initialized

📖 First read (cache miss):
  Product: { id: 'product-1', name: 'Gaming Laptop', price: 1299 }

📖 Second read (cache hit - FREE!):
  Product: { id: 'product-1', name: 'Gaming Laptop', price: 1299 }

📊 Cache Statistics:
  Total operations: 2
  Cache hits: 1 (50% hit rate)
  Cache misses: 1
  Estimated savings: ~$0.000018 on these 2 reads
```

## Cost Savings Explained

**Without optimizer:**
- Each read costs $0.000036
- 2 reads = $0.000072

**With optimizer:**
- First read: $0.000036 (cache miss)
- Second read: $0 (cache hit!)
- Total: $0.000036

**Savings: 50%** on just these 2 reads. Multiply this across millions of reads!

## Next Steps

- Try reading collections with [readCollection example](../collection-example.js)
- See [React integration](../react/) for frontend apps
- Check [real-world patterns](../../02-real-world-patterns/) for production use cases
