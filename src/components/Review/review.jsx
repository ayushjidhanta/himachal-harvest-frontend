import React, { useEffect, useState } from "react";
import Navbar2 from "../Home/Navbar2";
import Style from "./review.module.css";
import Model from "../../assets/Model/model";
import PrimaryButton from "../../assets/Button/PrimaryButton/PrimaryButton";
import { Reviews } from "../../service/GeneralService/api";
import apiActions from "../../enum/apiActions";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import AlertDialog from "../../assets/AlertDialog/AlertDialog";
import responseStatus from "../../enum/responseStatus";
function Review() {
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: "", });
    const alertDialogHandler = (field, value) => {
        setAlertDialog((prev) => ({ ...prev, [field]: value }));
    };
    const showAlert = (message) => {
        alertDialogHandler("isOpen", true);
        alertDialogHandler("message", message);
    };
    const fetchReviews = async () => {
        try {
            setSpinner(true);
            const response = await Reviews(apiActions.GET);
            if (response.status === responseStatus.SUCCESS) {
                setReviews(response.data.reviews);
                setSpinner(false);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveReview = async (newReview) => {
        try {
            setSpinner(true);
            let persistData = {
                name: newReview.reviewName,
                discription: newReview.reviewDescription,
                date: newReview.reviewDate.toLocaleDateString()
            };
            const response = await Reviews(apiActions.POST, newReview);
             
            if (response.status === responseStatus.SUCCESS) {
                setReviews([...reviews, persistData]);
                showAlert(
                    "Review Sent Successfully"
                );
            }
            setSpinner(false);
        } catch (error) {
            console.error("Error saving review:", error);
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
            <div className={Style.review_header}>
                <h1 className={Style.main_heading}>Give Review</h1>
                <h2 className={Style.sub_heading}>Click below to give review</h2>
                <PrimaryButton event={handleOpenModal} title="Give Review" />
            </div>
            <SpinnerHimachalHarvest show={spinner} />
            <Model
                title="Review Here"
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveReview}
            />
            {reviews.map((review, index) => (
                <div className={Style.review_container} key={index}>
                    <div className={Style.review_details}>
                        <h3 className={Style.review_title}>{review.name}</h3>
                        <p className={Style.review_description}>{review.discription}</p>
                        <p className={Style.review_date}>Reviewed on Date {review.date}</p>
                    </div>
                    <div className={Style.review_photo}>
                        <img
                            src="https://img.freepik.com/free-vector/organic-flat-feedback-concept_52683-62653.jpg?w=1060&t=st=1686740054~exp=1686740654~hmac=86f720d8ae2b6878178b6bcfb080b17be421965d34fb69a829bc21a106aa7af7"
                            alt="my-pic"
                        />
                    </div>
                </div>
            ))}
        </>
    );
}

export default Review;
