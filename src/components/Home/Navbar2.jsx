import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import navStyle from "./Nav2.module.css";
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
    searchRef.current.classList.toggle(navStyle.active);

    navbarRef.current.classList.remove(navStyle.active);
    cartItemRef.current.classList.remove(navStyle.active);
  };

  const toggleMenu = () => {
    navbarRef.current.classList.toggle(navStyle.active);

    searchRef.current.classList.remove(navStyle.active);
    cartItemRef.current.classList.remove(navStyle.active);
  };

  const toggleCart = () => {
    cartItemRef.current.classList.toggle(navStyle.active);

    searchRef.current.classList.remove(navStyle.active);
    navbarRef.current.classList.remove(navStyle.active);
  };

  return (
    <div className={`${navStyle.header} ${isFixed ? navStyle.fixed : ""}`}>
      <nav className={navStyle.navbar} ref={navbarRef}>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy </Link>
        <Link to="/explore">Products </Link>
        <Link to="/review">Review </Link>
      </nav>

      <div className={navStyle.icons}>
          <div className={navStyle.search_icon} 
          id="search-btnn" 
          onClick={toggleSearch}>Search</div>
      <div 
          className={navStyle.cart_icon} 
          id="cart-btnn" 
          onClick={toggleCart}>Cart</div>
      <div className={navStyle.menu_icon}
          id="menu-btnn" 
          onClick={toggleMenu}>Menu</div>
      </div>

      <div className={navStyle.search_form} ref={searchRef}>
        <input type="search" id="search-box" placeholder="search here..." />
        <label htmlFor="search-box" className={navStyle.search_icon}></label>
      </div>


      {/* CART ITEMS CONTAINER----- */}
      <div className={navStyle.cart_items_container} ref={cartItemRef}>
      <div className={navStyle.cart_item}>
          <img src={cartImage} alt="Loading..."></img>
          <span className="fas fa_time"></span>
          <div className={navStyle.content}>
            {/* <h3>Total Items</h3> */}
            <div className={navStyle.price}>{/* Price */}</div>
          </div>
        </div>

        <div className={navStyle.bag_quantity}>
          <span>{cartItems.length}</span>
        </div>
        <button className={navStyle.Checkout} onClick={togglePg}>
          Go to My Cart{" "}
        </button>
      </div>
    </div>
  );
}
