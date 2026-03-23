import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PageNotFound.module.css";
import imageNotFound from "../Images/pageNotFoundbg.gif";
import Navbar2 from "../../components/Home/Navbar2";
import Footer from "../Footer/Footer";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = String(location?.pathname || "/");

  return (
    <div className={styles.shell}>
      <Navbar2 />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.art}>
              <img src={imageNotFound} alt="Page not found" />
            </div>

            <div className={styles.kicker}>404</div>
            <h1 className={styles.title}>Page not found</h1>
            <p className={styles.subtitle}>
              We couldn’t find the page you’re looking for. It may have been moved, renamed, or doesn’t exist.
            </p>

            <div className={styles.pathPill} title={path}>
              {path}
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.primaryBtn} onClick={() => navigate("/")}>
                Go home
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => navigate("/explore")}>
                Explore products
              </button>
              <button type="button" className={styles.linkBtn} onClick={() => navigate(-1)}>
                Go back
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
