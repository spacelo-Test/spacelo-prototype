import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompanyOnboardingStep3() {
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
              <div className="w-10 h-10 rounded-full bg-[#006d5b] text-[#96ebd5] border-2 border-[#005344] flex items-center justify-center shadow-md">
                <span className="font-bold text-[16px]">3</span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#ebefec] text-[#3e4945] flex items-center justify-center border-2 border-[#bec9c4]">
                <span className="text-[16px]">4</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 px-2">
             <span className="text-[10px] font-bold text-[#005344]">Contact</span>
             <span className="text-[10px] font-bold text-[#005344]">Brand</span>
             <span className="text-[10px] font-bold text-[#005344]">Location</span>
             <span className="text-[10px] text-[#6e7975]">Verify</span>
          </div>
        </section>

        <div className="mb-6">
          <h2 className="text-[24px] font-bold text-[#005344] mb-1">Company Location</h2>
          <p className="text-[14px] text-[#3e4945]">Please provide the address of your registered head office.</p>
        </div>

        <div className="bg-[#ffffff] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 mb-6 border border-[#e0e3e0]">
          <div className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#3e4945]">Head Office Address</label>
              <textarea className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px] resize-none h-24" placeholder="Building, Street, Area..."></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">City</label>
                <div className="relative">
                  <select className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px] appearance-none cursor-pointer">
                    <option value="" disabled selected>Select...</option>
                    <option value="karachi">Karachi</option>
                    <option value="lahore">Lahore</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="material-symbols-outlined text-[#6e7975]">expand_more</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">Locality</label>
                <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px]" placeholder="e.g. Clifton" type="text" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#3e4945] flex items-center gap-1">
                Google Maps Pin <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative rounded-xl overflow-hidden cursor-pointer border border-[#bec9c4] hover:border-[#005344] transition-all">
                <div className="h-32 w-full bg-[#ebefec] relative">
                  <img className="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyUkcaS7USuftdFrLyUMyE60OtCW8OuAMAovgPeWrgTyTbDy3sxmlkiLxTYYxe4yDobrEji9DDMJYnlE6_-Y1_2NgcMIi7qKBx-iMJ0Ls2NWOPHWKheUgqHtCO-IV3x-FLUt_NqS95CTvsazjIrA6S9z4uYTw_EFNQQrFiAhAhvVgYSJUFEZX6qYcYsfuoCYTRKuAovzc9TcVOneDDSkKDYvJP1iu-Nfu2ZjGYXj99gPuxqeGnzBXtlEmo6C2KsUoeXGFXJTzjnho" alt="Map Placeholder" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <button className="bg-[#005344] text-white px-4 py-2 rounded-lg text-[12px] font-bold flex items-center gap-1 shadow-lg active:scale-95">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      Pin Head Office
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-4 border-t border-[#e0e3e0]">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-[#3e4945]">Alternate / Branch Address</label>
                <span className="text-[10px] bg-[#e0e3e0] text-[#3e4945] px-2 py-0.5 rounded font-bold">OPTIONAL</span>
              </div>
              <textarea className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-lg p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[16px] resize-none h-20" placeholder="Branch or secondary office address..."></textarea>
            </div>

          </div>
        </div>

      </main>

      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center text-[#3e4945] px-4 py-2 hover:bg-[#ebefec] transition-all rounded-lg">
            <span className="material-symbols-outlined mr-1 text-[20px]">chevron_left</span>
            <span className="text-[14px] font-semibold">Back</span>
          </button>
          
          <button onClick={() => navigate('/onboarding/company/step4')} className="flex items-center justify-center bg-[#005344] text-white rounded-lg px-8 py-3 hover:opacity-90 transition-all shadow-md active:scale-95">
            <span className="text-[14px] font-bold mr-1">Next</span>
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </footer>

    </div>
  );
}
