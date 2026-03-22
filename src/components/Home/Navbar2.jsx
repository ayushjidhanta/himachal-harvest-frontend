import React, { useRef, useContext, useMemo } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import navStyle from "./Nav2.module.css";
import { useSelector } from "react-redux";
import cartImage from "../../assets/Images/Cart.gif";
import { AuthContext } from "../../context/auth-context";

export default function Navbar2() {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const auth = useContext(AuthContext);
  const role = String(auth?.role || "").toLowerCase();
  const showAdmin = role === "admin" || auth.isAdminLoggedIn;
  const showUser = role === "user" || auth.isUserLoggedIn;
  const showPartner = role === "partner" || auth.isPartnerLoggedIn;
  const showCart = showUser || showAdmin;
  const showProducts = showUser || showAdmin;
  const showMyOrders = showUser || showAdmin;
  const showReview = showUser || showAdmin;
  const isLoggedIn = showUser || showAdmin || showPartner;

  const togglePg = () => {
    navigate("/cart");
  };

  const closeOverlays = () => {
    searchRef?.current?.classList?.remove(navStyle.active);
    navbarRef?.current?.classList?.remove(navStyle.active);
    cartItemRef?.current?.classList?.remove(navStyle.active);
    adminRef?.current?.classList?.remove(navStyle.active);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("role");
      localStorage.removeItem("persist:root");
    } catch {}

    auth?.logout?.();

    closeOverlays();

    navigate("/signin");
  };

  const searchRef = useRef(null);
  const navbarRef = useRef(null);
  const cartItemRef = useRef(null);
  const adminRef = useRef(null);

  const toggleSearch = () => {
    searchRef.current?.classList.toggle(navStyle.active);
    navbarRef.current?.classList.remove(navStyle.active);
    cartItemRef.current?.classList.remove(navStyle.active);
    adminRef.current?.classList.remove(navStyle.active);
  };

  const toggleMenu = () => {
    navbarRef.current?.classList.toggle(navStyle.active);
    searchRef.current?.classList.remove(navStyle.active);
    cartItemRef.current?.classList.remove(navStyle.active);
    adminRef.current?.classList.remove(navStyle.active);
  };

  const toggleCart = () => {
    cartItemRef.current?.classList.toggle(navStyle.active);
    searchRef.current?.classList.remove(navStyle.active);
    navbarRef.current?.classList.remove(navStyle.active);
    adminRef.current?.classList.remove(navStyle.active);
  };

  const toggleAdmin = () => {
    adminRef.current?.classList.toggle(navStyle.active);
    searchRef.current?.classList.remove(navStyle.active);
    navbarRef.current?.classList.remove(navStyle.active);
    cartItemRef.current?.classList.remove(navStyle.active);
  };

  const navItems = useMemo(() => {
    if (showPartner) {
      return [
        { to: "/partner", label: "Dashboard" },
        { to: "/contactUs", label: "Contact" },
        { to: "/privacy", label: "Privacy" },
      ];
    }

    if (showUser || showAdmin) {
      return [
        { to: "/", label: "Home" },
        ...(showProducts ? [{ to: "/explore", label: "Products" }] : []),
        ...(showMyOrders ? [{ to: "/my-orders", label: "My Orders" }] : []),
        ...(showReview ? [{ to: "/review", label: "Review" }] : []),
        { to: "/about", label: "About" },
        { to: "/contactUs", label: "Contact" },
        { to: "/privacy", label: "Privacy" },
      ];
    }

    return [];
  }, [showAdmin, showMyOrders, showPartner, showProducts, showReview, showUser]);

  const brandHref = showPartner ? "/partner" : "/";

  return (
    <div className={navStyle.header}>
      <div className={navStyle.brand}>
        <Link to={brandHref} className={navStyle.brandLink} onClick={closeOverlays}>
          Himachal Harvest
        </Link>
      </div>

      <nav className={navStyle.navbar} ref={navbarRef} aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={closeOverlays}
            className={({ isActive }) =>
              `${navStyle.navLink} ${isActive ? navStyle.navLinkActive : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={navStyle.actions}>
        {showProducts ? (
          <button
            type="button"
            className={navStyle.actionBtn}
            onClick={toggleSearch}
            aria-label="Search products"
          >
            Search
          </button>
        ) : null}

        {showCart ? (
          <button
            type="button"
            className={navStyle.actionBtn}
            onClick={toggleCart}
            aria-label="Open cart"
          >
            Cart
            <span className={navStyle.badge} aria-label={`${cartItems.length} items in cart`}>
              {cartItems.length}
            </span>
          </button>
        ) : null}

        {showAdmin ? (
          <button
            type="button"
            className={navStyle.actionBtn}
            onClick={toggleAdmin}
            aria-label="Open admin menu"
          >
            Admin
          </button>
        ) : null}

        <button
          type="button"
          className={`${navStyle.actionBtn} ${navStyle.menuBtn}`}
          onClick={toggleMenu}
          aria-label="Open menu"
        >
          Menu
        </button>

        {isLoggedIn && (
          <button type="button" className={navStyle.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      <div className={navStyle.search_form} ref={searchRef}>
        <input type="search" id="search-box" placeholder="search here..." />
        <label htmlFor="search-box" className={navStyle.searchLabel}>
          Go
        </label>
      </div>

      {/* CART ITEMS CONTAINER----- */}
      <div
        className={navStyle.cart_items_container}
        ref={cartItemRef}
        style={showCart ? undefined : { display: "none" }}
      >
        <div className={navStyle.cart_item}>
          <img src={cartImage} alt="Loading..." />
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

      <div className={navStyle.ADMIN} ref={adminRef} style={showAdmin ? undefined : { display: "none" }}>
        <Link to="/admin">Add Product</Link>
        <Link to="/admin/manage-products">Manage Products</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/delivery">Delivery</Link>
        <Link to="/admin/users">Users</Link>
      </div>
    </div>
  );
}
