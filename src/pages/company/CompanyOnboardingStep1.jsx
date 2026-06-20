import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompanyOnboardingStep1() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
      
      {/* TopAppBar */}
      <header className="bg-[#f7faf7] sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
        <div className="flex items-center px-4 h-16 w-full mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full">
              arrow_back
            </button>
            <h1 className="text-[20px] font-bold text-[#005344]">Company Profile</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-6 pb-24 px-4 w-full mx-auto relative z-10">
        
        {/* Progress Bar Section */}
        <section className="mb-8 w-full max-w-sm mx-auto">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-[#bec9c4] -z-10"></div>
            
            {/* Step 1: Active */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#006d5b] text-[#96ebd5] border-2 border-[#005344] flex items-center justify-center shadow-md">
                <span className="font-bold text-[16px]">1</span>
              </div>
            </div>
            {/* Step 2: Inactive */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#ebefec] text-[#3e4945] flex items-center justify-center border-2 border-[#bec9c4]">
                <span className="text-[16px]">2</span>
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
             <span className="text-[10px] font-bold text-[#005344]">Representative</span>
             <span className="text-[10px] text-[#6e7975]">Brand</span>
             <span className="text-[10px] text-[#6e7975]">Location</span>
          </div>
        </section>

        <div className="mb-6">
          <h2 className="text-[24px] font-bold text-[#005344] mb-1">Representative Details</h2>
          <p className="text-[14px] text-[#3e4945]">Tell us about yourself to establish your brand presence on Spacelo.</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#ffffff] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 mb-6 border border-[#e0e3e0]">
          <div className="space-y-6">
            
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#3e4945]">Full Name</label>
              <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] focus:border-[#005344] transition-all text-[16px] outline-none" placeholder="Enter your full name" type="text" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#3e4945]">Mobile Number</label>
              <input className="w-full bg-[#e5e9e6] border border-[#bec9c4] rounded-lg p-3 text-[14px] text-[#6e7975] outline-none cursor-not-allowed" value="+92 300 1234567" disabled type="text" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <label className="text-[14px] font-semibold text-[#3e4945]">CNIC Number</label>
                <span className="text-[10px] bg-[#e0e3e0] text-[#3e4945] px-2 py-0.5 rounded font-bold">OPTIONAL</span>
              </div>
              <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] focus:border-[#005344] transition-all text-[16px] outline-none" placeholder="12345-1234567-1" type="text" />
            </div>

            {/* Selfie Upload */}
            <div className="space-y-2 pt-2 border-t border-[#e0e3e0]">
              <label className="text-[14px] font-semibold text-[#3e4945]">Live Selfie Verification</label>
              <div className="flex flex-col gap-4 p-4 bg-[#006d5b]/10 border border-[#006d5b]/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#006d5b] flex items-center justify-center text-[#96ebd5] shrink-0">
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>face</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-[#005344] mb-0.5">Take a Live Photo</p>
                    <p className="text-[11px] text-[#3e4945] leading-tight">Position your face within the frame in a well-lit area.</p>
                  </div>
                </div>
                <button className="w-full bg-[#005344] text-white px-4 py-2.5 rounded-lg text-[14px] font-semibold hover:opacity-90 active:scale-95 transition-all">
                  Open Camera
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Helping Text */}
        <div className="flex items-start gap-2 px-1 opacity-70 mb-4">
          <span className="material-symbols-outlined text-[#3e4945] text-[18px]">verified_user</span>
          <p className="text-[12px] text-[#3e4945]">Your data is encrypted and stored securely.</p>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="sticky bottom-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <button className="flex flex-col items-center justify-center text-[#6e7975] px-4 py-1 opacity-30 cursor-not-allowed">
          <span className="material-symbols-outlined">chevron_left</span>
          <span className="text-[12px] font-semibold">Back</span>
        </button>

        <button onClick={() => navigate('/onboarding/company/step2')} className="flex items-center justify-center gap-1 bg-[#fe6a34] text-[#5d1900] rounded-lg px-8 py-3 hover:bg-[#ffdbd0] transition-all active:scale-95 shadow-md font-bold">
          <span className="text-[14px]">Next</span>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </nav>

    </div>
  );
}
