import React from "react";
import styles from "./Spinner.module.css";

const Spinner = ({ show }) => {
  return show ? (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  ) : null;
};

export default Spinner;
