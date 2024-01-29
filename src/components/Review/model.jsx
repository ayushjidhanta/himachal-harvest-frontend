import React from "react";
// import "./model.css";

function Model() {
  const handleStorageData = () => {
    const reviewName = document.getElementById("reviewName").value;
    const reviewDescription =
      document.getElementById("reviewdiscription").value;

    const existingData = localStorage.getItem("reviews");
    const reviews = existingData ? JSON.parse(existingData) : [];

    // Create a new review object
    const newReview = { reviewName, reviewDescription };

    // Add the new review to the array
    reviews.push(newReview);

    // Store the updated array in local storage
    localStorage.setItem("reviews", JSON.stringify(reviews));
  };
  return (
    <div>
      <div className="p-5 text-center bg-green">
        <h1 className="mb-10" style={{ color: "white" }}>
          Review
        </h1>
        <h4 className="mb-10" style={{ color: "white" }}>
          Give Your Reviews from here
        </h4>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Give Review
        </button>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <form>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Reviews Here
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="reviewName"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="textarea"
                    id="reviewdiscription"
                    placeholder="Please add Your Reviews"
                    required
                    style={{ border: "rgb(83, 183, 222) 1px solid;" }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  className="btn btn-info btn-lg btn-block"
                  type="submit"
                  data-mdb-ripple-color="dark"
                  onClick={handleStorageData}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Model;
