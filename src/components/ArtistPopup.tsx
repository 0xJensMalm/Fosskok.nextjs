import React from 'react';
import styles from './ArtistPopup.module.css';
import { Artist } from './ArtistCard';

interface ArtistPopupProps {
  artist: Artist;
  onClose: () => void;
}

const ArtistPopup: React.FC<ArtistPopupProps> = ({ artist, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Lukk">×</button>
        <div className={styles.leftCol}>
          <img src={artist.image} alt={artist.title} className={styles.image} />
          <h3 className={styles.title}>{artist.title}</h3>
        </div>
        <div className={styles.rightCol}>
          {artist.time && <span className={styles.time}>{artist.time}</span>}
          <div className={styles.descriptionContainer}>
            {artist.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className={styles.descriptionParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPopup;
