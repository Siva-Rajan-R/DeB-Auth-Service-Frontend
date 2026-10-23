import axios from "axios";
import { APP_CONFIG } from "../config";
import { useContext } from "react";
import { AuthContext } from "../Contexts/UserContext";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const getValidAccessToken = async () => {
  const backend_url = APP_CONFIG.BACKEND_URL;
  const accessToken = Cookies.get('access_token') || '';
  const refreshToken = Cookies.get('refresh_token') || '';

  // 1. Check if access token is valid and not expired (with 30s buffer)
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded && decoded.exp && decoded.exp > Math.floor(Date.now() / 1000) + 30) {
        return accessToken;
      }
    } catch (e) {
      console.warn("Error decoding access token:", e);
    }
  }

  // 2. If access token is missing or expired, attempt to refresh using refresh token
  if (refreshToken) {
    try {
      const decodedRefresh = jwtDecode(refreshToken);
      if (decodedRefresh && decodedRefresh.exp && decodedRefresh.exp > Math.floor(Date.now() / 1000)) {
        const res = await axios.get(`${backend_url}/user/token`, {
          headers: { Authorization: `Bearer ${refreshToken}` },
          timeout: 12000
        });
        const newToken = res.data?.access_token;
        if (newToken) {
          Cookies.set('access_token', newToken, { expires: 7, path: '/' });
          return newToken;
        }
      }
    } catch (e) {
      console.warn("Failed to refresh access token with refresh token:", e);
    }
  }

  return null;
};

export const useNetworkCalls = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const backend_url = APP_CONFIG.BACKEND_URL;

  const call = async ({ method, path, data = null, withCred = true }) => {
    const urlToCall = `${backend_url}${path}`;
    method = method.toUpperCase();

    let access_headers = {};

    if (withCred) {
      const token = await getValidAccessToken();
      if (!token) {
        console.warn("No valid access or refresh token found. User needs to re-authenticate.");
        Cookies.remove('user_name', { path: '/' });
        Cookies.remove('user_profile', { path: '/' });
        Cookies.remove('user_email', { path: '/' });
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        setIsLoggedIn(false);

        const publicRoutes = ['/', '/contact', '/auth-docs', '/pricing', '/privacy', '/terms'];
        if (!publicRoutes.includes(location.pathname)) {
          window.location.href = '/';
        }
        return null;
      }
      access_headers = { Authorization: `Bearer ${token}` };
    }

    try {
      let response;
      const reqConfig = { headers: access_headers, timeout: 15000 };
      if (method === "POST") response = await axios.post(urlToCall, data, reqConfig);
      else if (method === "GET") response = await axios.get(urlToCall, reqConfig);
      else if (method === "PUT") response = await axios.put(urlToCall, data, reqConfig);
      else if (method === "DELETE") response = await axios.delete(urlToCall, reqConfig);
      else throw new Error("Unsupported HTTP method");

      if (response.status === 200 || response.status === 201) return response.data;
      return response.data || null;
    } catch (error) {
      const response = error?.response;

      if (response?.status === 401 && (response.data?.detail?.logout || response.data?.detail === "Invalid token or token expierd")) {
        console.warn("Your token has expired. Please sign in again.");
        Cookies.remove('user_name', { path: '/' });
        Cookies.remove('user_profile', { path: '/' });
        Cookies.remove('user_email', { path: '/' });
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        setIsLoggedIn(false);

        const publicRoutes = ['/', '/contact', '/auth-docs', '/pricing', '/privacy', '/terms'];
        if (!publicRoutes.includes(location.pathname)) {
          window.location.href = '/';
        }
      }
      console.error(
        `Error from NetworkCalls [${method} ${path}]:`,
        error?.message || error,
        response ? `Status: ${response.status}` : 'No response from server'
      );
      return null;
    }
  };

  return { call };
};
