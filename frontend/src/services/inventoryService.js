import axios from 'axios';

const BASE_URL = import.meta.env.VITE_INVENTORY_API_URL;

const headers = {
  'Ocp-Apim-Subscription-Key': import.meta.env.VITE_APIM_SUBSCRIPTION_KEY
};

export async function getAllInventory() {
  const response = await axios.get(`${BASE_URL}/inventory`, {
    headers
  });

  return response.data;
}

export async function getInventoryByCode(medicineCode) {
  const response = await axios.get(
    `${BASE_URL}/inventory/${medicineCode}`,
    {
      headers
    }
  );

  return response.data;
}