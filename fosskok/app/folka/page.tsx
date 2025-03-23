"use client";

import React, { useState } from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';

// Mock data for members
const members = [
  {
    id: "member1",
    name: "Anna Johansen",
    role: "Kunstner & Kurator",
    bio: "Anna arbeider med maleri og installasjoner. Hun utforsker temaer knyttet til natur og menneskelig påvirkning.",
    image: "/images/placeholder-person.jpg"
  },
  {
    id: "member2",
    name: "Erik Larsen",
    role: "Musiker & Komponist",
    bio: "Erik er en eksperimentell komponist som arbeider i skjæringspunktet mellom elektronisk og akustisk musikk.",
    image: "/images/placeholder-person.jpg"
  },
  {
    id: "member3",
    name: "Maria Olsen",
    role: "Fotograf",
    bio: "Maria dokumenterer hverdagslivet i urbane miljøer, med fokus på sosiale strukturer og fellesskap.",
    image: "/images/placeholder-person.jpg"
  },
  {
    id: "member4",
    name: "Sofie Hansen",
    role: "Danser & Koreograf",
    bio: "Sofie utforsker bevegelse som kommunikasjonsform og arbeider med improvisasjon og stedsspesifikke verk.",
    image: "/images/placeholder-person.jpg"
  },
  {
    id: "member5",
    name: "Thomas Berg",
    role: "Forfatter & Poet",
    bio: "Thomas skriver tekster som utforsker identitet, tilhørighet og språkets grenser.",
    image: "/images/placeholder-person.jpg"
  },
  {
    id: "member6",
    name: "Lisa Andersen",
    role: "Visuell kunstner",
    bio: "Lisa arbeider med video og digitale medier, og utforsker temaer knyttet til teknologi og menneskelighet.",
    image: "/images/placeholder-person.jpg"
  }
];

// Generate a color based on the member's name (for placeholder)
const getColorFromName = (name: string) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', 
    '#FB5607', '#8338EC', '#3A86FF', '#06D6A0'
  ];
  
  // Simple hash function to get consistent color for a name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Member card component
const MemberCard = ({ member }: { member: typeof members[0] }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className={styles.memberSquare}>
      <div 
        className={styles.memberImageContainer}
        style={imageError ? { backgroundColor: getColorFromName(member.name) } : {}}
      >
        {!imageError ? (
          <img 
            src={member.image} 
            alt={member.name} 
            className={styles.memberImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.memberInitials}>
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        <div className={styles.memberOverlay}>
          <h2 className={styles.memberName}>{member.name}</h2>
          <p className={styles.memberRole}>{member.role}</p>
          <p className={styles.memberBio}>{member.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default function Folka() {
  return (
    <ContentContainer>
      <div className={styles.container}>
        <div className={styles.membersGrid}>
          {members.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </ContentContainer>
  );
}
