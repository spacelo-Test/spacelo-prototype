import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MallOnboardingStep1() {
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
            <h1 className="text-[20px] font-bold text-[#005344]">Mall Profile</h1>
          </div>
          <div className="flex items-center">
            <span className="text-[#3e4945] font-semibold text-[12px]">Step 1 of 3</span>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-6 pb-24 px-4 w-full mx-auto relative z-10">
        
        {/* Progress Bar Section (Mobile Optimized) */}
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
             <span className="text-[10px] font-bold text-[#005344]">Basic</span>
             <span className="text-[10px] text-[#6e7975]">Shop</span>
             <span className="text-[10px] text-[#6e7975]">Location</span>
          </div>
        </section>

        <div className="mb-6">
          <h2 className="text-[24px] font-bold text-[#005344] mb-1">Personal Information</h2>
          <p className="text-[14px] text-[#3e4945]">Verify your identity to start listing your mall spaces on Spacelo.</p>
        </div>

        <form className="space-y-6">
          
          <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0] space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#3e4945]">Full Name</label>
              <input className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="As shown on CNIC" type="text" />
            </div>


          </div>

          {/* CNIC Upload Section */}
          <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <div className="mb-4">
              <h3 className="text-[18px] font-bold text-[#181c1b] mb-0.5">Identity Documents</h3>
              <p className="text-[12px] font-bold text-[#ab3500]">Ensure your CNIC is clearly visible</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">CNIC Front Photo</label>
                <div className="relative group h-32 rounded-lg border-2 border-dashed border-[#bec9c4] bg-[#f1f4f1] flex flex-col items-center justify-center cursor-pointer hover:bg-[#e5e9e6] transition-colors overflow-hidden">
                  <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
                  <span className="material-symbols-outlined text-[#005344] text-[32px] mb-1">add_a_photo</span>
                  <span className="text-[12px] font-semibold text-[#3e4945]">Upload Front</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">CNIC Back Photo</label>
                <div className="relative group h-32 rounded-lg border-2 border-dashed border-[#bec9c4] bg-[#f1f4f1] flex flex-col items-center justify-center cursor-pointer hover:bg-[#e5e9e6] transition-colors overflow-hidden">
                  <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
                  <span className="material-symbols-outlined text-[#005344] text-[32px] mb-1">add_a_photo</span>
                  <span className="text-[12px] font-semibold text-[#3e4945]">Upload Back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Face Verification */}
          <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <div className="mb-4">
              <h3 className="text-[18px] font-bold text-[#181c1b] mb-0.5">Live Face Verification</h3>
              <p className="text-[12px] font-bold text-[#ab3500]">Position your face within the frame</p>
            </div>
            
            <div className="relative overflow-hidden bg-[#e5e9e6] rounded-xl h-48 flex flex-col items-center justify-center border border-[#bec9c4]">
              <div className="z-10 flex flex-col items-center text-center px-4 w-full">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3 shadow-md">
                  <span className="material-symbols-outlined text-[#005344] text-[28px]">photo_camera</span>
                </div>
                <button type="button" className="w-full bg-[#ab3500] text-white font-bold text-[14px] py-3 rounded-lg shadow-md hover:bg-[#fe6a34] transition-all active:scale-95">
                  Take a Live Photo
                </button>
              </div>
              {/* Guidelines Overlay */}
              <div className="absolute inset-0 border-[20px] border-[#f7faf7]/80 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-32 border-2 border-[#005344] border-dashed rounded-[100px]"></div>
              </div>
            </div>
          </div>

        </form>
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          <button className="flex items-center justify-center text-[#6e7975] px-4 py-2 border border-[#bec9c4] rounded-lg cursor-not-allowed opacity-50">
            <span className="material-symbols-outlined mr-1 text-[20px]">chevron_left</span>
            <span className="text-[14px] font-semibold">Back</span>
          </button>
          
          <button onClick={() => navigate('/onboarding/mall/step2')} className="flex items-center justify-center bg-[#ab3500] text-white rounded-lg px-8 py-3 hover:opacity-90 transition-all shadow-md active:scale-95">
            <span className="text-[14px] font-bold mr-1">Next</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </footer>

    </div>
  );
}
