import React from "react";
import styles from "./SecondaryButton.module.css";

function SecondaryButton({ event, title, isDisabled = false }) {
  return (
    <button onClick={event} disabled={isDisabled} className={styles.button}>
      {title}
    </button>
  );
}

export default SecondaryButton;
