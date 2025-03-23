"use client";

import React, { useState } from 'react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  folder?: string;
  className?: string;
}

export default function ImageUploader({ 
  onImageUploaded, 
  folder = 'general',
  className = '' 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    try {
      setUploading(true);
      setError('');
      setProgress(10);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      setProgress(100);
      const data = await response.json();
      onImageUploaded(data.url);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`${styles.imageUploader} ${className}`}>
      <label className={styles.uploadLabel}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className={styles.fileInput}
        />
        <div className={styles.uploadButton}>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </div>
      </label>
      
      {uploading && (
        <div className={styles.progressContainer}>
          <div 
            className={styles.progressBar} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
