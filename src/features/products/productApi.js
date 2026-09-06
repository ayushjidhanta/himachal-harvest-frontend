import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getApiUrl = () => {
  if (!API_URL) throw new Error("Missing REACT_APP_API_URL");
  return API_URL;
};

export const fetchProductCatalog = ({ etag } = {}) =>
  axios.get(`${getApiUrl()}/products/getProducts`, {
    headers: etag ? { "If-None-Match": etag } : undefined,
    validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
  });

export const fetchProductById = (id) =>
  axios.get(`${getApiUrl()}/products/getProducts/${encodeURIComponent(id)}`);

export const createProduct = (payload, headers) =>
  axios.post(`${getApiUrl()}/products`, payload, { headers });

export const updateProduct = (id, payload, headers) =>
  axios.patch(`${getApiUrl()}/products/${encodeURIComponent(id)}`, payload, { headers });
