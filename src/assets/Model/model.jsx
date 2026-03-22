import React, { useEffect, useMemo, useState } from "react";
import PrimaryButton from "../../assets/Button/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../assets/Button/SecondaryButton/SecondaryButton";
import Style from "./model.module.css";

function Model({ title, isOpen, onClose, onSave }) {
    const [reviewName, setReviewName] = useState("");
    const [reviewDescription, setReviewDescription] = useState("");
    const [reviewRating, setReviewRating] = useState(5);

    const remaining = useMemo(() => {
        const max = 400;
        return Math.max(0, max - String(reviewDescription || "").length);
    }, [reviewDescription]);

    useEffect(() => {
        if (!isOpen) return;
        setReviewName("");
        setReviewDescription("");
        setReviewRating(5);
    }, [isOpen]);

    const handleStorageData = (e) => {
        e.preventDefault();
        const form = e.target;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            form.reportValidity();
            return;
        }

        const reviewDate = new Date();
        const newReview = { reviewName, reviewDescription, reviewDate, reviewRating };
        onSave(newReview);
        onClose();
    };

    return (
        isOpen && (
            <div className={Style.modal} role="dialog" aria-modal="true" aria-label={title || "Write a review"}>
                <form onSubmit={handleStorageData} noValidate>
                    <div className={Style.modal_dialog}>
                        <div className={Style.modal_content}>
                            <div className={Style.modal_header}>
                                <div>
                                    <h1 className={Style.modal_title}>{title}</h1>
                                    <div className={Style.modal_subtitle}>
                                        Share honest feedback to help us improve.
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className={Style.close_modal_btn}
                                    onClick={onClose}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>
                            <div className={Style.modal_body}>
                                <div className={Style.form_group}>
                                    <label className={Style.label} htmlFor="reviewName">
                                        Your name
                                    </label>
                                    <input
                                        type="text"
                                        id="reviewName"
                                        value={reviewName}
                                        onChange={(e) => setReviewName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                        minLength={2}
                                        maxLength={60}
                                        autoComplete="name"
                                    />
                                </div>
                                <div className={Style.form_group}>
                                    <label className={Style.label}>Rating</label>
                                    <div className={Style.stars} role="radiogroup" aria-label="Rating">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <label key={n} className={Style.starLabel}>
                                                <input
                                                    type="radio"
                                                    name="reviewRating"
                                                    value={n}
                                                    checked={reviewRating === n}
                                                    onChange={() => setReviewRating(n)}
                                                />
                                                <span className={Style.star} aria-hidden="true">
                                                    {n <= reviewRating ? "★" : "☆"}
                                                </span>
                                                <span className={Style.srOnly}>{n} stars</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className={Style.form_group}>
                                    <div className={Style.rowBetween}>
                                        <label className={Style.label} htmlFor="reviewDescription">
                                            Your review
                                        </label>
                                        <span className={Style.counter}>{remaining} left</span>
                                    </div>
                                    <textarea
                                        id="reviewDescription"
                                        value={reviewDescription}
                                        onChange={(e) => setReviewDescription(e.target.value)}
                                        placeholder="What did you like? What can we improve?"
                                        required
                                        minLength={10}
                                        maxLength={400}
                                    />
                                    <div className={Style.hint}>
                                        Please don’t share personal info (phone, address, payment details).
                                    </div>
                                </div>
                            </div>
                            <div className={Style.modal_footer}>
                                <SecondaryButton event={onClose} title="Close" />
                                <PrimaryButton title="Submit Review" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    );
}

export default Model;
