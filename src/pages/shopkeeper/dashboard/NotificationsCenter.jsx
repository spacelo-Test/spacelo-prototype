import React from 'react';
import { useShopkeeper } from './ShopkeeperContext';

export default function NotificationsCenter() {
  const { 
    notifications, 
    setNotifications, 
    navigateToView 
  } = useShopkeeper();

  return (
    <div className="p-4 space-y-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <button onClick={() => navigateToView('dashboard', 'main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
          arrow_back
        </button>
        <h2 className="text-[22px] font-black text-[#005344]">Notifications</h2>
      </div>

      {/* List */}
      <div className="space-y-3 pt-2">
        {notifications.map((n) => (
          <div 
            key={n.id}
            onClick={() => {
              // Mark read
              setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item));
              if (n.deepLink) {
                navigateToView(n.deepLink.tab, n.deepLink.view || 'main', n.deepLink.id);
              }
            }}
            className={`border rounded-xl p-4 flex gap-3 items-start cursor-pointer hover:border-[#005344] transition-all ${
              n.read ? 'bg-white border-[#e0e3e0]' : 'bg-[#fe6a34]/5 border-[#fe6a34]/20'
            }`}
          >
            <span className={`material-symbols-outlined shrink-0 p-1.5 rounded-full ${
              n.type === 'request' ? 'bg-[#ffab00]/10 text-[#ab6b00]' :
              n.type === 'chat' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-[#00875a]'
            }`}>
              {n.type === 'request' ? 'description' : n.type === 'chat' ? 'chat_bubble' : 'credit_card'}
            </span>
            <div className="flex-1 text-xs">
              <p className="font-extrabold text-[#181c1b]">{n.title}</p>
              <p className="text-[#3e4945] mt-0.5">{n.body}</p>
              <span className="text-[10px] text-[#6e7975] mt-1.5 block">{n.time}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
