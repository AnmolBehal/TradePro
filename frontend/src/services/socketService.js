import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/constants';

let socket = null;

/**
 * Initialize the Socket.IO connection with authentication token
 * @param {string} token - JWT authentication token
 * @returns {object} - Socket.IO instance
 */
export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection with auth token
  socket = io(SOCKET_URL, {
    auth: {
      token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  return socket;
};

/**
 * Join user-specific room for personalized updates
 * @param {string} userId - User ID to join room
 */
export const joinUserRoom = (userId) => {
  if (socket && socket.connected) {
    socket.emit('join', userId);
  }
};

/**
 * Subscribe to market data for specific symbols
 * @param {Array} symbols - Array of asset symbols to subscribe to
 */
export const subscribeToMarketData = (symbols) => {
  if (socket && socket.connected) {
    socket.emit('subscribe', symbols);
  }
};

/**
 * Add event listener for order updates
 * @param {Function} callback - Callback function to handle order updates
 */
export const onOrderUpdate = (callback) => {
  if (socket) {
    socket.on('orderUpdate', callback);
  }
};

/**
 * Add event listener for portfolio updates
 * @param {Function} callback - Callback function to handle portfolio updates
 */
export const onPortfolioUpdate = (callback) => {
  if (socket) {
    socket.on('portfolioUpdate', callback);
  }
};

/**
 * Remove event listener
 * @param {string} event - Event name
 * @param {Function} callback - Callback function to remove
 */
export const offEvent = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get current socket instance
 * @returns {object|null} - Socket.IO instance or null if not initialized
 */
export const getSocket = () => socket;