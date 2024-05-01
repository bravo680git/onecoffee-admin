import { authStorage } from "@/services/storage";
import React from "react";
import { Navigate } from "react-router-dom";
import { path } from "./path";

function ProtectedRoute({
  children,
  isPublic,
}: {
  children: React.ReactNode;
  isPublic?: boolean;
}) {
  const isLoggedIn = authStorage.getIsLoggedIn();

  return !isPublic && !isLoggedIn ? <Navigate to={path.login} /> : children;
}

export default ProtectedRoute;
