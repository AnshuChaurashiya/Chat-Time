import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const ChatContext = createContext();

function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [loading, setLoading] = useState(false);

  const { socket, axios } = useContext(AuthContext);

  // Fetch list of users
  const getUsers = async () => {
    try {
      const { data } = await axios.get('/api/messages/users');
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.message || "Failed to fetch users");
    }
  };

  // Fetch messages with selected user
  const getMessages = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error(error.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  // Send a message to the selected user
  const sendMessage = async (messageData) => {
    if (!selectUser || !selectUser._id) {
      console.error('No user selected or missing user ID');
      toast.error('Please select a user to chat with');
      return false;
    }

    if (!messageData.text && !messageData.image) {
      console.error('No message content provided');
      toast.error('Message must contain either text or image');
      return false;
    }

    try {
      console.log('Sending message:', {
        to: selectUser._id,
        data: {
          text: messageData.text,
          hasImage: !!messageData.image
        }
      });

      const { data } = await axios.post(`/api/messages/send/${selectUser._id}`, messageData);
      
      if (data.success) {
        console.log('Message sent successfully:', data.newMessage);
        // Add the new message to the messages array
        setMessages((prev) => [...prev, data.newMessage]);
        
        // Emit the message through socket
        if (socket) {
          console.log('Emitting message through socket');
          socket.emit('sendMessage', {
            receiverId: selectUser._id,
            message: data.newMessage
          });
        }
        return true;
      } else {
        console.error('Server returned error:', data.message);
        toast.error(data.message || "Failed to send message");
        return false;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.message || error.message || "Failed to send message";
      toast.error(errorMessage);
      return false;
    }
  };

  // Subscribe to real-time messages
  const subscribeToMessage = () => {
    if (!socket) return;

    socket.on('newMessage', async (newMessage) => {
      console.log('New message received:', newMessage);
      
      if (selectUser && newMessage.senderId === selectUser._id) {
        // If the message is from the currently selected user
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);

        try {
          await axios.put(`/api/messages/mark/${newMessage._id}`);
        } catch (error) {
          console.error("Failed to mark message as seen:", error.message);
        }
      } else {
        // If the message is from another user
        setUnseenMessages((prevUnseen) => ({
          ...prevUnseen,
          [newMessage.senderId]: (prevUnseen[newMessage.senderId] || 0) + 1,
        }));
      }
    });

    // Listen for online users updates
    socket.on('getOnlineUsers', (onlineUsers) => {
      console.log('Online users updated:', onlineUsers);
      // Update users' online status
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          isOnline: onlineUsers.includes(user._id),
        }))
      );
    });
  };

  // Unsubscribe from socket
  const unsubscribeToMessage = () => {
    if (socket) {
      socket.off('newMessage');
      socket.off('getOnlineUsers');
    }
  };

  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeToMessage();
  }, [socket, selectUser]);

  // Get messages when user is selected
  useEffect(() => {
    if (selectUser) {
      getMessages(selectUser._id);
      // Reset unseen messages count for selected user
      setUnseenMessages((prev) => ({
        ...prev,
        [selectUser._id]: 0,
      }));
    }
  }, [selectUser]);

  const value = {
    messages,
    users,
    selectUser,
    setSelectUser,
    unseenMessages,
    loading,
    getUsers,
    getMessages,
    sendMessage,
    setUnseenMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
