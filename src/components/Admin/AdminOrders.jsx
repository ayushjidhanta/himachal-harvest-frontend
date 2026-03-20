
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import { AuthContext } from "../../context/auth-context";
import layout from "./AdminLayout.module.css";
import styles from "./AdminOrders.module.css";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN_KEY = process.env.REACT_APP_ADMIN_API_KEY;

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

const STATUS_OPTIONS = [
  "created",
  "confirmed",
  "dispatched",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function AdminOrders() {
  const auth = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");

  const headers = useMemo(() => {
    const h = {};
    if (ADMIN_KEY) h["x-admin-key"] = ADMIN_KEY;
    return h;
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!API_URL) {
      setError("Missing REACT_APP_API_URL");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API_URL}/orders/admin`, { headers });
      setOrders(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to load orders";
      if ((status === 401 || status === 403) && !ADMIN_KEY) {
        setError(`${status}: ${msg}. Missing REACT_APP_ADMIN_API_KEY.`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders || []).filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false;
      if (!q) return true;
      const id = o?.orderId || "";
      const email = o?.customer?.email || "";
      const name = `${o?.customer?.firstName || ""} ${o?.customer?.lastName || ""}`;
      return `${id} ${email} ${name}`.toLowerCase().includes(q);
    });
  }, [orders, query, statusFilter]);

  const updateOrder = async (orderId, payload) => {
    if (!API_URL) return;
    setBanner("");
    setError("");

    try {
      const { data } = await axios.patch(`${API_URL}/orders/admin/${orderId}`, payload, { headers });
      const updated = data?.data;
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      }
      setBanner(`Updated order ${orderId}`);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to update order";
      if ((status === 401 || status === 403) && !ADMIN_KEY) {
        setError(`${status}: ${msg}. Missing REACT_APP_ADMIN_API_KEY.`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
    }
  };

  if (!auth?.isAdminLoggedIn) {
    return (
      <>
        <Navbar2 />
      <SpinnerHimachalHarvest show={loading} />
        <div className={layout.shell}>
          <div className={layout.header}>
            <div className={layout.container}>
              <div className={layout.headerInner}>
                <div>
                  <h1 className={layout.title}>Admin</h1>
                  <div className={layout.sub}>Not authorized</div>
                </div>
              </div>
            </div>
          </div>
          <div className={layout.body}>
            <div className={layout.container} style={{ padding: "1rem 0" }}>
              <div className={layout.card}>You need to be logged in as Admin.</div>
            </div>
          </div>
          <div className={layout.footer}>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={layout.shell}>
      <Navbar2 />

      <div className={layout.header}>
        <div className={layout.container}>
          <div className={layout.headerInner}>
            <div>
              <h1 className={layout.title}>Orders</h1>
              <div className={layout.sub}>Update status + tracking (dispatch, delivery, etc.)</div>
            </div>
            <div className={layout.tabs}>
              <Link className={layout.tab} to="/admin">
                Add Product
              </Link>
              <Link className={layout.tab} to="/admin/manage-products">
                Manage Products
              </Link>
              <Link className={`${layout.tab} ${layout.tabActive}`} to="/admin/orders">
                Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={layout.body}>
        <div className={layout.container + " " + layout.scroll}>
          {banner ? <div className={layout.banner}>{banner}</div> : null}
          {error ? <div className={layout.alert}>{error}</div> : null}

          <div className={styles.controls}>
            <div className={styles.search}>
              <input
                placeholder="Search orderId, customer email, name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className={styles.filters}>
              <select className={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={fetchOrders}>
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className={styles.grid}>
            {filtered.map((o) => (
              <OrderCard key={o.orderId} order={o} onUpdate={updateOrder} />
            ))}

            {filtered.length === 0 ? (
              <div className={layout.card} style={{ color: "#666" }}>
                No orders found.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={layout.footer}>
        <Footer />
      </div>
    </div>
  );
}

function OrderCard({ order, onUpdate }) {
  const [status, setStatus] = useState(order.status || "created");
  const [carrier, setCarrier] = useState(order?.tracking?.carrier || "");
  const [trackingNumber, setTrackingNumber] = useState(order?.tracking?.trackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(order?.tracking?.trackingUrl || "");
  const [adminNotes, setAdminNotes] = useState(order?.adminNotes || "");

  const isCancelled = order.status === "cancelled";

  const submit = () => {
    onUpdate(order.orderId, {
      status,
      tracking: { carrier, trackingNumber, trackingUrl },
      adminNotes,
    });
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.orderId}>Order {order.orderId}</div>
          <div className={styles.meta}>
            {order?.customer?.firstName} {order?.customer?.lastName} • {order?.customer?.email}
          </div>
          <div className={styles.meta}>Placed: {formatDateTime(order.createdAt)}</div>
        </div>

        <div className={styles.badges}>
          <span className={`${styles.badge} ${isCancelled ? styles.statusCancelled : styles.status}`}>
            {order.status}
          </span>
          <span className={styles.badge}>₹ {formatINR(order?.totals?.total)}</span>
        </div>
      </div>

      <div className={styles.columns}>
        <div>
          <div className={styles.sectionTitle}>Items</div>
          <div className={styles.items}>
            {(order.items || []).map((i, idx) => (
              <div className={styles.item} key={idx}>
                <div>
                  <div className={styles.itemTitle}>{i.title}</div>
                  <div className={styles.itemMeta}>
                    Product: {i.productId} • Qty: {i.quantity}
                  </div>
                </div>
                <div className={styles.price}>₹ {formatINR(i.unitPrice * i.quantity)}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.sectionTitle}>Shipping</div>
          <div className={styles.addr}>
            {order?.shippingAddress?.addressLine1}
            <br />
            {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zip}
          </div>

          <div className={styles.form}>
            <div className={styles.row2}>
              <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input className={styles.input} value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="Carrier (e.g., Delhivery)" />
            </div>
            <div className={styles.row2}>
              <input className={styles.input} value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Tracking number" />
              <input className={styles.input} value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="Tracking URL" />
            </div>
            <textarea className={styles.textarea} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Admin notes..." />

            <div className={styles.actions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={submit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
