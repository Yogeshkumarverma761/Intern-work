import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:5000",
});

export const fetchClothes = async (params = {}, config = {}) => {
  const { data } = await api.get("/cloths", { params, ...config });
  return data;
};

export const fetchClothById = async (id) => {
  const { data } = await api.get(`/cloths/${id}`);
  return data;
};

export const fetchShopMeta = async () => {
  const { data } = await api.get("/cloths/meta");
  return data;
};

export const createCloth = async (payload, token) => {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const { data } = await api.post("/cloths", payload, {
    headers: isFormData ? headers : headers,
    withCredentials: true,
  });
  return data;
};

export default {
  fetchClothes,
  fetchClothById,
  fetchShopMeta,
  createCloth,
};
