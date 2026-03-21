
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import { AuthContext } from "../../context/auth-context";
import layout from "./AdminLayout.module.css";
import styles from "./ManageProducts.module.css";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN_KEY = process.env.REACT_APP_ADMIN_API_KEY;

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(value || 0)
  );

export default function ManageProducts() {
  const auth = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!API_URL) {
      setError("Missing REACT_APP_API_URL");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${API_URL}/products/getProducts`);
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const title = p?.title?.shortTitle || p?.title?.longTitle || "";
      const seller = p?.seller || "";
      const id = p?.id || "";
      return `${id} ${title} ${seller}`.toLowerCase().includes(q);
    });
  }, [products, query]);

  const openEdit = (p) => {
    setBanner("");
    setError("");
    setEditing(p);
    setEditForm({
      url: p?.url || "",
      detailUrl: p?.detailUrl || "",
      shortTitle: p?.title?.shortTitle || "",
      longTitle: p?.title?.longTitle || "",
      mrp: String(p?.price?.mrp ?? ""),
      cost: String(p?.price?.cost ?? ""),
      quantity: String(p?.quantity ?? ""),
      discount: p?.discount || "",
      tagline: p?.tagline || "",
      seller: p?.seller || "",
      description: p?.description || "",
    });
  };

  const update = (key, value) => setEditForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    if (!API_URL) {
      setError("Missing REACT_APP_API_URL");
      return;
    }
    if (!editing?.id) return;

    setSaving(true);
    setError("");
    setBanner("");

    try {
      const headers = {};
      if (ADMIN_KEY) headers["x-admin-key"] = ADMIN_KEY;

      const payload = {
        url: editForm.url,
        detailUrl: editForm.detailUrl,
        title: {
          shortTitle: editForm.shortTitle,
          longTitle: editForm.longTitle,
        },
        price: {
          mrp: Number(editForm.mrp),
          cost: Number(editForm.cost),
        },
        quantity: Number(editForm.quantity),
        discount: editForm.discount,
        tagline: editForm.tagline,
        seller: editForm.seller,
        description: editForm.description,
      };

      const { data } = await axios.patch(`${API_URL}/products/${editing.id}`, payload, { headers });

      const updated = data?.data;
      if (updated) {
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      }
      setBanner("Product updated successfully");
      setEditing(null);
      setEditForm(null);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to update product";
      if ((status === 401 || status === 403) && !ADMIN_KEY) {
        setError(`${status}: ${msg}. Missing REACT_APP_ADMIN_API_KEY.`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!auth?.isAdminLoggedIn) {
    return (
      <>
        <Navbar2 />
      <SpinnerHimachalHarvest show={loading || saving} />
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
              <h1 className={layout.title}>Manage Products</h1>
              <div className={layout.sub}>Edit existing products (same schema)</div>
            </div>
            <div className={layout.tabs}>
              <Link className={layout.tab} to="/admin">
                Add Product
              </Link>
              <Link className={`${layout.tab} ${layout.tabActive}`} to="/admin/manage-products">
                Manage Products
              </Link>
              <Link className={layout.tab} to="/admin/orders">
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

          <div className={layout.card}>
            <div className={styles.controls}>
              <div className={styles.search}>
                <input
                  placeholder="Search by id, title, seller..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={fetchProducts}>
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img className={styles.thumb} src={p.url} alt={p?.title?.shortTitle || "Product"} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 900 }}>{p?.title?.shortTitle}</div>
                      <div style={{ color: "#666", fontSize: "0.85rem" }}>{p.id}</div>
                      {p?.seller ? <div className={styles.badge}>Seller: {p.seller}</div> : null}
                    </td>
                    <td>
                      <div style={{ fontWeight: 900 }}>₹ {formatINR(p?.price?.cost)}</div>
                      <div style={{ color: "#777", fontSize: "0.85rem" }}>
                        MRP: ₹ {formatINR(p?.price?.mrp)}
                      </div>
                    </td>
                    <td>{p?.quantity ?? 0}</td>
                    <td>
                      <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={() => openEdit(p)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: "#666", padding: "1rem 0" }}>
                      No products found.
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

      {editing && editForm ? (
        <div className={styles.modalOverlay} onClick={() => setEditing(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit: {editing?.title?.shortTitle}</h3>
              <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={() => setEditing(null)}>
                Close
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                  <img className={styles.imgPreview} src={editForm.url} alt="Preview" />
                </div>

                <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                  <label>Image URL (url) *</label>
                  <input value={editForm.url} onChange={(e) => update("url", e.target.value)} />
                </div>

                <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                  <label>Detail URL (detailUrl)</label>
                  <input value={editForm.detailUrl} onChange={(e) => update("detailUrl", e.target.value)} />
                </div>

                <div className={styles.field}>
                  <label>Short title *</label>
                  <input value={editForm.shortTitle} onChange={(e) => update("shortTitle", e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Long title</label>
                  <input value={editForm.longTitle} onChange={(e) => update("longTitle", e.target.value)} />
                </div>

                <div className={styles.field}>
                  <label>MRP *</label>
                  <input type="number" value={editForm.mrp} onChange={(e) => update("mrp", e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Cost *</label>
                  <input type="number" value={editForm.cost} onChange={(e) => update("cost", e.target.value)} />
                </div>

                <div className={styles.field}>
                  <label>Quantity</label>
                  <input type="number" value={editForm.quantity} onChange={(e) => update("quantity", e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Discount</label>
                  <input value={editForm.discount} onChange={(e) => update("discount", e.target.value)} />
                </div>

                <div className={styles.field}>
                  <label>Seller</label>
                  <input value={editForm.seller} onChange={(e) => update("seller", e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label>Tagline</label>
                  <input value={editForm.tagline} onChange={(e) => update("tagline", e.target.value)} />
                </div>

                <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                  <label>Description</label>
                  <textarea value={editForm.description} onChange={(e) => update("description", e.target.value)} />
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={() => setEditing(null)} disabled={saving}>
                Cancel
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
