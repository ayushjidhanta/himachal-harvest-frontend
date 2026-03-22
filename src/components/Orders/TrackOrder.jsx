import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import OrderMap from "../Maps/OrderMap";
import { AuthContext } from "../../context/auth-context";
import "./TrackOrder.css";

const API_URL = process.env.REACT_APP_API_URL;

const OWNER_PHONE = process.env.REACT_APP_OWNER_PHONE || "";
const OWNER_WHATSAPP = process.env.REACT_APP_OWNER_WHATSAPP || "";

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

const waLink = (phone, text) => {
  const p = String(phone || "").replace(/[^0-9]/g, "");
  if (!p) return "";
  const msg = encodeURIComponent(text || "");
  return `https://wa.me/${p}?text=${msg}`;
};

export default function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const email = String(auth?.user?.email || "").trim();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(async () => {
    setError("");
    if (!API_URL) {
      setError("Missing REACT_APP_API_URL");
      return;
    }
    if (!email) {
      setError("Missing account email. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/orders/${orderId}`, { params: { email } });
      setOrder(data?.data || null);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || "Order not found";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [orderId, email]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const status = order?.status || "";
  const isCancelled = status === "cancelled";
  const activeIndex = STATUS_STEPS.indexOf(status);

  const deliveryLoc = order?.deliveryLocation;
  const shipmentLoc = order?.shipment?.lastKnownLocation;

  const deliveryPartner = order?.deliveryPartner || {};

  const ownerWa = useMemo(() => {
    const phone = OWNER_WHATSAPP || OWNER_PHONE;
    return waLink(phone, `Hi, I want an update on my order ${orderId}. Current status: ${status}`);
  }, [orderId, status]);

  const partnerWa = useMemo(() => {
    const phone = deliveryPartner?.whatsapp || deliveryPartner?.phone;
    return waLink(phone, `Hi, I am the customer for order ${orderId}. Please share an update.`);
  }, [deliveryPartner?.whatsapp, deliveryPartner?.phone, orderId]);

  return (
    <div className="trackShell">
      <Navbar2 />
      <SpinnerHimachalHarvest show={loading} />

      <div className="trackHeader">
        <div className="trackContainer trackHeaderInner">
          <button className="btn" type="button" onClick={() => navigate("/my-orders")}>
            ← Back
          </button>
          <div>
            <h1 className="trackTitle">Track Order</h1>
            <div className="trackSub">Order {orderId}</div>
          </div>
          <button className="btn btnPrimary" type="button" onClick={fetchOrder}>
            Refresh
          </button>
        </div>
      </div>

      <div className="trackBody">
        <div className="trackContainer trackScroll">
          {error ? <div className="alert">{error}</div> : null}

          {order ? (
            <div className="grid">
              <div className="card">
                <div style={{ fontWeight: 900, color: "#111" }}>
                  ₹ {formatINR(order?.totals?.total)}
                </div>
                <div className="badges">
                  <span className={`badge ${isCancelled ? "statusCancelled" : "status"}`}>{status}</span>
                  {order?.tracking?.trackingNumber ? (
                    <span className="badge">Tracking: {order.tracking.trackingNumber}</span>
                  ) : null}
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

                <div style={{ marginTop: "1rem" }}>
                  <OrderMap deliveryLocation={deliveryLoc} shipmentLocation={shipmentLoc} />
                </div>

                {order?.shipment?.lastKnownText ? (
                  <div style={{ marginTop: "0.75rem", color: "#333" }}>
                    <div style={{ fontWeight: 900 }}>Latest update</div>
                    <div>{order.shipment.lastKnownText}</div>
                  </div>
                ) : null}

                {order?.tracking?.trackingUrl ? (
                  <div style={{ marginTop: "0.75rem" }}>
                    <a className="link" href={order.tracking.trackingUrl} target="_blank" rel="noreferrer">
                      Open courier tracking
                    </a>
                  </div>
                ) : null}

                {order?.deliveryShareToken ? (
                  <div style={{ marginTop: "0.75rem" }}>
                    <a className="link" href={`/live/${order.deliveryShareToken}`}>
                      Live delivery partner location
                    </a>
                  </div>
                ) : null}
              </div>

              <aside className="card">
                <div style={{ fontWeight: 900, marginBottom: "0.5rem" }}>Contact</div>

                <div className="contact">
                  <div>
                    <div style={{ fontWeight: 900 }}>Owner support</div>
                    <div className="contactRow">
                      {OWNER_PHONE ? <a className="link" href={`tel:${OWNER_PHONE}`}>Call</a> : <span style={{ color: "#666" }}>Phone not set</span>}
                      {ownerWa ? <a className="link" href={ownerWa} target="_blank" rel="noreferrer">WhatsApp</a> : null}
                    </div>
                  </div>

                  <div style={{ marginTop: "0.75rem" }}>
                    <div style={{ fontWeight: 900 }}>Delivery partner</div>
                    {deliveryPartner?.name ? <div style={{ color: "#333" }}>{deliveryPartner.name}</div> : <div style={{ color: "#666" }}>Not assigned yet</div>}
                    <div className="contactRow" style={{ marginTop: "0.25rem" }}>
                      {deliveryPartner?.phone ? <a className="link" href={`tel:${deliveryPartner.phone}`}>Call</a> : null}
                      {partnerWa ? <a className="link" href={partnerWa} target="_blank" rel="noreferrer">WhatsApp</a> : null}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
                  Transparency tip: share the tracking link from the seller and keep updates in this page.
                </div>
              </aside>
            </div>
          ) : null}
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
