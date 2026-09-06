import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import { AuthContext } from "../../context/auth-context";
import AdminKeyCard from "./AdminKeyCard";
import { getAdminKey } from "../../service/adminKey";
import AdminNavigationTabs from "./AdminNavigationTabs";
import layout from "./AdminLayout.module.css";
import styles from "./AdminDelivery.module.css";
import { updateAdminOrder } from "../../features/orders/orderApi";
import { applyAdminOrderUpdate, loadAdminOrderCatalog } from "../../features/orders/orderActions";
import { selectAdminOrderCatalog } from "../../features/orders/orderSelectors";

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
  const dispatch = useDispatch();
  const { orders, isFetching, error: catalogError } = useSelector(selectAdminOrderCatalog);

  const [adminKey, setAdminKey] = useState(getAdminKey());

  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");

  const accessToken = auth?.user?.accessToken || "";
  const headers = useMemo(() => {
    const nextHeaders = {};
    if (adminKey) nextHeaders["x-admin-key"] = adminKey;
    if (accessToken) nextHeaders.Authorization = `Bearer ${accessToken}`;
    return nextHeaders;
  }, [accessToken, adminKey]);

  const fetchOrders = useCallback(async ({ force = false } = {}) => {
    setError("");
    try {
      await dispatch(loadAdminOrderCatalog({ headers, force }));
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to load orders";
      setError(status ? `${status}: ${msg}` : msg);
    }
  }, [dispatch, headers]);

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
    setBanner("");
    setError("");

    try {
      const { data } = await updateAdminOrder(orderId, payload, headers);
      const updated = data?.data;
      if (updated) {
        dispatch(applyAdminOrderUpdate(updated));
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

  if (!auth?.isAdminLoggedIn && !auth?.isManagerLoggedIn) {
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
      <SpinnerHimachalHarvest show={isFetching} />

      <div className={layout.header}>
        <div className={layout.container}>
          <div className={layout.headerInner}>
            <div>
              <h1 className={layout.title}>Delivery Management</h1>
              <div className={layout.sub}>Step 2: after assigning a Delivery Partner in Orders, generate and share live-tracking links here.</div>
            </div>
            <AdminNavigationTabs active="delivery" />
          </div>
        </div>
      </div>

      <div className={layout.body}>
        <div className={layout.container + " " + layout.scroll}>
          {banner ? <div className={layout.banner}>{banner}</div> : null}
          {error || catalogError ? <div className={layout.alert}>{error || catalogError}</div> : null}

          {auth?.isAdminLoggedIn ? <AdminKeyCard adminKey={adminKey} setAdminKey={setAdminKey} /> : null}

          <div className={layout.card}>
            <div className={styles.controls}>
              <div className={styles.search}>
                <input
                  placeholder="Search orderId, customer email, name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={() => fetchOrders({ force: true })}>
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
  const customerToken = order?.deliveryShareToken;
  const partnerToken = order?.deliveryUpdateToken;
  const assignedPartner = order?.deliveryPartner?.username;
  const customerUrl = buildCustomerUrl(customerToken);
  const partnerUrl = buildPartnerUrl(partnerToken);

  const generateLinks = () => onSave(order.orderId, { deliveryPartner: { generateShareToken: true } });
  const clearLinks = () => onSave(order.orderId, { deliveryPartner: { clearShareToken: true } });

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
        {assignedPartner ? (
          <>
            <div style={{ fontWeight: 900 }}>{assignedPartner}</div>
            <div className={styles.small}>Assigned from Orders</div>
            <div className={styles.actions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={generateLinks}>
                Generate links
              </button>
              <button className={`${styles.btn} ${styles.btnDanger}`} type="button" onClick={clearLinks}>
                Clear links
              </button>
            </div>
          </>
        ) : (
          <div className={styles.small}>No Delivery Partner assigned. Assign one from the Orders tab first.</div>
        )}
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
          <div className={styles.small}>Generate links to let the assigned partner share live location and the customer view it.</div>
        )}
      </td>
    </tr>
  );
}
