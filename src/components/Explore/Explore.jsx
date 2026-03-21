import React, { useEffect, useMemo, useState } from "react";
import Navbar2 from "../Home/Navbar2";
import "./Explore.css";
import Products from "./Products";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/actions/productAction";
import Footer from "../../assets/Footer/Footer";

export default function Exploree() {
  const dispatch = useDispatch();
  const { products, error } = useSelector((state) => state.getProducts);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((p) => {
      const title = p?.title?.shortTitle || p?.title?.longTitle || "";
      const desc = p?.description || "";
      const seller = p?.seller || "";
      return `${title} ${desc} ${seller}`.toLowerCase().includes(q);
    });
  }, [products, query]);

  return (
    <div className="exploreShell">
      <Navbar2 />

      <div className="exploreHeader">
        <div className="exploreContainer exploreHeaderInner">
          <div>
            <h1 className="exploreTitle">Products</h1>
            <div className="exploreCount">
              {Array.isArray(products)
                ? `${filteredProducts.length} items`
                : "Loading..."}
            </div>
          </div>

          <div className="exploreSearch">
            <input
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="exploreBody">
        <div className="exploreContainer exploreScroll">
          {error && <div className="exploreAlert">{error}</div>}

          <div className="productGrid">
            {filteredProducts.map((product) => (
              <Products product={product} key={product.id} />
            ))}
          </div>

          {Array.isArray(products) && filteredProducts.length === 0 && (
            <div className="exploreEmpty">
              <h3>No products found</h3>
              <p>Try a different search.</p>
            </div>
          )}
        </div>
      </div>

      <div className="exploreFooter">
        <Footer />
      </div>
    </div>
  );
}
