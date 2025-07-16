const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_EXPIRY_KEY = "token_expiry";
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const isTokenExpired = () => {
  const expiryString = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryString) return true;

  const expiryTime = parseInt(expiryString, 10);
  return Date.now() >= expiryTime;
};

export const setToken = (token) => {
  const { access_token, refresh_token, expires_in, token_type } = token;

  const expiryTime = Date.now() + expires_in * 1000;

  localStorage.setItem(TOKEN_KEY, access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  localStorage.setItem("token_type", token_type);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem("token_type");
};

export const hasToken = () => {
  return !!getToken();
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      console.warn("No refresh token available");
      return false;
    }

    console.log("Attempting to refresh access token...");
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      console.warn(`Token refresh failed with status: ${response.status}`);
      return false;
    }

    const data = await response.json();
    if (data.session) {
      setToken(data.session);
      console.log("Access token refreshed successfully");
      return true;
    } else {
      console.warn("Invalid response from refresh endpoint");
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

export const withAuth = (options = {}) => {
  const token = getToken();
  if (!token) return options;

  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
};
