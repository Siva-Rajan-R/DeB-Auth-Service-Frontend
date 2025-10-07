import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Contexts/UserContext";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";



export const useNetworkCalls = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const location =useLocation()
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const call = async ({ method, path, data = null, withCred = true }) => {
    const urlToCall = `${backend_url}${path}`;
    method = method.toUpperCase();

    try {
      let response;
      if (method === "POST") response = await axios.post(urlToCall, data, { withCredentials: withCred });
      else if (method === "GET") response = await axios.get(urlToCall, { withCredentials: withCred });
      else if (method === "PUT") response = await axios.put(urlToCall, data, { withCredentials: withCred });
      else if (method === "DELETE") response = await axios.delete(urlToCall, { withCredentials: withCred });
      else throw new Error("Unsupported HTTP method");

      if (response.status === 200) return response.data;
    } catch (error) {
      const response = error.response;

      if (response?.status === 401 && response.data?.detail?.logout) {
        console.warn("Your token is expired. Please login again.");
        Cookies.remove('user_name')
        Cookies.remove('user_profile')
        if (location.pathname!='/'){
          // window.location.href='/'
          console.warn("You  need to go back to home page and sigin in again");
          
        }
        setIsLoggedIn(false);
      }
      console.error(`Error From NetworkCalls\n\nCatched Error : ${error}\n\nRespone Error : ${response.status} ${response?.data?.detail}`)
      return null;
    }
  };

  return { call };
};
