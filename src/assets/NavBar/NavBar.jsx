// Inbuilt Packages
import React, { useState } from "react";
import styles from "./NavBar.module.css";
import { Link, useLocation } from "react-router-dom";

// Custom Components
import { Icons } from "../Icons/Icons";
import Menu from "../Menu/Menu";

function NavBar() {
  // Get the current location
  const location = useLocation();

  // Check if the current location is the same as the path
  const isCurrentRoute = (path) => location.pathname === path;

  const [searchBar, setSearchBar] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.sidebar}>
        <div
          className={styles.hamburger}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setSearchBar(false);
          }}
        >
          {isMenuOpen ? Icons.close : Icons.hamburger}
          {isMenuOpen && <Menu />}
        </div>
        <div
          className={styles.search_bar}
          onClick={() => {
            setSearchBar(searchBar ? false : true);
            setIsMenuOpen(false);
          }}
        >
          {searchBar ? Icons.close : Icons.search}
          {searchBar && <input type="text" placeholder="Search Product" />}
        </div>
      </div>
      <nav className={styles.links}>
        {!isCurrentRoute("/") && <Link to="/">Home</Link>}
        {!isCurrentRoute("/about") && <Link to="/about">About</Link>}
        {!isCurrentRoute("/products") && <Link to="/products">Products</Link>}
        {!isCurrentRoute("/reviews") && <Link to="/reviews">Reviews</Link>}
      </nav>
    </header>
  );
}

export default NavBar;
