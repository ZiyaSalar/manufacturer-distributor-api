import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PRODUCT_API_URL;

export async function getAllManufacturers() {
  const response = await axios.get(`${BASE_URL}/manufacturers`);
  return response.data;
}

export async function createManufacturer(data) {
  const response = await axios.post(`${BASE_URL}/manufacturers`, data);
  return response.data;
}