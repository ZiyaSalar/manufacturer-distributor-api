import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PRODUCT_API_URL;

export async function getAllProducts() {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
}

export async function createProduct(data) {
  const response = await axios.post(`${BASE_URL}/products`, data);
  return response.data;
}