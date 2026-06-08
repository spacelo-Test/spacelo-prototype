import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
      {/* TopAppBar */}
      <header className="bg-[#f7faf7] sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
        <div className="flex items-center justify-between px-4 h-16 w-full mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/login')} className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full">
              arrow_back
            </button>
            <h1 className="text-[20px] font-bold text-[#005344]">Reset Password</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-10 px-6 w-full max-w-sm mx-auto">
        <div className="w-full">
          
          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h2 className="text-[28px] font-bold text-[#005344] mb-2 leading-tight">Forgot Password?</h2>
                <p className="text-[14px] text-[#3e4945] leading-relaxed">
                  No worries! Enter the email address associated with your account, and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-[#3e4945]" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#005344] text-[20px]">mail</span>
                    <input 
                      className="w-full h-14 pl-12 pr-4 bg-white border border-[#bec9c4] rounded-xl focus:ring-2 focus:ring-[#005344] focus:border-[#005344] transition-all outline-none text-[16px] shadow-sm" 
                      id="email" 
                      placeholder="name@company.com" 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button className="w-full h-14 bg-[#005344] text-white font-bold text-[16px] rounded-xl shadow-[0_4px_12px_rgba(0,83,68,0.25)] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2" type="submit">
                  Send Reset Link
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#005344]/10 text-[#005344] rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
              </div>
              <h2 className="text-[22px] font-bold text-[#181c1b] mb-2">Check your email</h2>
              <p className="text-[14px] text-[#3e4945] mb-6">
                We've sent a password reset link to <span className="font-bold">{email}</span>. Click the link to reset your password.
              </p>
              <button 
                onClick={() => navigate('/login')} 
                className="w-full py-3 bg-[#005344] text-white font-bold rounded-lg shadow-md hover:bg-[#006d5b] active:scale-95 transition-all"
              >
                Back to Login
              </button>
              <p className="text-[12px] text-[#6e7975] mt-6">
                Didn't receive the email? <button className="text-[#005344] font-bold hover:underline" onClick={() => setIsSubmitted(false)}>Click to resend</button>
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
