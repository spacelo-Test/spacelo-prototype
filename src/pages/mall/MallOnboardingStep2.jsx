import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../../lib/constants';

export default function MallOnboardingStep2() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [branchName, setBranchName] = useState('');

  const handleNext = () => {
    localStorage.setItem(STORAGE_KEYS.CHAIN_NAME, storeName || 'Imtiaz Supermarket');
    localStorage.setItem(STORAGE_KEYS.BRANCH_AREA, branchName || 'Johar Town Branch');
    navigate('/onboarding/mall/step3');
  };

  return (
    <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
      
      {/* TopAppBar */}
      <header className="bg-[#f7faf7] sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
        <div className="flex items-center justify-between px-4 h-16 w-full mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full">
              arrow_back
            </button>
            <h1 className="text-[20px] font-bold text-[#005344]">Mall Profile</h1>
          </div>
          <div className="flex items-center">
            <span className="text-[#3e4945] font-semibold text-[12px]">Step 2 of 3</span>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-6 pb-24 px-4 w-full mx-auto relative z-10">
        
        {/* Progress Bar Section (Mobile Optimized) */}
        <section className="mb-8 w-full max-w-sm mx-auto">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-[#bec9c4] -z-10"></div>
            
            {/* Step 1: Done */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#005344] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>
            
            {/* Step 2: Active */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#006d5b] text-[#96ebd5] border-2 border-[#005344] flex items-center justify-center shadow-md">
                <span className="font-bold text-[16px]">2</span>
              </div>
            </div>
            
            {/* Step 3: Inactive */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#ebefec] text-[#3e4945] flex items-center justify-center border-2 border-[#bec9c4]">
                <span className="text-[16px]">3</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 px-2">
             <span className="text-[10px] font-bold text-[#005344]">Basic</span>
             <span className="text-[10px] font-bold text-[#005344]">Shop</span>
             <span className="text-[10px] text-[#6e7975]">Location</span>
          </div>
        </section>

        <div className="mb-6">
          <h2 className="text-[24px] font-bold text-[#005344] mb-1">Store Profile</h2>
          <p className="text-[14px] text-[#3e4945]">Complete your business identity to proceed.</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0] space-y-5">
          
          {/* Business / Store Name */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-[#181c1b]">Business / Store Name</label>
            <input 
              className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" 
              placeholder="e.g., Al-Fatah Hypermarket" 
              type="text" 
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          {/* Business Type Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-[#181c1b]">Business Type</label>
            <div className="relative">
              <select className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px] appearance-none cursor-pointer">
                <option value="" disabled>Select retail format</option>
                <option>Supermarket/Hypermarket</option>
                <option>Large Departmental Store</option>
                <option value="Retail Chain" selected>Retail Chain</option>
                <option>Mini Mall/Plaza</option>
                <option>Other Large Format Retail</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-[#6e7975]">expand_more</span>
              </div>
            </div>
          </div>

          {/* Branch Name & Footfall */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#181c1b]">Branch Name</label>
              <input 
                className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" 
                placeholder="e.g. Main Branch" 
                type="text" 
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#181c1b]">Avg Daily Footfall</label>
              <input className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="500+" type="number" />
            </div>
          </div>

          {/* Website/Social Media Link */}
          <div className="space-y-1.5">
            <label className="text-[14px] font-semibold text-[#181c1b]">Website / Social Link</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7975] text-[20px]">link</span>
              <input className="w-full h-12 pl-10 pr-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="https://www.yourbusiness.com" type="text" />
            </div>
          </div>

          {/* KYC Assurance */}
          <div className="p-3 bg-[#8df5e4]/20 border border-[#005249]/10 rounded-lg flex gap-3 items-start">
            <span className="material-symbols-outlined text-[#005249] text-[20px]">verified_user</span>
            <p className="text-[11px] text-[#005048] leading-tight">
              All information is stored securely following local regulatory guidelines. This data helps us verify your chain's legitimacy.
            </p>
          </div>

        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center text-[#005344] px-4 py-2 border border-[#005344] rounded-lg hover:bg-[#e5e9e6] transition-all">
            <span className="material-symbols-outlined mr-1 text-[20px]">chevron_left</span>
            <span className="text-[14px] font-bold">Back</span>
          </button>
          
          <button onClick={handleNext} className="flex items-center justify-center bg-[#ab3500] text-white rounded-lg px-8 py-3 hover:opacity-90 transition-all shadow-md active:scale-95">
            <span className="text-[14px] font-bold mr-1">Next</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </footer>

    </div>
  );
}
