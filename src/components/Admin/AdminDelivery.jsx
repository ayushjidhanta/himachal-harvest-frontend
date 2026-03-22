import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import { AuthContext } from "../../context/auth-context";
import AdminKeyCard from "./AdminKeyCard";
import { getAdminKey } from "../../service/adminKey";
import layout from "./AdminLayout.module.css";
import styles from "./AdminDelivery.module.css";

const API_URL = process.env.REACT_APP_API_URL;

const buildPartnerUrl = (token) => {
  if (!token) return "";
  try {
    return `${window.location.origin}/delivery/${token}`;
  } catch {
    return `/delivery/${token}`;
  }
};

const buildCustomerUrl = (token) => {
  if (!token) return "";
  try {
    return `${window.location.origin}/live/${token}`;
  } catch {
    return `/live/${token}`;
  }
};

export default function AdminDelivery() {
  const auth = useContext(AuthContext);

  const [adminKey, setAdminKey] = useState(getAdminKey());

  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");

  const headers = useMemo(() => {
    const h = {};
    if (adminKey) h["x-admin-key"] = adminKey;
    return h;
  }, [adminKey]);

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
      setError(status ? `${status}: ${msg}` : msg);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return (orders || []).filter((o) => {
      const id = o?.orderId || "";
      const email = o?.customer?.email || "";
      const name = `${o?.customer?.firstName || ""} ${o?.customer?.lastName || ""}`;
      return `${id} ${email} ${name}`.toLowerCase().includes(q);
    });
  }, [orders, query]);

  const updateDeliveryPartner = async (orderId, payload) => {
    if (!API_URL) return;
    setBanner("");
    setError("");

    try {
      const { data } = await axios.patch(`${API_URL}/orders/admin/${orderId}`, payload, { headers });
      const updated = data?.data;
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)));
      }
      setBanner(`Updated delivery for order ${orderId}`);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to update";
      if ((status === 401 || status === 403) && !adminKey) {
        setError(`${status}: ${msg}. Missing Admin API Key (backend ADMIN_API_KEY is likely set).`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setBanner("Copied link");
    } catch {
      setBanner("Copy failed. Please copy manually.");
    }
  };

  if (!auth?.isAdminLoggedIn) {
    return (
      <>
        <Navbar2 />
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
      <SpinnerHimachalHarvest show={loading} />

      <div className={layout.header}>
        <div className={layout.container}>
          <div className={layout.headerInner}>
            <div>
              <h1 className={layout.title}>Delivery</h1>
              <div className={layout.sub}>Assign a delivery partner + share a location link</div>
            </div>
            <div className={layout.tabs}>
              <Link className={layout.tab} to="/admin">
                Add Product
              </Link>
              <Link className={layout.tab} to="/admin/manage-products">
                Manage Products
              </Link>
              <Link className={layout.tab} to="/admin/orders">
                Orders
              </Link>
              <Link className={`${layout.tab} ${layout.tabActive}`} to="/admin/delivery">
                Delivery
              </Link>
              <Link className={layout.tab} to="/admin/users">
                Users
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={layout.body}>
        <div className={layout.container + " " + layout.scroll}>
          {banner ? <div className={layout.banner}>{banner}</div> : null}
          {error ? <div className={layout.alert}>{error}</div> : null}

          <AdminKeyCard adminKey={adminKey} setAdminKey={setAdminKey} />

          <div className={layout.card}>
            <div className={styles.controls}>
              <div className={styles.search}>
                <input
                  placeholder="Search orderId, customer email, name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={fetchOrders}>
                Refresh
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Delivery partner</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <DeliveryRow
                    key={o.orderId}
                    order={o}
                    onSave={updateDeliveryPartner}
                    onCopy={copy}
                  />
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: "#666", padding: "1rem 0" }}>
                      No orders found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={layout.footer}>
        <Footer />
      </div>
    </div>
  );
}

function DeliveryRow({ order, onSave, onCopy }) {
  const [name, setName] = useState(order?.deliveryPartner?.name || "");
  const [phone, setPhone] = useState(order?.deliveryPartner?.phone || "");
  const [whatsapp, setWhatsapp] = useState(order?.deliveryPartner?.whatsapp || "");

  const customerToken = order?.deliveryShareToken;
  const partnerToken = order?.deliveryUpdateToken;
  const customerUrl = buildCustomerUrl(customerToken);
  const partnerUrl = buildPartnerUrl(partnerToken);

  const save = (extra = {}) => {
    onSave(order.orderId, {
      deliveryPartner: {
        name,
        phone,
        whatsapp,
        ...extra,
      },
    });
  };

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 900 }}>{order.orderId}</div>
        <div className={styles.small}>
          Updated: {order?.shipment?.updatedAt ? new Date(order.shipment.updatedAt).toLocaleString() : "-"}
        </div>
      </td>
      <td>
        <div style={{ fontWeight: 900 }}>
          {order?.customer?.firstName} {order?.customer?.lastName}
        </div>
        <div className={styles.small}>{order?.customer?.email}</div>
      </td>
      <td>
        <span className={styles.badge}>{order.status}</span>
      </td>
      <td>
        <div className={styles.field}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp" />
        </div>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={() => save()}>
            Save
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            type="button"
            onClick={() => save({ generateShareToken: true })}
          >
            Generate links
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            type="button"
            onClick={() => save({ clearShareToken: true })}
          >
            Clear link
          </button>
        </div>
      </td>
      <td>
        {customerToken || partnerToken ? (
          <>
            <div>
              {partnerToken ? (
                <a className={styles.link} href={partnerUrl} target="_blank" rel="noreferrer">
                  Partner link
                </a>
              ) : null}
              {customerToken ? (
                <div style={{ marginTop: "0.35rem" }}>
                  <a className={styles.link} href={customerUrl} target="_blank" rel="noreferrer">
                    Customer live tracking
                  </a>
                </div>
              ) : null}
            </div>
            {partnerToken ? (
              <>
                <div className={styles.small} style={{ wordBreak: "break-all", marginTop: "0.35rem" }}>
                  {partnerUrl}
                </div>
                <div className={styles.actions}>
                  <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={() => onCopy(partnerUrl)}>
                    Copy partner
                  </button>
                </div>
              </>
            ) : null}

            {customerToken ? (
              <>
                <div className={styles.small} style={{ wordBreak: "break-all", marginTop: "0.35rem" }}>
                  {customerUrl}
                </div>
                <div className={styles.actions}>
                  <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={() => onCopy(customerUrl)}>
                    Copy customer
                  </button>
                </div>
              </>
            ) : null}
          </>
        ) : (
          <div className={styles.small}>Generate links to let the delivery partner share live location and the customer view it.</div>
        )}
      </td>
    </tr>
  );
}
