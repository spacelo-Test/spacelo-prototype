import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MerchantOnboardingStep3() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
      
      {/* TopAppBar */}
      <header className="bg-[#f7faf7] sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
        <div className="flex items-center justify-between px-4 h-16 w-full mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full">
              arrow_back
            </button>
            <h1 className="text-[20px] font-bold text-[#005344]">Create Profile</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-6 pb-24 px-4 w-full mx-auto relative z-10">
        {/* Progress Bar Section (Mobile Optimized) */}
        <section className="mb-8 w-full max-w-sm mx-auto">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-[#bec9c4] -z-10"></div>
            
            {/* Step 1: Done */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#005344] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>
            
            {/* Step 2: Done */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#005344] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>
            
            {/* Step 3: Active */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#006d5b] text-[#96ebd5] border-2 border-[#005344] flex items-center justify-center shadow-md">
                <span className="font-bold text-[16px]">3</span>
              </div>
            </div>
            
            {/* Step 4: Inactive */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#ebefec] text-[#3e4945] flex items-center justify-center border-2 border-[#bec9c4]">
                <span className="text-[16px]">4</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 px-2">
             <span className="text-[10px] font-bold text-[#005344]">Basic</span>
             <span className="text-[10px] font-bold text-[#005344]">Shop</span>
             <span className="text-[10px] font-bold text-[#005344]">Media</span>
             <span className="text-[10px] text-[#6e7975]">Verify</span>
          </div>
        </section>

        <div className="space-y-6">
          {/* Location Details Canvas */}
          <section className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#005344] mb-1">Location Details</h2>
            </div>

            <div className="space-y-5">
              {/* Complete Address */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">Complete Address</label>
                <textarea className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px] resize-none" placeholder="Enter shop number, building, street and area..." rows="3"></textarea>
              </div>

              {/* Google Maps Pin */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">Google Maps Pin</label>
                <div className="relative rounded-xl overflow-hidden cursor-pointer border border-[#bec9c4] hover:border-[#005344] transition-all">
                  <div className="h-32 w-full bg-[#ebefec] relative">
                    <img className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyUkcaS7USuftdFrLyUMyE60OtCW8OuAMAovgPeWrgTyTbDy3sxmlkiLxTYYxe4yDobrEji9DDMJYnlE6_-Y1_2NgcMIi7qKBx-iMJ0Ls2NWOPHWKheUgqHtCO-IV3x-FLUt_NqS95CTvsazjIrA6S9z4uYTw_EFNQQrFiAhAhvVgYSJUFEZX6qYcYsfuoCYTRKuAovzc9TcVOneDDSkKDYvJP1iu-Nfu2ZjGYXj99gPuxqeGnzBXtlEmo6C2KsUoeXGFXJTzjnho" alt="Map Placeholder" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <button className="bg-[#005344] text-white px-4 py-2 rounded-lg text-[12px] font-bold flex items-center gap-1 shadow-lg active:scale-95">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        Pin Location
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Store Media Canvas */}
          <section className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <h2 className="text-[24px] font-bold text-[#005344] mb-4">Store Media</h2>
            
            {/* Shop Exterior */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[14px] font-semibold text-[#3e4945]">Shop Exterior Photos</label>
                <span className="text-[12px] font-bold text-[#ab3500]">0/2 minimum</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="aspect-square rounded-xl border-2 border-dashed border-[#bec9c4] flex flex-col items-center justify-center text-[#6e7975] hover:border-[#005344] hover:text-[#005344] bg-[#f7faf7] transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[24px] mb-1">add_a_photo</span>
                  <span className="text-[12px] font-bold">Upload</span>
                </button>
                <div className="aspect-square bg-[#e5e9e6] rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Shop Interior */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-[14px] font-semibold text-[#3e4945]">Shop Interior Photos</label>
                <span className="text-[12px] font-bold text-[#ab3500]">0/3 minimum</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="aspect-square rounded-xl border-2 border-dashed border-[#bec9c4] flex flex-col items-center justify-center text-[#6e7975] hover:border-[#005344] hover:text-[#005344] bg-[#f7faf7] transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[24px] mb-1">add_a_photo</span>
                  <span className="text-[12px] font-bold">Upload</span>
                </button>
                <div className="aspect-square bg-[#e5e9e6] rounded-xl animate-pulse"></div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className="flex items-center justify-center text-[#3e4945] px-4 py-2 hover:bg-[#ebefec] transition-all rounded-lg">
            <span className="material-symbols-outlined mr-1 text-[20px]">chevron_left</span>
            <span className="text-[14px] font-semibold">Back</span>
          </button>
          {/* Next Button */}
          <button onClick={() => navigate('/onboarding/merchant/step4')} className="flex items-center justify-center bg-[#005344] text-white rounded-lg px-8 py-3 hover:opacity-90 transition-all shadow-md active:scale-95">
            <span className="text-[14px] font-bold mr-1">Next</span>
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
