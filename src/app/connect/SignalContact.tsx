import styles from "./connect.module.css";

export function SignalContact() {
  return (
    <a
      className={styles.link}
      href="https://signal.me/#eu/unf9pQFAvrcYPvTIRF763CKZXrTFSsLg605Pa7muFjnpsi8WP01FU4nO-ZqyfXQA"
    >
      <span className={styles.icon}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M21 11.5a9 9 0 0 1-9 9 9 9 0 0 1-4-.9l-5 1.4 1.4-4.7A9 9 0 1 1 21 11.5Z" strokeDasharray="2.5 1.5" />
        </svg>
      </span>
      <span className={styles.label}>Signal <span className={styles.signalUsername}>jackless.09</span></span>
      <span className={styles.action}>Open chat ↗</span>
    </a>
  );
}
