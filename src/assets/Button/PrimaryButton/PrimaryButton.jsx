import React from "react";
import styles from "./PrimaryButton.module.css";

function PrimaryButton({ event, title, isDisabled = false }) {
  return (
    <button onClick={event} disabled={isDisabled} className={styles.button}>
      {title}
    </button>
  );
}

export default PrimaryButton;
