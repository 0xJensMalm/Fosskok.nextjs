"use client";
import React, { useEffect, useState } from "react";
import styles from "./PromoPopup.module.css";

const LOCAL_STORAGE_KEY = "promoPopupDismissed25";

const PromoPopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show if not dismissed this session
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!dismissed) setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, "1");
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Lukk banner">×</button>
        <img
          src="/img/promo/festivalBanner25.jpg"
          alt="Festival Banner 2025"
          className={styles.banner}
        />
      </div>
    </div>
  );
};

export default PromoPopup;
