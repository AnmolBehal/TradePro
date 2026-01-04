const socketIo = require('socket.io');

// Initialize with null, will be set when server is created
let io = null;

// Function to initialize Socket.IO with the HTTP server
function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Join a room for personalized updates
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Handle market data subscription
    socket.on('subscribe', (symbols) => {
      console.log(`Client subscribed to: ${symbols}`);
      // Here we would set up real-time data feeds for these symbols
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}

// Export the io instance and the initialization function
module.exports = {
  io: () => io,
  initializeSocket
};