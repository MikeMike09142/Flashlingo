import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-cream-100 dark:bg-neutral-900 flex flex-col">
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        
        <main className="flex-1 transition-all duration-300 md:ml-64">
          <div className="w-full px-2 sm:px-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;