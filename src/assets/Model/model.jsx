import React from "react";
import PrimaryButton from "../../assets/Button/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../assets/Button/SecondaryButton/SecondaryButton";
import Style from "./model.module.css";

function Model({ title, isOpen, onClose, onSave }) {
    const handleStorageData = (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            form.reportValidity();
            return;
        }
        const reviewName = document.getElementById("reviewName").value;
        const reviewDescription = document.getElementById("reviewDescription").value;
        const reviewDate = new Date();
        const newReview = { reviewName, reviewDescription, reviewDate };
        onSave(newReview);
        onClose();
    };

    return (
        isOpen && (
            <div className={Style.modal}>
                <form onSubmit={handleStorageData} noValidate>
                    <div className={Style.modal_dialog}>
                        <div className={Style.modal_content}>
                            <div className={Style.modal_header}>
                                <h1 className={Style.modal_title}>{title}</h1>
                                <button
                                    type="button"
                                    className={Style.close_modal_btn}
                                    onClick={onClose}
                                >
                                    ×
                                </button>
                            </div>
                            <div className={Style.modal_body}>
                                <div className={Style.form_group}>
                                    <input
                                        type="text"
                                        id="reviewName"
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div className={Style.form_group}>
                                    <textarea
                                        id="reviewDescription"
                                        placeholder="Please add Discription"
                                        required
                                    />
                                </div>
                            </div>
                            <div className={Style.modal_footer}>
                                <SecondaryButton event={onClose} title="Close" />
                                <PrimaryButton type="submit" title="Save" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    );
}

export default Model;
