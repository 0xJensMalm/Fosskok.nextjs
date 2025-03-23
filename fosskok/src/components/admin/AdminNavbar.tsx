"use client";

import React from 'react';
import styles from './AdminNavbar.module.css';

interface AdminNavbarProps {
  activePanel: 'members' | 'events' | 'blog';
  setActivePanel: (panel: 'members' | 'events' | 'blog') => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ activePanel, setActivePanel }) => {
  return (
    <nav className={styles.adminNav}>
      <button 
        className={`${styles.navButton} ${activePanel === 'members' ? styles.active : ''}`}
        onClick={() => setActivePanel('members')}
      >
        Medlemmer
      </button>
      <button 
        className={`${styles.navButton} ${activePanel === 'events' ? styles.active : ''}`}
        onClick={() => setActivePanel('events')}
      >
        Arrangementer
      </button>
      <button 
        className={`${styles.navButton} ${activePanel === 'blog' ? styles.active : ''}`}
        onClick={() => setActivePanel('blog')}
      >
        Blogginnlegg
      </button>
    </nav>
  );
};

export default AdminNavbar;
