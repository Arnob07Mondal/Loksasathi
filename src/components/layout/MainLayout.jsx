import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-saffron/30 selection:text-brand-saffron">
      {/* Background Glow Decorations */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-saffron/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-blue/5 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[350px] h-[350px] rounded-full bg-brand-green/5 blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center py-10 px-4 max-w-7xl w-full mx-auto relative">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
