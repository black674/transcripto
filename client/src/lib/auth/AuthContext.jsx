import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  getToken,
  setToken,
  removeToken,
  withAuth,
  isTokenExpired,
  refreshAccessToken,
  getRefreshToken,
} from "./utils";
import { apiGet } from "../api/apiClient";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext(undefined);

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const refreshTimerRef = useRef(null);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const checkAndRefreshToken = async () => {
    try {
      if (getRefreshToken() && (isTokenExpired() || !getToken())) {
        console.log("Token expired, attempting to refresh...");
        return await refreshAccessToken();
      }
      return true;
    } catch (error) {
      console.error("Error in token refresh check:", error);
      return false;
    }
  };

  const fetchUserData = async () => {
    try {
      const tokenValid = await checkAndRefreshToken();
      if (!tokenValid) {
        removeToken();
        return null;
      }

      try {
        const userData = await apiGet(`/account`);
        return userData;
      } catch (error) {
        if (error instanceof Error && error.message.includes("401")) {
          removeToken();
          return null;
        }
        throw error;
      }
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error instanceof Error ? error.message : error
      );
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to fetch user data",
      }));
      return null;
    }
  };

  const refreshUser = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const userData = await fetchUserData();

    setState({
      user: userData,
      isAuthenticated: !!userData,
      isLoading: false,
      error: null,
    });
  };

  const login = async (token) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      setToken(token);
      const userData = await fetchUserData();

      if (!userData) {
        throw new Error("Invalid token");
      }

      setState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      removeToken();

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      });
    }
  };

  const getProfile = async () => {
    try {
      const response = await fetch(`${baseUrl}/profile`, withAuth());

      if (!response.ok) {
        if (response.status === 401) {
          removeToken();
          return null;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
  };

  const logout = () => {
    removeToken();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const startTokenRefreshTimer = () => {
    if (refreshTimerRef.current) {
      window.clearInterval(refreshTimerRef.current);
    }

    refreshTimerRef.current = window.setInterval(async () => {
      if (getToken()) {
        await checkAndRefreshToken();
      } else {
        if (refreshTimerRef.current) {
          window.clearInterval(refreshTimerRef.current);
          refreshTimerRef.current = null;
        }
      }
    }, 60000);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (getRefreshToken()) {
        await refreshUser();
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }

      if (state.isAuthenticated) {
        startTokenRefreshTimer();
      }
    };

    initializeAuth();

    return () => {
      if (refreshTimerRef.current) {
        window.clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, []);

  const contextValue = {
    ...state,
    login,
    logout,
    refreshUser,
    getProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
