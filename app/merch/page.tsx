'use client';

import React from 'react';
import styles from './page.module.css';
import { useRef } from 'react';

// Merchandise item component
const MerchItem = ({ name, price }: { name: string; price: string }) => {
  return (
    <div className={styles.merchItem}>
      <div className={styles.merchImageContainer}>
        <div className={styles.placeholderIcon}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
            <path d="M12 8V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <path d="M8 12H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <h3 className={styles.merchName}>{name}</h3>
      <p className={styles.merchPrice}>{price}</p>
    </div>
  );
};

// Merchandise section with carousel
const MerchSection = ({ title }: { title: string }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <div className={styles.merchSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      
      <div className={styles.carouselContainer}>
        <button className={`${styles.scrollButton} ${styles.scrollLeft}`} onClick={scrollLeft} aria-label="Scroll left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className={styles.merchCarousel} ref={scrollContainerRef}>
          <MerchItem name="T-skjorte" price="299 kr" />
          <MerchItem name="Hettegenser" price="499 kr" />
          <MerchItem name="Caps" price="249 kr" />
          <MerchItem name="Totebag" price="199 kr" />
          <MerchItem name="Klistremerke" price="49 kr" />
          <MerchItem name="Plakat" price="149 kr" />
        </div>
        
        <button className={`${styles.scrollButton} ${styles.scrollRight}`} onClick={scrollRight} aria-label="Scroll right">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default function MerchPage() {
  return (
    <main className={styles.container}>
      <div className={styles.merchSectionsContainer}>
        <MerchSection title="Fosskok" />
        <MerchSection title="August Kann" />
        <MerchSection title="Leon Røsten Trio" />
        <MerchSection title="Duetrost" />
      </div>
    </main>
  );
}
