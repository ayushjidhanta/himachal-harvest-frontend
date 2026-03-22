import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import OrderMap from "../Maps/OrderMap";
import "./LiveTracking.css";

const API_URL = process.env.REACT_APP_API_URL;

const OWNER_PHONE = process.env.REACT_APP_OWNER_PHONE || "";
const OWNER_WHATSAPP = process.env.REACT_APP_OWNER_WHATSAPP || "";

const STATUS_STEPS = ["created", "confirmed", "dispatched", "out_for_delivery", "delivered"];

const waLink = (phone, text) => {
  const p = String(phone || "").replace(/[^0-9]/g, "");
  if (!p) return "";
  const msg = encodeURIComponent(text || "");
  return `https://wa.me/${p}?text=${msg}`;
};

export default function LiveTracking() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTracking = useCallback(async () => {
    setError("");
    if (!API_URL) {
      setError("Missing REACT_APP_API_URL");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/orders/track/${token}`);
      setData(res?.data?.data || null);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || "Tracking link not found";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const id = setInterval(() => fetchTracking(), 12000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchTracking]);

  const orderId = data?.orderId || "";
  const status = data?.status || "";
  const shipmentLoc = data?.shipment?.lastKnownLocation;
  const partner = data?.deliveryPartner || {};

  const activeIndex = STATUS_STEPS.indexOf(status);
  const isCancelled = status === "cancelled";

  const ownerWa = useMemo(() => {
    const phone = OWNER_WHATSAPP || OWNER_PHONE;
    return waLink(phone, `Hi, I want an update on order ${orderId}. Current status: ${status}`);
  }, [orderId, status]);

  const partnerWa = useMemo(() => {
    const phone = partner?.whatsapp || partner?.phone;
    return waLink(phone, `Hi, I am the customer for order ${orderId}. Please share an update.`);
  }, [partner?.whatsapp, partner?.phone, orderId]);

  return (
    <div className="liveShell">
      <Navbar2 />
      <SpinnerHimachalHarvest show={loading} />

      <div className="liveHeader">
        <div className="liveContainer liveHeaderInner">
          <button className="liveBtn" type="button" onClick={() => navigate("/my-orders")}>
            ← Back
          </button>
          <div>
            <h1 className="liveTitle">Live Delivery Tracking</h1>
            <div className="liveSub">{orderId ? `Order ${orderId}` : "Tracking link"}</div>
          </div>
          <div className="liveHeaderActions">
            <label className="liveToggle">
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
              Auto-refresh
            </label>
            <button className="liveBtn liveBtnPrimary" type="button" onClick={fetchTracking}>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="liveBody">
        <div className="liveContainer liveScroll">
          {error ? <div className="liveAlert">{error}</div> : null}

          {data ? (
            <div className="liveGrid">
              <div className="liveCard">
                <div className="liveBadges">
                  <span className={`liveBadge ${isCancelled ? "liveStatusCancelled" : "liveStatus"}`}>{status}</span>
                </div>

                {!isCancelled ? (
                  <div className="liveProgress">
                    <div className="liveProgressRow">
                      {STATUS_STEPS.map((s, idx) => {
                        const cls = idx < activeIndex ? "liveStep liveStepDone" : idx === activeIndex ? "liveStep liveStepActive" : "liveStep";
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
                  <OrderMap shipmentLocation={shipmentLoc} />
                </div>

                <div className="liveHint">
                  This map shows the delivery partner’s last shared location (requires partner to keep the link open).
                </div>
              </div>

              <aside className="liveCard">
                <div style={{ fontWeight: 900, marginBottom: "0.5rem" }}>Contact</div>

                <div className="liveContact">
                  <div>
                    <div style={{ fontWeight: 900 }}>Owner support</div>
                    <div className="liveContactRow">
                      {OWNER_PHONE ? <a className="liveLink" href={`tel:${OWNER_PHONE}`}>Call</a> : <span style={{ color: "#666" }}>Phone not set</span>}
                      {ownerWa ? <a className="liveLink" href={ownerWa} target="_blank" rel="noreferrer">WhatsApp</a> : null}
                    </div>
                  </div>

                  <div style={{ marginTop: "0.75rem" }}>
                    <div style={{ fontWeight: 900 }}>Delivery partner</div>
                    {partner?.name ? <div style={{ color: "#333" }}>{partner.name}</div> : <div style={{ color: "#666" }}>Not assigned yet</div>}
                    <div className="liveContactRow" style={{ marginTop: "0.25rem" }}>
                      {partner?.phone ? <a className="liveLink" href={`tel:${partner.phone}`}>Call</a> : null}
                      {partnerWa ? <a className="liveLink" href={partnerWa} target="_blank" rel="noreferrer">WhatsApp</a> : null}
                    </div>
                  </div>
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

