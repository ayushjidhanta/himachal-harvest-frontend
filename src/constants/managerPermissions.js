export const MANAGER_PERMISSION = Object.freeze({
  ASSIGN_DELIVERY_PARTNER: "assign_delivery_partner",
  UPDATE_ORDER_STATUS: "update_order_status",
  MANAGE_CATALOG: "manage_catalog",
});

export const hasManagerPermission = (user, permission) =>
  Array.isArray(user?.permissions) && user.permissions.includes(permission);

export const hasAnyManagerPermission = (user, permissions) =>
  permissions.some((permission) => hasManagerPermission(user, permission));
