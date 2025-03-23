"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import ContentContainer from "../src/components/ContentContainer";

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
    time: date.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })
  };
};

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch upcoming events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Sort events by date (ascending)
        const sortedEvents = [...data].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        // Get only future events or events happening today
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of today
        
        const futureEvents = sortedEvents.filter(event => 
          new Date(event.date) >= now
        );
        
        // Get only the next 3 events
        setUpcomingEvents(futureEvents.slice(0, 3));
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  return (
    <ContentContainer>
      <div className={styles.homeLayout}>
        <div className={styles.mainContent}>
          <h1 className={styles.title}>Velkommen til Fosskok</h1>
          <p className={styles.description}>
            Et kunstkollektiv dedikert til kreativitet og fellesskap.
          </p>
          <div className={styles.introText}>
            <p>
              Fosskok er et samlingspunkt for kunstnere og kreative sjeler som ønsker å 
              utforske og dele sine ideer i et inkluderende miljø.
            </p>
            <p>
              Vi arrangerer utstillinger, konserter, workshops og andre kulturelle 
              arrangementer gjennom hele året.
            </p>
            <p>
              Fosskok er et kunstnerkollektiv grunnlagt i 2024 på Hammer Gård i Lørenskog.
              Vi er en gruppe kunstnere, designere, musikere og skapere som jobber sammen 
              for å utforske nye ideer og skape meningsfulle opplevelser gjennom kunst.
            </p>
          </div>
        </div>
        
        <div className={styles.sideContent}>
          <h2 className={styles.sideTitle}>Kommende arrangementer</h2>
          {isLoading ? (
            <div className={styles.loadingState}>Laster arrangementer...</div>
          ) : error ? (
            <div className={styles.errorState}>{error}</div>
          ) : upcomingEvents.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Ingen kommende arrangementer</p>
              <Link href="/arrangementer" className={styles.viewAllLink}>
                Se alle arrangementer
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.eventsList}>
                {upcomingEvents.map((event) => {
                  const formattedDate = formatDate(event.date);
                  
                  return (
                    <div key={event.id} className={styles.eventCard}>
                      <div className={styles.eventDate}>
                        <span className={styles.day}>{formattedDate.day}</span>
                        <span className={styles.month}>{formattedDate.month}</span>
                      </div>
                      <div className={styles.eventDetails}>
                        <h3>{event.title}</h3>
                        <p className={styles.eventTime}>{event.location} - {formattedDate.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href="/arrangementer" className={styles.viewAllLink}>
                Se alle arrangementer
              </Link>
            </>
          )}
        </div>
      </div>
    </ContentContainer>
  );
}
