import React from "react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../redux/actions/cartAction";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const quantity = Number(item?.quantity || 1);
  const unitPrice = Number(item?.price?.cost ?? 0);

  const decrement = () => dispatch(updateCartQuantity(item.id, quantity - 1));
  const increment = () => dispatch(updateCartQuantity(item.id, quantity + 1));
  const remove = () => dispatch(removeFromCart(item.id));

  return (
    <div className="cartItem">
      <div className="cartItemImageWrap">
        <img className="cartItemImage" src={item.url} alt={item?.title?.shortTitle || "Product"} />
      </div>

      <div className="cartItemInfo">
        <div className="cartItemTitle">{item?.title?.shortTitle}</div>
        <div className="cartItemDesc">{item?.description}</div>

        <div className="cartItemBottom">
          <div className="qtyControl">
            <button type="button" className="qtyBtn" onClick={decrement} aria-label="Decrease quantity">
              −
            </button>
            <div className="qtyValue">{quantity}</div>
            <button type="button" className="qtyBtn" onClick={increment} aria-label="Increase quantity">
              +
            </button>
          </div>

          <div className="cartItemPrice">₹ {formatINR(unitPrice * quantity)}</div>
        </div>
      </div>

      <button type="button" className="cartItemRemove" onClick={remove} aria-label="Remove item">
        Remove
      </button>
    </div>
  );
}
