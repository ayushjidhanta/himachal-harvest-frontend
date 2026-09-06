export const ADMIN_ORDER_CATALOG_REQUEST = "orders/adminCatalogRequest";
export const ADMIN_ORDER_CATALOG_SUCCESS = "orders/adminCatalogSuccess";
export const ADMIN_ORDER_CATALOG_NOT_MODIFIED = "orders/adminCatalogNotModified";
export const ADMIN_ORDER_CATALOG_FAILURE = "orders/adminCatalogFailure";
export const ADMIN_ORDER_UPDATED = "orders/adminOrderUpdated";

export const ADMIN_ORDER_CACHE_TTL_MS = 30 * 1000;

export const ORDER_STATUS_OPTIONS = [
  "created",
  "confirmed",
  "dispatched",
  "out_for_delivery",
  "delivered",
  "cancelled",
];
