import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "@/lib/auth/AuthContext";
import { Loader2 } from "lucide-react";

const ConfirmPage = () => {
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const { isAuthenticated, isLoading } = UseAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const handleConfirmation = async () => {
      while (isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (isAuthenticated) {
        setStatus("already-signed-in");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const expiresIn = params.get("expires_in");
      const tokenType = params.get("token_type");

      if (!accessToken || !refreshToken) {
        setStatus("error");
        setErrorMessage("Invalid or missing token. Cannot confirm your email.");
        setTimeout(() => navigate("/"), 5000);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/create-profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail);
        }

        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("token", accessToken);
        if (expiresIn) {
          const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
          localStorage.setItem("expires_at", expiresAt.toString());
        }
        if (tokenType) localStorage.setItem("token_type", tokenType);

        setTimeout(() => (window.location.href = "/"), 2000);
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error.message || "Failed to confirm your account. Please try again."
        );
        setTimeout(() => navigate("/"), 5000);
      }
    };

    handleConfirmation();
  }, [isAuthenticated, isLoading, navigate, baseUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg border border-border">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold text-center mb-4">
              Confirming your email...
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Please don't close this page while we complete the process.
            </p>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Redirecting...
            </p>
          </>
        )}

        {status === "already-signed-in" && (
          <>
            <h1 className="text-2xl font-bold text-center mb-4">
              You are already signed in
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              Redirecting you to the homepage...
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-center mb-4 text-destructive">
              Confirmation Failed
            </h1>
            <p className="text-muted-foreground text-center mb-6">
              {errorMessage}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Redirecting you to the login page...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmPage;
