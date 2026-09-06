import {
  ADMIN_ORDER_CACHE_TTL_MS,
  ADMIN_ORDER_CATALOG_FAILURE,
  ADMIN_ORDER_CATALOG_NOT_MODIFIED,
  ADMIN_ORDER_CATALOG_REQUEST,
  ADMIN_ORDER_CATALOG_SUCCESS,
  ADMIN_ORDER_UPDATED,
} from "./orderConstants";
import { fetchAdminOrders } from "./orderApi";

const isFresh = (catalog) =>
  Array.isArray(catalog.orders) &&
  Number.isFinite(catalog.lastFetchedAt) &&
  Date.now() - catalog.lastFetchedAt < ADMIN_ORDER_CACHE_TTL_MS;

// Admin order data stays in memory only; it must not be persisted to browser storage.
export const loadAdminOrderCatalog = ({ headers, force = false } = {}) => async (dispatch, getState) => {
  const catalog = getState()?.adminOrderCatalog || {};
  if (!force && isFresh(catalog)) return { source: "cache" };

  dispatch({ type: ADMIN_ORDER_CATALOG_REQUEST });
  try {
    const response = await fetchAdminOrders({ headers, etag: catalog.etag });
    if (response.status === 304) {
      dispatch({ type: ADMIN_ORDER_CATALOG_NOT_MODIFIED, payload: Date.now() });
      return { source: "not-modified" };
    }

    dispatch({
      type: ADMIN_ORDER_CATALOG_SUCCESS,
      payload: {
        orders: Array.isArray(response.data?.data) ? response.data.data : [],
        etag: response.headers.etag || null,
        fetchedAt: Date.now(),
      },
    });
    return { source: "network" };
  } catch (error) {
    dispatch({ type: ADMIN_ORDER_CATALOG_FAILURE, payload: error.message });
    throw error;
  }
};

export const applyAdminOrderUpdate = (order) => ({ type: ADMIN_ORDER_UPDATED, payload: order });
