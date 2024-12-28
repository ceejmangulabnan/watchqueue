import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL

export const axiosBase = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
})

export default axiosBase
