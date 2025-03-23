/**
 * Utility functions for cache management and data refreshing
 */

// Global event bus for cache invalidation
type CacheInvalidationCallback = () => void;
type CacheInvalidationEvent = 'members' | 'events' | 'blog';

// Store callbacks by event type
const listeners: Record<CacheInvalidationEvent, CacheInvalidationCallback[]> = {
  members: [],
  events: [],
  blog: []
};

/**
 * Subscribe to cache invalidation events
 * @param event The event type to subscribe to
 * @param callback The callback to execute when the event is triggered
 * @returns A function to unsubscribe
 */
export function subscribeToCacheInvalidation(
  event: CacheInvalidationEvent,
  callback: CacheInvalidationCallback
): () => void {
  listeners[event].push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = listeners[event].indexOf(callback);
    if (index !== -1) {
      listeners[event].splice(index, 1);
    }
  };
}

/**
 * Trigger a cache invalidation event
 * @param event The event type to trigger
 */
export function invalidateCache(event: CacheInvalidationEvent): void {
  console.log(`Invalidating cache for ${event}`);
  listeners[event].forEach(callback => callback());
}

/**
 * Add a cache-busting parameter to a URL
 * @param url The URL to add the cache-busting parameter to
 * @returns The URL with a cache-busting parameter
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}
