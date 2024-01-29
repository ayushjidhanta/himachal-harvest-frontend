import React from "react";
// import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";

export default function Cart() {
  const navigate = useNavigate();

  // const {cartItems} = use
  const { cartItems } = useSelector((state) => state.cart);

  const handleBack = () => {
    navigate("/explore");
  };
  const handleCheckout=()=>{
   navigate("/checkout");
  }


  return (
    <>
      <div className="encapsule">
        <br></br><br></br><br></br>
        <header>
          <div className="continue-shopping">
            
            <h3 style={{ color:"white",}}><i className="fa-sharp fa-solid fa-arrow-left fa-2xl" onClick={handleBack} style={{cursor: "pointer", color:"white",}}></i>&nbsp; &nbsp;continue shopping</h3>
          </div>
         
        </header>
        <section className="main-cart-section">
          <h1> Your Cart </h1>
          <h4 className="total-items">
            you have{" "}
            <span className="total-items-count">{cartItems.length}</span> items
            in your cart
          </h4>
          <div className="cart-items">
            <div className="cart-items-container">
              {cartItems &&
                cartItems.map((item) => {
                  return <CartItem item={item} />;
                })}
            </div> 
          </div>
        </section>
      </div>
      <header>
          <div className="Footer-continue-shopping">
            <h3> Check Out</h3>
            <div className="Button_Checkout">
           <button type="button" className="btn btn-light" onClick={handleCheckout}>Checkout</button>
      </div>
          </div>
        </header>
    </>
  );
}