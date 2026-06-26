import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../../lib/constants';

export default function MallOnboardingStep3() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'Mall Owner');
    setShowModal(true);
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
            <span className="text-[#3e4945] font-semibold text-[12px]">Step 3 of 3</span>
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
          </div>
          <div className="flex justify-between items-center mt-2 px-2">
             <span className="text-[10px] font-bold text-[#005344]">Basic</span>
             <span className="text-[10px] font-bold text-[#005344]">Shop</span>
             <span className="text-[10px] font-bold text-[#005344]">Location</span>
          </div>
        </section>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-[24px] font-bold text-[#005344] mb-1">Location & Media</h2>
            <p className="text-[14px] text-[#3e4945]">Add details and photos for each of your retail branch locations.</p>
          </div>
        </div>

        <form id="mall-onboarding-step3" onSubmit={handleSubmit} className="space-y-6">
          {/* Branch Card */}
          <section className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0] mb-6">
            <div className="space-y-5">
              {/* Location Inputs */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#181c1b]">Branch Address</label>
                <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="e.g. 45-C, 24th Commercial St" type="text" required />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#181c1b]">City</label>
                <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="Karachi" type="text" required />
              </div>
              
              <button type="button" className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#005344] text-[#005344] font-bold rounded-lg hover:bg-[#ebefec] transition-all">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Drop Google Maps Pin
              </button>

              {/* Media Uploads */}
              <div className="pt-2 border-t border-[#e0e3e0] space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[14px] font-semibold text-[#181c1b]">Exterior Photos</label>
                    <span className="text-[10px] font-bold text-[#ab3500]">0/5 uploaded</span>
                  </div>
                  <button type="button" className="w-full h-24 border-2 border-dashed border-[#bec9c4] bg-[#f7faf7] rounded-lg flex flex-col items-center justify-center text-[#6e7975] hover:border-[#005344] hover:text-[#005344] transition-all">
                    <span className="material-symbols-outlined mb-1">add_a_photo</span>
                    <span className="text-[12px] font-bold">Add Photos</span>
                  </button>
                </div>
                
                <div>
                  <label className="text-[14px] font-semibold text-[#181c1b] mb-2 block">Interior Photos</label>
                  <button type="button" className="w-full h-24 border-2 border-dashed border-[#bec9c4] bg-[#f7faf7] rounded-lg flex flex-col items-center justify-center text-[#6e7975] hover:border-[#005344] hover:text-[#005344] transition-all">
                    <span className="material-symbols-outlined mb-1">cloud_upload</span>
                    <span className="text-[12px] font-bold">Upload Interior Views</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </form>
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center text-[#005344] px-4 py-2 border border-[#005344] rounded-lg hover:bg-[#e5e9e6] transition-all">
            <span className="material-symbols-outlined mr-1 text-[20px]">chevron_left</span>
            <span className="text-[14px] font-bold">Back</span>
          </button>
          
          <button type="submit" form="mall-onboarding-step3" className="flex items-center justify-center bg-[#ab3500] text-white rounded-lg px-8 py-3 hover:opacity-90 transition-all shadow-md active:scale-95">
            <span className="text-[14px] font-bold mr-2">Submit</span>
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </button>
        </div>
      </footer>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-[#181c1b]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#ab3500]"></div>
            
            <div className="w-20 h-20 bg-[#fe6a34]/10 text-[#ab3500] rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            
            <h2 className="text-[22px] font-bold text-[#181c1b] mb-2">Profile Created!</h2>
            <p className="text-[14px] text-[#3e4945] mb-6">
              Your profile has been created successfully. Proceed to the dashboard to submit your chain verification documents.
            </p>
            
            <div className="w-full space-y-3">
              <button onClick={() => navigate('/dashboard')} className="w-full bg-[#005344] text-white py-3 rounded-lg text-[14px] font-bold shadow-md hover:bg-[#006d5b] active:scale-95 transition-all">
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
