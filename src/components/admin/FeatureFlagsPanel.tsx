'use client';

import React, { useState, useEffect } from 'react';
import styles from './AdminPanels.module.css';

interface FeatureFlag {
  key: string;
  value: boolean;
  description: string;
}

const FeatureFlagsPanel: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch feature flags on component mount
  useEffect(() => {
    const fetchFlags = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/feature-flags', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feature flags');
        }

        const data = await response.json();
        
        // Use the raw data which includes descriptions
        if (data.rawData && Array.isArray(data.rawData)) {
          setFlags(data.rawData);
        } else {
          // Fallback to just the flags object if rawData is not available
          const flagsArray = Object.entries(data.flags || {}).map(([key, value]) => ({
            key,
            value: value as boolean,
            description: getDefaultDescription(key),
          }));
          setFlags(flagsArray);
        }
      } catch (error) {
        console.error('Error fetching feature flags:', error);
        setMessage({
          text: 'Failed to load feature flags. Please try again.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
  }, []);

  // Helper function to get default descriptions for flags
  const getDefaultDescription = (key: string): string => {
    switch (key) {
      case 'enableGrytaPage':
        return 'Show the Gryta page in navigation';
      case 'enableMerchPage':
        return 'Show the Merch page in navigation';
      case 'enableThemeLab':
        return 'Enable theme customization feature in the header';
      default:
        return 'No description available';
    }
  };

  // Handle toggle of a feature flag
  const handleToggle = async (key: string, currentValue: boolean) => {
    try {
      setMessage(null);
      
      const response = await fetch('/api/feature-flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value: !currentValue,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update feature flag');
      }

      const data = await response.json();
      
      // Update the local state with the new value
      setFlags(prevFlags =>
        prevFlags.map(flag =>
          flag.key === key ? { ...flag, value: !currentValue } : flag
        )
      );

      setMessage({
        text: `Feature flag ${key} updated successfully`,
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating feature flag:', error);
      setMessage({
        text: 'Failed to update feature flag. Please try again.',
        type: 'error',
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        Loading feature flags...
      </div>
    );
  }

  return (
    <div className={styles.panelContainer}>
      <h2 className={styles.panelTitle}>Feature Flags</h2>
      
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
      
      <div className={styles.flagsContainer}>
        {flags.length === 0 ? (
          <p>No feature flags available.</p>
        ) : (
          flags.map(flag => (
            <div key={flag.key} className={styles.flagItem}>
              <div className={styles.flagInfo}>
                <span className={styles.flagName}>{flag.key}</span>
                <p className={styles.flagDescription}>{flag.description}</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={flag.value}
                  onChange={() => handleToggle(flag.key, flag.value)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeatureFlagsPanel;
