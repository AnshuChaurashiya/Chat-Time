import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendUrl = 'https://chat-time-backend.onrender.com';
// console.log(backendUrl);

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Check if user is authenticated
  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/api/auth/check');
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error(" Please log.");
      localStorage.removeItem('token');
      setToken(null);
      setAuthUser(null);
    }
  };

  // ✅ Connect Socket.IO
  const connectSocket = (user) => {
    if (!user || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: user._id || user.id },
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log("Connected to socket server with userId:", user._id || user.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on('getOnlineUsers', (userIds) => {
      console.log("Received online users:", userIds);
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  // ✅ Login function
  const login = async (type, userData) => {
    try {
      const endpoint = type === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const { data } = await axios.post(endpoint, userData);
      
      if (data.success) {
        setAuthUser(data.userData);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['token'] = data.token;
        connectSocket(data.userData);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common['token'] = null;
    toast.success("Logged out successfully");
    if (socket) socket.disconnect();
  };

  // ✅ Update Profile
  const updateProfile = async (formData) => {
    try {
      const { data } = await axios.put('/api/auth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message || 'Profile updated successfully');
        return data;
      } else {
        toast.error(data.message || 'Failed to update profile');
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
      throw error;
    }
  };

  // ✅ Initial mount: apply token and check auth
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['token'] = token;
    }
    checkAuth();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const value = {
    axios,
    authUser,
    token,
    onlineUsers,
    socket,
    setAuthUser,
    setToken,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
