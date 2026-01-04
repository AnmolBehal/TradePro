import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { initializeSocket, joinUserRoom, disconnectSocket } from '../services/socketService';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize socket when user is authenticated
    if (currentUser) {
      const token = localStorage.getItem('token');
      if (token) {
        const socketInstance = initializeSocket(token);
        
        socketInstance.on('connect', () => {
          setConnected(true);
          // Join user-specific room for personalized updates
          if (currentUser._id) {
            joinUserRoom(currentUser._id);
          }
        });

        socketInstance.on('disconnect', () => {
          setConnected(false);
        });

        setSocket(socketInstance);
      }
    } else {
      // Disconnect socket when user logs out
      disconnectSocket();
      setSocket(null);
      setConnected(false);
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => useContext(SocketContext);