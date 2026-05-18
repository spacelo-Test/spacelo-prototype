import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MallOnboardingStep4() {
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
            <h1 className="text-[20px] font-bold text-[#005344]">Mall Profile</h1>
          </div>
          <div className="flex items-center">
            <span className="text-[#3e4945] font-semibold text-[12px]">Step 4 of 4</span>
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
             <span className="text-[10px] font-bold text-[#005344]">Basic</span>
             <span className="text-[10px] font-bold text-[#005344]">Shop</span>
             <span className="text-[10px] font-bold text-[#005344]">Location</span>
             <span className="text-[10px] font-bold text-[#005344]">Verify</span>
          </div>
        </section>

        <div className="mb-6">
          <h2 className="text-[24px] font-bold text-[#005344] mb-1">Verification & Compliance</h2>
          <p className="text-[14px] text-[#3e4945]">Please provide the necessary business documentation and signatory details.</p>
        </div>

        <form id="mall-verification-form" onSubmit={handleSubmit} className="space-y-6">
          
          {/* Business Tax Info */}
          <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0] space-y-4">
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#181c1b]">NTN Number</label>
              <input className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="1234567-8" type="text" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#181c1b]">Sales Tax Registration (STRN)</label>
              <input className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="12-34-5678-901-23" type="text" />
            </div>
          </div>

          {/* Company Registration Documents */}
          <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <label className="text-[14px] font-semibold text-[#181c1b] mb-3 block">Company Registration Documents</label>
            <div className="border-2 border-dashed border-[#bec9c4] bg-[#f7faf7] rounded-xl p-6 flex flex-col items-center justify-center hover:border-[#005344] transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-[#81d6c0] rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[#005344] text-[24px]">cloud_upload</span>
              </div>
              <p className="text-[14px] font-bold text-[#005344] text-center mb-1">Upload SECP or Trade License</p>
              <p className="text-[10px] text-[#6e7975] text-center">Drag and drop PDF or JPG files (Max 10MB)</p>
            </div>
          </div>

          {/* Authorized Signatory Information */}
          <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <div className="flex items-center gap-2 mb-4 text-[#005344]">
              <span className="material-symbols-outlined">verified_user</span>
              <h3 className="text-[18px] font-bold">Authorized Signatory</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#181c1b]">Full Name</label>
                <input className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="As per CNIC" type="text" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#181c1b]">CNIC Number</label>
                <input className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="42101-XXXXXXX-X" type="text" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#181c1b]">Designation</label>
                <input className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="e.g. CEO, Director" type="text" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#181c1b]">Contact Number</label>
                <input className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="+92 3XX XXXXXXX" type="tel" />
              </div>
            </div>
          </div>

          {/* Compliance Checkbox */}
          <div className="bg-[#f1f4f1] p-4 rounded-lg flex gap-3 items-start border border-[#e0e3e0]">
            <input className="mt-0.5 w-5 h-5 rounded border-[#bec9c4] text-[#005344] focus:ring-[#005344]" type="checkbox" required />
            <p className="text-[12px] text-[#3e4945] leading-relaxed">
              I hereby declare that the information provided above is true to the best of my knowledge and complies with the retail regulatory framework of Pakistan.
            </p>
          </div>

        </form>
      </main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center text-[#005344] px-4 py-2 border border-[#005344] rounded-lg hover:bg-[#e5e9e6] transition-all">
            <span className="material-symbols-outlined mr-1 text-[20px]">chevron_left</span>
            <span className="text-[14px] font-bold">Back</span>
          </button>
          
          <button type="submit" form="mall-verification-form" className="flex items-center justify-center bg-[#ab3500] text-white rounded-lg px-6 py-3 hover:opacity-90 transition-all shadow-md active:scale-95">
            <span className="text-[14px] font-bold mr-1">Submit Application</span>
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
            
            <h2 className="text-[22px] font-bold text-[#181c1b] mb-2">Awaiting Admin Approval</h2>
            <p className="text-[14px] text-[#3e4945] mb-6">
              Your Mall Owner application has been submitted securely and is pending admin approval. Please click the button below to return to the login page.
            </p>
            
            <div className="w-full space-y-3">
              <button onClick={() => navigate('/login')} className="w-full bg-[#005344] text-white py-3 rounded-lg text-[14px] font-bold shadow-md hover:bg-[#006d5b] active:scale-95 transition-all">
                Return to Login
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
