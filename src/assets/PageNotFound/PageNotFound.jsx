import React from "react";
import styles from "./PageNotFound.module.css";
import imageNotFound from "../Images/pageNotFoundbg.gif";

const NotFound = () => {
  return (
    <div className={styles.not_found_container}>
      <div className={styles.image_container}>
        <img src={imageNotFound} alt="Page Not Found" />
      </div>
      <h1>Page Not Found</h1>
      <p>
        Sorry, the page you are looking for might be unavailable or does not
        exist.
      </p>
    </div>
  );
};

export default NotFound;
