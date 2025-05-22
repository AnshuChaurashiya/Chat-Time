# ChatTime - Real-time Chat Application

A modern real-time chat application built with React, Node.js, and Socket.IO.

## Features

- Real-time messaging
- User authentication
- Profile management
- Image sharing
- Online/offline status
- Message notifications
- Responsive design

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Socket.IO Client
- Axios
- React Router
- React Hot Toast

### Backend
- Node.js
- Express
- Socket.IO
- MongoDB
- JWT Authentication

## Project Structure

```
├── Chat Web/          # Frontend React application
│   ├── src/          # Source files
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
│
└── Backend/          # Backend Node.js application
    ├── config/       # Configuration files
    ├── controller/   # Route controllers
    ├── middleware/   # Custom middleware
    ├── model/        # Database models
    ├── routes/       # API routes
    └── package.json  # Backend dependencies
```

## Live Demo

- Frontend: https://chattime-fronted.onrender.com
- Backend: https://chattime-3gul.onrender.com

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd "Chat Web"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

### Frontend
- `VITE_BACKEND_URL`: Backend API URL

### Backend
- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 