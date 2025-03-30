"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminNavbar.module.css';

interface AdminNavbarProps {
  activePanel: 'members' | 'events' | 'blog' | 'featureFlags' | 'gryta';
  setActivePanel: (panel: 'members' | 'events' | 'blog' | 'featureFlags' | 'gryta') => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ activePanel, setActivePanel }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Force a hard refresh to ensure cookie is cleared
        window.location.href = '/admin/login';
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className={styles.adminNav}>
      <div className={styles.navButtons}>
        <button 
          className={`${styles.navButton} ${activePanel === 'members' ? styles.active : ''}`}
          onClick={() => setActivePanel('members')}
        >
          <span className={styles.navIcon}>👥</span>
          Medlemmer
        </button>
        <button 
          className={`${styles.navButton} ${activePanel === 'events' ? styles.active : ''}`}
          onClick={() => setActivePanel('events')}
        >
          <span className={styles.navIcon}>📅</span>
          Arrangementer
        </button>
        <button 
          className={`${styles.navButton} ${activePanel === 'blog' ? styles.active : ''}`}
          onClick={() => setActivePanel('blog')}
        >
          <span className={styles.navIcon}>📝</span>
          Blogginnlegg
        </button>
        <button 
          className={`${styles.navButton} ${activePanel === 'featureFlags' ? styles.active : ''}`}
          onClick={() => setActivePanel('featureFlags')}
        >
          <span className={styles.navIcon}>🚩</span>
          Funksjoner
        </button>
        <button 
          className={`${styles.navButton} ${activePanel === 'gryta' ? styles.active : ''}`}
          onClick={() => setActivePanel('gryta')}
        >
          <span className={styles.navIcon}>🧩</span>
          Gryta
        </button>
      </div>
      <button 
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        <span className={styles.navIcon}>🚪</span>
        Logg ut
      </button>
    </nav>
  );
};

export default AdminNavbar;
