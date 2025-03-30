"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '../../../utils/supabase/client';
import styles from './AdminPanels.module.css';

interface Member {
  id: string;
  name: string;
  image_url?: string;
}

interface GrytaItem {
  id: string;
  image_url: string;
  thumbnail_url: string;
  description: string;
  member_id?: string;
  member_name?: string;
  created_at: string;
  updated_at: string;
}

const GrytaPanel: React.FC = () => {
  const [items, setItems] = useState<GrytaItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Form state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [cropSettings, setCropSettings] = useState({ x: 0, y: 0, width: 600, height: 600 });
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Fetch gryta items and members on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // Fetch gryta items
        const { data: grytaData, error: grytaError } = await supabase
          .from('gryta_items')
          .select('*, members:member_id(name)')
          .order('created_at', { ascending: false });
        
        if (grytaError) {
          throw grytaError;
        }
        
        // Fetch members for dropdown
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('id, name, image_url')
          .order('name');
        
        if (membersError) {
          throw membersError;
        }
        
        // Format the data
        const formattedItems = grytaData.map((item: any) => ({
          id: item.id,
          image_url: item.image_url,
          thumbnail_url: item.thumbnail_url,
          description: item.description,
          member_id: item.member_id,
          member_name: item.members?.name,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        
        setItems(formattedItems);
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({
          text: 'Kunne ikke hente data. Vennligst prøv igjen.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      setMessage({
        text: 'Vennligst velg et bilde',
        type: 'error',
      });
      return;
    }
    
    try {
      setLoading(true);
      setMessage(null);
      
      const supabase = createClient();
      
      // Upload the image
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gryta/${fileName}`;
      
      // TODO: Apply cropping to the image before uploading
      // For now, we'll just upload the original image
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, selectedImage);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      // Create a thumbnail (same URL for now, but would be processed on server)
      const thumbnailPath = `gryta/thumbnails/${fileName}`;
      await supabase.storage
        .from('images')
        .copy(filePath, thumbnailPath);
      
      const { data: thumbnailUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(thumbnailPath);
      
      // Insert the new item
      const { error: insertError } = await supabase
        .from('gryta_items')
        .insert({
          image_url: urlData.publicUrl,
          thumbnail_url: thumbnailUrlData.publicUrl,
          description,
          member_id: selectedMember || null,
        });
      
      if (insertError) {
        throw insertError;
      }
      
      // Refresh the list
      const { data: newData, error: refreshError } = await supabase
        .from('gryta_items')
        .select('*, members:member_id(name)')
        .order('created_at', { ascending: false });
      
      if (refreshError) {
        throw refreshError;
      }
      
      // Format and update the data
      const formattedItems = newData.map((item: any) => ({
        id: item.id,
        image_url: item.image_url,
        thumbnail_url: item.thumbnail_url,
        description: item.description,
        member_id: item.member_id,
        member_name: item.members?.name,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      
      setItems(formattedItems);
      
      // Reset form
      setSelectedImage(null);
      setPreviewUrl(null);
      setDescription('');
      setSelectedMember('');
      
      setMessage({
        text: 'Gryta-innhold ble lagt til!',
        type: 'success',
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error adding gryta item:', error);
      setMessage({
        text: 'Kunne ikke legge til innhold. Vennligst prøv igjen.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle item deletion
  const handleDelete = async (id: string) => {
    if (!window.confirm('Er du sikker på at du vil slette dette innholdet?')) {
      return;
    }
    
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Find the item to get image paths
      const itemToDelete = items.find(item => item.id === id);
      
      if (!itemToDelete) {
        throw new Error('Item not found');
      }
      
      // Delete the item from the database
      const { error: deleteError } = await supabase
        .from('gryta_items')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Extract file paths from URLs
      const imagePath = itemToDelete.image_url.split('/').pop();
      const thumbnailPath = itemToDelete.thumbnail_url.split('/').pop();
      
      // Delete the files from storage
      if (imagePath) {
        await supabase.storage
          .from('images')
          .remove([`gryta/${imagePath}`]);
      }
      
      if (thumbnailPath) {
        await supabase.storage
          .from('images')
          .remove([`gryta/thumbnails/${thumbnailPath}`]);
      }
      
      // Update the state
      setItems(items.filter(item => item.id !== id));
      
      setMessage({
        text: 'Innhold ble slettet',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting gryta item:', error);
      setMessage({
        text: 'Kunne ikke slette innhold. Vennligst prøv igjen.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.panelContainer}>
      <h2 className={styles.panelTitle}>Gryta</h2>
      
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
      
      <div className={styles.formSection}>
        <h3>Legg til nytt innhold</h3>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="image">Bilde (600x600)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className={styles.fileInput}
            />
            
            {previewUrl && (
              <div className={styles.imagePreviewContainer}>
                <div className={styles.imagePreview}>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    ref={imageRef as any}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <p className={styles.previewNote}>
                  Bildet vil bli beskåret til et kvadrat (600x600px)
                </p>
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Beskrivelse</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textArea}
              rows={4}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="member">Tilknyttet medlem</label>
            <select
              id="member"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className={styles.select}
            >
              <option value="">Ingen (anonym)</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Lyd</label>
            <div className={styles.placeholderField}>
              Kommer snart
            </div>
          </div>
          
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !selectedImage}
          >
            {loading ? 'Laster opp...' : 'Legg til'}
          </button>
        </form>
      </div>
      
      <div className={styles.listSection}>
        <h3>Eksisterende innhold</h3>
        
        {loading && items.length === 0 ? (
          <div className={styles.loadingContainer}>Laster innhold...</div>
        ) : items.length === 0 ? (
          <p>Ingen innhold lagt til ennå.</p>
        ) : (
          <div className={styles.itemsGrid}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemImageContainer}>
                  <Image
                    src={item.thumbnail_url}
                    alt={item.description}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                
                <div className={styles.itemInfo}>
                  <p className={styles.itemDescription}>
                    {item.description.length > 50
                      ? `${item.description.substring(0, 50)}...`
                      : item.description}
                  </p>
                  
                  <p className={styles.itemMeta}>
                    <span>Av: {item.member_name || 'Anonym'}</span>
                    <span>Dato: {new Date(item.created_at).toLocaleDateString('nb-NO')}</span>
                  </p>
                </div>
                
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(item.id)}
                  title="Slett"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrytaPanel;
