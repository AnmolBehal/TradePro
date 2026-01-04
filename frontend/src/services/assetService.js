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

export const getAssets = async (type = '') => {
  try {
    const url = type ? `${API_URL}/api/assets?type=${type}` : `${API_URL}/api/assets`;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAssetBySymbol = async (symbol) => {
  try {
    const response = await axios.get(`${API_URL}/api/assets/${symbol}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAssetHistory = async (symbol, timeframe = '1d') => {
  try {
    const response = await axios.get(
      `${API_URL}/api/assets/${symbol}/history?timeframe=${timeframe}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchAssets = async (query) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/assets/search?q=${query}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};