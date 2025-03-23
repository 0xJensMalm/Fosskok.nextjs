import React from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';

// Mock data for events
const events = [
  {
    id: "utstilling-2025",
    title: "Utstillingsåpning",
    date: {
      day: "15",
      month: "Mar",
      year: "2025",
      full: "2025-03-15"
    },
    location: "Galleri, Oslo",
    description: "Bli med på åpningen av vår nye utstilling med verk fra alle kollektivets medlemmer.",
    image: null
  },
  {
    id: "workshop-2025",
    title: "Workshop",
    date: {
      day: "22",
      month: "Mar",
      year: "2025",
      full: "2025-03-22"
    },
    location: "Fosskok Studio, Oslo",
    description: "Kreativ workshop med fokus på bærekraftige materialer og gjenbruk i kunst.",
    image: null
  },
  {
    id: "kunstnersamtale-2025",
    title: "Kunstnersamtale",
    date: {
      day: "5",
      month: "Apr",
      year: "2025",
      full: "2025-04-05"
    },
    location: "Kulturhuset, Oslo",
    description: "En samtale med kunstnerne bak den nye utstillingen om prosessen og inspirasjonskildene.",
    image: null
  },
  {
    id: "filmvisning-2025",
    title: "Filmvisning",
    date: {
      day: "12",
      month: "Apr",
      year: "2025",
      full: "2025-04-12"
    },
    location: "Cinemateket, Oslo",
    description: "Visning av eksperimentelle kortfilmer laget av kollektivets medlemmer.",
    image: null
  },
  {
    id: "konsert-2025",
    title: "Konsert",
    date: {
      day: "19",
      month: "Apr",
      year: "2025",
      full: "2025-04-19"
    },
    location: "Blå, Oslo",
    description: "Liveopptreden med musikere fra kollektivet og spesielle gjester.",
    image: null
  },
  {
    id: "poesikveld-2025",
    title: "Poesikveld",
    date: {
      day: "26",
      month: "Apr",
      year: "2025",
      full: "2025-04-26"
    },
    location: "Litteraturhuset, Oslo",
    description: "En kveld med poesi, prosa og performance fra kollektivets forfattere.",
    image: null
  }
];

export default function Arrangementer() {
  return (
    <ContentContainer>
      <div className={styles.container}>    
        <div className={styles.eventsGrid}>
          {events.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventDate}>
                <span className={styles.day}>{event.date.day}</span>
                <span className={styles.month}>{event.date.month}</span>
              </div>
              <div className={styles.eventDetails}>
                <h3>{event.title}</h3>
                <p className={styles.eventLocation}>{event.location}</p>
                <p className={styles.eventDescription}>{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentContainer>
  );
}
