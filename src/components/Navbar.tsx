"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle';
import featureFlags from '../../utils/featureFlags';

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logoContainer}>
          <h1 className={styles.logo}>Fosskok</h1>
        </Link>

        <div className={styles.navCenter}>
          <Link href="/arrangementer" className={styles.navLink} aria-current={pathname === '/arrangementer' ? 'page' : undefined}>
            Arrangementer
          </Link>
          <Link href="/folka" className={styles.navLink} aria-current={pathname === '/folka' ? 'page' : undefined}>
            Folka
          </Link>
          {featureFlags.enableGrytaPage && (
            <Link href="/gryta" className={styles.navLink} aria-current={pathname === '/gryta' ? 'page' : undefined}>
              Gryta
            </Link>
          )}
          {featureFlags.enableMerchPage && (
            <Link href="/merch" className={styles.navLink} aria-current={pathname === '/merch' ? 'page' : undefined}>
              Merch
            </Link>
          )}
          <Link href="/praktisk-info" className={styles.navLink} aria-current={pathname === '/praktisk-info' ? 'page' : undefined}>
            Praktisk info
          </Link>
        </div>

        <div className={styles.navRight}>
          <div className={styles.socialIcons}>
            <a href="https://www.instagram.com/fosskoksamvirkelag/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61571690984113" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" fill="currentColor"/>
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`${styles.mobileMenuButton} ${mobileMenuOpen ? styles.active : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          <Link href="/" className={styles.mobileNavLink} aria-current={pathname === '/' ? 'page' : undefined} onClick={toggleMobileMenu}>
            Hjem
          </Link>
          <Link href="/arrangementer" className={styles.mobileNavLink} aria-current={pathname === '/arrangementer' ? 'page' : undefined} onClick={toggleMobileMenu}>
            Arrangementer
          </Link>
          <Link href="/folka" className={styles.mobileNavLink} aria-current={pathname === '/folka' ? 'page' : undefined} onClick={toggleMobileMenu}>
            Folka
          </Link>
          {featureFlags.enableGrytaPage && (
            <Link href="/gryta" className={styles.mobileNavLink} aria-current={pathname === '/gryta' ? 'page' : undefined} onClick={toggleMobileMenu}>
              Gryta
            </Link>
          )}
          {featureFlags.enableMerchPage && (
            <Link href="/merch" className={styles.mobileNavLink} aria-current={pathname === '/merch' ? 'page' : undefined} onClick={toggleMobileMenu}>
              Merch
            </Link>
          )}
          <Link href="/praktisk-info" className={styles.mobileNavLink} aria-current={pathname === '/praktisk-info' ? 'page' : undefined} onClick={toggleMobileMenu}>
            Praktisk info
          </Link>
          
          <div className={styles.mobileSocialContainer}>
            <div className={styles.socialIcons}>
              <a href="https://www.instagram.com/fosskoksamvirkelag/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61571690984113" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" fill="currentColor"/>
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.divider}></div>
    </nav>
  );
};

export default Navbar;
