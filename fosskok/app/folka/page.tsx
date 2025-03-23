"use client";

import React, { useState, useEffect } from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';

// Interface for Member type
interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string | null;
}

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
const MemberCard = ({ member }: { member: Member }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className={styles.memberSquare}>
      <div 
        className={styles.memberImageContainer}
        style={imageError || !member.image ? { backgroundColor: getColorFromName(member.name) } : {}}
      >
        {!imageError && member.image ? (
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
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/members');
        
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Failed to load members');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembers();
  }, []);

  return (
    <ContentContainer>
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <p>Laster inn teamet...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : members.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p>Ingen teammedlemmer funnet</p>
          </div>
        ) : (
          <div className={styles.membersGrid}>
            {members.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </ContentContainer>
  );
}
