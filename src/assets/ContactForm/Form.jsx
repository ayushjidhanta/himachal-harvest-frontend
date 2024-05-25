import React, { useState } from "react";
import style from "./Form.module.css"; 
import PrimaryButton from "../../assets/Button/PrimaryButton/PrimaryButton"
function Form({ onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      fullName: "",
      email: "",
      message: "",
    });
  };

  return (
    <form className={style.form_container} onSubmit={handleSubmit}>
      <div className={style.form_group}>
        <label htmlFor="fullName" className={style.label}>
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={style.input}
          required
        />
      </div>
      <div className={style.form_group}>
        <label htmlFor="email" className={style.label}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={style.input}
          required
        />
      </div>
      <div className={style.form_group}>
        <label htmlFor="message" className={style.label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`${style.input} ${style.inputTextarea}`}
          required
        />
      </div>
      <div className="submit-button">
          <PrimaryButton title="Submit" />
        </div>
    </form>
  );
}

export default Form;
