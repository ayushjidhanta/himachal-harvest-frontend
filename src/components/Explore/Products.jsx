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

  const discountLabel =
    product?.discount ||
    (priceMrp > priceCost ? `${Math.round(((priceMrp - priceCost) / priceMrp) * 100)}% OFF` : "");

  return (
    <article className="productCard">
      <div className="productImageWrap">
        {discountLabel ? <div className="productTopBadge">{discountLabel}</div> : null}
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
        {product?.seller ? (
          <span className="productBadge">{product.seller}</span>
        ) : null}
      </div>

      <p className="productDesc" title={product?.description || ""}>
        {product?.description}
      </p>

      {priceMrp > priceCost ? (
        <div className="productSeller">You save ₹ {formatINR(priceMrp - priceCost)}</div>
      ) : (
        <div className="productSeller">Fresh & quality checked</div>
      )}

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
