# System Design Concepts

A collection of hands-on implementations of core system design algorithms and patterns.

## Project Structure

```
system-design-concepts/
├── rate-limiting-algorithms/
│   ├── TokenBucket.js
│   └── LeakyBucket.js
├── index.js
├── package.json
└── README.md
```

## Rate Limiting Algorithms

### 1. Token Bucket
- **Implementation**: [`rate-limiting-algorithms/TokenBucket.js`](./rate-limiting-algorithms/TokenBucket.js)
- **Characteristics**:
  - Tokens refill steadily over time up to `capacity`.
  - **Burst friendly**: allows bursts of requests up to `capacity` instantly at the exact same millisecond.
  - Common use case: API gateways (Stripe, GitHub, AWS).

### 2. Leaky Bucket
- **Implementation**: [`rate-limiting-algorithms/LeakyBucket.js`](./rate-limiting-algorithms/LeakyBucket.js)
- **Characteristics**:
  - Bounded FIFO queue of requests up to `capacity`.
  - **Traffic shaping**: Smooths out bursts by leaking/processing requests at a constant, fixed rate (e.g. 1 request every 500ms).
  - Drops incoming requests if the buffer queue is full.
  - Common use case: Traffic shaping, database writes, downstream service protection (Shopify, Nginx).

### Running the Demos
```bash
node index.js
# or
npm start
```
