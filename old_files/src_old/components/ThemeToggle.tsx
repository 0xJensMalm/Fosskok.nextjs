"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Only show the toggle after component has mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setIsRotating(true);
    toggleTheme();
  };

  useEffect(() => {
    if (isRotating) {
      const timer = setTimeout(() => setIsRotating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isRotating]);

  // Don't render anything until client-side
  if (!mounted) {
    return null;
  }

  return (
    <button 
      className={styles.themeToggle}
      onClick={handleToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${styles.icon} ${isRotating ? styles.iconRotate : ''}`}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${styles.icon} ${isRotating ? styles.iconRotate : ''}`}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
