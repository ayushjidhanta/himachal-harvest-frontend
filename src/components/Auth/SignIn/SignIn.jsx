// Inbuilt React Packages
import React, { useState } from "react";
import styles from "./SignIn.module.css";
import { useNavigate } from "react-router";

// Custom React Packages
import { signIn } from "../../../service/AuthService/api";

// Components & Assets include:
import { Icons } from "../../../assets/Icons/Icons";
import Spinner from "../../../assets/Spinner/Spinner";
import AlertDialog from "../../../assets/AlertDialog/AlertDialog";
import PrimaryButton from "../../../assets/Button/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../assets/Button/SecondaryButton/SecondaryButton";

const SignIn = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    message: "",
  });

  const [spinner, setSpinner] = useState(false);

  const credentialHandler = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const setName = (e) => credentialHandler("username", e.target.value);
  const setPassword = (e) => credentialHandler("password", e.target.value);

  const alertDialogHandler = (field, value) => {
    setAlertDialog((prev) => ({ ...prev, [field]: value }));
  };

  const showAlert = (message) => {
    alertDialogHandler("isOpen", true);
    alertDialogHandler("message", message);
  };

  const authHandler = async (e) => {
    if (!credentials.username || !credentials.password) {
      showAlert(
        !credentials.username
          ? "Please Enter The Username"
          : "Please Enter The Password"
      );
      return;
    }

    setSpinner(true);

    try {
      const response = await signIn(credentials);
      if (response.data.user_authenticated) {
        setSpinner(false);
        credentialHandler("username", "");
        credentialHandler("password", "");
        showAlert(response.data.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setSpinner(false);
        credentialHandler("username", "");
        credentialHandler("password", "");
        showAlert(response.data.message);
      }
    } catch (error) {
      setSpinner(false);
      credentialHandler("username", "");
      credentialHandler("password", "");
      showAlert(error);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={alertDialog.isOpen}
        alertMessage={alertDialog.message}
        handlerFunction={alertDialogHandler}
      />
      <Spinner show={spinner} />
      <div className={styles.login_page}>
        <div className={styles.form_wrapper}>
          <h1 className={styles.h1}>Sign In</h1>
          <div className={styles.form}>
            <input
              type="text"
              value={credentials.username}
              placeholder="Username"
              className={styles.input}
              onChange={setName}
            />
            <input
              type="password"
              value={credentials.password}
              placeholder="Password"
              className={styles.input}
              onChange={setPassword}
            />
            <PrimaryButton event={authHandler} title="Sign In" />
            <SecondaryButton
              event={() => navigate("/signup")}
              title="Sign Up"
            />
            <div className={styles.social_icons}>
              <span>{Icons.facebook}</span>
              <span>{Icons.google}</span>
            </div>
          </div>
        </div>
        <div className={styles.overlay}></div>
      </div>
    </>
  );
};
export default SignIn;
