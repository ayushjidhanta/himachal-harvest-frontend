import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getApiUrl = () => {
  if (!API_URL) throw new Error("Missing REACT_APP_API_URL");
  return API_URL;
};

export const fetchAdminOrders = ({ headers, etag } = {}) =>
  axios.get(`${getApiUrl()}/orders/admin`, {
    headers: { ...headers, ...(etag ? { "If-None-Match": etag } : {}) },
    validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
  });

export const updateAdminOrder = (orderId, payload, headers) =>
  axios.patch(`${getApiUrl()}/orders/admin/${encodeURIComponent(orderId)}`, payload, { headers });

export const fetchDeliveryPartners = (headers) =>
  axios.get(`${getApiUrl()}/admin/delivery-partners`, { headers });
