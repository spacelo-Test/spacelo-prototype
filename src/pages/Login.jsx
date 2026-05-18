import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Retrieve the role they selected during registration
    const role = localStorage.getItem('userRole') || 'Shopkeeper';

    if (role === 'Shopkeeper') {
      navigate('/onboarding/merchant');
    } else if (role === 'Mall Owner') {
      navigate('/onboarding/mall');
    } else if (role === 'Company/Brand') {
      navigate('/onboarding/company');
    } else {
      navigate('/onboarding/merchant'); // fallback
    }
  };

  return (
    <div className="bg-background text-on-background min-h-full flex flex-col items-center justify-center p-4 font-manrope">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full bg-[#ffffff] p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#ebefec]">
          <div className="text-center mb-6">
            <h1 className="text-[32px] text-[#005344] italic font-black">Spacelo</h1>
            <p className="text-[14px] text-[#6e7975]">Space lo, Grow kro</p>
          </div>
          
          <div className="space-y-1 mb-8">
            <h2 className="text-[24px] font-bold text-[#181c1b]">Welcome Back</h2>
            <p className="text-[14px] text-[#6e7975]">Log in to manage your spaces and business growth.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#6e7975]" htmlFor="email">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7975] text-[20px]">mail</span>
                <input className="w-full pl-10 pr-4 py-3 bg-[#f1f4f1] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] focus:border-[#005344] transition-all outline-none" id="email" placeholder="name@company.com" type="email" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-[#6e7975]" htmlFor="password">Password</label>
                <button type="button" className="text-[12px] font-semibold text-[#005344] hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7975] text-[20px]">lock</span>
                <input className="w-full pl-10 pr-10 py-3 bg-[#f1f4f1] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] focus:border-[#005344] transition-all outline-none" id="password" placeholder="••••••••" type="password" />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pb-2">
              <input className="w-4 h-4 rounded border-[#bec9c4] text-[#005344] focus:ring-[#005344]" id="remember" type="checkbox" />
              <label className="text-[12px] font-semibold text-[#6e7975]" htmlFor="remember">Remember me for 30 days</label>
            </div>

            {/* Primary Login Button */}
            <button className="w-full py-3 bg-[#005344] text-white font-bold rounded-lg shadow-md hover:bg-[#006d5b] active:scale-95 transition-all flex items-center justify-center gap-2" type="submit">
              Login
              <span className="material-symbols-outlined text-[20px]">login</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-[#e0e3e0] flex-1"></div>
            <span className="text-[12px] font-semibold text-[#6e7975] px-2">OR</span>
            <div className="h-px bg-[#e0e3e0] flex-1"></div>
          </div>

          <div className="text-center">
            <p className="text-[14px] text-[#6e7975]">
              Don't have an account? <button onClick={() => navigate('/')} className="text-[#005344] font-bold hover:underline">Register</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
