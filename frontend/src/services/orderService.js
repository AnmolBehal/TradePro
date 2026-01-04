import axios from 'axios';
import { API_URL } from '../config/constants';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? {
    headers: {
      Authorization: `Bearer ${token}`
    }
  } : { headers: {} };
};

export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/orders`,
      orderData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    // Check if the error response contains an order object
    // If it does, the order was actually placed successfully
    if (error.response?.data?.order) {
      return error.response.data;
    }
    throw error.response?.data || error.message;
  }
};

export const getUserOrders = async (status = '') => {
  try {
    const url = status ? `${API_URL}/api/orders?status=${status}` : `${API_URL}/api/orders`;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/orders/${orderId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/orders/${orderId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};