import {
  PRODUCT_CATALOG_CACHE_TTL_MS,
  PRODUCT_CATALOG_FAILURE,
  PRODUCT_CATALOG_NOT_MODIFIED,
  PRODUCT_CATALOG_REQUEST,
  PRODUCT_CATALOG_SUCCESS,
} from "./productConstants";
import { fetchProductCatalog } from "./productApi";

const isFresh = (catalog) =>
  Array.isArray(catalog.products) &&
  catalog.products.length > 0 &&
  Number.isFinite(catalog.lastFetchedAt) &&
  Date.now() - catalog.lastFetchedAt < PRODUCT_CATALOG_CACHE_TTL_MS;

// Uses persisted data first; only reaches the API after the catalogue becomes stale.
export const loadProductCatalog = ({ force = false } = {}) => async (dispatch, getState) => {
  const catalog = getState()?.productCatalog || {};
  if (!force && isFresh(catalog)) return { source: "cache" };

  dispatch({ type: PRODUCT_CATALOG_REQUEST });

  try {
    const response = await fetchProductCatalog({ etag: catalog.etag });
    if (response.status === 304) {
      dispatch({ type: PRODUCT_CATALOG_NOT_MODIFIED, payload: Date.now() });
      return { source: "not-modified" };
    }

    dispatch({
      type: PRODUCT_CATALOG_SUCCESS,
      payload: {
        products: Array.isArray(response.data) ? response.data : [],
        etag: response.headers.etag || null,
        fetchedAt: Date.now(),
      },
    });
    return { source: "network" };
  } catch (error) {
    dispatch({ type: PRODUCT_CATALOG_FAILURE, payload: error.message });
    throw error;
  }
};
