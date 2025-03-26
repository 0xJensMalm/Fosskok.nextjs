"use client";

import { useState, useEffect } from 'react';
import styles from './AdminPanels.module.css';
import featureFlags from '../../../utils/featureFlags';

interface FeatureFlag {
  key: string;
  value: boolean;
  description: string;
}

const FeatureFlagsPanel = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Descriptions for each feature flag
  const flagDescriptions: Record<string, string> = {
    enableGrytaPage: 'Show the Gryta page in navigation',
    enableMerchPage: 'Show the Merch page in navigation',
    enableBlogSection: 'Enable the blog section functionality',
    enableEventsSection: 'Enable the events section functionality',
    enableMembersSection: 'Enable the members section functionality',
    enableImageUpload: 'Allow image uploads in admin panels',
  };

  useEffect(() => {
    // Convert feature flags object to array with descriptions
    const flagsArray = Object.entries(featureFlags).map(([key, value]) => ({
      key,
      value,
      description: flagDescriptions[key] || key,
    }));
    
    setFlags(flagsArray);
    setIsLoading(false);
  }, []);

  const handleToggle = async (index: number) => {
    try {
      const updatedFlags = [...flags];
      updatedFlags[index].value = !updatedFlags[index].value;
      setFlags(updatedFlags);

      // Prepare data for API call
      const flagData = {
        key: updatedFlags[index].key,
        value: updatedFlags[index].value
      };

      // Call API to update feature flag
      const response = await fetch('/api/feature-flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flagData),
        credentials: 'include'
      });

      if (response.ok) {
        setMessage({ 
          text: `Feature flag "${updatedFlags[index].key}" updated successfully`, 
          type: 'success' 
        });
      } else {
        // Revert the change if the API call fails
        updatedFlags[index].value = !updatedFlags[index].value;
        setFlags(updatedFlags);
        setMessage({ 
          text: 'Failed to update feature flag', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error updating feature flag:', error);
      setMessage({ 
        text: 'An error occurred while updating the feature flag', 
        type: 'error' 
      });
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading feature flags...</div>;
  }

  return (
    <div className={styles.panelContainer}>
      <h2 className={styles.panelTitle}>Feature Flags</h2>
      
      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.flagsContainer}>
        {flags.map((flag, index) => (
          <div key={flag.key} className={styles.flagItem}>
            <div className={styles.flagInfo}>
              <span className={styles.flagName}>{flag.key}</span>
              <p className={styles.flagDescription}>{flag.description}</p>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={flag.value}
                onChange={() => handleToggle(index)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureFlagsPanel;
