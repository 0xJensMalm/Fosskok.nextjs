"use client";

import React, { useState, useEffect } from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';
import { subscribeToTableChanges, addCacheBuster } from '@/utils/supabase/realtime';

// Interface for Event type
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  return {
    day: date.getDate().toString(),
    month: date.toLocaleDateString('no-NO', { month: 'short' }),
    year: date.getFullYear().toString(),
    full: dateString
  };
};

export default function Arrangementer() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        // Add cache buster to prevent browser caching
        const response = await fetch(addCacheBuster('/api/events'));
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Sort events by date (ascending)
        const sortedEvents = [...data].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setEvents(sortedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
    
    // Subscribe to real-time events from Supabase
    const unsubscribe = subscribeToTableChanges('events', () => {
      console.log('Events data changed, refreshing...');
      fetchEvents();
    });
    
    // Set up periodic refresh (every 30 seconds) as a fallback
    const refreshInterval = setInterval(() => {
      console.log('Periodic refresh of events data');
      fetchEvents();
    }, 30000);
    
    // Clean up subscriptions
    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <ContentContainer>
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <p>Laster inn arrangementer...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p>Ingen arrangementer funnet</p>
          </div>
        ) : (
          <div className={styles.eventsGrid}>
            {events.map(event => {
              const formattedDate = formatDate(event.date);
              
              return (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.eventDate}>
                    <span className={styles.day}>{formattedDate.day}</span>
                    <span className={styles.month}>{formattedDate.month}</span>
                  </div>
                  <div className={styles.eventDetails}>
                    <h3>{event.title}</h3>
                    <p className={styles.eventLocation}>{event.location}</p>
                    <p className={styles.eventDescription}>{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ContentContainer>
  );
}
