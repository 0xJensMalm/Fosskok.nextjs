"use client";

import React, { useState, useEffect } from 'react';
import styles from './AdminPanels.module.css';
import ImageUploader from './ImageUploader';

// Interface for Member type
interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const MembersPanel: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for new/edit member
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: ''
  });
  
  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/members', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        
        const data = await response.json();
        setMembers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Failed to load members. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembers();
  }, []);
  
  const handleSelectMember = (member: Member) => {
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

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (isEditing && selectedMember) {
        // Update existing member
        const response = await fetch(`/api/members/${selectedMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update member');
        }
        
        const updatedMember = await response.json();
        
        // Update local state
        setMembers(prev => 
          prev.map(m => 
            m.id === selectedMember.id ? updatedMember : m
          )
        );
        
        setSelectedMember(updatedMember);
      } else if (isEditing) {
        // Create new member
        const response = await fetch('/api/members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create member');
        }
        
        const newMember = await response.json();
        
        // Update local state
        setMembers(prev => [...prev, newMember]);
        setSelectedMember(newMember);
      }
      
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error saving member:', err);
      setError('Failed to save member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedMember) return;
    
    if (!confirm(`Er du sikker på at du vil slette ${selectedMember.name}?`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/members/${selectedMember.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      
      // Update local state
      setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
      setSelectedMember(null);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error deleting member:', err);
      setError('Failed to delete member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h2>Administrer Medlemmer</h2>
        <button 
          className={styles.addButton}
          onClick={handleNewMember}
          disabled={isLoading}
        >
          Legg til medlem
        </button>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div className={styles.panelContent}>
        <div className={styles.itemsList}>
          {isLoading && members.length === 0 ? (
            <div className={styles.loadingState}>Laster medlemmer...</div>
          ) : members.length === 0 ? (
            <div className={styles.emptyState}>Ingen medlemmer funnet</div>
          ) : (
            members.map(member => (
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
            ))
          )}
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
                    disabled={isLoading}
                  >
                    Rediger
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={handleDelete}
                    disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Bilde</label>
                <ImageUploader 
                  onImageUploaded={handleImageUploaded}
                  folder="members"
                />
                {formData.image && (
                  <div className={styles.imagePreview}>
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>
              
              <div className={styles.formActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Avbryt
                </button>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Lagrer...' : 'Lagre'}
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
