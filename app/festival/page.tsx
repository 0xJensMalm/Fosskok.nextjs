import React from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';
import Link from 'next/link';

export default function Festival() {
  return (
    <ContentContainer>
      <div className={styles.container}>
        <div className={styles.posterContainer}>
          <img 
            src="/images/festival/festival-poster.jpg" 
            alt="Festival i hagen 2025 - 14. juni hos Fosskok" 
            className={styles.posterImage}
          />
        </div>
        <p className={styles.subheader}>
          Sommeren 2025 vender vi tilbake til røttene – og inviterer til festival på Hammer Prestegård! Det blir musikk, mat, drikke og glede. På dagtid blir det også gratis barneprogram. Vi løfter frem lokale og kortreiste artister, og skaper en inkluderende møteplass hvor hele nabolaget, kommunen og hvem som helst ellers er velkommen!
        </p>
        
        <div className={styles.festivalContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Kjøp festivalpass</h2>
            <div className={styles.ticketInfo}>
              <div className={styles.ticketType}>
                <h3>Dagspass</h3>
                <p className={styles.price}>kr 350,-</p>
                <p className={styles.earlyBird}>Første 30 billetter: kr 300,-</p>
                <p>Under 16 år: <strong>Gratis!</strong></p>
                <Link href="https://tikkio.com/events/56347" target="_blank" rel="noopener noreferrer" className={styles.button}>Kjøp nå</Link>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Line-up</h2>
            
            <div className={styles.lineup}>
              <div className={styles.stage}>
                <h3>Kirken</h3>
                <div className={styles.stageTable}>
                  <div className={styles.tableHeader}>
                    <span>Artist</span>
                    <span>Tid</span>
                  </div>
                  <div className={styles.comingSoon}>
                    Blir annonsert snart
                  </div>
                </div>
              </div>
              <div className={styles.stage}>
                <h3>Hagen</h3>
                <div className={styles.stageTable}>
                  <div className={styles.tableHeader}>
                    <span>Artist</span>
                    <span>Tid</span>
                  </div>
                  <div className={styles.comingSoon}>
                    Blir annonsert snart
                  </div>
                </div>
              </div>
              <div className={styles.stage}>
                <h3>Stabburet</h3>
                <div className={styles.stageTable}>
                  <div className={styles.tableHeader}>
                    <span>Artist</span>
                    <span>Tid</span>
                  </div>
                  <div className={styles.comingSoon}>
                    Blir annonsert snart
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Mat og drikke</h2>
            <p className={styles.foodDrinkText}>
              Vi serverer kortreist mat og drikke disket opp av vår egen stjernekokk!
            </p>
          </section>
          
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Praktisk info</h2>
            <div className={styles.practicalInfo}>
              <p><strong>Parkering:</strong> Stor parkeringsplass ved kirken rett på nedsiden av hagen</p>
              <p><strong>Dato:</strong> Lørdag 14. juni</p>
              <p><strong>Start:</strong> 14.06.2025 14:00</p>
              <p><strong>Slutt:</strong> 14.06.2025 23:59</p>
              <p><strong>Transport:</strong> Buss 110</p>
            </div>
          </section>
        </div>
      </div>
    </ContentContainer>
  );
}
