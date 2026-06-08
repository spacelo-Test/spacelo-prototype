import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MerchantOnboardingStep4() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            {/* Step 3: Done */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#005344] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>
            {/* Step 4: Active */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#006d5b] text-[#96ebd5] border-2 border-[#005344] flex items-center justify-center shadow-md">
                <span className="font-bold text-[16px]">4</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 px-2">
             <span className="text-[10px] font-bold text-[#005344]">General</span>
             <span className="text-[10px] font-bold text-[#005344]">Shop</span>
             <span className="text-[10px] font-bold text-[#005344]">Location</span>
             <span className="text-[10px] font-bold text-[#005344]">Verification</span>
          </div>
        </section>

        {/* Instructions Panel */}
        <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0] mb-6">
          <h2 className="text-[20px] font-bold text-[#005344] mb-2">Verification</h2>
          <p className="text-[#3e4945] text-[14px] mb-4 leading-relaxed">
            To ensure a safe ecosystem for the Pakistani retail market, we require business verification documents. High-quality scans or photos are preferred.
          </p>
          <div className="space-y-2">
            <div className="flex gap-2 items-center text-[#005344]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <p className="text-[12px] font-bold">Encrypted and secure storage</p>
            </div>
            <div className="flex gap-2 items-center text-[#005344]">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              <p className="text-[12px] font-bold">Review usually takes 24-48 hours</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <form id="verification-form" onSubmit={handleSubmit} className="space-y-4">
          
          {/* Required: Utility Bill */}
          <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[14px] font-semibold text-[#181c1b] flex items-center gap-1">
                Utility Bill / Rent Agreement <span className="text-[#ba1a1a] font-bold">*</span>
              </label>
              <span className="text-[10px] bg-[#005344]/10 text-[#005344] px-2 py-0.5 rounded font-bold">REQUIRED</span>
            </div>
            <div className="border-2 border-dashed border-[#bec9c4] rounded-lg p-6 flex flex-col items-center justify-center hover:bg-[#ebefec] transition-colors cursor-pointer group bg-[#f7faf7]">
              <span className="material-symbols-outlined text-[32px] text-[#6e7975] mb-2 group-hover:text-[#005344] transition-colors">cloud_upload</span>
              <p className="text-[12px] font-bold text-[#3e4945] text-center">Click to upload or drag and drop</p>
              <p className="text-[10px] text-[#6e7975] mt-1">PDF, PNG, JPG (Max 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Optional: NTN Certificate */}
            <div className="bg-white rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
              <label className="block text-[12px] font-bold text-[#181c1b] mb-3 text-center">NTN Certificate</label>
              <div className="border border-[#bec9c4] rounded-lg p-3 flex flex-col items-center justify-center bg-[#f7faf7] hover:border-[#005344] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[24px] text-[#6e7975] mb-1">upload_file</span>
                <span className="text-[10px] font-bold text-[#3e4945]">Upload File</span>
              </div>
            </div>
            
            {/* Optional: Other registration */}
            <div className="bg-white rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
              <label className="block text-[12px] font-bold text-[#181c1b] mb-3 text-center">Other Business Reg</label>
              <div className="border border-[#bec9c4] rounded-lg p-3 flex flex-col items-center justify-center bg-[#f7faf7] hover:border-[#005344] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[24px] text-[#6e7975] mb-1">add_circle</span>
                <span className="text-[10px] font-bold text-[#3e4945]">Upload More</span>
              </div>
            </div>
          </div>

          {/* Description for other docs */}
          <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <label className="block text-[14px] font-semibold text-[#181c1b] mb-2">Other Registration Description</label>
            <textarea className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[14px] resize-none h-24" placeholder="Describe the additional documents provided..."></textarea>
          </div>
        </form>
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center text-[#3e4945] px-4 py-2 hover:bg-[#ebefec] transition-all rounded-lg">
            <span className="material-symbols-outlined mr-1 text-[20px]">chevron_left</span>
            <span className="text-[14px] font-semibold">Back</span>
          </button>
          
          <button type="submit" form="verification-form" className="flex items-center justify-center bg-[#005344] text-white rounded-lg px-8 py-3 hover:opacity-90 transition-all shadow-md active:scale-95">
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
              Your business documents have been submitted for verification. We will review your application soon.
            </p>
            
            <div className="w-full space-y-3">
              <button onClick={() => navigate('/login')} className="w-full bg-[#005344] text-white py-3 rounded-lg text-[14px] font-bold shadow-md hover:bg-[#006d5b] active:scale-95 transition-all">
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
