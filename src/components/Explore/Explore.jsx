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
  const { cartItems } = useSelector((state) => state.cart);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [onlyInCart, setOnlyInCart] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.resolve(dispatch(getProducts()))
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const q = query.trim().toLowerCase();
    const cartIds = new Set((cartItems || []).map((i) => i.id));

    const filtered = list.filter((p) => {
      const title = p?.title?.shortTitle || p?.title?.longTitle || "";
      const desc = p?.description || "";
      const seller = p?.seller || "";
      const hay = `${title} ${desc} ${seller}`.toLowerCase();
      if (q && !hay.includes(q)) return false;

      if (onlyDiscounted) {
        const cost = Number(p?.price?.cost ?? 0);
        const mrp = Number(p?.price?.mrp ?? 0);
        const hasDiscount = Boolean(p?.discount) || (Number.isFinite(mrp) && Number.isFinite(cost) && mrp > cost);
        if (!hasDiscount) return false;
      }

      if (onlyInCart && !cartIds.has(p?.id)) return false;
      return true;
    });

    const sorted = [...filtered];
    if (sortBy === "price_asc") {
      sorted.sort((a, b) => Number(a?.price?.cost ?? 0) - Number(b?.price?.cost ?? 0));
    } else if (sortBy === "price_desc") {
      sorted.sort((a, b) => Number(b?.price?.cost ?? 0) - Number(a?.price?.cost ?? 0));
    } else if (sortBy === "discount_desc") {
      const saving = (p) => {
        const cost = Number(p?.price?.cost ?? 0);
        const mrp = Number(p?.price?.mrp ?? 0);
        return Math.max(0, mrp - cost);
      };
      sorted.sort((a, b) => saving(b) - saving(a));
    }

    return sorted;
  }, [cartItems, onlyDiscounted, onlyInCart, products, query, sortBy]);

  const clearFilters = () => {
    setQuery("");
    setSortBy("featured");
    setOnlyDiscounted(false);
    setOnlyInCart(false);
  };

  return (
    <div className="exploreShell">
      <Navbar2 />

      <header className="exploreHero">
        <div className="exploreContainer">
          <div className="exploreHeroCard">
            <div className="exploreHeroTop">
              <div>
                <h1 className="exploreTitle">Products</h1>
                <div className="exploreCount">
                  {loading ? "Loading products..." : `${filteredProducts.length} items`}
                </div>
              </div>
              <div className="exploreChips">
                <button
                  type="button"
                  className={`chip ${onlyDiscounted ? "chipActive" : ""}`}
                  onClick={() => setOnlyDiscounted((v) => !v)}
                >
                  On Sale
                </button>
                <button
                  type="button"
                  className={`chip ${onlyInCart ? "chipActive" : ""}`}
                  onClick={() => setOnlyInCart((v) => !v)}
                >
                  In Cart
                </button>
                <button type="button" className="chip chipGhost" onClick={clearFilters}>
                  Clear
                </button>
              </div>
            </div>

            <div className="exploreControls">
              <div className="exploreSearch">
                <input
                  type="search"
                  placeholder="Search products, seller..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="exploreSort">
                <label htmlFor="sortBy" className="sortLabel">
                  Sort
                </label>
                <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="discount_desc">Best Savings</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="exploreBody">
        <div className="exploreContainer">
          {error && <div className="exploreAlert">{error}</div>}

          <div className="productGrid">
            {loading
              ? Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="productCard productCardSkeleton" aria-hidden="true">
                    <div className="productImageWrap skeleton" />
                    <div className="skeletonLine skeletonLineLg" />
                    <div className="skeletonLine skeletonLineSm" />
                    <div className="skeletonLine skeletonLineMd" />
                    <div className="skeletonLine skeletonLineSm" />
                    <div className="skeletonBtnRow">
                      <div className="skeletonBtn" />
                      <div className="skeletonBtn" />
                    </div>
                  </div>
                ))
              : filteredProducts.map((product) => <Products product={product} key={product.id} />)}
          </div>

          {!loading && Array.isArray(products) && filteredProducts.length === 0 && (
            <div className="exploreEmpty">
              <h3>No products found</h3>
              <p>Try clearing filters or searching something else.</p>
              <button type="button" className="emptyBtn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
