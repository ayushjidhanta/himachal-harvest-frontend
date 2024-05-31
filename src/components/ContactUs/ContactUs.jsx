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
  const alertDialogHandler = (field, value) => {
    setAlertDialog((prev) => ({ ...prev, [field]: value }));
  };
  const showAlert = ( message) => {
    alertDialogHandler("isOpen", true);
    alertDialogHandler("message", message);
  };
  const handleContactButtonClick = () => {
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleCallButtonClick = () => {
    console.log("Contact");
  };

  const handleFormSubmit = async(formData) => {
    setSpinner(true);
    try {
      debugger;
      const response = await uploadForm(formData);
      if (response.status === responseStatus.CREATED) {
        showAlert(
          "Message Sent Successfully"
        );
      }
    }
    catch{
      console.error("caught Error ");
    }
    setSpinner(false);
  };

  return (
    <div>
      <Navbar2 />
      <AlertDialog
        isOpen={alertDialog.isOpen}
        alertMessage={alertDialog.message}
        handlerFunction={alertDialogHandler}
      />
      <SpinnerHimachalHarvest show={spinner} />
      <div className={style.contact_container}>
        <div className={style.contact_button}>
          <PrimaryButton event={handleContactButtonClick} title="Contact Us" />
        </div>

        <div className={style.call_button}>
          <PrimaryButton event={handleCallButtonClick} title="Call Us" />
        </div>
      </div>
      <div ref={formRef}>
        <ContactForm onSubmit={handleFormSubmit} />
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
