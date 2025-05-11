import React from 'react';
import styles from './ArtistCard.module.css';

export interface Artist {
  image: string;
  title: string;
  time: string;
  description: string;
}

interface ArtistCardProps {
  artist: Artist;
  onClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick} tabIndex={0} role="button" aria-pressed="false">
      <img src={artist.image} alt={artist.title} className={styles.image} />
      <div className={styles.info}>
        <h4 className={styles.title}>{artist.title}</h4>
        <span className={styles.time}>{artist.time}</span>
      </div>
    </div>
  );
};

export default ArtistCard;
