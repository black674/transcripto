import {
  getToken,
  isTokenExpired,
  refreshAccessToken,
  withAuth,
} from "../auth/utils";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

export const apiFetch = async (url, options = {}) => {
  if (getToken() && isTokenExpired()) {
    console.log("Token expired, refreshing before request...");
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      console.warn("Token refresh failed before request");
    }
  }

  const authOptions = withAuth(options);
  let response = await fetch(baseUrl + url, authOptions);
  if (response.status === 401 && getToken()) {
    console.log("Received 401, attempting token refresh...");
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      console.log("Token refresh successful, retrying request...");
      const newAuthOptions = withAuth(options);
      return fetch(baseUrl + url, newAuthOptions);
    } else {
      console.warn("Token refresh failed after 401 response");
    }
  }

  return response;
};

export const apiGet = async (url, options = {}) => {
  const response = await apiFetch(url, {
    method: "GET",
    ...options,
  });

  if (!response.ok) {
    throw {
      message: `API error: ${response.status} ${response.statusText}`,
      status: response.status,
    };
  }

  return response.json();
};

export const apiPost = async (url, data, options = {}) => {
  const response = await apiFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });

  if (!response.ok) {
    throw {
      message: `API error: ${response.status} ${response.statusText}`,
      status: response.status,
    };
  }

  return response.json();
};

export const apiPut = async (url, data, options = {}) => {
  const response = await apiFetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });

  if (!response.ok) {
    throw {
      message: `API error: ${response.status} ${response.statusText}`,
      status: response.status,
    };
  }

  return response.json();
};
