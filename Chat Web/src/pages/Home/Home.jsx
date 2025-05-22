import React, { useContext, useState } from 'react';
import SideBaar from '../../components/SideBaar';
import ChatContainer from '../../components/ChatContainer';
import RightSlider from '../../components/RightSlider';
import { ChatContext } from '../../context/ChatContext';

function Home() {
  const { selectUser } = useContext(ChatContext);
  const [showProfile, setShowProfile] = useState(false);

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  return (
    <div className="w-full h-screen gap-2 p-2 overflow-hidden">
      <div
        className={`grid w-full gap-1 h-full ${
          selectUser 
            ? showProfile
              ? 'sm:grid-cols-[1fr_2fr] md:grid-cols-[1fr_2fr_1.5fr]'
              : 'sm:grid-cols-[1fr_2fr]'
            : 'sm:grid-cols-[1fr_2fr]'
        } grid-cols-1 relative`}
      >
        {/* Sidebar */}
        <div className="h-full overflow-hidden">
          <SideBaar />
        </div>

        {/* Chat */}
        <div className="h-full overflow-hidden">
          <ChatContainer selectUser={selectUser} onProfileClick={handleProfileClick} />
        </div>

        {/* Right Slider (shown if user is selected and profile is clicked) */}
        {selectUser && showProfile && (
          <>
            {/* Overlay for mobile */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={handleCloseProfile}
            />
            {/* Profile Slider */}
            <div className={`
              h-full overflow-hidden
              md:block
              fixed md:relative
              top-0 right-0
              w-full md:w-auto
              z-50
              transition-transform duration-300 ease-in-out
              ${showProfile ? 'translate-x-0' : 'translate-x-full'}
            `}>
              <RightSlider selectUser={selectUser} onClose={handleCloseProfile} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
