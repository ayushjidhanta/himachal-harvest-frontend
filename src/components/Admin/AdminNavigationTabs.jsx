import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { MANAGER_PERMISSION, hasAnyManagerPermission, hasManagerPermission } from "../../constants/managerPermissions";
import layout from "./AdminLayout.module.css";

const canManageOrders = (user) => hasAnyManagerPermission(user, [
  MANAGER_PERMISSION.ASSIGN_DELIVERY_PARTNER,
  MANAGER_PERMISSION.UPDATE_ORDER_STATUS,
]);

export default function AdminNavigationTabs({ active }) {
  const auth = useContext(AuthContext);
  const isAdmin = auth?.isAdminLoggedIn;
  const user = auth?.user;
  const tabs = [
    ...(isAdmin || hasManagerPermission(user, MANAGER_PERMISSION.MANAGE_CATALOG)
      ? [
          { id: "products", label: "Add Product", to: "/admin/products" },
          { id: "listing", label: "Manage Products", to: "/admin/listing" },
        ]
      : []),
    ...(isAdmin || canManageOrders(user) ? [{ id: "orders", label: "Orders", to: "/admin/orders" }] : []),
    ...(isAdmin || hasManagerPermission(user, MANAGER_PERMISSION.ASSIGN_DELIVERY_PARTNER)
      ? [{ id: "delivery", label: "Delivery", to: "/admin/delivery" }]
      : []),
    ...(isAdmin || auth?.isManagerLoggedIn ? [{ id: "users", label: "Users", to: "/admin/users" }] : []),
  ];

  return (
    <div className={layout.tabs}>
      {tabs.map((tab) => (
        <Link key={tab.id} className={`${layout.tab} ${active === tab.id ? layout.tabActive : ""}`} to={tab.to}>
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
