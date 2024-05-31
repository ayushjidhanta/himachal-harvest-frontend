import React from "react";
import styles from "./Footer.module.css";
import { Icons } from "../Icons/Icons";
import PrimaryButton from "../Button/PrimaryButton/PrimaryButton";
import { Link } from 'react-router-dom';

function Footer() {
  // Social Icons
  const social_icons = {
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    twitter: "https://www.twitter.com/",
    github: "https://www.github.com/",
    google: "https://www.google.com/",
  };
    const companyLinks = [
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contactUs" },
        { name: "Careers", path: "/" }
    ];
  return (
    <footer className={styles.footer}>
      <section className={styles.social_icons}>
        {Object.keys(social_icons).map((key) => {
          return (
            <a key={key} href={social_icons[key]} target="_blank">
              {Icons[key]}
            </a>
          );
        })}
      </section>
      <section className={styles.newsletter}>
        <p>Subscribe to our newsletter</p>
        <div className={styles.input_field}>
          <input type="email" placeholder="example@example.com" />
          <PrimaryButton event={null} title="Subscribe" isDisabled={false} />
        </div>
      </section>
      <section className={styles.links}>
        <div className={styles.column}>
          <h3>Company</h3>
                  <ul>
                      {companyLinks.map((link, index) => (
                          <li key={index}>
                              <Link to={link.path}>
                                  {link.name}
                              </Link>
                          </li>
                      ))}
                  </ul>
        </div>
        <div className={styles.column}>
          <h3>Support</h3>
          <ul>
            {["FAQ", "Help Desk", "Forums"].map((item, index) => {
              return (
                <li>
                  <a href="/" key={item}>
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Legal</h3>
          <ul>
            {["Terms Of Use", "Privacy Policy", "Cookie Policy"].map(
              (item, index) => {
                return (
                  <li>
                    <a href="/" key={item}>
                      {item}
                    </a>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </section>
      <section className={styles.copyright}>
        <p>
          &copy; <span>Himachal Harvest</span> 2023 - {new Date().getFullYear()}
        </p>
        <p>All rights reserved.</p>
      </section>
    </footer>
  );
}

export default Footer;
