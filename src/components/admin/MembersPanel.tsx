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
  image_url?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const MembersPanel: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state for new/edit member
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: ''
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
        setFilteredMembers(data);
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
  
  // Filter members based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMembers(members);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = members.filter(member => 
      member.name.toLowerCase().includes(query) || 
      member.role.toLowerCase().includes(query)
    );
    
    setFilteredMembers(filtered);
  }, [searchQuery, members]);
  
  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image_url: member.image_url || ''
    });
    setIsEditing(false);
  };
  
  const handleNewMember = () => {
    setSelectedMember(null);
    setFormData({
      name: '',
      role: '',
      bio: '',
      image_url: ''
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
      image_url: imageUrl
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
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Søk etter medlemmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>

          {isLoading && members.length === 0 ? (
            <div className={styles.loadingState}>Laster medlemmer...</div>
          ) : filteredMembers.length === 0 ? (
            <div className={styles.emptyState}>
              <span>👤</span>
              <p>
                {searchQuery ? 'Ingen medlemmer funnet med dette søket' : 'Ingen medlemmer funnet. Legg til ditt første medlem!'}
              </p>
            </div>
          ) : (
            filteredMembers.map(member => (
              <div 
                key={member.id} 
                className={`${styles.itemCard} ${selectedMember?.id === member.id ? styles.selected : ''}`}
                onClick={() => handleSelectMember(member)}
              >
                <div className={styles.itemPreview}>
                  {member.image_url ? (
                    <img 
                      src={member.image_url} 
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
                    ✏️ Rediger
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    🗑️ Slett
                  </button>
                </div>
              </div>
              
              <div className={styles.detailsContent}>
                <div className={styles.detailsInfo}>
                  <div className={styles.detailsField}>
                    <h4>Rolle</h4>
                    <p>{selectedMember.role}</p>
                  </div>
                  <div className={styles.detailsField}>
                    <h4>Bio</h4>
                    <p>{selectedMember.bio}</p>
                  </div>
                  {selectedMember.createdAt && (
                    <div className={styles.detailsField}>
                      <h4>Lagt til</h4>
                      <p>{new Date(selectedMember.createdAt).toLocaleDateString('no-NO')}</p>
                    </div>
                  )}
                </div>
                
                {selectedMember.image_url && (
                  <div className={styles.detailsImage}>
                    <img src={selectedMember.image_url} alt={selectedMember.name} />
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
                {formData.image_url && (
                  <div className={styles.imagePreview}>
                    <img src={formData.image_url} alt="Preview" />
                  </div>
                )}
              </div>
              
              <div className={styles.formActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  ❌ Avbryt
                </button>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Lagrer...' : '💾 Lagre'}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>👈</span>
              <p>Velg et medlem fra listen eller legg til et nytt medlem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembersPanel;
