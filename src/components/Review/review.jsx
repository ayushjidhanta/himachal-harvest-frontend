import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Navbar2 from "../Home/Navbar2";
import Style from "./review.module.css";
import Model from "../../assets/Model/model";
import PrimaryButton from "../../assets/Button/PrimaryButton/PrimaryButton";
import { Reviews } from "../../service/GeneralService/api";
import apiActions from "../../enum/apiActions";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import AlertDialog from "../../assets/AlertDialog/AlertDialog";
import responseStatus from "../../enum/responseStatus";
import { AuthContext } from "../../context/auth-context";
function Review() {
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: "", });
    const auth = useContext(AuthContext);
    const role = String(auth?.role || "").toLowerCase();
    const isAdmin = role === "admin" || auth?.isAdminLoggedIn;

    const stats = useMemo(() => {
        const total = reviews.length;
        return { total };
    }, [reviews.length]);

    const alertDialogHandler = useCallback((field, value) => {
        setAlertDialog((prev) => ({ ...prev, [field]: value }));
    }, []);

    const showAlert = useCallback((message) => {
        alertDialogHandler("isOpen", true);
        alertDialogHandler("message", message);
    }, [alertDialogHandler]);

    const fetchReviews = useCallback(async () => {
        try {
            setSpinner(true);
            const response = await Reviews(apiActions.GET);
            if (response.status === responseStatus.SUCCESS) {
                setReviews(response.data.reviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            showAlert("Failed to load reviews. Please try again.");
        } finally {
            setSpinner(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveReview = async (newReview) => {
        try {
            setSpinner(true);
            const response = await Reviews(apiActions.POST, newReview);
             
            if (response.status === responseStatus.SUCCESS) {
                showAlert(
                    "Review Sent Successfully"
                );
                await fetchReviews();
            }
        } catch (error) {
            console.error("Error saving review:", error);
            showAlert("Failed to submit review. Please try again.");
        } finally {
            setSpinner(false);
        }
    };

    const formatDate = (value) => {
        try {
            return new Date(value).toLocaleDateString();
        } catch {
            return String(value || "");
        }
    };

    const renderStars = (ratingValue) => {
        const r = Number(ratingValue || 0);
        if (!Number.isFinite(r) || r <= 0) return null;
        const clamped = Math.max(1, Math.min(5, Math.round(r)));
        return (
            <div className={Style.starsRow} aria-label={`Rating ${clamped} out of 5`}>
                {"★★★★★".slice(0, clamped)}
                <span className={Style.starsOff} aria-hidden="true">
                    {"★★★★★".slice(0, 5 - clamped)}
                </span>
            </div>
        );
    };

    const deleteOne = async (review) => {
        const id = review?._id;
        if (!id) {
            showAlert("Cannot delete: missing review id.");
            return;
        }
        if (!isAdmin) {
            showAlert("Only admin can delete reviews.");
            return;
        }

        const ok = window.confirm("Delete this review? This cannot be undone.");
        if (!ok) return;

        setDeletingId(id);
        try {
            const response = await Reviews(apiActions.DELETE, id);
            if (response.status === responseStatus.SUCCESS) {
                showAlert("Review deleted.");
                await fetchReviews();
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            const msg = error?.response?.data?.error?.message || error?.response?.data?.message || "Failed to delete review.";
            showAlert(msg);
        } finally {
            setDeletingId("");
        }
    };

    return (
        <>
            <Navbar2 />
            <AlertDialog
                isOpen={alertDialog.isOpen}
                alertMessage={alertDialog.message}
                handlerFunction={alertDialogHandler}
            />

            <div className={Style.page}>
                <header className={Style.hero}>
                    <div className={Style.heroInner}>
                        <h1 className={Style.title}>Reviews</h1>
                        <p className={Style.subtitle}>
                            Your feedback helps us improve quality and delivery experience.
                        </p>
                        <div className={Style.metaRow}>
                            <span className={Style.metaPill}>{stats.total} reviews</span>
                            {isAdmin ? <span className={Style.metaPillAdmin}>Admin</span> : null}
                        </div>
                        <div className={Style.ctaRow}>
                            <PrimaryButton event={handleOpenModal} title="Write a Review" />
                            <button type="button" className={Style.secondaryBtn} onClick={fetchReviews}>
                                Refresh
                            </button>
                        </div>
                    </div>
                </header>

                <SpinnerHimachalHarvest show={spinner} />
                <Model
                    title="Review Here"
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveReview}
                />

                <main className={Style.container}>
                    {reviews.length === 0 && !spinner ? (
                        <div className={Style.emptyCard}>
                            <div className={Style.emptyTitle}>No reviews yet</div>
                            <div className={Style.emptySub}>Be the first to share your experience.</div>
                            <div className={Style.emptyActions}>
                                <PrimaryButton event={handleOpenModal} title="Write a Review" />
                            </div>
                        </div>
                    ) : null}

                    <div className={Style.grid}>
                        {reviews.map((review) => {
                            const initial = String(review?.name || "?").trim().slice(0, 1).toUpperCase();
                            const id = review?._id || "";
                            const isDeleting = deletingId === id;
                            return (
                                <div className={Style.card} key={id || `${review?.name}-${review?.date}`}>
                                    <div className={Style.cardTop}>
                                        <div className={Style.avatar} aria-hidden="true">
                                            {initial || "?"}
                                        </div>
                                        <div className={Style.cardHead}>
                                            <div className={Style.cardName}>{review?.name}</div>
                                            <div className={Style.cardDate}>{formatDate(review?.date)}</div>
                                        </div>
                                        {isAdmin ? (
                                            <button
                                                type="button"
                                                className={Style.deleteBtn}
                                                onClick={() => deleteOne(review)}
                                                disabled={isDeleting}
                                                aria-label="Delete review"
                                            >
                                                {isDeleting ? "Deleting…" : "Delete"}
                                            </button>
                                        ) : null}
                                    </div>
                                    <div className={Style.cardBody}>
                                        <div className={Style.quoteMark} aria-hidden="true">
                                            “
                                        </div>
                                        {renderStars(review?.rating)}
                                        <p className={Style.cardText}>{review?.discription}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </>
    );
}

export default Review;
