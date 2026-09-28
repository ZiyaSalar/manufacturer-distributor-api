import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PRODUCT_API_URL;

const headers = {
  'Ocp-Apim-Subscription-Key': import.meta.env.VITE_APIM_SUBSCRIPTION_KEY
};

export async function getAllManufacturers() {
  const response = await axios.get(
    `${BASE_URL}/manufacturers`,
    { headers }
  );

  return response.data;
}

export async function createManufacturer(data) {
  const response = await axios.post(
    `${BASE_URL}/manufacturers`,
    data,
    { headers }
  );

  return response.data;
}