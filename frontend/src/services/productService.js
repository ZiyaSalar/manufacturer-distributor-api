import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PRODUCT_API_URL;
console.log(BASE_URL);

const subscriptionKey = import.meta.env.VITE_APIM_SUBSCRIPTION_KEY;
console.log(subscriptionKey);

export async function getAllProducts() {
  console.log("amka dhamka");
  const response = await axios.get(`${BASE_URL}/products`, {
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  });
  console.log(subscriptionKey);
  console.log(import.meta.env.VITE_APIM_SUBSCRIPTION_KEY);

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

  const response = await axios.post(
    `${BASE_URL}/products`,
    formData,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
}