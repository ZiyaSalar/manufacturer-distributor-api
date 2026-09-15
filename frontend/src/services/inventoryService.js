import axios from 'axios';

const BASE_URL = import.meta.env.VITE_INVENTORY_API_URL;

export async function getAllInventory() {
  const response = await axios.get(`${BASE_URL}/inventory`);
  return response.data;
}

export async function getInventoryByCode(medicineCode) {
  const response = await axios.get(`${BASE_URL}/inventory/${medicineCode}`);
  return response.data;
}