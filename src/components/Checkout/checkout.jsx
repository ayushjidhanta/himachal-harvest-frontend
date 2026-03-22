import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import { resetCart } from "../../redux/actions/cartAction";
import { AuthContext } from "../../context/auth-context";
import "./checkout.css";

const API_URL = process.env.REACT_APP_API_URL;

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const auth = useContext(AuthContext);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: String(auth?.user?.email || ""),
    phone: "",
    addressLine1: "",
    city: "",
    state: "Himachal Pradesh",
    zip: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

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

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const requestLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported on this device/browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDeliveryLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocating(false);
      },
      (err) => {
        setLocationError(err?.message || "Failed to get location");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  const clearLocation = () => {
    setDeliveryLocation(null);
    setLocationError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!API_URL) {
      setError("Missing REACT_APP_API_URL");
      return;
    }

    if (!cartItems?.length) {
      setError("Your cart is empty.");
      return;
    }

    const payload = {
      customer: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      shippingAddress: {
        addressLine1: form.addressLine1.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
      },
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: Number(item.quantity || 1),
      })),
      deliveryLocation: deliveryLocation || undefined,
    };

    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_URL}/orders`, payload);
      const created = data?.data?.orderId;
      setOrderId(created || "");
      try {
        localStorage.setItem("lastOrderEmail", form.email.trim());
        if (created) localStorage.setItem("lastOrderId", created);
      } catch {}
      dispatch(resetCart());
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to place order";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkoutShell">
      <Navbar2 />
      <SpinnerHimachalHarvest show={submitting || locating} />

      <div className="checkoutHeader">
        <div className="checkoutContainer checkoutHeaderInner">
          <button type="button" className="checkoutBack" onClick={() => navigate("/cart")}>
            ← Back to cart
          </button>
          <div>
            <h1 className="checkoutTitle">Checkout</h1>
            <div className="checkoutSubtitle">
              {totals.itemCount} item{totals.itemCount === 1 ? "" : "s"} • ₹ {formatINR(totals.total)}
            </div>
          </div>
        </div>
      </div>

      <div className="checkoutBody">
        <div className="checkoutContainer checkoutScroll">
          {!cartItems.length ? (
            <div className="checkoutEmpty">
              <h2>Your cart is empty</h2>
              <p>Add items and come back to checkout.</p>
              <button type="button" className="checkoutBtnPrimary" onClick={() => navigate("/explore")}>
                Browse products
              </button>
            </div>
          ) : orderId ? (
            <div className="checkoutSuccess">
              <h2>Order placed successfully</h2>
              <p>
                Your order id is <span className="checkoutOrderId">{orderId}</span>
              </p>
              <div className="checkoutActionsRow">
                <button type="button" className="checkoutBtnPrimary" onClick={() => navigate(`/track/${orderId}`)}>
                  Track order
                </button>
                <button type="button" className="checkoutBtnSecondary" onClick={() => navigate("/my-orders")}>
                  View my orders
                </button>
                <button type="button" className="checkoutBtnPrimary" onClick={() => navigate("/explore")}>
                  Continue shopping
                </button>
                <button type="button" className="checkoutBtnSecondary" onClick={() => navigate("/cart")}>
                  Go to cart
                </button>
              </div>
            </div>
          ) : (
            <div className="checkoutGrid">
              <div className="checkoutCard">
                <div className="checkoutCardTitle">Shipping details</div>

                <form onSubmit={submit} className="checkoutForm">
                  <div className="checkoutRow2">
                    <div className="checkoutField">
                      <label>First name *</label>
                      <input
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="checkoutField">
                      <label>Last name *</label>
                      <input
                        value={form.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="checkoutRow2">
                    <div className="checkoutField">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        readOnly
                        disabled
                        required
                      />
                    </div>
                    <div className="checkoutField">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="checkoutField">
                    <label>Address *</label>
                    <input
                      value={form.addressLine1}
                      onChange={(e) => update("addressLine1", e.target.value)}
                      required
                    />
                  </div>

                  <div className="checkoutRow3">
                    <div className="checkoutField">
                      <label>City *</label>
                      <input
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="checkoutField">
                      <label>State *</label>
                      <select
                        value={form.state}
                        onChange={(e) => update("state", e.target.value)}
                        required
                      >
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                      </select>
                    </div>
                    <div className="checkoutField">
                      <label>Zip *</label>
                      <input
                        value={form.zip}
                        onChange={(e) => update("zip", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                                    <div className="checkoutCard" style={{ marginTop: "0.9rem" }}>
                    <div className="checkoutCardTitle">Location (optional)</div>
                    <div style={{ color: "#555", fontSize: "0.95rem" }}>
                      Share your current location to help with delivery coordination. You can skip this.
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                      <button
                        type="button"
                        className="checkoutBtnSecondary"
                        onClick={requestLocation}
                        disabled={locating}
                      >
                        {locating ? "Getting location..." : "Use my current location"}
                      </button>
                      <button type="button" className="checkoutBtnSecondary" onClick={clearLocation}>
                        Clear
                      </button>
                    </div>

                    {deliveryLocation ? (
                      <div style={{ marginTop: "0.75rem", color: "#333" }}>
                        Captured: {deliveryLocation.lat.toFixed(6)}, {deliveryLocation.lng.toFixed(6)}
                        {deliveryLocation.accuracy ? ` (±${Math.round(deliveryLocation.accuracy)}m)` : ""}
                      </div>
                    ) : null}

                    {locationError ? <div className="checkoutError" style={{ marginTop: "0.75rem" }}>{locationError}</div> : null}
                  </div>

{error ? <div className="checkoutError">{error}</div> : null}

                  <button type="submit" className="checkoutBtnPrimary" disabled={submitting}>
                    {submitting ? "Placing order..." : "Place order"}
                  </button>
                </form>
              </div>

              <aside className="checkoutCard checkoutSummary">
                <div className="checkoutCardTitle">Order summary</div>

                <div className="checkoutSummaryList">
                  {cartItems.map((item) => {
                    const qty = Number(item?.quantity ?? 1);
                    const unit = Number(item?.price?.cost ?? 0);
                    return (
                      <div key={item.id} className="checkoutSummaryItem">
                        <img src={item.url} alt={item?.title?.shortTitle || "Product"} />
                        <div className="checkoutSummaryInfo">
                          <div className="checkoutSummaryTitle">{item?.title?.shortTitle}</div>
                          <div className="checkoutSummaryMeta">Qty: {qty}</div>
                        </div>
                        <div className="checkoutSummaryPrice">₹ {formatINR(unit * qty)}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="checkoutDivider" />

                <div className="checkoutTotals">
                  <div className="checkoutTotalsRow">
                    <span>Subtotal</span>
                    <span>₹ {formatINR(totals.subtotal)}</span>
                  </div>
                  <div className="checkoutTotalsRow checkoutTotalsTotal">
                    <span>Total</span>
                    <span>₹ {formatINR(totals.total)}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      <div className="checkoutFooter">
        <Footer />
      </div>
    </div>
  );
}
