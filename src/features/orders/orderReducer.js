import {
  ADMIN_ORDER_CATALOG_FAILURE,
  ADMIN_ORDER_CATALOG_NOT_MODIFIED,
  ADMIN_ORDER_CATALOG_REQUEST,
  ADMIN_ORDER_CATALOG_SUCCESS,
  ADMIN_ORDER_UPDATED,
} from "./orderConstants";

const initialState = { orders: [], etag: null, lastFetchedAt: null, isFetching: false, error: null };

export const adminOrderCatalogReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_ORDER_CATALOG_REQUEST:
      return { ...state, isFetching: true, error: null };
    case ADMIN_ORDER_CATALOG_SUCCESS:
      return { ...state, ...action.payload, isFetching: false, error: null };
    case ADMIN_ORDER_CATALOG_NOT_MODIFIED:
      return { ...state, lastFetchedAt: action.payload, isFetching: false, error: null };
    case ADMIN_ORDER_CATALOG_FAILURE:
      return { ...state, isFetching: false, error: action.payload };
    case ADMIN_ORDER_UPDATED:
      return {
        ...state,
        orders: state.orders.map((order) => (order.orderId === action.payload.orderId ? action.payload : order)),
        lastFetchedAt: Date.now(),
      };
    default:
      return state;
  }
};
