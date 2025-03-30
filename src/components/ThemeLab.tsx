"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './ThemeLab.module.css';
import { track } from '@vercel/analytics';

// Define the theme variables and their default values
interface ThemeVariable {
  name: string;
  cssVar: string;
  lightDefault: string;
  darkDefault: string;
  category: 'background' | 'text' | 'ui';
}

const themeVariables: ThemeVariable[] = [
  { name: 'Background', cssVar: '--background', lightDefault: '#f8f8f8', darkDefault: '#1a1a1a', category: 'background' },
  { name: 'Foreground', cssVar: '--foreground', lightDefault: '#1a1a1a', darkDefault: '#f8f8f8', category: 'text' },
  { name: 'Accent', cssVar: '--accent', lightDefault: '#666', darkDefault: '#a0a0a0', category: 'text' },
  { name: 'Divider', cssVar: '--divider', lightDefault: '#e0e0e0', darkDefault: '#333', category: 'ui' },
  { name: 'Card Background', cssVar: '--card-bg', lightDefault: '#ffffff', darkDefault: '#222', category: 'background' },
  { name: 'Card Shadow', cssVar: '--card-shadow', lightDefault: 'rgba(0, 0, 0, 0.1)', darkDefault: 'rgba(0, 0, 0, 0.3)', category: 'ui' },
];

const ThemeLab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const { theme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize custom colors from localStorage or set to current values
  useEffect(() => {
    const savedColors = localStorage.getItem('fosskok-theme-lab');
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  // Apply custom colors when they change
  useEffect(() => {
    if (Object.keys(customColors).length > 0) {
      Object.entries(customColors).forEach(([cssVar, value]) => {
        document.documentElement.style.setProperty(cssVar, value);
      });
      
      // Save to localStorage
      localStorage.setItem('fosskok-theme-lab', JSON.stringify(customColors));
    }
  }, [customColors]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    
    // Track theme lab toggle
    track('theme_lab_toggle', { 
      action: !isOpen ? 'open' : 'close',
      current_theme: theme
    });
  };

  const handleColorChange = (cssVar: string, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [cssVar]: value
    }));
    
    // Track color change
    track('theme_lab_color_change', {
      variable: cssVar,
      value: value,
      current_theme: theme
    });
  };

  const resetColors = () => {
    // Clear custom colors
    setCustomColors({});
    
    // Remove custom properties from root element
    themeVariables.forEach(variable => {
      document.documentElement.style.removeProperty(variable.cssVar);
    });
    
    // Clear localStorage
    localStorage.removeItem('fosskok-theme-lab');
    
    // Track reset
    track('theme_lab_reset', { current_theme: theme });
  };

  const getCurrentColor = (variable: ThemeVariable) => {
    if (customColors[variable.cssVar]) {
      return customColors[variable.cssVar];
    }
    
    // Get computed style
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue(variable.cssVar).trim() || 
           (theme === 'light' ? variable.lightDefault : variable.darkDefault);
  };

  return (
    <div className={styles.themeLab} ref={dropdownRef}>
      <button 
        className={styles.themeLabToggle} 
        onClick={toggleDropdown}
        aria-label="Open Theme Lab"
        aria-expanded={isOpen}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2v20"></path>
          <path d="M2 12h20"></path>
          <path d="M12 2c-2.8 3.7-5 8-5 10s2.2 6.3 5 10"></path>
          <path d="M12 2c2.8 3.7 5 8 5 10s-2.2 6.3-5 10"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3>Theme Lab</h3>
            <button 
              className={styles.resetButton}
              onClick={resetColors}
            >
              Reset to Default
            </button>
          </div>
          
          <div className={styles.colorGroups}>
            {['background', 'text', 'ui'].map(category => (
              <div key={category} className={styles.colorGroup}>
                <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                {themeVariables
                  .filter(variable => variable.category === category)
                  .map(variable => (
                    <div key={variable.cssVar} className={styles.colorControl}>
                      <label htmlFor={variable.cssVar}>{variable.name}</label>
                      <div className={styles.colorInputGroup}>
                        <input
                          type="color"
                          id={variable.cssVar}
                          value={getCurrentColor(variable)}
                          onChange={(e) => handleColorChange(variable.cssVar, e.target.value)}
                        />
                        <input
                          type="text"
                          value={getCurrentColor(variable)}
                          onChange={(e) => handleColorChange(variable.cssVar, e.target.value)}
                          className={styles.hexInput}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          
          <div className={styles.dropdownFooter}>
            <p className={styles.note}>
              Changes are automatically saved to your browser.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeLab;
