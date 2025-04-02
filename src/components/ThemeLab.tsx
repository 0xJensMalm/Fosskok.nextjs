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
  category: 'background' | 'text' | 'ui' | 'social';
}

// Available fonts for selection
interface FontOption {
  name: string;
  value: string;
  category: string;
}

const fontOptions: FontOption[] = [
  // Sans-serif fonts
  { name: 'Inter (Standard)', value: "'Inter', 'Helvetica Neue', Arial, sans-serif", category: 'sans-serif' },
  { name: 'Roboto', value: "'Roboto', 'Helvetica Neue', Arial, sans-serif", category: 'sans-serif' },
  { name: 'Open Sans', value: "'Open Sans', 'Helvetica Neue', Arial, sans-serif", category: 'sans-serif' },
  { name: 'Montserrat', value: "'Montserrat', 'Helvetica Neue', Arial, sans-serif", category: 'sans-serif' },
  { name: 'Raleway', value: "'Raleway', 'Helvetica Neue', Arial, sans-serif", category: 'sans-serif' },
  { name: 'Poppins', value: "'Poppins', 'Helvetica Neue', Arial, sans-serif", category: 'sans-serif' },
  { name: 'Work Sans', value: "'Work Sans', 'Helvetica Neue', Arial, sans-serif", category: 'sans-serif' },
  
  // Serif fonts
  { name: 'Playfair Display', value: "'Playfair Display', Georgia, serif", category: 'serif' },
  { name: 'Merriweather', value: "'Merriweather', Georgia, serif", category: 'serif' },
  { name: 'Lora', value: "'Lora', Georgia, serif", category: 'serif' },
  { name: 'Libre Baskerville', value: "'Libre Baskerville', Georgia, serif", category: 'serif' },
  { name: 'Crimson Pro', value: "'Crimson Pro', Georgia, serif", category: 'serif' },
  
  // Monospace fonts
  { name: 'Source Code Pro', value: "'Source Code Pro', monospace", category: 'monospace' },
  { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace", category: 'monospace' },
  { name: 'Fira Code', value: "'Fira Code', monospace", category: 'monospace' },
  { name: 'Roboto Mono', value: "'Roboto Mono', monospace", category: 'monospace' },
  
  // Display fonts
  { name: 'Bebas Neue', value: "'Bebas Neue', cursive", category: 'display' },
  { name: 'Abril Fatface', value: "'Abril Fatface', cursive", category: 'display' },
  { name: 'Pacifico', value: "'Pacifico', cursive", category: 'display' },
];

const themeVariables: ThemeVariable[] = [
  // Background colors
  { name: 'Bakgrunn', cssVar: '--background', lightDefault: '#f8f8f8', darkDefault: '#1a1a1a', category: 'background' },
  { name: 'Kortbakgrunn', cssVar: '--card-bg', lightDefault: '#ffffff', darkDefault: '#222', category: 'background' },
  { name: 'Header og footer', cssVar: '--header-footer-bg', lightDefault: '#f0f0f0', darkDefault: '#1c1c1c', category: 'background' },
  
  // Text colors
  { name: 'Tekst', cssVar: '--foreground', lightDefault: '#1a1a1a', darkDefault: '#f8f8f8', category: 'text' },
  { name: 'Sekundærtekst', cssVar: '--accent', lightDefault: '#666', darkDefault: '#a0a0a0', category: 'text' },
  
  // UI elements
  { name: 'Skillelinje', cssVar: '--divider', lightDefault: '#e0e0e0', darkDefault: '#333', category: 'ui' },
  { name: 'Kortskygge', cssVar: '--card-shadow', lightDefault: 'rgba(0, 0, 0, 0.1)', darkDefault: 'rgba(0, 0, 0, 0.3)', category: 'ui' },
  { name: 'Knapper', cssVar: '--button-bg', lightDefault: '#0070f3', darkDefault: '#0070f3', category: 'ui' },
  
  // Social media icons (separate)
  { name: 'Sosiale ikoner', cssVar: '--social-icons-color', lightDefault: '#1877F2', darkDefault: '#1877F2', category: 'social' },
];

const ThemeLab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [selectedFont, setSelectedFont] = useState<string>("");
  const [currentFontIndex, setCurrentFontIndex] = useState<number>(0);
  const [storedColors, setStoredColors] = useState<string[]>([]);
  const [showSavedThemes, setShowSavedThemes] = useState(false);
  const [savedThemes, setSavedThemes] = useState<Array<{name: string, colors: Record<string, string>, font: string}>>([]);
  const { theme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize custom colors and font from localStorage or set to current values
  useEffect(() => {
    const savedColors = localStorage.getItem('fosskok-theme-lab-colors');
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
    
    const savedFont = localStorage.getItem('fosskok-theme-lab-font');
    if (savedFont) {
      setSelectedFont(savedFont);
      // Apply to root element for global effect
      document.documentElement.style.setProperty('--font-family', savedFont);
      // Also apply directly to body for immediate effect
      document.body.style.fontFamily = savedFont;
      
      // Find the index of the saved font
      const index = fontOptions.findIndex(font => font.value === savedFont);
      if (index !== -1) {
        setCurrentFontIndex(index);
      }
      
      // Load the font if it's not already loaded
      const fontName = savedFont.split(',')[0].replace(/['"]/g, '');
      if (fontName !== 'Inter') {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    } else {
      // Default font
      setSelectedFont(fontOptions[0].value);
    }
    
    // Load stored colors from localStorage
    const savedStoredColors = localStorage.getItem('fosskok-theme-lab-stored-colors');
    if (savedStoredColors) {
      setStoredColors(JSON.parse(savedStoredColors));
    }
    
    // Load saved themes from localStorage
    const savedThemesData = localStorage.getItem('fosskok-theme-lab-saved-themes');
    if (savedThemesData) {
      setSavedThemes(JSON.parse(savedThemesData));
    }
  }, []);

  // Apply custom colors when they change
  useEffect(() => {
    if (Object.keys(customColors).length > 0) {
      Object.entries(customColors).forEach(([cssVar, value]) => {
        document.documentElement.style.setProperty(cssVar, value);
      });
      
      // Save to localStorage
      localStorage.setItem('fosskok-theme-lab-colors', JSON.stringify(customColors));
    }
  }, [customColors]);

  // Apply font when it changes
  useEffect(() => {
    if (selectedFont) {
      // Apply to root element for global effect
      document.documentElement.style.setProperty('--font-family', selectedFont);
      // Also apply directly to body for immediate effect
      document.body.style.fontFamily = selectedFont;
      
      localStorage.setItem('fosskok-theme-lab-font', selectedFont);
      
      // Load the font if it's not already loaded
      const fontName = selectedFont.split(',')[0].replace(/['"]/g, '');
      if (fontName !== 'Inter') {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }
  }, [selectedFont]);

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

  const handleFontChange = (fontValue: string) => {
    setSelectedFont(fontValue);
    
    // Update current font index
    const index = fontOptions.findIndex(font => font.value === fontValue);
    if (index !== -1) {
      setCurrentFontIndex(index);
    }
    
    // Track font change
    track('theme_lab_font_change', {
      font: fontValue,
      current_theme: theme
    });
  };

  const generateRandomColor = (cssVar: string) => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    handleColorChange(cssVar, randomColor);
    
    // Track random color generation
    track('theme_lab_random_color', {
      variable: cssVar,
      value: randomColor,
      current_theme: theme
    });
  };
  
  const storeColor = (color: string) => {
    // Add color to stored colors if not already in the list
    if (!storedColors.includes(color)) {
      const updatedColors = [...storedColors, color];
      setStoredColors(updatedColors);
      localStorage.setItem('fosskok-theme-lab-stored-colors', JSON.stringify(updatedColors));
      
      // Track color storage
      track('theme_lab_store_color', {
        color: color,
        stored_count: updatedColors.length,
        current_theme: theme
      });
    }
  };

  const randomizeAllColors = () => {
    const newColors: Record<string, string> = {};
    
    // Generate random colors for all variables
    themeVariables.forEach(variable => {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      newColors[variable.cssVar] = randomColor;
      document.documentElement.style.setProperty(variable.cssVar, randomColor);
    });
    
    // Update state and save to localStorage
    setCustomColors(newColors);
    localStorage.setItem('fosskok-theme-lab-colors', JSON.stringify(newColors));
    
    // Track randomize all action
    track('theme_lab_randomize_all', { 
      current_theme: theme
    });
  };

  const toggleSavedThemes = () => {
    setShowSavedThemes(!showSavedThemes);
    
    // Track saved themes toggle
    track('theme_lab_saved_themes_toggle', {
      action: !showSavedThemes ? 'show' : 'hide',
      current_theme: theme
    });
  };

  const saveCurrentTheme = () => {
    // Create a name based on date and time
    const date = new Date();
    const themeName = `Theme ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
    // Create theme object
    const newTheme = {
      name: themeName,
      colors: {...customColors},
      font: selectedFont
    };
    
    // Add to saved themes
    const updatedThemes = [...savedThemes, newTheme];
    setSavedThemes(updatedThemes);
    
    // Save to localStorage
    localStorage.setItem('fosskok-theme-lab-saved-themes', JSON.stringify(updatedThemes));
    
    // Show saved themes section if not already visible
    if (!showSavedThemes) {
      setShowSavedThemes(true);
    }
    
    // Track theme save
    track('theme_lab_save_theme', {
      theme_count: updatedThemes.length,
      current_theme: theme
    });
  };

  const activateTheme = (savedTheme: {name: string, colors: Record<string, string>, font: string}) => {
    // Apply colors
    Object.entries(savedTheme.colors).forEach(([cssVar, value]) => {
      document.documentElement.style.setProperty(cssVar, value);
    });
    
    // Apply font
    document.documentElement.style.setProperty('--font-family', savedTheme.font);
    document.body.style.fontFamily = savedTheme.font;
    
    // Update state
    setCustomColors(savedTheme.colors);
    setSelectedFont(savedTheme.font);
    
    // Find font index
    const fontIndex = fontOptions.findIndex(font => font.value === savedTheme.font);
    if (fontIndex !== -1) {
      setCurrentFontIndex(fontIndex);
    }
    
    // Save to localStorage
    localStorage.setItem('fosskok-theme-lab-colors', JSON.stringify(savedTheme.colors));
    localStorage.setItem('fosskok-theme-lab-font', savedTheme.font);
    
    // Track theme activation
    track('theme_lab_activate_theme', {
      theme_name: savedTheme.name,
      current_theme: theme
    });
  };

  const deleteTheme = (index: number) => {
    const updatedThemes = [...savedThemes];
    updatedThemes.splice(index, 1);
    setSavedThemes(updatedThemes);
    
    // Update localStorage
    localStorage.setItem('fosskok-theme-lab-saved-themes', JSON.stringify(updatedThemes));
    
    // Track theme deletion
    track('theme_lab_delete_theme', {
      theme_count: updatedThemes.length,
      current_theme: theme
    });
  };

  const goToPreviousFont = () => {
    const newIndex = (currentFontIndex - 1 + fontOptions.length) % fontOptions.length;
    setCurrentFontIndex(newIndex);
    handleFontChange(fontOptions[newIndex].value);
    
    // Track font navigation
    track('theme_lab_font_navigation', {
      action: 'previous',
      current_theme: theme
    });
  };

  const goToNextFont = () => {
    const newIndex = (currentFontIndex + 1) % fontOptions.length;
    setCurrentFontIndex(newIndex);
    handleFontChange(fontOptions[newIndex].value);
    
    // Track font navigation
    track('theme_lab_font_navigation', {
      action: 'next',
      current_theme: theme
    });
  };

  const selectRandomFont = () => {
    const randomIndex = Math.floor(Math.random() * fontOptions.length);
    setCurrentFontIndex(randomIndex);
    handleFontChange(fontOptions[randomIndex].value);
    
    // Track font navigation
    track('theme_lab_font_navigation', {
      action: 'random',
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
    localStorage.removeItem('fosskok-theme-lab-colors');
    
    // Track reset
    track('theme_lab_reset', { current_theme: theme });
  };

  const resetFont = () => {
    // Reset to default font
    setSelectedFont(fontOptions[0].value);
    setCurrentFontIndex(0);
    document.documentElement.style.setProperty('--font-family', fontOptions[0].value);
    document.body.style.fontFamily = fontOptions[0].value;
    localStorage.removeItem('fosskok-theme-lab-font');
    
    // Track reset
    track('theme_lab_font_reset', { current_theme: theme });
  };

  const resetAll = () => {
    resetColors();
    resetFont();
    
    // Track reset all
    track('theme_lab_reset_all', { current_theme: theme });
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

  const exportTheme = () => {
    // Create theme object
    const themeObject = {
      colors: customColors,
      font: selectedFont,
      timestamp: new Date().toISOString(),
      theme: theme
    };
    
    // Convert to JSON string
    const themeJson = JSON.stringify(themeObject, null, 2);
    
    // Create CSS string
    let themeCss = `/* Fosskok Custom Theme */\n`;
    themeCss += `:root {\n`;
    Object.entries(customColors).forEach(([cssVar, value]) => {
      themeCss += `  ${cssVar}: ${value};\n`;
    });
    themeCss += `  --font-family: ${selectedFont};\n`;
    themeCss += `}\n`;
    
    // Create download link
    const blob = new Blob([`${themeCss}\n\n/* JSON Format */\n${themeJson}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fosskok-theme-${theme}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track export
    track('theme_lab_export', { current_theme: theme });
  };

  return (
    <div className={styles.themeLab} ref={dropdownRef}>
      <button 
        className={styles.themeLabToggle} 
        onClick={toggleDropdown}
        aria-label="Farger og font"
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
          <circle cx="12" cy="12" r="4"></circle>
          <line x1="12" y1="2" x2="12" y2="4"></line>
          <line x1="12" y1="20" x2="12" y2="22"></line>
          <line x1="2" y1="12" x2="4" y2="12"></line>
          <line x1="20" y1="12" x2="22" y2="12"></line>
        </svg>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <h3>Farger og font</h3>
          </div>
          
          <div className={styles.compactLayout}>
            {/* Fonts Section */}
            <div className={styles.section}>
              <h4>Font</h4>
              <div className={styles.fontSelector}>
                <div className={styles.fontNavigation}>
                  <button 
                    className={styles.fontNavButton}
                    onClick={goToPreviousFont}
                    aria-label="Forrige font"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <select 
                    value={selectedFont}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className={styles.selectInput}
                  >
                    <optgroup label="Sans-serif">
                      {fontOptions
                        .filter(font => font.category === 'sans-serif')
                        .map(font => (
                          <option key={font.value} value={font.value} style={{fontFamily: font.value}}>
                            {font.name}
                          </option>
                        ))
                      }
                    </optgroup>
                    <optgroup label="Serif">
                      {fontOptions
                        .filter(font => font.category === 'serif')
                        .map(font => (
                          <option key={font.value} value={font.value} style={{fontFamily: font.value}}>
                            {font.name}
                          </option>
                        ))
                      }
                    </optgroup>
                    <optgroup label="Monospace">
                      {fontOptions
                        .filter(font => font.category === 'monospace')
                        .map(font => (
                          <option key={font.value} value={font.value} style={{fontFamily: font.value}}>
                            {font.name}
                          </option>
                        ))
                      }
                    </optgroup>
                    <optgroup label="Display">
                      {fontOptions
                        .filter(font => font.category === 'display')
                        .map(font => (
                          <option key={font.value} value={font.value} style={{fontFamily: font.value}}>
                            {font.name}
                          </option>
                        ))
                      }
                    </optgroup>
                  </select>
                  <button 
                    className={styles.fontNavButton}
                    onClick={goToNextFont}
                    aria-label="Neste font"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                  <button 
                    className={styles.fontNavButton}
                    onClick={selectRandomFont}
                    aria-label="Tilfeldig font"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Colors Section */}
            <div className={styles.section}>
              <h4>Farger</h4>
              <div className={styles.colorGrid}>
                {themeVariables.map(variable => (
                  <div key={variable.cssVar} className={styles.colorControl}>
                    <label htmlFor={variable.cssVar}>{variable.name}</label>
                    <div className={styles.colorInputGroup}>
                      <input
                        type="color"
                        id={variable.cssVar}
                        value={getCurrentColor(variable)}
                        onChange={(e) => handleColorChange(variable.cssVar, e.target.value)}
                        className={styles.colorPicker}
                      />
                      <input
                        type="text"
                        value={getCurrentColor(variable)}
                        onChange={(e) => handleColorChange(variable.cssVar, e.target.value)}
                        className={styles.hexInput}
                      />
                      <div className={styles.colorButtonsGroup}>
                        <button
                          className={styles.colorActionButton}
                          onClick={() => generateRandomColor(variable.cssVar)}
                          aria-label="Tilfeldig farge"
                          title="Tilfeldig farge"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
                          </svg>
                        </button>
                        <button
                          className={styles.colorActionButton}
                          onClick={() => storeColor(getCurrentColor(variable))}
                          aria-label="Lagre farge"
                          title="Lagre farge"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 19V5M5 12l7 7 7-7"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Central Buttons */}
            <div className={styles.centralButtons}>
              <button 
                className={`${styles.centralButton} ${styles.crazyButton}`}
                onClick={randomizeAllColors}
                aria-label="Go Crazy"
              >
                Go Crazy
              </button>
              <button 
                className={`${styles.centralButton} ${styles.saveThemeButton}`}
                onClick={toggleSavedThemes}
                aria-label="Temaer"
              >
                Temaer
              </button>
            </div>
            
            {/* Saved Themes Section */}
            {showSavedThemes && (
              <div className={styles.savedThemesSection}>
                <h4>Lagrede temaer</h4>
                {savedThemes.length === 0 ? (
                  <p className={styles.note}>Ingen lagrede temaer ennå. Klikk på "Lagre tema" for å lagre det nåværende temaet.</p>
                ) : (
                  savedThemes.map((savedTheme, index) => (
                    <div key={index} className={styles.themeItem}>
                      <div className={styles.themeColors}>
                        {Object.values(savedTheme.colors).map((color, colorIndex) => (
                          <div 
                            key={colorIndex} 
                            className={styles.themeColorSwatch} 
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <div className={styles.themeActions}>
                        <button 
                          className={`${styles.themeActionButton} ${styles.activateButton}`}
                          onClick={() => activateTheme(savedTheme)}
                          aria-label="Aktiver tema"
                        >
                          Aktiver
                        </button>
                        <button 
                          className={styles.themeActionButton}
                          onClick={() => deleteTheme(index)}
                          aria-label="Slett tema"
                        >
                          Slett
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <button 
                  className={styles.centralButton}
                  onClick={saveCurrentTheme}
                  style={{ width: '100%', marginTop: '10px' }}
                  aria-label="Lagre nåværende tema"
                >
                  Lagre nåværende tema
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.dropdownFooter}>
            <div className={styles.actionButtons}>
              <button 
                className={styles.resetButton}
                onClick={resetAll}
              >
                Tilbakestill alt
              </button>
              <button 
                className={styles.exportButton}
                onClick={exportTheme}
              >
                Eksporter tema
              </button>
            </div>
            <p className={styles.note}>
              Endringer lagres automatisk i nettleseren.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeLab;
