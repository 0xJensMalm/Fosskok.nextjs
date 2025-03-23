import React from 'react';
import styles from './page.module.css';

// Artist merch section component
const MerchSection = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className={styles.merchSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDescription}>{description}</p>
      <div className={styles.comingSoonContainer}>
        <div className={styles.comingSoonMessage}>
          <h3>Kommer snart</h3>
          <p>Merch for {title} er under utvikling. Kom tilbake snart!</p>
        </div>
      </div>
    </div>
  );
};

export default function MerchPage() {
  return (
    <main className={styles.container}>
      <div className={styles.merchSectionsContainer}>
        <MerchSection 
          title="Fosskok Merch" 
          description="Offisiell merch fra Fosskok Samvirkelag - t-skjorter, hettegensere, plakater og mer."
        />
        
        <MerchSection 
          title="August Kann" 
          description="Merch fra August Kann - plater, t-skjorter og mer."
        />
        
        <MerchSection 
          title="Leon Røsten Trio" 
          description="Offisiell merch fra Leon Røsten Trio - plater, t-skjorter og mer."
        />
        
        <MerchSection 
          title="Duetrost" 
          description="Merch fra Duetrost - plater, t-skjorter og mer."
        />
      </div>
    </main>
  );
}
