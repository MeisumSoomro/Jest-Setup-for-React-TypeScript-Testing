import NodeCache from 'node-cache';

class Cache {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 60 * 60) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl);
  }

  del(keys: string | string[]): number {
    return this.cache.del(keys);
  }

  flush(): void {
    this.cache.flushAll();
  }

  async getOrSet<T>(
    key: string,
    storeFunction: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const value = this.get<T>(key);
    if (value) return value;

    const result = await storeFunction();
    this.set(key, result, ttl);
    return result;
  }
}

export const cache = new Cache(); 