import React, { useEffect, useState } from "react";
import Navbar2 from "../Home/Navbar2";
// import "./review.css";
import Model from "./model";

function Review() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const storedReviews = localStorage.getItem("reviews");
    if (storedReviews) {
      const parsedReviews = JSON.parse(storedReviews);
      setReviews(parsedReviews);
    }
  }, []);

  return (
    <>
      <Navbar2 />
      <div className="margin-box">
        <h1>Explore 2</h1>
      </div>
      <Model />
      {reviews.map((review, index) => (
        <div className="review-container" key={index}>
          <div className="review-details">
            <h3 className="review-title">{review.reviewName}</h3>
            <p className="review-description">{review.reviewDescription}</p>
            <p className="review-date">Reviewed on Today{review.reviewDate}</p>
          </div>
          <div className="review-photo">
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
