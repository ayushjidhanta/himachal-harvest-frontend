import { useCallback, useEffect, useState } from "react";
import styles from "./Toast.module.css";

const DEFAULT_DURATION_MS = 4_000;

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success", duration = DEFAULT_DURATION_MS) => {
    setToast({ id: Date.now(), message, variant, duration });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { toast, showToast, dismissToast };
};

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onDismiss, toast.duration || DEFAULT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast]);

  if (!toast) return null;

  return (
    <div className={`${styles.toast} ${styles[toast.variant] || styles.info}`} role="status" aria-live="polite">
      <span>{toast.message}</span>
      <button type="button" className={styles.close} onClick={onDismiss} aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}
