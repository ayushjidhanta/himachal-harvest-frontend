import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import { getAuthUser } from "../../service/authUser";
import "./PartnerDashboard.css";

const API_URL = process.env.REACT_APP_API_URL;
const formatINR = (value) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(value || 0));

const getNavigationUrl = (order) => {
  const lat = Number(order?.deliveryLocation?.lat);
  const lng = Number(order?.deliveryLocation?.lng);
  const destination = Number.isFinite(lat) && Number.isFinite(lng)
    ? `${lat},${lng}`
    : [
      order?.shippingAddress?.addressLine1,
      order?.shippingAddress?.city,
      order?.shippingAddress?.state,
      order?.shippingAddress?.zip,
    ].filter(Boolean).join(", ");

  return destination
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`
    : null;
};

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAssignedOrders = useCallback(async () => {
    const accessToken = getAuthUser()?.accessToken;
    if (!API_URL) return setError("Missing REACT_APP_API_URL");
    if (!accessToken) return setError("Your session is outdated. Please sign out and sign in again.");

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API_URL}/orders/assigned`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setOrders(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      const message = err?.response?.data?.error?.message || err?.message || "Failed to load assigned deliveries";
      setError(message === "Forbidden" ? "Your session is invalid or expired. Please sign in again." : message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignedOrders();
  }, [loadAssignedOrders]);

  return (
    <div className="partnerShell">
      <Navbar2 />
      <SpinnerHimachalHarvest show={loading} />
      <div className="partnerHeader">
        <div className="partnerContainer partnerHeaderInner">
          <div>
            <h1 className="partnerTitle">My Deliveries</h1>
            <div className="partnerSub">Orders assigned to your Delivery Partner account</div>
          </div>
          <button className="partnerBtn" type="button" onClick={loadAssignedOrders}>Refresh</button>
        </div>
      </div>

      <div className="partnerBody">
        <div className="partnerContainer partnerScroll">
          {error ? <div className="partnerAlert">{error}</div> : null}
          {orders.map((order) => (
            <DeliveryCard key={order.orderId} order={order} navigate={navigate} />
          ))}
          {!loading && !error && orders.length === 0 ? (
            <div className="partnerCard">
              <div className="partnerLabel">No deliveries assigned</div>
              <div className="partnerHint">New orders assigned to your account will appear here after you refresh.</div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="footer"><Footer /></div>
    </div>
  );
}

function DeliveryCard({ order, navigate }) {
  const navigationUrl = getNavigationUrl(order);

  return (
    <article className="partnerCard">
      <div className="partnerCardHeader">
        <div>
          <div className="partnerLabel">Order {order.orderId}</div>
          <div className="partnerHint">Status: {order.status} · ₹ {formatINR(order?.totals?.total)}</div>
        </div>
        <span className="partnerStatus">{order.status}</span>
      </div>
      <div className="partnerDetails">
        <div>
          <strong>Customer</strong>
          <div>{order?.customer?.firstName} {order?.customer?.lastName}</div>
          {order?.customer?.phone ? <a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a> : null}
        </div>
        <div>
          <strong>Delivery address</strong>
          <div>{order?.shippingAddress?.addressLine1}</div>
          <div>{order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zip}</div>
        </div>
      </div>
      <div className="partnerItems">
        {(order.items || []).map((item) => <div key={item.productId}>{item.title} × {item.quantity}</div>)}
      </div>
      <div className="partnerActions">
        {navigationUrl ? <a className="partnerBtn partnerBtnNavigate" href={navigationUrl} target="_blank" rel="noreferrer">Start navigation</a> : null}
        {order.deliveryUpdateToken ? (
          <button className="partnerBtn partnerBtnPrimary" type="button" onClick={() => navigate(`/delivery/${order.deliveryUpdateToken}`)}>
            Share live location
          </button>
        ) : <span className="partnerHint">Tracking link is not ready. Ask your manager to generate it in Delivery Management.</span>}
        {order?.tracking?.trackingUrl ? <a className="partnerBtn" href={order.tracking.trackingUrl} target="_blank" rel="noreferrer">Open tracking</a> : null}
      </div>
    </article>
  );
}
