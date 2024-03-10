import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Nav2.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import cartImage from "../../assets/Images/Cart.gif";

export default function Navbar2() {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const [isFixed, setIsFixed] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    setIsFixed(offset > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const togglePg = () => {
    navigate("/cart");
  };

  const searchRef = useRef(null);
  const navbarRef = useRef(null);
  const cartItemRef = useRef(null);

  const toggleSearch = () => {
    searchRef.current.classList.toggle("active");

    navbarRef.current.classList.remove("active");
    cartItemRef.current.classList.remove("active");
  };

  const toggleMenu = () => {
    navbarRef.current.classList.toggle("active");

    searchRef.current.classList.remove("active");
    cartItemRef.current.classList.remove("active");
  };

  const toggleCart = () => {
    cartItemRef.current.classList.toggle("active");

    searchRef.current.classList.remove("active");
    navbarRef.current.classList.remove("active");
  };

  return (
    <div className={`header ${isFixed ? "fixed" : ""}`}>
      <nav className="navbar" ref={navbarRef}>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy </Link>
        <Link to="/explore">Products </Link>
        <Link to="/review">Review </Link>
      </nav>

      <div className="icons">
          <div className="search-icon" 
          id="search-btnn" 
          onClick={toggleSearch}>Search</div>
      <div 
          className="cart-icon" 
          id="cart-btnn" 
          onClick={toggleCart}>Cart</div>
      <div className="menu-icon" 
          id="menu-btnn" 
          onClick={toggleMenu}>Menu</div>
      </div>

      <div className="search-form" ref={searchRef}>
        <input type="search" id="search-box" placeholder="search here..." />
        <label htmlFor="search-box" className="search-icon"></label>
      </div>


      {/* CART ITEMS CONTAINER----- */}
      <div className="cart-items-container" ref={cartItemRef}>
        <div className="cart-item">
          <img src={cartImage} alt="Loading..."></img>
          <span className="fas fa-time"></span>
          <div className="content ">
            {/* <h3>Total Items</h3> */}
            <div className="price">{/* Price */}</div>
          </div>
        </div>

        <div className="bag-quantity">
          <span>{cartItems.length}</span>
        </div>
        <button className="Checkout" onClick={togglePg}>
          Go to My Cart{" "}
        </button>
      </div>
    </div>
  );
}
