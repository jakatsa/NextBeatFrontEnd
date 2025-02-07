import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { use } from "react";

const baseURL = "http://127.0.0.1:8000/api/";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);
  {
    /**creation of user token */
  }
  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer${authTokens?.access}` },
  }).access;
  {
    /**refresh token  consumption */
  }
  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(use.exp).diff(dayjs()) < 1;

    if (isExpired) return req;

    const response = await axios.post(`${baseURL}/tokens/refresh/`, {
      refresh: authTokens.refresh,
    });

    localStorage.setItem("authToken", JSON.stringify(response.data));
    //localStorage.setItem("authToken", JSON.stringify(response.data));

    setAuthTokens(response.data);
    setUser(jwt_decode(response.data.access));
    req.headers.Authorization = `Bearer${response.data.access}`;
    return req;
  });
  return axiosInstance;
};

export default useAxios;
