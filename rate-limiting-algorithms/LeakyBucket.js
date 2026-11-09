class LeakyBucket {
  constructor(capacity, leakRatePerSec) {
    this.capacity = capacity;                    // Max requests queue can hold
    this.queue = [];                             // FIFO queue
    this.leakIntervalMs = 1000 / leakRatePerSec; // Delay between leaking requests
    this.isProcessing = false;
  }

  add(task) {
    if (this.queue.length >= this.capacity) {
      return false; // Queue full: drop request
    }

    this.queue.push(task);

    // Start processing if not already draining
    if (!this.isProcessing) {
      this.process();
    }

    return true;
  }

  async process() {
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      task(); // Execute request

      // Wait for the steady leak interval before leaking the next one
      await new Promise((resolve) => setTimeout(resolve, this.leakIntervalMs));
    }

    this.isProcessing = false;
  }
}

module.exports = LeakyBucket;