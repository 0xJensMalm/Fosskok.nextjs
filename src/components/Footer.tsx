import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p> {currentYear} Fosskok. Alle rettigheter reservert.</p>
        <div>
          <Link href="/vilkar" className={styles.footerLink}>Vilkår og betingelser</Link>
          <span className={styles.linkSeparator}>|</span>
          <Link href="/admin" className={styles.footerLink}>Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
