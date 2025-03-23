import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>© {currentYear} Fosskok. Alle rettigheter reservert.</p>
        <Link href="/admin" className={styles.adminLink}>Admin</Link>
      </div>
    </footer>
  );
};

export default Footer;
