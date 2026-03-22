import React from "react";
import { Link } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import styles from "./privacy.module.css";

function Privacy() {
  const lastUpdated = "March 22, 2026";

  return (
    <>
      <Navbar2 />

      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.subtitle}>
              We respect your privacy and work to protect the information you share with
              Himachal Harvest.
            </p>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>Last updated: {lastUpdated}</span>
              <span className={styles.metaDot} aria-hidden="true">
                •
              </span>
              <Link className={styles.metaLink} to="/contactUs">
                Questions? Contact us
              </Link>
            </div>
          </div>
        </header>

        <main className={styles.container}>
          <aside className={styles.toc} aria-label="Privacy policy table of contents">
            <div className={styles.tocCard}>
              <div className={styles.tocTitle}>On this page</div>
              <a className={styles.tocLink} href="#information-we-collect">
                Information we collect
              </a>
              <a className={styles.tocLink} href="#how-we-use-your-information">
                How we use your information
              </a>
              <a className={styles.tocLink} href="#information-sharing">
                Information sharing
              </a>
              <a className={styles.tocLink} href="#security-measures">
                Security measures
              </a>
              <a className={styles.tocLink} href="#updates-to-this-privacy-policy">
                Updates to this policy
              </a>
              <a className={styles.tocLink} href="#contact-us">
                Contact us
              </a>
            </div>
          </aside>

          <article className={styles.content} aria-label="Privacy policy content">
            <section className={styles.section} id="overview">
              <p className={styles.lead}>
                At Himachal Harvest, we prioritize the privacy and security of our users'
                personal information. This Privacy Policy outlines how we collect, use, and
                protect the information you provide to us.
              </p>
            </section>

            <section className={styles.section} id="information-we-collect">
              <h2>Information We Collect</h2>
              <p>
                We may collect the following types of information when you interact with our
                website or services:
              </p>
              <ul>
                <li>Personal information such as your name, email address, and phone number.</li>
                <li>Demographic information such as your age, gender, and location.</li>
                <li>Payment information necessary for completing transactions.</li>
                <li>Information about your interactions with our website and services.</li>
                <li>Device information such as your IP address, browser type, and operating system.</li>
                <li>Any other information you choose to provide to us.</li>
              </ul>
            </section>

            <section className={styles.section} id="how-we-use-your-information">
              <h2>How We Use Your Information</h2>
              <p>We may use the information we collect for the following purposes:</p>
              <ul>
                <li>Provide and personalize our services to meet your needs.</li>
                <li>Process and fulfill your orders and transactions.</li>
                <li>Communicate with you about your account and provide customer support.</li>
                <li>Send you promotional offers, updates, and newsletters.</li>
                <li>Improve our website, services, and user experience.</li>
                <li>Protect against fraud and unauthorized access.</li>
              </ul>
            </section>

            <section className={styles.section} id="information-sharing">
              <h2>Information Sharing</h2>
              <p>We may share your information with third parties in the following cases:</p>
              <ul>
                <li>With your consent or at your direction.</li>
                <li>
                  With our trusted partners and service providers who assist us in delivering our
                  services.
                </li>
                <li>To comply with legal obligations or respond to lawful requests.</li>
                <li>In case of a merger, acquisition, or sale of our company assets.</li>
              </ul>
            </section>

            <section className={styles.section} id="security-measures">
              <h2>Security Measures</h2>
              <p>
                We implement appropriate security measures to protect your information from
                unauthorized access, alteration, disclosure, or destruction. However, please note
                that no method of transmission over the internet or electronic storage is completely
                secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className={styles.section} id="updates-to-this-privacy-policy">
              <h2>Updates to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on
                this page, and the &quot;Last Updated&quot; date will be revised accordingly. We
                encourage you to review this Privacy Policy periodically for any updates.
              </p>
            </section>

            <section className={styles.section} id="contact-us">
              <h2>Contact Us</h2>
              <div className={styles.contactCard}>
                <p className={styles.contactText}>
                  If you have any questions or concerns regarding this Privacy Policy or our privacy
                  practices, please contact us at:
                </p>
                <a className={styles.emailLink} href="mailto:harvesthimachal@gmail.com">
                  harvesthimachal@gmail.com
                </a>
                <div className={styles.contactActions}>
                  <Link className={styles.contactBtn} to="/contactUs">
                    Go to Contact Page
                  </Link>
                </div>
              </div>
            </section>
          </article>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Privacy;
