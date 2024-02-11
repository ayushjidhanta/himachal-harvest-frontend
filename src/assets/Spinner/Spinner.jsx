import React from "react";
import styles from "./Spinner.module.css";
import spinnerHH from "../Images/logo.gif";
const Spinner = ({ show }) => {
  return show ? (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  ) : null;
};

export default Spinner;

const SpinnerHimachalHarvest = ({ show }) => {
  return show ? (
    <div className={styles.overlay}>
      <img className={styles.spinnerHH} src={spinnerHH} alt="Loading..." />
    </div>
  ) : null;
};

export { SpinnerHimachalHarvest };
