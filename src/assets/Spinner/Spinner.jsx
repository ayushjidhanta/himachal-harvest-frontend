import React from "react";
import styles from "./Spinner.module.css";
import spinnerHH from "../Images/loader.png";
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
      <div className={styles.hhWrap} aria-label="Loading">
        <img className={styles.spinnerHH} src={spinnerHH} alt="" aria-hidden="true" />
      </div>
    </div>
  ) : null;
};

export { SpinnerHimachalHarvest };
