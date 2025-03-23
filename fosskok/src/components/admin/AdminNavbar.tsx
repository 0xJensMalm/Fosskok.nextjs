"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminNavbar.module.css';

interface AdminNavbarProps {
  activePanel: 'members' | 'events' | 'blog';
  setActivePanel: (panel: 'members' | 'events' | 'blog') => void;
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
      });

      if (response.ok) {
        // Redirect to login page after logout
        router.push('/admin/login');
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
      </div>
      <button 
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        Logg ut
      </button>
    </nav>
  );
};

export default AdminNavbar;
