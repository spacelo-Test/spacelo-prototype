import React from 'react';
import { useShopkeeper } from './ShopkeeperContext';

export default function ProfileTab({ handleLogout }) {
  const {
    currentView,
    setCurrentView,
    reviews,
    setReviews
  } = useShopkeeper();

  // 1. Profile Main Menu
  if (currentView === 'main') {
    return (
      <div className="p-4 space-y-6">
        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex gap-4 items-center">
          <div className="w-16 h-16 rounded-xl bg-[#005344] text-[#96ebd5] flex items-center justify-center font-bold text-[28px] uppercase shrink-0">
            S
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-[18px] font-black text-[#181c1b]">Super Store</h3>
              <span className="material-symbols-outlined text-[#00875a] text-[18px] filled">verified</span>
            </div>
            <p className="text-xs text-[#6e7975] mt-0.5">Rating: 4.8★ • Response Rate: 98%</p>
            <p className="text-[11px] text-[#005344] mt-1 font-bold">Premium Retail Member</p>
          </div>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] divide-y divide-[#ebefec]">
          <div 
            onClick={() => setCurrentView('verification')}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#ebefec] text-xs transition-colors"
          >
            <span className="flex items-center gap-2 font-bold text-[#3e4945]"><span className="material-symbols-outlined text-[20px]">verified</span> Account Verification</span>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </div>

          <div 
            onClick={() => setCurrentView('reviews')}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#ebefec] text-xs transition-colors"
          >
            <span className="flex items-center gap-2 font-bold text-[#3e4945]"><span className="material-symbols-outlined text-[20px]">star</span> Reviews & Ratings</span>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </div>

          <div 
            onClick={() => setCurrentView('settings')}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#ebefec] text-xs transition-colors"
          >
            <span className="flex items-center gap-2 font-bold text-[#3e4945]"><span className="material-symbols-outlined text-[20px]">settings</span> Settings</span>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </div>

          <div 
            onClick={handleLogout}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-red-50 text-xs transition-colors text-[#ba1a1a]"
          >
            <span className="flex items-center gap-2 font-bold"><span className="material-symbols-outlined text-[20px]">logout</span> Log Out</span>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Reviews & Ratings View (Screen 14)
  if (currentView === 'reviews') {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[20px] font-black text-[#005344]">Reviews & Ratings</h2>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-6 text-center space-y-2 flex flex-col items-center">
          <p className="text-[10px] text-[#6e7975] font-bold uppercase tracking-wider">Your Trust Score</p>
          <div className="flex items-center justify-center gap-1.5 text-[#fe6a34]">
            <span className="material-symbols-outlined text-[36px] filled">star</span>
            <span className="text-[32px] font-black">4.8</span>
          </div>
          <p className="text-xs text-[#3e4945]">Based on 14 reviews from verified retail bookings</p>
        </div>

        <div className="space-y-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975] px-1">Brand Feedback</p>
          
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-[#e0e3e0] p-4 rounded-xl space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-xs">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#005344] text-[#96ebd5] flex items-center justify-center font-bold text-xs">
                    {rev.brand[0]}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-[#181c1b]">{rev.brand}</h4>
                    <p className="text-[10px] text-[#6e7975]">{rev.date}</p>
                  </div>
                </div>
                <div className="flex text-[#fe6a34]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx} className={`material-symbols-outlined text-[16px] ${idx < rev.rating ? 'filled' : ''}`}>star</span>
                  ))}
                </div>
              </div>

              <p className="leading-relaxed">{rev.text}</p>

              {rev.reply ? (
                <div className="bg-[#f7faf7] p-3 rounded-lg border border-[#e0e3e0]">
                  <p className="font-extrabold text-[#005344]">Your Reply:</p>
                  <p className="text-[#3e4945] mt-0.5">{rev.reply}</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Reply to this brand..." 
                    id={`reply-${rev.id}`}
                    className="flex-1 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-[#005344]"
                  />
                  <button 
                    onClick={() => {
                      const val = document.getElementById(`reply-${rev.id}`).value;
                      if (!val) return;
                      setReviews(reviews.map(r => r.id === rev.id ? { ...r, reply: val } : r));
                    }}
                    className="bg-[#005344] text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Verification Checklist View (Screen 15)
  if (currentView === 'verification') {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[20px] font-black text-[#005344]">Account Verification</h2>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975] border-b border-[#ebefec] pb-2">Verification Checklist</p>
          
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00875a]">check_circle</span>
              <span>CNIC Front & Back Photo</span>
            </div>
            <span className="text-[#00875a] font-bold uppercase tracking-wider text-[10px]">Verified</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00875a]">check_circle</span>
              <span>Live Face Selfie Verification</span>
            </div>
            <span className="text-[#00875a] font-bold uppercase tracking-wider text-[10px]">Verified</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffab00]">hourglass_empty</span>
              <span>Store Outlet Photos & Address</span>
            </div>
            <span className="text-[#ffab00] font-bold uppercase tracking-wider text-[10px]">Pending Review</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Settings View (Screen 17)
  if (currentView === 'settings') {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[20px] font-black text-[#005344]">Settings</h2>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975] border-b border-[#ebefec] pb-2">Notification Preferences</p>
          
          <div className="flex justify-between items-center text-xs">
            <div>
              <p className="font-black text-[#181c1b]">Push Notifications</p>
              <p className="text-[#6e7975] mt-0.5">New requests & payment updates</p>
            </div>
            <input type="checkbox" defaultChecked className="w-9 h-5 rounded-full text-[#005344] border-gray-300 focus:ring-0 cursor-pointer" />
          </div>

          <div className="flex justify-between items-center text-xs">
            <div>
              <p className="font-black text-[#181c1b]">Email Notifications</p>
              <p className="text-[#6e7975] mt-0.5">Monthly reports & receipts</p>
            </div>
            <input type="checkbox" defaultChecked className="w-9 h-5 rounded-full text-[#005344] border-gray-300 focus:ring-0 cursor-pointer" />
          </div>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975] border-b border-[#ebefec] pb-2">Security</p>
          <button 
            onClick={() => alert("Simulated Change Password workflow triggered")}
            className="w-full text-left text-xs font-black text-[#005344] hover:underline"
          >
            Change Password
          </button>
        </div>
      </div>
    );
  }

  return null;
}
