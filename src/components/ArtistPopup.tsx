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
        <img src={artist.image} alt={artist.title} className={styles.image} />
        <h3 className={styles.title}>{artist.title}</h3>
        <span className={styles.time}>{artist.time}</span>
        <p className={styles.description}>{artist.description}</p>
      </div>
    </div>
  );
};

export default ArtistPopup;
