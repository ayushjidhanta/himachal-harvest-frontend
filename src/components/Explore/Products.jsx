import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/actions/cartAction";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );

const Products = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const inCartQty = useMemo(() => {
    const found = (cartItems || []).find((i) => i.id === product.id);
    return found ? Number(found.quantity || 1) : 0;
  }, [cartItems, product.id]);

  const priceCost = Number(product?.price?.cost ?? 0);
  const priceMrp = Number(product?.price?.mrp ?? 0);

  const addToCartFun = () => {
    dispatch(addToCart(product.id, 1));
  };

  return (
    <article className="productCard">
      <div className="productImageWrap">
        <img
          className="productImage"
          src={product.url}
          alt={product?.title?.shortTitle || "Product"}
          loading="lazy"
        />
      </div>

      <div className="productTitle">{product?.title?.shortTitle}</div>

      <div className="productPriceRow">
        <div className="productPrice">₹ {formatINR(priceCost)}</div>
        {priceMrp > priceCost && (
          <div className="productMrp">₹ {formatINR(priceMrp)}</div>
        )}
        {product?.discount ? (
          <span className="productBadge">{product.discount}</span>
        ) : null}
      </div>

      <p className="productDesc" title={product?.description || ""}>
        {product?.description}
      </p>

      {product?.seller ? (
        <div className="productSeller">Sold by {product.seller}</div>
      ) : null}

      <div className="productActions">
        <button
          className="productBtn productBtnPrimary"
          type="button"
          onClick={addToCartFun}
        >
          {inCartQty ? `Add (+1)` : "Add to Cart"}
        </button>

        {inCartQty ? (
          <button
            className="productBtn productBtnSecondary"
            type="button"
            onClick={() => navigate("/cart")}
          >
            Cart ({inCartQty})
          </button>
        ) : null}
      </div>
    </article>
  );
};

export default Products;
