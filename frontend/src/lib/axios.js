import axios from 'axios'

const BASEDURL = import.meta.env.MODE === "development" ? "http://localhost:4000/api" : "/api"
export const axiosInstance = axios.create({
    baseURL: BASEDURL ,
    withCredentials:true
});