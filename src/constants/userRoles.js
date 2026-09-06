export const USER_ROLE = Object.freeze({
  USER: "user",
  MANAGER: "manager",
  ADMIN: "admin",
  DELIVERY_PARTNER: "delivery_partner",
});

export const USER_ROLE_OPTIONS = [
  { value: "User", label: "User" },
  { value: "Manager", label: "Manager" },
  { value: "DeliveryPartner", label: "Delivery Partner" },
  { value: "Admin", label: "Admin" },
];

export const MANAGER_PERMISSION_OPTIONS = [
  { value: "assign_delivery_partner", label: "Assign delivery partners" },
  { value: "update_order_status", label: "Update order status" },
  { value: "manage_catalog", label: "Create and edit products" },
];

export const normalizeUserRole = (role) => {
  const value = String(role || "").trim().toLowerCase();
  if (value === "partner" || value === "deliverypartner" || value === "delivery_partner") return USER_ROLE.DELIVERY_PARTNER;
  if (value === "manager") return USER_ROLE.MANAGER;
  if (value === "admin") return USER_ROLE.ADMIN;
  if (value === "user") return USER_ROLE.USER;
  return "";
};
