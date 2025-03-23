import { createClient } from './client';

// Define payload type for Postgres changes
interface PostgresChangePayload {
  commit_timestamp: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  new: Record<string, any>;
  old: Record<string, any>;
}

type TableChangeCallback = (payload: PostgresChangePayload) => void;
type SubscriptionCleanup = () => void;

/**
 * Subscribe to all changes (insert, update, delete) for a specific table
 * @param table The table name to subscribe to
 * @param callback Function to call when changes occur
 * @returns A cleanup function to unsubscribe
 */
export function subscribeToTableChanges(
  table: 'members' | 'events' | 'blog_posts',
  callback: TableChangeCallback
): SubscriptionCleanup {
  const supabase = createClient();
  
  // Create a unique channel name based on table and timestamp
  const channelName = `${table}-changes-${Date.now()}`;
  
  const channel = supabase.channel(channelName)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      (payload: PostgresChangePayload) => {
        console.log(`Supabase real-time event for ${table}:`, payload);
        callback(payload);
      }
    )
    .subscribe((status: any) => {
      console.log(`Supabase subscription status for ${table}:`, status);
    });
  
  // Return cleanup function
  return () => {
    console.log(`Unsubscribing from ${table} changes`);
    supabase.removeChannel(channel);
  };
}

/**
 * Force refresh data by adding a cache buster to the URL
 * @param url The URL to add a cache buster to
 * @returns URL with cache buster parameter
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}
