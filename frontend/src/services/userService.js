import axios from 'axios';
import { API_URL } from '../config/constants';

// Get the JWT token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users/profile`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/api/users/profile`, profileData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update password
export const updatePassword = async (passwordData) => {
  try {
    const response = await axios.put(`${API_URL}/api/users/password`, passwordData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};