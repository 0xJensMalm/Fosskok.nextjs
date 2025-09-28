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
      </div>
    </div>
  );
}
