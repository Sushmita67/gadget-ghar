import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { pathname } = useLocation();
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const isAdminPath = useMemo(
    () => pathname.startsWith("/admin/dashboard"),
    [pathname]
  );

  // For now, let's simplify the protection logic to avoid redirect loops
  if (!isAuthenticated && (pathname === "/orders" || pathname === "/profile" || pathname === "/checkout")) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && role === "user" && (pathname === "/login" || pathname === "/signup")) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && role === "admin" && pathname === "/admin/login") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!isAuthenticated && isAdminPath) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
