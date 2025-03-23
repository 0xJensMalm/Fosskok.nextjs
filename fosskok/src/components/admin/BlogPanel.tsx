"use client";

import React, { useState } from 'react';
import styles from './AdminPanels.module.css';

// Mock data for initial UI development
const mockBlogPosts = [
  {
    id: "post1",
    title: "Velkommen til Fosskok",
    date: "2025-03-01T12:00:00",
    author: "Fosskok-teamet",
    content: "Vi er glade for å kunne ønske velkommen til Fosskok, et nytt kulturelt samlingspunkt i Oslo. Her vil vi dele kunst, musikk, mat og fellesskap.",
    image: "/images/placeholder-blog.jpg",
    published: true
  },
  {
    id: "post2",
    title: "Kommende arrangementer våren 2025",
    date: "2025-03-15T10:30:00",
    author: "Programkomiteen",
    content: "Vi har gleden av å presentere vårens program med konserter, utstillinger og workshops. Det blir et spennende halvår med både lokale og internasjonale artister.",
    image: "/images/placeholder-blog.jpg",
    published: true
  }
];

const BlogPanel: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState(mockBlogPosts);
  const [selectedPost, setSelectedPost] = useState<typeof mockBlogPosts[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for new/edit blog post
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    image: '',
    published: true
  });
  
  const handleSelectPost = (post: typeof mockBlogPosts[0]) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      author: post.author,
      content: post.content,
      image: post.image || '',
      published: post.published
    });
    setIsEditing(false);
  };
  
  const handleNewPost = () => {
    setSelectedPost(null);
    setFormData({
      title: '',
      author: 'Fosskok-teamet',
      content: '',
      image: '',
      published: true
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
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSave = () => {
    // This would normally connect to an API
    // For now, we'll just update the UI state
    const currentDate = new Date().toISOString();
    
    if (isEditing && selectedPost) {
      // Editing existing post
      setBlogPosts(prev => 
        prev.map(p => 
          p.id === selectedPost.id 
            ? { ...p, ...formData, date: selectedPost.date } 
            : p
        )
      );
    } else if (isEditing) {
      // Adding new post
      const newPost = {
        id: `post${Date.now()}`,
        date: currentDate,
        ...formData
      };
      setBlogPosts(prev => [...prev, newPost]);
    }
    
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (selectedPost) {
      // This would normally connect to an API
      // For now, we'll just update the UI state
      setBlogPosts(prev => prev.filter(p => p.id !== selectedPost.id));
      setSelectedPost(null);
      setIsEditing(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('no-NO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h2>Administrer Blogginnlegg</h2>
        <button 
          className={styles.addButton}
          onClick={handleNewPost}
        >
          Legg til innlegg
        </button>
      </div>
      
      <div className={styles.panelContent}>
        <div className={styles.itemsList}>
          {blogPosts.map(post => (
            <div 
              key={post.id} 
              className={`${styles.itemCard} ${selectedPost?.id === post.id ? styles.selected : ''} ${!post.published ? styles.unpublished : ''}`}
              onClick={() => handleSelectPost(post)}
            >
              <div className={styles.itemPreview}>
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.previewPlaceholder}>
                    <span>Blogg</span>
                  </div>
                )}
              </div>
              <div className={styles.itemInfo}>
                <h3>{post.title}</h3>
                <p>{formatDate(post.date)}</p>
                {!post.published && <span className={styles.unpublishedBadge}>Upublisert</span>}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.itemDetails}>
          {selectedPost && !isEditing ? (
            <>
              <div className={styles.detailsHeader}>
                <h3>{selectedPost.title}</h3>
                <div className={styles.detailsActions}>
                  <button 
                    className={styles.editButton}
                    onClick={handleEditPost}
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
                <p>
                  <strong>Dato:</strong> {formatDate(selectedPost.date)}
                  {!selectedPost.published && <span className={styles.unpublishedBadge}>Upublisert</span>}
                </p>
                <p><strong>Forfatter:</strong> {selectedPost.author}</p>
                <div className={styles.blogContent}>
                  <strong>Innhold:</strong>
                  <div>{selectedPost.content}</div>
                </div>
                
                {selectedPost.image && (
                  <div className={styles.detailsImage}>
                    <img src={selectedPost.image} alt={selectedPost.title} />
                  </div>
                )}
              </div>
            </>
          ) : isEditing ? (
            <div className={styles.editForm}>
              <h3>{selectedPost ? 'Rediger Blogginnlegg' : 'Legg til Blogginnlegg'}</h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="title">Tittel</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="author">Forfatter</label>
                <input 
                  type="text" 
                  id="author" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="content">Innhold</label>
                <textarea 
                  id="content" 
                  name="content" 
                  value={formData.content} 
                  onChange={handleFormChange}
                  rows={10}
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
                  placeholder="f.eks. /images/blog.jpg"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    name="published" 
                    checked={formData.published} 
                    onChange={handleFormChange}
                  />
                  Publisert
                </label>
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
              <p>Velg et blogginnlegg fra listen eller legg til et nytt innlegg</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPanel;
