const express = require('express');
const cors = require('cors');
const http = require('http');
const ConnectDB = require('./DB/DataBase');
const UserRouter = require('./routes/userRouts');
const messageRouter = require('./routes/MessageRouts');
const { initializeSocket } = require('./config/socket');
const dotenv = require('dotenv');

dotenv.config(); 

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000; 

// Initialize socket.io
const io = initializeSocket(server);
// Store io instance in app for use in routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: [ 'http://localhost:5173'],
  credentials: true
}));

// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', UserRouter);
app.use('/api/messages', messageRouter);

// Connect to database
ConnectDB();

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
