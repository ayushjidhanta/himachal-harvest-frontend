import React from "react";
import "./Menu.css";
import { Link, useLocation } from "react-router-dom";

function Menu() {
  // Get the current location
  const location = useLocation();

  // Check if the current location is the same as the path
  const isCurrentRoute = (path) => location.pathname === path;
  return (
    <aside className="menu">
      {!isCurrentRoute("/") && <Link to="/">Home</Link>}
      {!isCurrentRoute("/about") && <Link to="/about">About</Link>}
      {!isCurrentRoute("/products") && <Link to="/products">Products</Link>}
      {!isCurrentRoute("/reviews") && <Link to="/reviews">Reviews</Link>}
    </aside>
  );
}

export default Menu;
