import axios from "axios";

const API_URL = "/api/profile";

export const getProfile = () => axios.get(API_URL);
export const saveProfile = (data) => axios.post(API_URL, data);
