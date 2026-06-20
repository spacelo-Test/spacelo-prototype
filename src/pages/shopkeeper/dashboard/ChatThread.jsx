import React, { useState } from 'react';
import { useShopkeeper } from './ShopkeeperContext';

export default function ChatThread() {
  const { 
    chats, 
    setChats, 
    requests, 
    setRequests, 
    viewParams, 
    navigateToView 
  } = useShopkeeper();
  const [counterPrice, setCounterPrice] = useState('');

  const thread = chats.find(c => c.id === viewParams) || chats[0];

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* Header */}
      <div className="bg-[#f7faf7] border-b border-[#e0e3e0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigateToView('profile', 'chats')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <div>
            <h3 className="text-[14px] font-black text-[#181c1b]">{thread.brand}</h3>
            <p className="text-[10px] text-[#6e7975]">Ref: {thread.bookingRef}</p>
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ minHeight: '320px' }}>
        {thread.messages.map((msg, idx) => {
          if (msg.sender === 'system-offer') {
            return (
              <div key={idx} className="flex justify-center my-2">
                <div className="bg-[#ffab00]/10 border border-[#ffab00]/20 rounded-xl p-3.5 text-center max-w-xs space-y-2 shadow-sm">
                  <span className="material-symbols-outlined text-[#ffab00] text-[28px]">description</span>
                  <p className="text-[12px] font-black text-[#5d4000]">Counter Offer Received</p>
                  <p className="text-[13px] font-extrabold text-[#5d4000]">PKR {msg.price}</p>
                  <p className="text-[10px] text-[#5d4000]/80">Rent display shelf for 4 days</p>
                  <div className="flex gap-2 pt-1.5">
                    <button 
                      onClick={() => {
                        setRequests(requests.map(r => r.id === 1 ? { ...r, price: msg.price, status: 'Accepted' } : r));
                        const updatedMsg = { ...msg, status: 'Accepted' };
                        setChats(chats.map(c => c.id === thread.id ? { ...c, messages: c.messages.map((m, i) => i === idx ? updatedMsg : m) } : c));
                      }}
                      className="flex-1 bg-[#00875a] text-white text-[11px] font-bold py-1.5 rounded-lg active:scale-95 transition-all"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => {
                        const updatedMsg = { ...msg, status: 'Rejected' };
                        setChats(chats.map(c => c.id === thread.id ? { ...c, messages: c.messages.map((m, i) => i === idx ? updatedMsg : m) } : c));
                      }}
                      className="flex-1 bg-white border border-[#bec9c4] text-[#ba1a1a] text-[11px] font-bold py-1.5 rounded-lg active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          const isShopkeeper = msg.sender === 'shopkeeper';
          return (
            <div key={idx} className={`flex ${isShopkeeper ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-xl p-3.5 text-xs shadow-sm ${
                isShopkeeper 
                  ? 'bg-[#005344] text-white rounded-tr-none' 
                  : 'bg-[#f1f4f1] text-[#3e4945] border border-[#e0e3e0] rounded-tl-none'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <span className="text-[9px] opacity-60 mt-1.5 block text-right">{msg.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Counter offer & message input */}
      <div className="bg-[#f7faf7] border-t border-[#bec9c4] p-3 space-y-2">
        <div className="flex gap-2 items-center">
          <span className="text-[11px] font-bold text-[#6e7975]">Send Counter Offer:</span>
          <input 
            type="number" 
            placeholder="PKR"
            className="bg-white border border-[#bec9c4] text-xs font-bold rounded-lg px-2.5 py-1.5 w-20 focus:ring-1 focus:ring-[#005344] outline-none"
            value={counterPrice}
            onChange={(e) => setCounterPrice(e.target.value)}
          />
          <button 
            onClick={() => {
              if (!counterPrice) return;
              const newMsg = { sender: 'system-offer', price: parseInt(counterPrice), status: 'Pending', time: "Just now" };
              setChats(chats.map(c => c.id === thread.id ? { ...c, messages: [...c.messages, newMsg] } : c));
              setCounterPrice('');
            }}
            className="bg-[#005344] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
          >
            Offer
          </button>
        </div>

        <div className="flex gap-2 items-center pt-1">
          <button className="material-symbols-outlined text-[#6e7975] hover:bg-[#ebefec] p-1.5 rounded-full">attach_file</button>
          <input 
            type="text" 
            placeholder="Type message..." 
            className="flex-1 bg-white border border-[#bec9c4] rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-[#005344] outline-none" 
          />
          <button className="bg-[#fe6a34] text-white p-2.5 rounded-xl flex items-center justify-center active:scale-95 shadow-md">
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>

    </div>
  );
}
