import React, { useMemo, useState } from "react";
import layout from "./AdminLayout.module.css";
import { setAdminKey as persistAdminKey } from "../../service/adminKey";

const ENV_KEY = process.env.REACT_APP_ADMIN_API_KEY;

export default function AdminKeyCard({ adminKey, setAdminKey }) {
  const show = useMemo(() => !ENV_KEY, []);
  const [value, setValue] = useState(adminKey || "");

  if (!show) return null;

  return (
    <div className={`${layout.card} ${layout.keyCard}`}>
      <div>
        <div style={{ fontWeight: 900, color: "#111" }}>Admin API Key</div>
        <div className={layout.keyHint}>
          Required only if backend `ADMIN_API_KEY` is set (fixes 403 on add/edit products & orders).
        </div>
      </div>

      <div className={layout.keyRow}>
        <input
          className={layout.keyInput}
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste admin key"
        />
        <button
          type="button"
          className={`${layout.keyBtn} ${layout.keyBtnPrimary}`}
          onClick={() => {
            const next = String(value || "").trim();
            persistAdminKey(next);
            setAdminKey(next);
          }}
        >
          Save
        </button>
        <button
          type="button"
          className={layout.keyBtn}
          onClick={() => {
            persistAdminKey("");
            setValue("");
            setAdminKey("");
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

