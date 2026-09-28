import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SHIPMENT_API_URL;

const subscriptionKey = import.meta.env.VITE_APIM_SUBSCRIPTION_KEY;

// console.log("subscriptionKey")
const headers = {
  'Ocp-Apim-Subscription-Key': subscriptionKey
};

export async function getAllShipments() {
  const response = await axios.get(`${BASE_URL}/shipments`, {
    headers
  });

  return response.data;
}

export async function createShipment(data) {
  const response = await axios.post(
    `${BASE_URL}/shipments`,
    data,
    {
      headers
    }
  );

  return response.data;
}