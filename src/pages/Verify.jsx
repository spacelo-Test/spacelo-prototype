import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Verify() {
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="bg-background text-on-background min-h-full flex flex-col font-manrope">
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 w-full z-40">
        <div className="flex items-center justify-between px-4 py-3 w-full mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 transition-colors rounded-full text-teal-700">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-2xl font-black text-teal-800 italic">Spacelo</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full flex justify-center">
          <div className="w-full bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-[#f1f4f1] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[#005344] text-3xl">mail</span>
              </div>
              <h2 className="text-[28px] font-bold text-on-background mb-2">Verify Account</h2>
              <p className="text-[14px] text-[#6e7975]">We sent a code to your email. Enter the 6-digit code below.</p>
            </div>
            
            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-between gap-2">
                <input className="w-10 h-12 text-center text-xl font-bold border-[#e0e3e0] bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#005344] focus:border-[#005344] outline-none" maxLength="1" type="text" />
                <input className="w-10 h-12 text-center text-xl font-bold border-[#e0e3e0] bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#005344] focus:border-[#005344] outline-none" maxLength="1" type="text" />
                <input className="w-10 h-12 text-center text-xl font-bold border-[#e0e3e0] bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#005344] focus:border-[#005344] outline-none" maxLength="1" type="text" />
                <input className="w-10 h-12 text-center text-xl font-bold border-[#e0e3e0] bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#005344] focus:border-[#005344] outline-none" maxLength="1" type="text" />
                <input className="w-10 h-12 text-center text-xl font-bold border-[#e0e3e0] bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#005344] focus:border-[#005344] outline-none" maxLength="1" type="text" />
                <input className="w-10 h-12 text-center text-xl font-bold border-[#e0e3e0] bg-gray-50 rounded-lg focus:ring-2 focus:ring-[#005344] focus:border-[#005344] outline-none" maxLength="1" type="text" />
              </div>

              <div className="space-y-4">
                <button className="w-full bg-[#005344] text-white font-bold py-4 rounded-lg shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
                  Verify Account
                </button>
                <div className="flex flex-col items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#6e7975]">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>OTP valid for <span className="text-[#ab3500] font-bold">04:58</span></span>
                  </div>
                  <div className="text-[14px] text-[#6e7975]">
                    Didn't receive the code? 
                    <button className="text-[#005344] font-bold hover:underline ml-1" type="button">Resend OTP</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
