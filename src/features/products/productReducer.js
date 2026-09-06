import {
  PRODUCT_CATALOG_FAILURE,
  PRODUCT_CATALOG_NOT_MODIFIED,
  PRODUCT_CATALOG_REQUEST,
  PRODUCT_CATALOG_SUCCESS,
} from "./productConstants";

const initialState = {
  products: [],
  etag: null,
  lastFetchedAt: null,
  isFetching: false,
  error: null,
};

export const productCatalogReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_CATALOG_REQUEST:
      return { ...state, isFetching: true, error: null };
    case PRODUCT_CATALOG_SUCCESS:
      return {
        ...state,
        products: action.payload.products,
        etag: action.payload.etag,
        lastFetchedAt: action.payload.fetchedAt,
        isFetching: false,
        error: null,
      };
    case PRODUCT_CATALOG_NOT_MODIFIED:
      return { ...state, lastFetchedAt: action.payload, isFetching: false, error: null };
    case PRODUCT_CATALOG_FAILURE:
      return { ...state, isFetching: false, error: action.payload };
    default:
      return state;
  }
};
