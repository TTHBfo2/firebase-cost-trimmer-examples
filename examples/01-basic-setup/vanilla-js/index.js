/**
 * Vanilla JavaScript Example
 *
 * This example shows basic setup with the Firebase DB Optimizer
 * Run with: node index.js
 */

import { initializeApp } from 'firebase/app';
import { quickFirebase } from '@tthbfo2/firebase-cost-trimmer';

// Your Firebase configuration
// Get this from Firebase Console > Project Settings > General
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

async function main() {
  // Step 1: Initialize Firebase normally
  const app = initializeApp(firebaseConfig);

  // Step 2: Wrap with optimizer (one line!)
  const optimizer = quickFirebase(app, 'balanced');

  console.log('✅ Optimizer initialized\n');

  // Step 3: Register your user (enables security)
  optimizer.registerUser({
    uid: 'user-123',
    email: 'john@example.com',
    role: 'user'
  });

  // Step 4: Read a document (first read - cache miss)
  console.log('📖 First read (cache miss):');
  const product1 = await optimizer.readDocument(
    'user-123',
    'products/product-1',
    { cache: true, ttl: 60000 } // Cache for 60 seconds
  );
  console.log('  Product:', product1);
  console.log('');

  // Step 5: Read the SAME document again (cache hit - FREE!)
  console.log('📖 Second read (cache hit - FREE!):');
  const product2 = await optimizer.readDocument(
    'user-123',
    'products/product-1',
    { cache: true, ttl: 60000 }
  );
  console.log('  Product:', product2);
  console.log('');

  // Step 6: Check cache statistics
  const stats = optimizer.getCacheStats();
  console.log('📊 Cache Statistics:');
  console.log(`  Total operations: ${stats.totalOperations}`);
  console.log(`  Cache hits: ${stats.cacheHits} (${Math.round((stats.cacheHits / stats.totalOperations) * 100)}% hit rate)`);
  console.log(`  Cache misses: ${stats.cacheMisses}`);
  console.log(`  Estimated savings: ~$${((stats.cacheHits * 0.000036).toFixed(6))} on these ${stats.totalOperations} reads`);
  console.log('');

  console.log('💡 Key Takeaway:');
  console.log('  The second read was FREE because it came from cache!');
  console.log('  In a real app with millions of reads, this saves $$$');
}

main().catch(console.error);
