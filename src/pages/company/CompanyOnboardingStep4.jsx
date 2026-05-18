import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompanyOnboardingStep4() {
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
            <h1 className="text-[20px] font-bold text-[#005344]">Company Profile</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-6 pb-24 px-4 w-full mx-auto relative z-10">
        
        {/* Progress Bar Section */}
        <section className="mb-8 w-full max-w-sm mx-auto">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-[#bec9c4] -z-10"></div>
            
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#005344] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#005344] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#005344] text-white flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#006d5b] text-[#96ebd5] border-2 border-[#005344] flex items-center justify-center shadow-md">
                <span className="font-bold text-[16px]">4</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 px-2">
             <span className="text-[10px] font-bold text-[#005344]">Contact</span>
             <span className="text-[10px] font-bold text-[#005344]">Brand</span>
             <span className="text-[10px] font-bold text-[#005344]">Location</span>
             <span className="text-[10px] font-bold text-[#005344]">Verify</span>
          </div>
        </section>

        <div className="mb-6">
          <h2 className="text-[24px] font-bold text-[#005344] mb-1">Verification</h2>
          <p className="text-[14px] text-[#3e4945]">Provide legal documentation for marketplace verification.</p>
        </div>

        <form id="company-verify-form" onSubmit={handleSubmit} className="space-y-4">
          
          <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#181c1b] flex items-center gap-1">NTN Number <span className="text-[#ba1a1a]">*</span></label>
                <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="1234567-8" type="text" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#181c1b] flex items-center gap-1">Sales Tax Reg. (STRN) <span className="text-[#ba1a1a]">*</span></label>
                <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="12-34-5678-901-23" type="text" required />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0] space-y-4">
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[14px] font-semibold text-[#181c1b]">SECP Certificate</label>
                <span className="text-[10px] bg-[#005344]/10 text-[#005344] px-2 py-0.5 rounded font-bold">REQUIRED</span>
              </div>
              <div className="border-2 border-dashed border-[#bec9c4] rounded-lg p-4 flex items-center gap-3 hover:bg-[#ebefec] transition-colors cursor-pointer group bg-[#f7faf7]">
                <div className="w-10 h-10 rounded-full bg-[#81d6c0] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#005344]">description</span>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#005344]">Upload Certificate</p>
                  <p className="text-[10px] text-[#6e7975]">PDF, PNG, JPG (Max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[14px] font-semibold text-[#181c1b]">NTN Certificate</label>
                <span className="text-[10px] bg-[#005344]/10 text-[#005344] px-2 py-0.5 rounded font-bold">REQUIRED</span>
              </div>
              <div className="border-2 border-dashed border-[#bec9c4] rounded-lg p-4 flex items-center gap-3 hover:bg-[#ebefec] transition-colors cursor-pointer group bg-[#f7faf7]">
                <div className="w-10 h-10 rounded-full bg-[#81d6c0] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#005344]">receipt_long</span>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#005344]">Upload NTN</p>
                  <p className="text-[10px] text-[#6e7975]">PDF, PNG, JPG (Max 5MB)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="border border-[#bec9c4] rounded-lg p-3 flex flex-col items-center justify-center bg-[#f7faf7] hover:border-[#005344] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[20px] text-[#6e7975] mb-1">badge</span>
                <span className="text-[10px] font-bold text-[#3e4945] text-center">Signatory Letter<br/>(Optional)</span>
              </div>
              <div className="border border-[#bec9c4] rounded-lg p-3 flex flex-col items-center justify-center bg-[#f7faf7] hover:border-[#005344] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[20px] text-[#6e7975] mb-1">auto_stories</span>
                <span className="text-[10px] font-bold text-[#3e4945] text-center">Brand Catalog<br/>(Optional)</span>
              </div>
            </div>
            
          </div>
        </form>
      </main>

      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center text-[#3e4945] px-4 py-2 hover:bg-[#ebefec] transition-all rounded-lg">
            <span className="material-symbols-outlined mr-1 text-[20px]">chevron_left</span>
            <span className="text-[14px] font-semibold">Back</span>
          </button>
          
          <button type="submit" form="company-verify-form" className="flex items-center justify-center bg-[#005344] text-white rounded-lg px-8 py-3 hover:opacity-90 transition-all shadow-md active:scale-95">
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
            
            <h2 className="text-[22px] font-bold text-[#181c1b] mb-2">Awaiting Admin Approval</h2>
            <p className="text-[14px] text-[#3e4945] mb-6">
              Your Company/Brand application has been submitted securely and is pending admin approval. Please click the button below to return to the login page.
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
