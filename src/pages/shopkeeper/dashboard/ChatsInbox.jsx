import React from 'react';
import { useShopkeeper } from './ShopkeeperContext';

export default function ChatsInbox() {
  const { chats, navigateToView } = useShopkeeper();

  return (
    <div className="p-4 space-y-4">
      
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <button onClick={() => navigateToView('dashboard', 'main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
          arrow_back
        </button>
        <h2 className="text-[22px] font-black text-[#005344]">Messages Inbox</h2>
      </div>

      {/* List */}
      <div className="space-y-2 pt-2">
        {chats.map((thread) => (
          <div 
            key={thread.id}
            onClick={() => navigateToView('profile', 'chat-thread', thread.id)}
            className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex justify-between items-center cursor-pointer hover:border-[#005344] transition-all"
          >
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-[#005344] text-[#96ebd5] rounded-xl flex items-center justify-center font-bold text-[16px]">
                {thread.brand[0]}
              </div>
              <div>
                <h4 className="text-[14px] font-black text-[#181c1b]">{thread.brand}</h4>
                <p className="text-[11px] text-[#6e7975] truncate max-w-[180px] mt-0.5">{thread.lastMsg}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[10px] text-[#6e7975]">{thread.time}</span>
              {thread.unread && (
                <span className="w-2.5 h-2.5 bg-[#fe6a34] rounded-full"></span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
