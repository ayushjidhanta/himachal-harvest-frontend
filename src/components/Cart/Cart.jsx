import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import CartItem from "./CartItem";
import { resetCart } from "../../redux/actions/cartAction";
import "./Cart.css";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const totals = useMemo(() => {
    const subtotal = (cartItems || []).reduce((sum, item) => {
      const unitPrice = Number(item?.price?.cost ?? 0);
      const quantity = Number(item?.quantity ?? 1);
      return sum + unitPrice * quantity;
    }, 0);

    return {
      itemCount: (cartItems || []).reduce(
        (sum, item) => sum + Number(item?.quantity ?? 1),
        0
      ),
      subtotal,
      total: subtotal,
    };
  }, [cartItems]);

  const goBack = () => navigate("/explore");
  const goCheckout = () => navigate("/checkout");
  const clear = () => dispatch(resetCart());

  return (
    <div className="cartShell">
      <Navbar2 />

      <div className="cartHeader">
        <div className="cartContainer cartHeaderInner">
          <button type="button" className="cartBack" onClick={goBack}>
            ← Continue shopping
          </button>
          <div className="cartTitleWrap">
            <h1 className="cartTitle">My Cart</h1>
            <div className="cartSubtitle">
              {totals.itemCount} item{totals.itemCount === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </div>

      <div className="cartBody">
        <div className="cartContainer cartScroll">
          {cartItems.length === 0 ? (
            <div className="cartEmpty">
              <h2>Your cart is empty</h2>
              <p>Add some products to continue.</p>
              <button type="button" className="cartBtnPrimary" onClick={goBack}>
                Browse products
              </button>
            </div>
          ) : (
            <div className="cartGrid">
              <div className="cartList">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <aside className="cartSummary">
                <div className="cartSummaryCard">
                  <div className="cartSummaryTitle">Order summary</div>

                  <div className="cartSummaryRow">
                    <span>Items</span>
                    <span>{totals.itemCount}</span>
                  </div>
                  <div className="cartSummaryRow">
                    <span>Subtotal</span>
                    <span>₹ {formatINR(totals.subtotal)}</span>
                  </div>
                  <div className="cartSummaryDivider" />
                  <div className="cartSummaryRow cartSummaryTotal">
                    <span>Total</span>
                    <span>₹ {formatINR(totals.total)}</span>
                  </div>

                  <div className="cartSummaryActions">
                    <button
                      type="button"
                      className="cartBtnPrimary"
                      onClick={goCheckout}
                    >
                      Checkout
                    </button>
                    <button
                      type="button"
                      className="cartBtnDanger"
                      onClick={clear}
                    >
                      Clear cart
                    </button>
                  </div>

                  <div className="cartHint">
                    Tip: quantities can be adjusted in the list.
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      <div className="cartFooter">
        <Footer />
      </div>
    </div>
  );
}
