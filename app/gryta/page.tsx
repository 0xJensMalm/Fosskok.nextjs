import React from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';

export default function Gryta() {
  return (
    <ContentContainer>
      <div className={styles.container}>
        <div className={styles.stayTunedContainer}>
          <h2 className={styles.stayTunedText}>Stay Tuned...</h2>
        </div>
      </div>
    </ContentContainer>
  );
}
