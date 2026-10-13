import React, { useContext, useEffect, useState } from 'react';
import SideBaar from '../../components/SideBaar';
import ChatContainer from '../../components/ChatContainer';
import RightSlider from '../../components/RightSlider';
import { ChatContext } from '../../context/ChatContext';

function Home() {
  const { selectUser } = useContext(ChatContext);
  const [showProfile, setShowProfile] = useState(false);

  const handleCloseProfile = () => setShowProfile(false);
  const handleProfileClick = () => setShowProfile(true);

  // Close the profile panel whenever the person switches or deselects a chat
  useEffect(() => {
    setShowProfile(false);
  }, [selectUser?._id]);

  // Close the profile panel with Escape
  useEffect(() => {
    if (!showProfile) return;
    const onKey = (e) => e.key === 'Escape' && handleCloseProfile();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showProfile]);

  const profileOpen = Boolean(selectUser && showProfile);

  // Shared look for each floating panel
  const panel =
    'h-full min-h-0 overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)]';

  return (
    <main className="h-screen w-full overflow-hidden bg-[#12161d] bg-[radial-gradient(60rem_40rem_at_10%_-10%,rgba(56,189,248,0.10),transparent),radial-gradient(50rem_40rem_at_100%_110%,rgba(129,140,248,0.12),transparent)] p-2 sm:p-3">
      <div className="flex h-full w-full gap-2 sm:gap-3">
        {/* Sidebar: full screen on mobile until a chat is opened */}
        <aside
          className={`${panel} ${
            selectUser ? 'hidden sm:block' : 'block'
          } w-full sm:w-[320px] md:w-[360px] shrink-0`}
        >
          <SideBaar />
        </aside>

        {/* Chat: full screen on mobile once a chat is opened */}
        <section
          className={`${panel} ${
            selectUser ? 'block' : 'hidden sm:block'
          } min-w-0 flex-1`}
        >
          <ChatContainer
            selectUser={selectUser}
            onProfileClick={handleProfileClick}
          />
        </section>

        {/* Profile: inline panel on desktop, drawer on mobile */}
        {selectUser && (
          <>
            {/* Mobile backdrop */}
            <div
              onClick={handleCloseProfile}
              aria-hidden="true"
              className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                showProfile ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            />

            <aside
              aria-label="Contact profile"
              aria-hidden={!profileOpen}
              className={`
                ${panel}
                fixed right-0 top-0 z-50 h-full w-[88%] max-w-sm rounded-none md:rounded-2xl
                transition-all duration-300 ease-out
                md:static md:z-auto md:max-w-none md:shrink-0
                ${
                  profileOpen
                    ? 'translate-x-0 md:w-[340px] md:opacity-100'
                    : 'translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:ring-0 md:shadow-none'
                }
              `}
            >
              <div className="h-full w-full md:w-[340px]">
                <RightSlider selectUser={selectUser} onClose={handleCloseProfile} />
              </div>
            </aside>
          </>
        )}
      </div>
    </main>
  );
}

export default Home;
