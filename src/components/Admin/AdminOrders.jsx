import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import { AuthContext } from "../../context/auth-context";
import OrderMap from "../Maps/OrderMap";
import AdminKeyCard from "./AdminKeyCard";
import { getAdminKey } from "../../service/adminKey";
import layout from "./AdminLayout.module.css";
import styles from "./AdminOrders.module.css";
import { fetchDeliveryPartners, updateAdminOrder } from "../../features/orders/orderApi";
import { applyAdminOrderUpdate, loadAdminOrderCatalog } from "../../features/orders/orderActions";
import { ORDER_STATUS_OPTIONS } from "../../features/orders/orderConstants";
import { selectAdminOrderCatalog } from "../../features/orders/orderSelectors";
import Toast, { useToast } from "../common/Toast/Toast";
import AdminNavigationTabs from "./AdminNavigationTabs";
import { MANAGER_PERMISSION, hasManagerPermission } from "../../constants/managerPermissions";

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

const openMapsUrl = (loc) => {
  if (!loc) return null;
  const lat = Number(loc.lat);
  const lng = Number(loc.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

export default function AdminOrders() {
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();
  const { toast, showToast, dismissToast } = useToast();
  const { orders, isFetching, error: catalogError } = useSelector(selectAdminOrderCatalog);

  const [adminKey, setAdminKey] = useState(getAdminKey());

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const canAssignDeliveryPartner = auth?.isAdminLoggedIn || hasManagerPermission(auth?.user, MANAGER_PERMISSION.ASSIGN_DELIVERY_PARTNER);
  const canUpdateOrderStatus = auth?.isAdminLoggedIn || hasManagerPermission(auth?.user, MANAGER_PERMISSION.UPDATE_ORDER_STATUS);

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
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Failed to load orders";
      if ((status === 401 || status === 403) && !adminKey) {
        setError(`${status}: ${msg}. Missing Admin API Key (backend ADMIN_API_KEY is likely set).`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
    }
  }, [dispatch, headers, adminKey]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!canAssignDeliveryPartner) {
      setDeliveryPartners([]);
      return undefined;
    }
    let active = true;
    fetchDeliveryPartners(headers)
      .then(({ data }) => {
        if (active) setDeliveryPartners(Array.isArray(data?.data) ? data.data : []);
      })
      .catch((err) => {
        if (active) setError(err?.response?.data?.error?.message || "Failed to load delivery partners");
      });
    return () => {
      active = false;
    };
  }, [canAssignDeliveryPartner, headers]);

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
    setBanner("");
    setError("");

    try {
      const { data } = await updateAdminOrder(orderId, payload, headers);
      const updated = data?.data;
      if (updated) {
        dispatch(applyAdminOrderUpdate(updated));
      }
      setBanner(`Updated order ${orderId}`);
      showToast(`Order ${orderId} updated.`, "success");
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Failed to update order";
      if ((status === 401 || status === 403) && !adminKey) {
        setError(`${status}: ${msg}. Missing Admin API Key (backend ADMIN_API_KEY is likely set).`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
      showToast(msg, "error");
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
      <Toast toast={toast} onDismiss={dismissToast} />

      <div className={layout.header}>
        <div className={layout.container}>
          <div className={layout.headerInner}>
            <div>
              <h1 className={layout.title}>Orders</h1>
              <div className={layout.sub}>
                Update status + tracking + last known location
              </div>
            </div>
            <AdminNavigationTabs active="orders" />
          </div>
        </div>
      </div>

      <div className={layout.body}>
        <div className={layout.container + " " + layout.scroll}>
          {banner ? <div className={layout.banner}>{banner}</div> : null}
          {error || catalogError ? <div className={layout.alert}>{error || catalogError}</div> : null}

          {auth?.isAdminLoggedIn ? <AdminKeyCard adminKey={adminKey} setAdminKey={setAdminKey} /> : null}

          <div className={styles.controls}>
            <div className={styles.search}>
              <input
                placeholder="Search orderId, customer email, name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className={styles.filters}>
              <select
                className={styles.select}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All statuses</option>
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                type="button"
                onClick={() => fetchOrders({ force: true })}
              >
                Refresh
              </button>
            </div>
          </div>

          <div className={styles.grid}>
            {filtered.map((o) => (
              <OrderCard
                key={o.orderId}
                order={o}
                onUpdate={updateOrder}
                deliveryPartners={deliveryPartners}
                canAssignDeliveryPartner={canAssignDeliveryPartner}
                canUpdateOrderStatus={canUpdateOrderStatus}
              />
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

function OrderCard({ order, onUpdate, deliveryPartners, canAssignDeliveryPartner, canUpdateOrderStatus }) {
  const [status, setStatus] = useState(order.status || "created");
  const [carrier, setCarrier] = useState(order?.tracking?.carrier || "");
  const [trackingNumber, setTrackingNumber] = useState(
    order?.tracking?.trackingNumber || ""
  );
  const [trackingUrl, setTrackingUrl] = useState(order?.tracking?.trackingUrl || "");
  const [adminNotes, setAdminNotes] = useState(order?.adminNotes || "");
  const [deliveryPartnerUserId, setDeliveryPartnerUserId] = useState(String(order?.deliveryPartner?.userId || ""));

  const [shipmentText, setShipmentText] = useState(order?.shipment?.lastKnownText || "");
  const [shipLat, setShipLat] = useState(
    order?.shipment?.lastKnownLocation?.lat !== undefined
      ? String(order.shipment.lastKnownLocation.lat)
      : ""
  );
  const [shipLng, setShipLng] = useState(
    order?.shipment?.lastKnownLocation?.lng !== undefined
      ? String(order.shipment.lastKnownLocation.lng)
      : ""
  );

  const isCancelled = order.status === "cancelled";

  useEffect(() => {
    setDeliveryPartnerUserId(String(order?.deliveryPartner?.userId || ""));
  }, [order?.deliveryPartner?.userId]);

  const deliveryLoc = order?.deliveryLocation;
  const shipmentLocFromState =
    shipLat.trim() && shipLng.trim()
      ? { lat: Number(shipLat), lng: Number(shipLng) }
      : order?.shipment?.lastKnownLocation;

  const mapsDelivery = openMapsUrl(deliveryLoc);
  const mapsShipment = openMapsUrl(shipmentLocFromState);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setShipLat(String(pos.coords.latitude));
        setShipLng(String(pos.coords.longitude));
      },
      () => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  const submit = () => {
    const payload = {};
    if (canUpdateOrderStatus) {
      payload.status = status;
      payload.tracking = { carrier, trackingNumber, trackingUrl };
      payload.adminNotes = adminNotes;
    }
    if (canAssignDeliveryPartner) payload.deliveryPartner = { userId: deliveryPartnerUserId || null };

    const lat = shipLat.trim() ? Number(shipLat) : undefined;
    const lng = shipLng.trim() ? Number(shipLng) : undefined;
    const text = shipmentText.trim();

    if (canUpdateOrderStatus && ((Number.isFinite(lat) && Number.isFinite(lng)) || text)) {
      payload.shipment = {
        lastKnownLocation:
          Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined,
        lastKnownText: text || undefined,
      };
    }

    onUpdate(order.orderId, payload);
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

          <div style={{ marginTop: "0.9rem" }}>
            <div className={styles.sectionTitle}>Map</div>
            <OrderMap
              deliveryLocation={deliveryLoc}
              shipmentLocation={shipmentLocFromState}
              small
            />
            {(mapsDelivery || mapsShipment) ? (
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
                {mapsDelivery ? (
                  <a className={styles.link} href={mapsDelivery} target="_blank" rel="noreferrer">
                    Open delivery location
                  </a>
                ) : null}
                {mapsShipment ? (
                  <a className={styles.link} href={mapsShipment} target="_blank" rel="noreferrer">
                    Open last known location
                  </a>
                ) : null}
              </div>
            ) : (
              <div style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                No location provided yet.
              </div>
            )}
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
            {canUpdateOrderStatus ? <div className={styles.row2}>
              <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                className={styles.input}
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Carrier (e.g., Delhivery)"
              />
            </div> : null}

            {canAssignDeliveryPartner ? <><div className={styles.sectionTitle} style={{ marginTop: "0.5rem" }}>
              Delivery partner
            </div>
            <select
              className={styles.select}
              value={deliveryPartnerUserId}
              onChange={(event) => setDeliveryPartnerUserId(event.target.value)}
            >
              <option value="">Unassigned</option>
              {(deliveryPartners || []).map((partner) => (
                <option key={partner._id} value={partner._id}>
                  {partner.username} — {partner.email}
                </option>
              ))}
            </select>
            {order?.deliveryPartner?.username ? (
              <div className={styles.meta}>Assigned to: {order.deliveryPartner.username}</div>
            ) : null}</> : null}

            {canUpdateOrderStatus ? <><div className={styles.row2}>
              <input
                className={styles.input}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking number"
              />
              <input
                className={styles.input}
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="Tracking URL"
              />
            </div>

            <div className={styles.sectionTitle} style={{ marginTop: "0.5rem" }}>
              Last known location
            </div>
            <div className={styles.row2}>
              <input className={styles.input} value={shipLat} onChange={(e) => setShipLat(e.target.value)} placeholder="Latitude" />
              <input className={styles.input} value={shipLng} onChange={(e) => setShipLng(e.target.value)} placeholder="Longitude" />
            </div>
            <div className={styles.actions} style={{ marginTop: "0" }}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={useMyLocation}>
                Use my location
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={() => { setShipLat(""); setShipLng(""); }}>
                Clear coords
              </button>
            </div>
            <textarea
              className={styles.textarea}
              value={shipmentText}
              onChange={(e) => setShipmentText(e.target.value)}
              placeholder="Status note (e.g., Reached Shimla hub / Dispatched)"
            />

            <textarea
              className={styles.textarea}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Admin notes shown to customer..."
            />

            </> : null}
            {(canUpdateOrderStatus || canAssignDeliveryPartner) ? <div className={styles.actions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={submit}>
                Save
              </button>
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
