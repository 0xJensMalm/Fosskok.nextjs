/**
 * Feature Flags Configuration
 * 
 * This file contains the configuration for feature flags used throughout the application.
 * Set a flag to true to enable the feature, or false to disable it.
 */

const featureFlags = {
  // Page visibility flags
  enableGrytaPage: false,
  enableMerchPage: false,
  
  // Feature flags
  enableBlogSection: true,
  enableEventsSection: true,
  enableMembersSection: true,
  
  // Admin features
  enableImageUpload: true,
};

export default featureFlags;
