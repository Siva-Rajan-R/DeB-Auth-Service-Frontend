import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../Contexts/UserContext";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";



export const useNetworkCalls = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const location =useLocation()
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const call = async ({ method, path, data = null, withCred = true }) => {
    const urlToCall = `${backend_url}${path}`;
    method = method.toUpperCase();

    var accessToken=Cookies.get('access_token') || ''
    const refreshToken=Cookies.get('refresh_token') || ''


    var decodedAccessToken=null
    const decodedRefreshToken = refreshToken!=='' ? jwtDecode(refreshToken) : null

    if (accessToken!==''){
      decodedAccessToken=jwtDecode(accessToken)
    }

    var access_headers={
      Authorization:`Bearer ${accessToken}`
    }

    console.log("Before access token headers : ",access_headers);
    
    
    console.warn('broo is this true or false ;',decodedAccessToken?.exp < Math.floor(Date.now() / 1000),'ohhh',decodedAccessToken);
    if (decodedRefreshToken?.exp < Math.floor(Date.now() / 1000)){
      console.warn("Refresh Token Expired....Please login again");
      return;
    }

    if (decodedAccessToken?.exp < Math.floor(Date.now() / 1000)){
      console.warn("Access Token Expired....Geting new token");
      
      const refresh_headers={
        Authorization:`Bearer ${refreshToken}`
      }
      const res=await axios.get(`${backend_url}/user/token`,{headers:refresh_headers})
      console.log("Log For getting New Access TOken From NetWorkCalls : ",res.data);
      
      const new_access_token=res.data['access_token']
      console.log("New Accesst token from NetworkCalls : ",new_access_token);
      access_headers={
        Authorization:`Bearer ${new_access_token}`
      }
      Cookies.set('access_token',new_access_token)
      
    }

    console.log("After access token headers : ",access_headers);

    try {
      let response;
      if (method === "POST") response = await axios.post(urlToCall, data, { headers : access_headers });
      else if (method === "GET") response = await axios.get(urlToCall, { headers : access_headers });
      else if (method === "PUT") response = await axios.put(urlToCall, data, { headers : access_headers });
      else if (method === "DELETE") response = await axios.delete(urlToCall, { headers : access_headers });
      else throw new Error("Unsupported HTTP method");
      console.log("Headers from Networkcalls : ",response.headers)
      if (response.status === 200) return response.data;
    } catch (error) {
      const response = error.response;

      if (response?.status === 401 && response.data?.detail?.logout) {
        console.warn("Your token is expired. Please login again.");
        Cookies.remove('user_name')
        Cookies.remove('user_profile')
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')
        if (location.pathname!='/'){
          window.location.href='/'
          console.warn("You  need to go back to home page and sigin in again");
          
        }
        setIsLoggedIn(false);
      }
      console.error(`Error From NetworkCalls\n\nCatched Error : ${error}\n\nRespone Error : ${response.status} ${response?.data?.detail} Headers : ${response.headers}`)
      return null;
    }
  };

  return { call };
};
