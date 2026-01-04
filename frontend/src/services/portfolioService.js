import axios from 'axios';
import { API_URL } from '../config/constants';

// Get the JWT token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user portfolio summary
export const getUserPortfolio = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/portfolio`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get portfolio history
export const getPortfolioHistory = async (timeframe = '1m') => {
  try {
    const response = await axios.get(`${API_URL}/api/portfolio/history?timeframe=${timeframe}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get portfolio statistics
export const getPortfolioStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/portfolio/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get portfolio assets
export const getPortfolioAssets = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/portfolio/assets`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};