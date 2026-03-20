import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import "./MyOrders.css";

const API_URL = process.env.REACT_APP_API_URL;

const STATUS_STEPS = [
  "created",
  "confirmed",
  "dispatched",
  "out_for_delivery",
  "delivered",
];

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );

const formatDateTime = (value) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value || "");
  }
};

export default function MyOrders() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const last = localStorage.getItem("lastOrderEmail") || "";
    if (last) setEmail(last);
  }, []);

  const fetchOrders = async () => {
    setError("");
    if (!API_URL) {
      setError("Missing REACT_APP_API_URL");
      return;
    }

    const e = email.trim();
    if (!e) {
      setError("Please enter your email to view orders.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/orders`, { params: { email: e } });
      setOrders(Array.isArray(data?.data) ? data.data : []);
      localStorage.setItem("lastOrderEmail", e);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || "Failed to load orders";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const sortedOrders = useMemo(() => {
    const list = Array.isArray(orders) ? [...orders] : [];
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [orders]);

  return (
    <div className="myOrdersShell">
      <Navbar2 />
      <SpinnerHimachalHarvest show={loading} />

      <div className="myOrdersHeader">
        <div className="myOrdersContainer myOrdersHeaderInner">
          <div>
            <h1 className="myOrdersTitle">My Orders</h1>
            <div className="myOrdersSub">Track your order status and shipping updates</div>
          </div>
        </div>
      </div>

      <div className="myOrdersBody">
        <div className="myOrdersContainer myOrdersScroll">
          <div className="card">
            <div className="controls">
              <input
                className="input"
                type="email"
                placeholder="Enter your email (used at checkout)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button className="btn btnPrimary" type="button" onClick={fetchOrders}>
                  Load orders
                </button>
                <button className="btn btnSecondary" type="button" onClick={() => setOrders([])}>
                  Clear
                </button>
              </div>
            </div>

            {error ? <div className="alert">{error}</div> : null}
          </div>

          <div className="grid">
            {sortedOrders.map((o) => (
              <OrderCard key={o.orderId} order={o} />
            ))}
            {!loading && sortedOrders.length === 0 ? (
              <div className="card" style={{ color: "#666" }}>
                No orders found for this email.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const isCancelled = order.status === "cancelled";
  const activeIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="orderCard">
      <div className="topRow">
        <div>
          <div className="orderId">Order {order.orderId}</div>
          <div className="meta">Placed: {formatDateTime(order.createdAt)}</div>
          <div className="meta">
            Total: ₹ {formatINR(order?.totals?.total)} • {order?.items?.length || 0} item(s)
          </div>
        </div>

        <div className="badges">
          <span className={`badge ${isCancelled ? "statusCancelled" : "status"}`}>
            {order.status}
          </span>
          {order?.tracking?.trackingNumber ? (
            <span className="badge">Tracking: {order.tracking.trackingNumber}</span>
          ) : null}
        </div>
      </div>

      {!isCancelled ? (
        <div className="progress">
          <div className="progressRow">
            {STATUS_STEPS.map((s, idx) => {
              const cls = idx < activeIndex ? "step stepDone" : idx === activeIndex ? "step stepActive" : "step";
              return (
                <span className={cls} key={s}>
                  {s}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="details">
        <div className="detailsTitle">Shipping</div>
        <div style={{ color: "#333", lineHeight: "1.35rem" }}>
          {order?.shippingAddress?.addressLine1}
          <br />
          {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zip}
        </div>

        {order?.tracking?.trackingUrl ? (
          <div>
            <a className="link" href={order.tracking.trackingUrl} target="_blank" rel="noreferrer">
              Open tracking link
            </a>
          </div>
        ) : null}

        {order?.adminNotes ? (
          <div>
            <div className="detailsTitle">Update from seller</div>
            <div style={{ color: "#333" }}>{order.adminNotes}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
