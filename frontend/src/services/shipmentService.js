import axios from 'axios';

const BASE_URL = import.meta.env.VITE_SHIPMENT_API_URL;

export async function getAllShipments() {
  const response = await axios.get(`${BASE_URL}/shipments`);
  return response.data;
}

export async function createShipment(data) {
  const response = await axios.post(`${BASE_URL}/shipments`, data);
  return response.data;
}