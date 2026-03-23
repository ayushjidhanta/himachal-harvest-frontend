import React, { useRef, useContext, useMemo, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import navStyle from "./Nav2.module.css";
import { useSelector } from "react-redux";
import cartImage from "../../assets/Images/Cart.gif";
import { AuthContext } from "../../context/auth-context";

const normalizeRole = (role) => {
  const r = String(role || "").toLowerCase();
  if (r === "partner") return "manager";
  return r;
};

const formatINR = (value) => {
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );
}

export default function Navbar2() {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const auth = useContext(AuthContext);
  const role = normalizeRole(auth?.role);
  const showAdmin = role === "admin" || auth.isAdminLoggedIn;
  const showUser = role === "user" || auth.isUserLoggedIn;
  const showManager = role === "manager" || auth.isManagerLoggedIn || auth.isPartnerLoggedIn;
  const isLoggedIn = showUser || showAdmin || showManager;
  const isGuest = !isLoggedIn;
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const showCart = showUser;
  const showProducts = isGuest || showUser || showAdmin;
  const showMyOrders = showUser || showAdmin;

  const closeOverlays = () => {
    navbarRef?.current?.classList?.remove(navStyle.active);
    cartItemRef?.current?.classList?.remove(navStyle.active);
    adminRef?.current?.classList?.remove(navStyle.active);
    setIsProfileMenuOpen(false);
    overlayRef?.current?.classList?.remove(navStyle.active);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("role");
      localStorage.removeItem("persist:root");
    } catch { }

    auth?.logout?.();

    closeOverlays();

    navigate("/");
  };

  const openCart = () => {
    closeOverlays();
    cartItemRef.current?.classList.add(navStyle.active);
    overlayRef.current?.classList.add(navStyle.active);
  };

  const toggleCart = () => {
    const isOpen = cartItemRef.current?.classList?.contains(navStyle.active);
    if (isOpen) closeOverlays();
    else openCart();
  };

  const goToCart = () => {
    closeOverlays();
    navigate("/cart");
  };

  const goToCheckout = () => {
    closeOverlays();
    navigate("/checkout");
  };

  const goToSignIn = () => {
    closeOverlays();
    navigate("/signin");
  };

  const navbarRef = useRef(null);
  const cartItemRef = useRef(null);
  const adminRef = useRef(null);
  const overlayRef = useRef(null);
  const profileBtnRef = useRef(null);

  const toggleMenu = () => {
    navbarRef.current?.classList.toggle(navStyle.active);
    cartItemRef.current?.classList.remove(navStyle.active);
    adminRef.current?.classList.remove(navStyle.active);
    setIsProfileMenuOpen(false);
    overlayRef.current?.classList.remove(navStyle.active);
  };

  const toggleAdmin = () => {
    adminRef.current?.classList.toggle(navStyle.active);
    navbarRef.current?.classList.remove(navStyle.active);
    cartItemRef.current?.classList.remove(navStyle.active);
    setIsProfileMenuOpen(false);
    overlayRef.current?.classList.remove(navStyle.active);
  };

  const toggleProfileMenu = () => {
    const willOpen = !isProfileMenuOpen;
    closeOverlays();
    if (!willOpen) return;
    setIsProfileMenuOpen(true);
    overlayRef.current?.classList.add(navStyle.active);
  };

  const navigateAndClose = (to) => {
    closeOverlays();
    navigate(to);
  };

  const { itemCount, subtotal } = useMemo(() => {
    const items = Array.isArray(cartItems) ? cartItems : [];
    const totalCount = items.reduce((sum, item) => sum + Number(item?.quantity ?? 1), 0);
    const total = items.reduce((sum, item) => sum + Number(item?.price?.cost ?? 0) * Number(item?.quantity ?? 1), 0);
    return { itemCount: totalCount, subtotal: total };
  }, [cartItems]);

  const profileMenuItems = useMemo(() => {
    if (showAdmin) {
      return [
        { label: "Dashboard", to: "/admin" },
      ];
    }

    if (showManager) {
      return [
        { label: "Dashboard", to: "/manager" },
      ];
    }

    if (showUser) {
      return [
        ...(showMyOrders ? [{ label: "My Orders", to: "/my-orders" }] : []),
      ];
    }

    return [];
  }, [showAdmin, showManager, showMyOrders, showProducts, showUser]);

  const navItems = useMemo(() => {
    if (showManager) {
      return [
        { to: "/manager", label: "Dashboard" },
      ];
    }

    if (showAdmin) {
      return [
        { to: "/admin/products", label: "Products" },
        { to: "/admin/listing", label: "Listing" },
        { to: "/admin/orders", label: "Orders" },
        { to: "/admin/delivery", label: "Delivery" },
        { to: "/admin/users", label: "Users" },
        { to: "/review", label: "Review" },
      ];
    }

    if (showUser) {
      return [
        ...(showProducts ? [{ to: "/explore", label: "Products" }] : []),
        { to: "/contactUs", label: "Contact" },
      ];
    }

    return [
      { to: "/", label: "Home" },
      { to: "/explore", label: "Products" },
      { to: "/review", label: "Review" },
      { to: "/about", label: "About" },
      { to: "/contactUs", label: "Contact" },
      { to: "/privacy", label: "Privacy" },
      { to: "/return", label: "Return Policy" },
      { to: "/signin", label: "Sign In", mobileOnly: true },
    ];
  }, [showAdmin, showManager, showProducts, showUser]);

  const brandHref = showManager ? "/manager" : "/";
  const username = String(auth?.user?.username || "").trim();
  const avatarLetter = username ? username[0].toUpperCase() : "U";
  const roleLabel = showAdmin ? "Admin" : showManager ? "Manager" : showUser ? "User" : "Guest";

  return (
    <div className={navStyle.header}>
      <div className={navStyle.brand}>
        <Link to={brandHref} className={navStyle.brandLink} onClick={closeOverlays}>
          <img className={navStyle.brandLogo} src="/logo/header-logo.png" alt="Himachal Harvest" />
        </Link>
      </div>

      <nav className={navStyle.navbar} ref={navbarRef} aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={closeOverlays}
            className={({ isActive }) =>
              `${navStyle.navLink} ${item.mobileOnly ? navStyle.mobileOnly : ""} ${isActive ? navStyle.navLinkActive : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={navStyle.actions}>
        {showCart ? (
          <button
            type="button"
            className={`${navStyle.actionBtn} ${navStyle.actionBtnFixed}`}
            onClick={toggleCart}
            aria-label="Open cart"
          >
            Cart
            <span className={navStyle.badge} aria-label={`${cartItems.length} items in cart`}>
              {cartItems.length}
            </span>
          </button>
        ) : null}

        {isGuest ? (
          <button
            type="button"
            className={`${navStyle.actionBtn} ${navStyle.actionBtnFixed} ${navStyle.hideOnMobile}`}
            onClick={goToSignIn}
            aria-label="Sign in"
          >
            Sign In
          </button>
        ) : (
          <button
            type="button"
            className={navStyle.profileBtn}
            onClick={toggleProfileMenu}
            ref={profileBtnRef}
            aria-haspopup="menu"
            aria-expanded={isProfileMenuOpen ? "true" : "false"}
            aria-controls="profile-menu"
            aria-label="Open profile"
            title={username || "Profile"}
          >
            <span className={navStyle.profileAvatar} aria-hidden="true">
              {avatarLetter}
            </span>
          </button>
        )}

        <button
          type="button"
          className={`${navStyle.actionBtn} ${navStyle.menuBtn}`}
          onClick={toggleMenu}
          aria-label="Open menu"
        >
          <span className={navStyle.hamburger} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className={navStyle.srOnly}>Menu</span>
        </button>


      </div>

      <div className={navStyle.overlay} ref={overlayRef} onClick={closeOverlays} aria-hidden="true" />

      <div
        id="profile-menu"
        className={`${navStyle.profileMenu} ${isProfileMenuOpen ? navStyle.active : ""}`}
        role="menu"
        aria-label="Account menu"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            closeOverlays();
            profileBtnRef.current?.focus?.();
          }
        }}
      >
        <div className={navStyle.profileMenuHeader}>
          <span className={navStyle.profileMenuAvatar} aria-hidden="true">
            {avatarLetter}
          </span>
          <div className={navStyle.profileMenuMeta}>
            <div className={navStyle.profileMenuName}>{username || "Account"}</div>
            <div className={navStyle.profileMenuRole}>{roleLabel}</div>
          </div>
        </div>

        <div className={navStyle.profileMenuList}>
          {profileMenuItems.map((item) => (
            <button
              key={item.to}
              type="button"
              className={navStyle.profileMenuItem}
              role="menuitem"
              onClick={() => navigateAndClose(item.to)}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            className={`${navStyle.profileMenuItem} ${navStyle.profileMenuDanger}`}
            role="menuitem"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>

      <div
        className={navStyle.cart_items_container}
        ref={cartItemRef}
        style={showCart ? undefined : { display: "none" }}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
      >
        <div className={navStyle.cartPanelHeader}>
          <div>
            <div className={navStyle.cartPanelTitle}>Your Cart</div>
            <div className={navStyle.cartPanelSub}>
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </div>
          </div>
          <button type="button" className={navStyle.cartCloseBtn} onClick={closeOverlays} aria-label="Close cart">
            ×
          </button>
        </div>

        <div className={navStyle.cartPanelBody}>
          {cartItems.length === 0 ? (
            <div className={navStyle.cartEmpty}>
              <img className={navStyle.cartEmptyImg} src={cartImage} alt="" aria-hidden="true" />
              <div className={navStyle.cartEmptyTitle}>Your cart is empty</div>
              <div className={navStyle.cartEmptySub}>Add some products to continue.</div>
              <button type="button" className={navStyle.cartSecondaryBtn} onClick={() => { closeOverlays(); navigate("/explore"); }}>
                Browse products
              </button>
            </div>
          ) : (
            <ul className={navStyle.cartList}>
              {cartItems.slice(0, 5).map((item) => {
                const title = item?.title?.shortTitle || item?.title?.longTitle || "Product";
                const qty = Number(item?.quantity ?? 1);
                const cost = Number(item?.price?.cost ?? 0);
                return (
                  <li key={item?.id ?? title} className={navStyle.cartListItem}>
                    <img className={navStyle.cartItemImg} src={item?.url || cartImage} alt={title} />
                    <div className={navStyle.cartItemInfo}>
                      <div className={navStyle.cartItemTitle} title={title}>{title}</div>
                      <div className={navStyle.cartItemMeta}>
                        <span>Qty: {qty}</span>
                        <span>₹ {formatINR(cost)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}

              {cartItems.length > 5 ? (
                <li className={navStyle.cartMore}>+ {cartItems.length - 5} more item{cartItems.length - 5 === 1 ? "" : "s"} in cart</li>
              ) : null}
            </ul>
          )}
        </div>

        <div className={navStyle.cartPanelFooter}>
          <div className={navStyle.cartTotals}>
            <span>Subtotal</span>
            <span>₹ {formatINR(subtotal)}</span>
          </div>
          <div className={navStyle.cartActions}>
            <button type="button" className={navStyle.cartSecondaryBtn} onClick={goToCart}>
              View cart
            </button>
            <button type="button" className={navStyle.cartPrimaryBtn} onClick={goToCheckout} disabled={cartItems.length === 0}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
