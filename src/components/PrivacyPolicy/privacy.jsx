import React from 'react'
import Navbar2 from '../Home/Navbar2'
import Footer from '../../assets/Footer/Footer'
import Styles from "./privacy.module.css"

function privacy() {
  return (
    <>
   <Navbar2/>
    <div className={Styles.privacy_policy}>
    <h1>Privacy Policy</h1>

    <p>
      At Himachal Harvest, we prioritize the privacy and security of our users'
      personal information. This Privacy Policy outlines how we collect,
      use, and protect the information you provide to us.
    </p>

    <h2>Information We Collect</h2>

    <p>
      We may collect the following types of information when you interact
      with our website or services:
    </p>

    <ul>
      <li>Personal information such as your name, email address, and phone number.</li>
      <li>Demographic information such as your age, gender, and location.</li>
      <li>Payment information necessary for completing transactions.</li>
      <li>Information about your interactions with our website and services.</li>
      <li>Device information such as your IP address, browser type, and operating system.</li>
      <li>Any other information you choose to provide to us.</li>
    </ul>

    <h2>How We Use Your Information</h2>

    <p>
      We may use the information we collect for the following purposes:
    </p>

    <ul>
      <li>Provide and personalize our services to meet your needs.</li>
      <li>Process and fulfill your orders and transactions.</li>
      <li>Communicate with you about your account and provide customer support.</li>
      <li>Send you promotional offers, updates, and newsletters.</li>
      <li>Improve our website, services, and user experience.</li>
      <li>Protect against fraud and unauthorized access.</li>
    </ul>

    <h2>Information Sharing</h2>

    <p>
      We may share your information with third parties in the following cases:
    </p>

    <ul>
      <li>With your consent or at your direction.</li>
      <li>With our trusted partners and service providers who assist us in delivering our services.</li>
      <li>To comply with legal obligations or respond to lawful requests.</li>
      <li>In case of a merger, acquisition, or sale of our company assets.</li>
    </ul>

    <h2>Security Measures</h2>

    <p>
      We implement appropriate security measures to protect your information
      from unauthorized access, alteration, disclosure, or destruction.
      However, please note that no method of transmission over the internet
      or electronic storage is completely secure, and we cannot guarantee
      absolute security.
    </p>

    <h2>Updates to This Privacy Policy</h2>

    <p>
      We may update this Privacy Policy from time to time. Any changes will be
      posted on this page, and the "Last Updated" date will be revised
      accordingly. We encourage you to review this Privacy Policy periodically
      for any updates.
    </p>

    <h2>Contact Us</h2>

    <p>
      If you have any questions or concerns regarding this Privacy Policy or our
      privacy practices, please contact us at:
    </p>

    <p>Email: harvesthimachal@gmail.com</p>
  </div>
  <Footer/>
  </>
  )
}

export default privacy
