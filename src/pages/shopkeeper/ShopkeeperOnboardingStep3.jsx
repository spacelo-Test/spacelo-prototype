import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShopkeeperOnboardingStep3() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('onboardingCompleted', 'true');
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
            <h1 className="text-[20px] font-bold text-[#005344]">Create Profile</h1>
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
             <span className="text-[10px] font-bold text-[#005344]">General</span>
             <span className="text-[10px] font-bold text-[#005344]">Shop</span>
             <span className="text-[10px] font-bold text-[#005344]">Location</span>
          </div>
        </section>

        <form id="onboarding-step3" onSubmit={handleSubmit} className="space-y-6">
          {/* Location Details Canvas */}
          <section className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-[#005344] mb-1">Location Details</h2>
            </div>

            <div className="space-y-5">
              {/* Complete Address */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">Complete Address</label>
                <textarea className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px] resize-none" placeholder="Enter shop number, building, street..." rows="2" required></textarea>
              </div>

              {/* City and Area */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-[#3e4945]">City</label>
                  <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="Karachi" type="text" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-[#3e4945]">Area</label>
                  <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="DHA Phase 2" type="text" required />
                </div>
              </div>

              {/* Google Maps Pin */}
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">Google Maps Pin</label>
                <button type="button" className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#005344] text-[#005344] font-bold rounded-lg hover:bg-[#ebefec] transition-all">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  Drop Google Maps Pin
                </button>
              </div>
            </div>
          </section>

          {/* Store Media Canvas */}
          <section className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0] space-y-4">
            <h2 className="text-[24px] font-bold text-[#005344] mb-1">Store Media</h2>
            
            {/* Shop Exterior Photos */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[14px] font-semibold text-[#181c1b]">Shop Exterior Photos</label>
                <span className="text-[10px] font-bold text-[#ab3500]">0/2 uploaded</span>
              </div>
              <button type="button" className="w-full h-24 border-2 border-dashed border-[#bec9c4] bg-[#f7faf7] rounded-lg flex flex-col items-center justify-center text-[#6e7975] hover:border-[#005344] hover:text-[#005344] transition-all">
                <span className="material-symbols-outlined mb-1">add_a_photo</span>
                <span className="text-[12px] font-bold">Add Photos</span>
              </button>
            </div>
            
            {/* Shop Interior Photos */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[14px] font-semibold text-[#181c1b]">Shop Interior Photos</label>
                <span className="text-[10px] font-bold text-[#ab3500]">0/3 uploaded</span>
              </div>
              <button type="button" className="w-full h-24 border-2 border-dashed border-[#bec9c4] bg-[#f7faf7] rounded-lg flex flex-col items-center justify-center text-[#6e7975] hover:border-[#005344] hover:text-[#005344] transition-all">
                <span className="material-symbols-outlined mb-1">cloud_upload</span>
                <span className="text-[12px] font-bold">Upload Interior Views</span>
              </button>
            </div>
          </section>
        </form>
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className="flex items-center justify-center text-[#3e4945] px-4 py-2 hover:bg-[#ebefec] transition-all rounded-lg">
            <span className="material-symbols-outlined mr-1 text-[20px]">chevron_left</span>
            <span className="text-[14px] font-semibold">Back</span>
          </button>
          
          {/* Submit Button */}
          <button type="submit" form="onboarding-step3" className="flex items-center justify-center bg-[#005344] text-white rounded-lg px-8 py-3 hover:opacity-90 transition-all shadow-md active:scale-95">
            <span className="text-[14px] font-bold mr-2">Submit</span>
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </button>
        </div>
      </footer>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-[#181c1b]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#005344]"></div>
            
            <div className="w-20 h-20 bg-[#005344]/10 text-[#005344] rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            
            <h2 className="text-[22px] font-bold text-[#181c1b] mb-2">Profile Created!</h2>
            <p className="text-[14px] text-[#3e4945] mb-6">
              Your profile has been created successfully. Your application is pending admin approval.
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
