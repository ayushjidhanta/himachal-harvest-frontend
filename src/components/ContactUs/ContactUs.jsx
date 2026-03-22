import React, { useRef, useState } from "react";
import Navbar2 from "../Home/Navbar2";
import style from "./ContactUs.module.css";
import PrimaryButton from "../../assets/Button/PrimaryButton/PrimaryButton";
import ContactForm from "../../assets/ContactForm/Form";
import Footer from "../../assets/Footer/Footer";
import { uploadForm } from "../../service/GeneralService/api";
import AlertDialog from "../../assets/AlertDialog/AlertDialog";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import responseStatus from "../../enum/responseStatus";

function ContactUs() {
  const formRef = useRef(null);
  const [spinner, setSpinner] = useState(false);
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    message: "",
  });
  const OWNER_EMAIL = process.env.REACT_APP_OWNER_EMAIL || "harvesthimachal@gmail.com";
  const OWNER_PHONE = process.env.REACT_APP_OWNER_PHONE || "8627019494";
  const OWNER_WHATSAPP = process.env.REACT_APP_OWNER_WHATSAPP || "8627019494";

  const alertDialogHandler = (field, value) => {
    setAlertDialog((prev) => ({ ...prev, [field]: value }));
  };
  const showAlert = (message) => {
    alertDialogHandler("isOpen", true);
    alertDialogHandler("message", message);
  };
  const handleContactButtonClick = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCallButtonClick = () => {
    if (!OWNER_PHONE) {
      showAlert("Phone number not available right now.");
      return;
    }
    window.location.href = `tel:${OWNER_PHONE}`;
  };

  const waLink = (phone, text) => {
    const p = String(phone || "").replace(/[^0-9]/g, "");
    if (!p) return "";
    const msg = encodeURIComponent(text || "");
    return `https://wa.me/${p}?text=${msg}`;
  };

  const ownerWhatsapp = waLink(OWNER_WHATSAPP || OWNER_PHONE, "Hi, I need help with Himachal Harvest.");

  const handleFormSubmit = async (formData) => {
    setSpinner(true);
    try {
      const response = await uploadForm(formData);
      if (response.status === responseStatus.CREATED) {
        showAlert("Message Sent Successfully");
      }
    } catch {
      console.error("caught Error ");
      showAlert("Failed to send message. Please try again.");
    }
    setSpinner(false);
  };

  return (
    <div className={style.page}>
      <Navbar2 />
      <AlertDialog
        isOpen={alertDialog.isOpen}
        alertMessage={alertDialog.message}
        handlerFunction={alertDialogHandler}
      />
      <SpinnerHimachalHarvest show={spinner} />

      <header className={style.hero}>
        <div className={style.heroInner}>
          <h1 className={style.title}>Contact Himachal Harvest</h1>
          <p className={style.subtitle}>
            Need help with orders, delivery, or products? Send us a message and we’ll get back to you.
          </p>

          <div className={style.ctaRow}>
            <div className={style.ctaItem}>
              <PrimaryButton event={handleContactButtonClick} title="Send a Message" />
            </div>
            <div className={style.ctaItem}>
              <PrimaryButton event={handleCallButtonClick} title={OWNER_PHONE ? "Call Us" : "Call Unavailable"} />
            </div>
            {ownerWhatsapp ? (
              <a className={style.waBtn} href={ownerWhatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            ) : null}
          </div>

          <div className={style.infoGrid}>
            <div className={style.infoCard}>
              <div className={style.infoLabel}>Email</div>
              <a className={style.infoValue} href={`mailto:${OWNER_EMAIL}`}>
                {OWNER_EMAIL}
              </a>
              <div className={style.infoHint}>Best for detailed queries</div>
            </div>

            <div className={style.infoCard}>
              <div className={style.infoLabel}>Phone</div>
              {OWNER_PHONE ? (
                <a className={style.infoValue} href={`tel:${OWNER_PHONE}`}>
                  {OWNER_PHONE}
                </a>
              ) : (
                <div className={style.infoValueMuted}>Not set</div>
              )}
              <div className={style.infoHint}>Available if configured</div>
            </div>

            <div className={style.infoCard}>
              <div className={style.infoLabel}>Support</div>
              <div className={style.infoValue}>Fast responses</div>
              <div className={style.infoHint}>We usually reply within 24–48 hours</div>
            </div>
          </div>
        </div>
      </header>

      <main className={style.main}>
        <div className={style.formWrap} ref={formRef} id="contact-form">
          <div className={style.formHeader}>
            <h2 className={style.formTitle}>Send us a message</h2>
            <p className={style.formSubtitle}>
              Share your name and email so we can reach you. Please include order details if applicable.
            </p>
          </div>
          <ContactForm onSubmit={handleFormSubmit} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ContactUs;
