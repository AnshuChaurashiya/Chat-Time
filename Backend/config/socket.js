const { Server } = require('socket.io');

// Initialize userSocketMap as an empty object
const userSocketMap = {};

// Function to initialize socket.io
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'https://chat-time-viya.onrender.com'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'token']
    }
  });

  // Socket connection handler
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    
    if (!userId) {
      console.log("Connection attempt without userId");
      socket.disconnect();
      return;
    }

    console.log("User Connected:", userId);
    userSocketMap[userId] = socket.id;

    // emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
    socket.on("disconnect", () => {
      if (userId) {
        console.log("User Disconnected:", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  return io;
};

module.exports = { initializeSocket, userSocketMap }; 
