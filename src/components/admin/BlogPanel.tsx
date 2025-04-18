"use client";

import React, { useState, useEffect } from 'react';
import styles from './AdminPanels.module.css';
import ImageUploader from './ImageUploader';

const BlogPanel: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for new/edit blog post
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    image_url: '',
    is_published: true,
    slug: '',
  });

  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/blog', { credentials: 'include' });
        if (!res.ok) throw new Error('Kunne ikke hente blogginnlegg');
        const data = await res.json();
        setBlogPosts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Ukjent feil ved henting av blogginnlegg');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSelectPost = (post: any) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      author: post.author,
      content: post.content,
      image_url: post.image_url || '',
      is_published: post.is_published,
      slug: post.slug || '',
    });
    setIsEditing(false);
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setFormData({
      title: '',
      author: 'Fosskok-teamet',
      content: '',
      image_url: '',
      is_published: true,
      slug: '',
    });
    setIsEditing(true);
  };

  const handleEditPost = () => {
    setIsEditing(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  // Save (create or update)
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let response;
      if (isEditing && selectedPost) {
        // Update
        response = await fetch(`/api/blog/${selectedPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
      } else {
        // Create
        response = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
      }
      if (!response.ok) throw new Error('Kunne ikke lagre blogginnlegget');
      const saved = await response.json();
      // Refresh list
      const postsRes = await fetch('/api/blog', { credentials: 'include' });
      setBlogPosts(await postsRes.json());
      setSelectedPost(saved);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Ukjent feil ved lagring');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!selectedPost) return;
    if (!window.confirm(`Er du sikker på at du vil slette "${selectedPost.title}"?`)) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/blog/${selectedPost.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Kunne ikke slette blogginnlegget');
      // Refresh list
      const postsRes = await fetch('/api/blog', { credentials: 'include' });
      setBlogPosts(await postsRes.json());
      setSelectedPost(null);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Ukjent feil ved sletting');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h2>Administrer Blogginnlegg</h2>
        <button className={styles.addButton} onClick={handleNewPost}>
          Legg til innlegg
        </button>
      </div>

      <div className={styles.panelContent}>
        <div className={styles.itemsList}>
          {isLoading ? (
            <div className={styles.loadingContainer}>Laster...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : blogPosts.length === 0 ? (
            <div className={styles.emptyState}>Ingen blogginnlegg funnet.</div>
          ) : (
            blogPosts.map(post => (
              <div
                key={post.id}
                className={`${styles.itemCard} ${selectedPost?.id === post.id ? styles.selected : ''} ${!post.is_published ? styles.unpublished : ''}`}
                onClick={() => handleSelectPost(post)}
              >
                <div className={styles.itemPreview}>
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className={styles.previewImage} />
                  ) : (
                    <div className={styles.previewPlaceholder}><span>Blogg</span></div>
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <h3>{post.title}</h3>
                  <p>{formatDate(post.created_at)}</p>
                  {!post.is_published && <span className={styles.unpublishedBadge}>Upublisert</span>}
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.itemDetails}>
          {selectedPost && !isEditing ? (
            <>
              <div className={styles.detailsHeader}>
                <h3>{selectedPost.title}</h3>
                <div className={styles.detailsActions}>
                  <button className={styles.editButton} onClick={handleEditPost}>Rediger</button>
                  <button className={styles.deleteButton} onClick={handleDelete}>Slett</button>
                </div>
              </div>
              <div className={styles.detailsContent}>
                <p><strong>Dato:</strong> {formatDate(selectedPost.created_at)}{!selectedPost.is_published && <span className={styles.unpublishedBadge}>Upublisert</span>}</p>
                <p><strong>Forfatter:</strong> {selectedPost.author}</p>
                <div className={styles.blogContent}><strong>Innhold:</strong><div>{selectedPost.content}</div></div>
                {selectedPost.image_url && (
                  <div className={styles.detailsImage}>
                    <img src={selectedPost.image_url} alt={selectedPost.title} />
                  </div>
                )}
              </div>
            </>
          ) : isEditing ? (
            <div className={styles.editForm}>
              <h3>{selectedPost ? 'Rediger Blogginnlegg' : 'Legg til Blogginnlegg'}</h3>
              <div className={styles.formGroup}>
                <label htmlFor="title">Tittel</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleFormChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="author">Forfatter</label>
                <input type="text" id="author" name="author" value={formData.author} onChange={handleFormChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="content">Innhold</label>
                <textarea id="content" name="content" value={formData.content} onChange={handleFormChange} rows={10} required />
              </div>
              <div className={styles.formGroup}>
                <label>Bilde</label>
                <ImageUploader onImageUploaded={handleImageUploaded} folder="blog" />
                {formData.image_url && (
                  <div className={styles.imagePreview}>
                    <img src={formData.image_url} alt="Preview" />
                  </div>
                )}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleFormChange} />
                  Publisert
                </label>
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>Avbryt</button>
                <button className={styles.saveButton} onClick={handleSave}>Lagre</button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}><p>Velg et blogginnlegg fra listen eller legg til et nytt innlegg</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPanel;
