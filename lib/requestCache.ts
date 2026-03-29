/**
 * Request Cache Utility - Deduplicates and caches API calls
 * - Prevents duplicate concurrent requests
 * - Caches responses in memory with TTL
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface PendingRequest<T> {
  promise: Promise<T>;
}

class RequestCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, PendingRequest<any>>();
  private defaultTTL = 30 * 1000; // 30 seconds

  /**
   * Execute a function with caching and request deduplication
   * @param key - Cache key for this request
   * @param fn - Async function to execute
   * @param ttl - Time to live in milliseconds (default: 5 mins)
   */
  async execute<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    // Check if we have a valid cached response
    const cached = this.cache.get(key);
    if (cached) {
      const isExpired = Date.now() - cached.timestamp > cached.ttl;
      if (!isExpired) {
        console.log(`✓ Cache HIT: ${key}`);
        return cached.data;
      } else {
        // Remove expired entry
        this.cache.delete(key);
      }
    }

    // Check if there's already a pending request
    const pending = this.pendingRequests.get(key);
    if (pending) {
      console.log(`⏳ Request DEDUP: ${key} (waiting for in-flight request)`);
      return pending.promise;
    }

    // Execute the function and cache the result
    console.log(`🌐 Cache MISS: ${key} (fetching from API)`);
    const promise = fn()
      .then((data) => {
        // Cache the successful response
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl,
        });
        // Remove from pending
        this.pendingRequests.delete(key);
        return data;
      })
      .catch((error) => {
        // Remove from pending on error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Store as pending request
    this.pendingRequests.set(key, { promise });
    return promise;
  }

  /**
   * Clear a specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️  Cache invalidated: ${key}`);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    console.log(`🗑️  Cache cleared all entries`);
  }

  /**
   * Get cache stats for debugging
   */
  getStats() {
    return {
      cachedEntries: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cacheKeys: Array.from(this.cache.keys()),
    };
  }
}

export const requestCache = new RequestCache();
export default requestCache;
