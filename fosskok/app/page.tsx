import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import ContentContainer from "../src/components/ContentContainer";

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: "event1",
    title: "Utstillingsåpning",
    day: "15",
    month: "Mar",
    location: "Galleri, Oslo",
    time: "18:00"
  },
  {
    id: "event2",
    title: "Workshop",
    day: "22",
    month: "Mar",
    location: "Fosskok Studio, Oslo",
    time: "12:00"
  },
  {
    id: "event3",
    title: "Kunstnersamtale",
    day: "5",
    month: "Apr",
    location: "Kulturhuset, Oslo",
    time: "19:00"
  }
];

export default function Home() {
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
          <div className={styles.eventsList}>
            {upcomingEvents.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventDate}>
                  <span className={styles.day}>{event.day}</span>
                  <span className={styles.month}>{event.month}</span>
                </div>
                <div className={styles.eventDetails}>
                  <h3>{event.title}</h3>
                  <p className={styles.eventTime}>{event.location} - {event.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/arrangementer" className={styles.viewAllLink}>
            Se alle arrangementer
          </Link>
        </div>
      </div>
    </ContentContainer>
  );
}
