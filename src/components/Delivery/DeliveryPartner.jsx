import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import OrderMap from "../Maps/OrderMap";
import "./DeliveryPartner.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function DeliveryPartner() {
  const { token } = useParams();

  const watchId = useRef(null);
  const lastSentAt = useRef(0);

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");

  const shipmentLoc = info?.shipment?.lastKnownLocation;

  const fetchInfo = useCallback(async () => {
    if (!API_URL) {
      setError("Missing REACT_APP_API_URL");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API_URL}/orders/track/${token}`);
      setInfo(data?.data || null);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || "Invalid link";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInfo();
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation?.clearWatch?.(watchId.current);
        watchId.current = null;
      }
    };
  }, [fetchInfo]);

  const postLocation = useCallback(async (pos) => {
    if (!API_URL) return;

    const now = Date.now();
    if (now - lastSentAt.current < 6000) return; // throttle
    lastSentAt.current = now;

    try {
      const payload = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      };
      const { data } = await axios.post(`${API_URL}/orders/track/${token}/location`, payload);
      setInfo((prev) => ({
        ...(prev || {}),
        shipment: data?.data?.shipment || prev?.shipment,
        status: data?.data?.status || prev?.status,
      }));
      setBanner("Location sent");
      setTimeout(() => setBanner(""), 1500);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to send location";
      setError(msg);
    }
  }, [token]);

  const startSharing = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported on this device/browser.");
      return;
    }

    if (watchId.current !== null) return;

    setSharing(true);
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        postLocation(pos);
      },
      (err) => {
        setError(err?.message || "Failed to get location");
        stopSharing();
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );
  };

  const stopSharing = () => {
    if (watchId.current !== null) {
      navigator.geolocation?.clearWatch?.(watchId.current);
      watchId.current = null;
    }
    setSharing(false);
  };

  const sendOnce = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported on this device/browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => postLocation(pos),
      (err) => setError(err?.message || "Failed to get location"),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  return (
    <div className="partnerShell">
      <Navbar2 />
      <SpinnerHimachalHarvest show={loading} />

      <div className="partnerHeader">
        <div className="partnerContainer partnerHeaderInner">
          <div>
            <h1 className="partnerTitle">Delivery Partner</h1>
            <div className="partnerSub">Share your live location for delivery tracking</div>
          </div>
        </div>
      </div>

      <div className="partnerBody">
        <div className="partnerContainer partnerScroll">
          <div className="card">
            {info ? (
              <>
                <div style={{ fontWeight: 900, color: "#111" }}>Order {info.orderId}</div>
                <div className="small" style={{ marginTop: "0.25rem" }}>Status: {info.status}</div>

                <div style={{ marginTop: "0.9rem" }}>
                  <OrderMap shipmentLocation={shipmentLoc} small />
                </div>

                <div className="actions">
                  <button className="btn btnPrimary" type="button" onClick={startSharing} disabled={sharing}>
                    Start sharing
                  </button>
                  <button className="btn btnSecondary" type="button" onClick={stopSharing} disabled={!sharing}>
                    Stop
                  </button>
                  <button className="btn btnSecondary" type="button" onClick={sendOnce}>
                    Send once
                  </button>
                  <button className="btn btnSecondary" type="button" onClick={fetchInfo}>
                    Refresh
                  </button>
                </div>

                {banner ? <div className="small" style={{ marginTop: "0.5rem" }}>{banner}</div> : null}
                <div className="small" style={{ marginTop: "0.5rem" }}>
                  Keep this page open while delivering to keep updating the location.
                </div>
              </>
            ) : (
              <div className="small">Open a valid delivery link from the seller.</div>
            )}

            {error ? <div className="alert">{error}</div> : null}
          </div>
        </div>
      </div>

      <div className={"footer"}>
        <Footer />
      </div>
    </div>
  );
}
