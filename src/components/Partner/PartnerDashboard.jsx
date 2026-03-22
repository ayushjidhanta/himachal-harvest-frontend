import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import "./PartnerDashboard.css";

const extractToken = (value) => {
  const v = String(value || "").trim();
  if (!v) return "";
  try {
    const url = new URL(v);
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("delivery");
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  } catch {}
  const m = v.match(/delivery\/([^/?#]+)/i);
  return m?.[1] || v;
};

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const token = useMemo(() => extractToken(input), [input]);

  return (
    <div className="partnerShell">
      <Navbar2 />

      <div className="partnerHeader">
        <div className="partnerContainer partnerHeaderInner">
          <div>
            <h1 className="partnerTitle">Partner</h1>
            <div className="partnerSub">Share live location for assigned deliveries</div>
          </div>
        </div>
      </div>

      <div className="partnerBody">
        <div className="partnerContainer partnerScroll">
          <div className="partnerCard">
            <div className="partnerLabel">Paste your Partner link</div>
            <input
              className="partnerInput"
              placeholder="https://.../delivery/<token>  (or just paste token)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="partnerActions">
              <button
                className="partnerBtn partnerBtnPrimary"
                type="button"
                disabled={!token}
                onClick={() => navigate(`/delivery/${token}`)}
              >
                Open location sharing
              </button>
              <button className="partnerBtn" type="button" onClick={() => setInput("")}>
                Clear
              </button>
            </div>

            <div className="partnerHint">
              Tip: keep the delivery page open and allow location permission so customers can see your last shared location.
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
