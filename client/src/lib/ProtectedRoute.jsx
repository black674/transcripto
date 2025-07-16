import React from "react";
import { UseAuth } from "./auth/AuthContext";
import { Navigate } from "react-router";
import { toast } from "sonner";
import { LoadingPage } from "@/components/shared/LoadingPage";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = UseAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated && !isLoading) {
    toast.error("Authentication required", {
      description: "You need to login to access this page",
    });
    return <Navigate to="/" replace />;
  }

  return children;
}
