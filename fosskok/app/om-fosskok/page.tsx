import React from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';

export default function OmFosskok() {
  return (
    <ContentContainer>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <p className={styles.intro}>
              Fosskok er et kunstnerkollektiv grunnlagt i 2024 på Hammer Gård i Lørenskog.
            </p>
            
            <p>
              Vi er en gruppe kunstnere, designere, musikere og skapere som jobber sammen for å utforske nye ideer og skape meningsfulle opplevelser gjennom kunst.
            </p>
            
            <p>
              Kollektivet vårt fungerer som et kreativt fellesskap der medlemmene kan dele ressurser, kunnskap og inspirasjon. Vi tror på kraften i samarbeid og tverrfaglig praksis for å skape innovativ kunst som engasjerer publikum på nye måter.
            </p>
            
            <p>
              Fosskok har base i Oslo, men våre prosjekter strekker seg over hele Norge og internasjonalt. Vi jobber med ulike medier og uttrykksformer, fra visuell kunst og musikk til performance og litteratur.
            </p>
          </div>
          <div className={styles.imageContainer}>
            <div className={styles.imagePlaceholder}>
              <div className={styles.placeholderText}>Fosskok</div>
            </div>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
}
