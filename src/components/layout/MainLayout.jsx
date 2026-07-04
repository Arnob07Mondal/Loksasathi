import React from 'react';

const MainLayout = ({ children, showLanding = false }) => {
  return (
    <div className="relative min-h-screen bg-[#F6F8F7] text-slate-800 selection:bg-[#2E8B57]/20 selection:text-[#2E8B57] flex flex-col font-sans">
      {/* Background Glow Decorations */}
      <div className="premium-bg-decorations">
        <div className="premium-bg-noise" />
        <div className="premium-bg-blob-1" />
        <div className="premium-bg-blob-2" />
        <div className="premium-bg-blob-3" />
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col w-full mx-auto relative ${showLanding ? '' : 'h-screen overflow-hidden'}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
