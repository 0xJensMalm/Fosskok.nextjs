"use client";

import React, { useState } from 'react';
import styles from './AdminPanels.module.css';

// Mock data for initial UI development
const mockMembers = [
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
  }
];

const MembersPanel: React.FC = () => {
  const [members, setMembers] = useState(mockMembers);
  const [selectedMember, setSelectedMember] = useState<typeof mockMembers[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for new/edit member
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: ''
  });
  
  const handleSelectMember = (member: typeof mockMembers[0]) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image || ''
    });
    setIsEditing(false);
  };
  
  const handleNewMember = () => {
    setSelectedMember(null);
    setFormData({
      name: '',
      role: '',
      bio: '',
      image: ''
    });
    setIsEditing(true);
  };
  
  const handleEditMember = () => {
    setIsEditing(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    // This would normally connect to an API
    // For now, we'll just update the UI state
    if (isEditing && selectedMember) {
      // Editing existing member
      setMembers(prev => 
        prev.map(m => 
          m.id === selectedMember.id 
            ? { ...m, ...formData } 
            : m
        )
      );
    } else if (isEditing) {
      // Adding new member
      const newMember = {
        id: `member${Date.now()}`,
        ...formData
      };
      setMembers(prev => [...prev, newMember]);
    }
    
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (selectedMember) {
      // This would normally connect to an API
      // For now, we'll just update the UI state
      setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
      setSelectedMember(null);
      setIsEditing(false);
    }
  };
  
  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h2>Administrer Medlemmer</h2>
        <button 
          className={styles.addButton}
          onClick={handleNewMember}
        >
          Legg til medlem
        </button>
      </div>
      
      <div className={styles.panelContent}>
        <div className={styles.itemsList}>
          {members.map(member => (
            <div 
              key={member.id} 
              className={`${styles.itemCard} ${selectedMember?.id === member.id ? styles.selected : ''}`}
              onClick={() => handleSelectMember(member)}
            >
              <div className={styles.itemPreview}>
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.previewInitials}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              <div className={styles.itemInfo}>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.itemDetails}>
          {selectedMember && !isEditing ? (
            <>
              <div className={styles.detailsHeader}>
                <h3>{selectedMember.name}</h3>
                <div className={styles.detailsActions}>
                  <button 
                    className={styles.editButton}
                    onClick={handleEditMember}
                  >
                    Rediger
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={handleDelete}
                  >
                    Slett
                  </button>
                </div>
              </div>
              
              <div className={styles.detailsContent}>
                <p><strong>Rolle:</strong> {selectedMember.role}</p>
                <p><strong>Bio:</strong> {selectedMember.bio}</p>
                {selectedMember.image && (
                  <div className={styles.detailsImage}>
                    <img src={selectedMember.image} alt={selectedMember.name} />
                  </div>
                )}
              </div>
            </>
          ) : isEditing ? (
            <div className={styles.editForm}>
              <h3>{selectedMember ? 'Rediger Medlem' : 'Legg til Medlem'}</h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="name">Navn</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="role">Rolle</label>
                <input 
                  type="text" 
                  id="role" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleFormChange}
                  rows={5}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="image">Bilde URL</label>
                <input 
                  type="text" 
                  id="image" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleFormChange}
                  placeholder="f.eks. /images/person.jpg"
                />
              </div>
              
              <div className={styles.formActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                >
                  Avbryt
                </button>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                >
                  Lagre
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Velg et medlem fra listen eller legg til et nytt medlem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersPanel;
