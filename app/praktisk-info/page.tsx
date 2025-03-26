import React from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';

export default function PraktiskInfoPage() {
  return (
    <ContentContainer>
      <div className={styles.container}>
        <h1 className={styles.title}>Praktisk informasjon</h1>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Hvordan komme seg hit</h2>
          <div className={styles.mapContainer}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1997.9603686622866!2d10.9742835!3d59.9392612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46417afb373c1e3d%3A0x3f8a6a9ac4bcc3a6!2sHammerveien%2026%2C%201474%20L%C3%B8renskog!5e0!3m2!1sno!2sno!4v1616661282937!5m2!1sno!2sno" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - Fosskok location"
              className={styles.map}
            ></iframe>
          </div>
          <div className={styles.addressContainer}>
            <div className={styles.addressInfo}>
              <h3 className={styles.addressTitle}>Adresse</h3>
              <p className={styles.address}>
                Hammerveien 26<br />
                1474 Lørenskog
              </p>
            </div>
            <div className={styles.transportInfo}>
              <h3 className={styles.transportTitle}>Transport</h3>
              <ul className={styles.transportList}>
                <li>
                  <strong>Kollektivtransport:</strong> Buss 110 stopper rett nede på veien. Går ofte og sent. 
                </li>
                <li>
                  <strong>Bil:</strong> Stor parkeringsplass tilknyttet kirken rett på nedsiden av huset.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </ContentContainer>
  );
}
