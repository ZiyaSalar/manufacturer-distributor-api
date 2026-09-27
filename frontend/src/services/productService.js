import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PRODUCT_API_URL;

export async function getAllProducts() {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
}

export async function createProduct(data, file) {
  const formData = new FormData();
  formData.append('medicineCode', data.medicineCode);
  formData.append('medicineName', data.medicineName);
  formData.append('manufacturerId', data.manufacturerId);

  if (file) {
    formData.append('productDocument', file);
  }

  const response = await axios.post(`${BASE_URL}/products`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}