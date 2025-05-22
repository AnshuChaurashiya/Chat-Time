import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatTime } from '../lib/Utils';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function ChatContainer({ onProfileClick }) {
  const { selectUser, messages, sendMessage, loading, setSelectUser } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const [messageInput, setMessageInput] = useState('');
  const [isUserOnline, setIsUserOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectUser) {
      setIsUserOnline(onlineUsers.includes(selectUser._id));
    }
  }, [selectUser, onlineUsers]);

  const handleBackClick = () => {
    setSelectUser(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      const success = await sendMessage({ text: messageInput.trim() });
      if (success) {
        setMessageInput('');
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const compressImage = (base64String, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with reduced quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG and GIF images are allowed');
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          let base64Image = reader.result;
          
          // Compress image if it's not a GIF
          if (file.type !== 'image/gif') {
            base64Image = await compressImage(base64Image);
          }

          const success = await sendMessage({ image: base64Image });
          if (success) {
            e.target.value = '';
            toast.success('Image sent successfully');
          }
        } catch (error) {
          console.error('Error sending image:', error);
          toast.error(error.response?.data?.message || 'Failed to send image');
        }
      };

      reader.onerror = () => {
        toast.error('Error reading file');
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (onProfileClick) {
      onProfileClick();
    }
  };

  if (!selectUser) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center bg-gradient-to-br w-full h-full  from-gray-50 to-gray-100"
      >
        <div className="text-center hidden md:block  p-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 mx-auto mb-6"
          >
            <svg className="w-full h-full text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg font-medium"
          >
            Select a user to start chatting
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <div 
    style={{backgroundImage:`url("https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg")`}}
     className="flex-1 flex flex-col h-[99%]  bg-gray-100  border-gray-100 border  rounded-2xl  overflow-y-auto overflow-hidden">
      {/* Chat Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between border-b shadow-black  border-gray-400 px-3 "
        
      >
        <div className="flex items-center gap-4">
          {/* Mobile Back Button */}
          <button
            onClick={handleBackClick}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer"
            onClick={handleProfileClick}
          >
            <img
              src={selectUser.profileImg || 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png'}
              alt={selectUser.fullname}
              className={`w-12 h-12 rounded-full object-cover border-2 shadow-md ${isUserOnline ? 'border-green-500' : ''} `}
            />
            
          </motion.div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectUser.fullname}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isUserOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              {isUserOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-full "
            >
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </motion.div>
          ) : messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-gray-500"
            >
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mb-4"
              >
                <svg className="w-full h-full text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </motion.div>
              <p className="text-lg font-medium">No messages yet. Start the conversation!</p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex  ${message.senderId === selectUser._id ? 'justify-start' : 'justify-end'}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    message.senderId === selectUser._id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {message.text && <p className="break-words">{message.text}</p>}
                  {message.image && (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={message.image}
                      alt="Shared"
                      className="mt-2 rounded-lg max-w-full max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(message.image, '_blank')}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png';
                        e.target.classList.add('opacity-50');
                      }}
                    />
                  )}
                  <span className="text-[10px] opacity-70 block mt-1">
                    {formatTime(message.createdAt)}
                  </span>
                </motion.div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onSubmit={handleSendMessage} 
        className="p-4"
      >
        <div className="flex items-center gap-2">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <input
            ref={inputRef}
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 shadows rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => document.getElementById('fileInput').click()}
            className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!messageInput.trim()}
            className={`p-3 rounded-full transition-colors ${
              messageInput.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}

export default ChatContainer;
