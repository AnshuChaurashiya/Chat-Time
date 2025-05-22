import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

function SideBaar() {
  const { users, getUsers, selectUser, setSelectUser, unseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers, authUser } = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Filter users based on search input
  const filteredUsers = searchInput 
    ? users.filter((user) => 
        user.fullname.toLowerCase().includes(searchInput.toLowerCase())
      )
    : users;

  // Get users on component mount and when online users change
  useEffect(() => {
    // console.log('Fetching users...');
    getUsers();
  }, [getUsers, onlineUsers]);

  useEffect(() => {
    // console.log('Current users:', users);
  }, [users]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const defaultIcon = 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png';

  // Helper function to check if user is online
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <div
      className={`w-full h-full p-2 sm:p-4 rounded-xl overflow-hidden bg-white border-gray-200 ${
        selectUser ? 'max-md:hidden' : ''
      }`}
    >
      {/* Header and Menu */}
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Chats</h2>
        <div className="relative profile-menu-container">
          <img
            src={authUser?.profileImg || defaultIcon}
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
            alt="profile menu"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          />
          {showProfileMenu && (
            <div className="absolute bg-white shadow-lg rounded-lg p-2 w-48 right-0 z-50 mt-2 border border-gray-100">
              <div className="p-2 border-b border-gray-100">
                <p className="font-medium text-gray-800">{authUser?.fullname}</p>
                <p className="text-sm text-gray-500">{authUser?.email}</p>
              </div>
            <Link 
              to="/profile" 
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md text-gray-700 transition-colors"
                onClick={() => setShowProfileMenu(false)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              Profile
            </Link>
            <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 rounded-md text-gray-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v3a1 1 0 102 0V9z" clipRule="evenodd" />
                </svg>
              Logout
            </button>
          </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search users..."
          className="w-full p-2 my-2 sm:my-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 text-sm sm:text-base"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Users List */}
      <div className="overflow-y-auto h-[calc(100%-6rem)] space-y-1 sm:space-y-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500 mt-4 text-sm sm:text-base">
            No users found
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isOnline = isUserOnline(user._id);
            const unreadCount = unseenMessages[user._id] || 0;
            return (
              <div
                key={user._id}
                onClick={() => setSelectUser(user)}
                className={`relative flex items-center gap-2  sm:gap-3 p-2 sm:p-3 rounded-xl cursor-pointer transition ${
                  isOnline 
                    ? 'bg-green-400 hover:bg-green-200 text-white' 
                    : 'hover:bg-gray-100'
                } ${
                  selectUser?._id === user._id ? ' ' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={user.profileImg || defaultIcon}
                    alt={user.fullname}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  {/* {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )} */}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <h3 className={`text-sm sm:text-md font-medium truncate ${
                      isOnline ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user.fullname}
                    </h3>
                    {/* <span className={`text-xs ${isOnline ? 'text-white' : 'text-gray-400'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span> */}
                  </div>
                </div>

                {unreadCount > 0 && (
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SideBaar;