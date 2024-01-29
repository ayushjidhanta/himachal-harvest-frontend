import React, { useRef } from "react";
// import "./checkout.css";
import emailjs from "@emailjs/browser";
import { useSelector } from "react-redux";
import Navbar2 from "../Home/Navbar2";
export const Checkout = () => {
  const form = useRef();

  const { cartItems } = useSelector((state) => state.cart);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_wce3q2l",
        "template_09z3jgy",
        form.current,
        "efJUC9kRw24_ByevK"
      )
      .then(
        (result) => {
          alert("Order placed Successfully.");
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <>
      <Navbar2 />

      <div className="Secion_1">
        <div className="Section1_wrap">
          <form className="row g-3" ref={form} onSubmit={sendEmail}>
            <div style={{ fontSize: "15px" }}>
              <p>Your items {cartItems.length}</p>
              <textarea
                rows="6"
                style={{ width: "100%" }}
                name="ordered_items"
                value={
                  cartItems &&
                  cartItems.map((item) => {
                    return "\n" + item.title.shortTitle;
                  })
                }
              ></textarea>
            </div>
            <div className="row g-3">
              <h2>Fill to confirm Purchase</h2>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  aria-label="First name"
                  name="user_name"
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last name"
                  aria-label="Last name"
                  name="user_lastname"
                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="inputEmail4" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="inputEmail4"
                name="user_email"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputPhone4" className="form-label">
                Phone
              </label>
              <input
                type="number"
                className="form-control"
                id="inputEmail4"
                name="user_number"
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputAddress" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddress"
                placeholder="1234 Main St"
                name="user_address"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="inputCity" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="inputCity"
                name="user_city"
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="inputState" className="form-label">
                State
              </label>

              <select id="inputState" className="form-select">
                <option selected>Choose...</option>
                <option>Himachal Pradesh</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="inputZip" className="form-label">
                Zip
              </label>
              <input
                type="text"
                className="form-control"
                id="inputZip"
                name="user_zipcode"
              />
            </div>
            {/* <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck"
              />
              <label className="form-check-label" for="gridCheck">
                Check me out
              </label>
            </div>
          </div> */}
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Confirm Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
