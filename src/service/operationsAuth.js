import { getAdminKey } from "./adminKey";
import { getAuthUser } from "./authUser";

export const getOperationsHeaders = (adminKeyOverride) => {
  const headers = {};
  const adminKey = adminKeyOverride === undefined ? getAdminKey() : adminKeyOverride;
  const accessToken = getAuthUser()?.accessToken;
  if (adminKey) headers["x-admin-key"] = adminKey;
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  return headers;
};
