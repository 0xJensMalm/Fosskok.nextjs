import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.placeholderWrapper}>
      <div className={styles.placeholderImageContainer}>
        <img
          src="/images/festival/placeholder.png"
          alt="Under construction background"
          className={styles.placeholderImage}
        />
        <div className={`${styles.overlayText} ${styles.overlayTextTop}`}>Nettsiden komposterer</div>
        <div className={`${styles.overlayText} ${styles.overlayTextBottom}`}>Lanseres 2026</div>
        <div className={styles.bottomBar}>
          <div className={styles.socialRow}>
            <a href="https://www.instagram.com/fosskoksamvirkelag/" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm6.406-.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.youtube.com/@FosskokRecords" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a2.995 2.995 0 00-2.11-2.117C19.383 3.5 12 3.5 12 3.5s-7.383 0-9.388.569A2.995 2.995 0 00.502 6.186 31.457 31.457 0 000 12a31.457 31.457 0 00.502 5.814 2.995 2.995 0 002.11 2.117C4.617 20.5 12 20.5 12 20.5s7.383 0 9.388-.569a2.995 2.995 0 002.11-2.117A31.457 31.457 0 0024 12a31.457 31.457 0 00-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61571690984113" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.676 0H1.324A1.324 1.324 0 000 1.324v21.352C0 23.403.597 24 1.324 24H12.82v-9.294H9.692V11.08h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.324 0 2.462.099 2.794.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.312h3.587l-.467 3.626h-3.12V24h6.116C23.403 24 24 23.403 24 22.676V1.324A1.324 1.324 0 0022.676 0z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
