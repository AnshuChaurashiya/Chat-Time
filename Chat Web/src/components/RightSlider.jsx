import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

function RightSlider({ selectUser, onClose }) {
  const { messages } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const [mediaMessages, setMediaMessages] = useState([]);
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    if (messages && selectUser) {
      // Filter messages with valid image URLs
      const media = messages.filter(msg => {
        const hasImage = msg.image && typeof msg.image === 'string' && msg.image.startsWith('http');
        // console.log('Checking message:', {
        //   id: msg._id,
        //   hasImage,
        //   imageUrl: msg.image,
        //   text: msg.text,
        //   createdAt: msg.createdAt
        // });
        return hasImage;
      });
      
      // console.log('Filtered media messages:', media.map(msg => ({
      //   id: msg._id,
      //   image: msg.image,
      //   createdAt: msg.createdAt
      // })));
      setMediaMessages(media);
      setIsUserOnline(onlineUsers.includes(selectUser._id));
    }
  }, [messages, selectUser, onlineUsers]);

  if (!selectUser) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <p>Select a user to view profile</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-3 sm:p-4 rounded-xl overflow-y-auto md:rounded-l-xl">
      {/* Close Button - Visible on both mobile and desktop */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          title="Close profile"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Profile Picture */}
      <div className="flex relative flex-col items-center gap-2 mb-4">
        <div className=" ">
          <img
            src={selectUser.profileImg || 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png'}
            alt={selectUser.fullname}
            className={`w-20 h-20 sm:w-52 sm:h-52 rounded-full    shadow-xl border-2  object-cover ${isUserOnline ? 'border-green-500  '  : 'bg-gray-400'}`}
              
          />
          
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{selectUser.fullname}</h2>
        <p className="text-xs sm:text-sm text-gray-500">{selectUser.bio || 'No bio yet'}</p>
        <span className={`text-xs sm:text-sm ${isUserOnline ? 'text-green-500' : 'text-gray-500'}`}>
          {isUserOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* User Details */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm sm:text-md font-semibold text-gray-700">About</h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {selectUser.bio || `Hello! I'm ${selectUser.fullname}. Feel free to message me any time. 😊`}
          </p>
        </div>

        <div>
          <h3 className="text-sm sm:text-md font-semibold text-gray-700">Contact Info</h3>
          <p className="text-xs sm:text-sm text-gray-600">📧 {selectUser.email}</p>
        </div>
      </div>

      <hr className="my-4" />

      {/* Media Section */}
      <div className="mt-4">
        <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-2">Shared Media</h3>
        <div className=' bg-[#9bfb9b] rounded-2xl w-fit  p-4 px-8 mb-4'>
          <img className=' w-10' src="https://cdn-icons-png.flaticon.com/128/9229/9229087.png" alt="" />
          <span className=' flex gap-3'>
          {mediaMessages.length}
          Image
          </span>
          </div>


        {mediaMessages.length === 0 ? (
          <p className="text-xs sm:text-sm text-gray-500">No media shared yet</p>
        ) : (
          <div className=" grid grid-cols-2 gap-2 ">
            {mediaMessages.map((message) => {
              const imageUrl = message.image;
              // console.log('Rendering media message:', {
              //   id: message._id,
              //   imageUrl,
              //   createdAt: message.createdAt
              // });
              
              return (
                <div key={message._id} className="relative group">
                  <img 
                    src={imageUrl}
                    alt="Shared media" 
                    className="w-full h-24 border border-gray-200 sm:h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(imageUrl, '_blank')}
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl);
                      e.target.onerror = null;
                      e.target.src = 'https://cdn-icons-png.flaticon.com/128/2311/2311524.png';
                      e.target.classList.add('opacity-50');
                    }}
                    // onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                  />
                  <div className="absolute inset-0   bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
                  <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 text-[10px] sm:text-xs text-white  bg-opacity-50 px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RightSlider;
