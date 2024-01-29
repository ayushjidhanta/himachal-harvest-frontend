import styles from "./AlertDialog.module.css";
import React, { useState, useEffect } from "react";

const AlertDialog = ({ isOpen, alertMessage, handlerFunction }) => {
  const [isDialogOpen, setDialogOpen] = useState({ dialog: isOpen });

  useEffect(() => {
    setDialogOpen({ dialog: isOpen });
  }, [isOpen]);

  const closeAlertDialog = () => {
    setDialogOpen({ dialog: false });
    handlerFunction("isOpen", false);
  };

  return isDialogOpen.dialog ? (
    <div className={styles.dialog_wrapper}>
      <div className={styles.dialog_content}>
        <h3>{alertMessage}</h3>
        <div className={styles.button_wrapper}>
          <button onClick={closeAlertDialog}>Close</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AlertDialog;
