"use client";

import React, { useState, useEffect } from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import styles from './page.module.css';
import { addCacheBuster } from '@/utils/cache-helpers';

// Interface for Member type
interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url?: string | null;
}

// Generate a color based on the member's name (for placeholder)
function getColorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 35%)`;
}

// Member card component
const MemberCard = ({ member, onClick }: { member: Member, onClick: (member: Member) => void }) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className={styles.memberSquare}
      onClick={() => onClick(member)}
    >
      <div 
        className={styles.memberImageContainer}
        style={imageError || !member.image_url ? { backgroundColor: getColorFromName(member.name) } : {}}
      >
        {!imageError && member.image_url ? (
          <img 
            src={member.image_url} 
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
        </div>
      </div>
    </div>
  );
};

// Modal component for member details
const MemberModal = ({ member, onClose }: { member: Member, onClose: () => void }) => {
  const [imageError, setImageError] = useState(false);
  
  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalHeader}>
          <div 
            className={styles.modalImage}
            style={imageError || !member.image_url ? { backgroundColor: getColorFromName(member.name) } : {}}
          >
            {!imageError && member.image_url ? (
              <img 
                src={member.image_url} 
                alt={member.name} 
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={styles.modalInitials}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          
          <div className={styles.modalInfo}>
            <h2>{member.name}</h2>
            <p className={styles.modalRole}>{member.role}</p>
          </div>
        </div>
        
        <div className={styles.modalBio}>
          <p>{member.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default function Folka() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        // Add cache buster to prevent browser caching
        const response = await fetch(addCacheBuster('/api/members'));
        
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
    
    // Remove real-time subscription and periodic refresh
    // This will prevent stuttering caused by frequent updates
  }, []);

  const handleOpenModal = (member: Member) => {
    setSelectedMember(member);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseModal = () => {
    setSelectedMember(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <ContentContainer>
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <p>Laster inn folka...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : members.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p>Ingen folk funnet</p>
          </div>
        ) : (
          <div className={styles.membersGrid}>
            {members.map(member => (
              <MemberCard 
                key={member.id} 
                member={member} 
                onClick={handleOpenModal}
              />
            ))}
          </div>
        )}
        
        {selectedMember && (
          <MemberModal 
            member={selectedMember} 
            onClose={handleCloseModal}
          />
        )}
      </div>
    </ContentContainer>
  );
}
