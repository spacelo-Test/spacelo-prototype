import React from 'react';
import { useShopkeeper } from './ShopkeeperContext';
import HomeTab from './HomeTab';
import SpacesTab from './SpacesTab';
import RequestsTab from './RequestsTab';
import EarningsTab from './EarningsTab';
import ProfileTab from './ProfileTab';
import NotificationsCenter from './NotificationsCenter';

export default function DashboardShell({ handleLogout }) {
  const {
    activeTab,
    currentView,
    notifications,
    navigateToView
  } = useShopkeeper();

  const renderActiveTab = () => {
    // Intercept secondary global overlay views
    if (activeTab === 'profile' && currentView === 'notifications') {
      return <NotificationsCenter />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <HomeTab />;
      case 'spaces':
        return <SpacesTab />;
      case 'bookings':
        return <RequestsTab />;
      case 'earnings':
        return <EarningsTab />;
      case 'profile':
        return <ProfileTab handleLogout={handleLogout} />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="bg-[#f7faf7] text-[#181c1b] min-h-full flex flex-col font-manrope relative select-none">
      
      {/* ----------------- TOP APP BAR ----------------- */}
      <header className="bg-white border-b border-[#e0e3e0] sticky top-0 w-full z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span 
            className="text-2xl font-black text-[#005344] italic cursor-pointer"
            onClick={() => navigateToView('dashboard', 'main')}
          >
            Spacelo
          </span>
        </div>
        
        {/* Top bar icons */}
        <div className="flex items-center gap-3">
          {/* Notifications Center link */}
          <button 
            onClick={() => navigateToView('profile', 'notifications')} 
            className="p-1.5 hover:bg-[#ebefec] rounded-full relative text-[#3e4945] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#fe6a34] rounded-full border border-white"></span>
            )}
          </button>
        </div>
      </header>

      {/* ----------------- VIEWPORT MAIN CONTENT ----------------- */}
      <div className="flex-1 overflow-y-auto pb-24">
        {renderActiveTab()}
      </div>

      {/* ----------------- BOTTOM TAB NAVIGATION BAR ----------------- */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 bg-white border-t border-[#bec9c4] shadow-[0_-4px_25px_rgba(0,0,0,0.06)] max-w-[375px] sm:max-w-[414px]">
        {/* Tab 1: Dashboard */}
        <button 
          onClick={() => navigateToView('dashboard')} 
          className="flex flex-col items-center justify-center py-1 transition-all"
          style={{ color: activeTab === 'dashboard' ? '#005344' : '#6e7975' }}
        >
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="text-[10px] font-black mt-0.5">Home</span>
        </button>

        {/* Tab 2: Spaces */}
        <button 
          onClick={() => navigateToView('spaces')} 
          className="flex flex-col items-center justify-center py-1 transition-all"
          style={{ color: activeTab === 'spaces' ? '#005344' : '#6e7975' }}
        >
          <span className="material-symbols-outlined text-[24px]">store</span>
          <span className="text-[10px] font-black mt-0.5">Spaces</span>
        </button>

        {/* Tab 3: Requests */}
        <button 
          onClick={() => navigateToView('bookings', 'inbox')} 
          className="flex flex-col items-center justify-center py-1 transition-all"
          style={{ color: activeTab === 'bookings' ? '#005344' : '#6e7975' }}
        >
          <span className="material-symbols-outlined text-[24px]">description</span>
          <span className="text-[10px] font-black mt-0.5">Requests</span>
        </button>

        {/* Tab 4: Earnings */}
        <button 
          onClick={() => navigateToView('earnings')} 
          className="flex flex-col items-center justify-center py-1 transition-all"
          style={{ color: activeTab === 'earnings' ? '#005344' : '#6e7975' }}
        >
          <span className="material-symbols-outlined text-[24px]">payments</span>
          <span className="text-[10px] font-black mt-0.5">Earnings</span>
        </button>

        {/* Tab 5: Profile */}
        <button 
          onClick={() => navigateToView('profile')} 
          className="flex flex-col items-center justify-center py-1 transition-all"
          style={{ color: activeTab === 'profile' ? '#005344' : '#6e7975' }}
        >
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
          <span className="text-[10px] font-black mt-0.5">Profile</span>
        </button>
      </nav>

    </div>
  );
}
