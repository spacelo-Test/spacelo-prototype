import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Shopkeeper');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userRole', role);
    localStorage.setItem('fullName', name);
    localStorage.setItem('userEmail', email);
    navigate('/verify');
  };

  return (
    <div className="bg-background text-on-background min-h-full flex flex-col font-manrope">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 w-full z-40">
        <div className="flex items-center justify-between px-4 py-3 w-full mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-teal-800 italic">Spacelo</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full flex items-center justify-center">
          {/* Registration Form Card */}
          <div className="w-full bg-[#ffffff] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#ebefec]">
              <div className="text-center lg:text-left mb-8">
                <h1 className="text-[36px] font-bold text-[#005344] mb-2">Create Your Account</h1>
                <p className="text-[16px] text-[#6e7975]">Join the premium network for retail spaces.</p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-semibold text-[#005344] uppercase tracking-wider" htmlFor="full_name">Full Name</label>
                  <div className="relative">
                    <input className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#e0e3e0] rounded-lg focus:ring-2 focus:ring-[#005344]/20 focus:border-[#005344] outline-none transition-all text-[16px]" id="full_name" placeholder="Enter your full name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-semibold text-[#005344] uppercase tracking-wider" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <input 
                      className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#e0e3e0] rounded-lg focus:ring-2 focus:ring-[#005344]/20 focus:border-[#005344] outline-none transition-all text-[16px]" 
                      id="email" 
                      placeholder="example@spacelo.pk" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Group */}
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-[#005344] uppercase tracking-wider" htmlFor="password">Password</label>
                    <input className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#e0e3e0] rounded-lg focus:ring-2 focus:ring-[#005344]/20 focus:border-[#005344] outline-none transition-all text-[16px]" id="password" placeholder="••••••••" type="password" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-semibold text-[#005344] uppercase tracking-wider" htmlFor="confirm_password">Confirm Password</label>
                    <input className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#e0e3e0] rounded-lg focus:ring-2 focus:ring-[#005344]/20 focus:border-[#005344] outline-none transition-all text-[16px]" id="confirm_password" placeholder="••••••••" type="password" />
                  </div>
                </div>

                {/* Role Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-semibold text-[#005344] uppercase tracking-wider" htmlFor="role">Role</label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 bg-[#F3F4F6] border border-[#e0e3e0] rounded-lg focus:ring-2 focus:ring-[#005344]/20 focus:border-[#005344] outline-none transition-all text-[16px] appearance-none cursor-pointer" 
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Shopkeeper">Shopkeeper</option>
                      <option value="Mall Owner">Mall Owner</option>
                      <option value="Company/Brand">Company/Brand</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="material-symbols-outlined text-[#005344]">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button className="mt-4 w-full bg-[#005344] text-white font-bold py-4 rounded-lg shadow-md hover:bg-[#006d5b] active:scale-[0.98] transition-all duration-150" type="submit">
                  Create Account
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-[16px] text-[#6e7975]">
                  Already have an account? <Link className="text-[#005344] font-bold hover:underline" to="/login">Log in</Link>
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-6 border-t border-[#ebefec] flex justify-center gap-6 opacity-60">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span className="text-[12px] font-semibold uppercase tracking-widest">Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span className="text-[12px] font-semibold uppercase tracking-widest">Private</span>
                </div>
              </div>

            </div>
          </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
        <div className="flex flex-col items-center gap-3 w-full px-4 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <a className="text-xs font-medium text-gray-400 hover:text-teal-700 transition-colors" href="#">Terms of Service</a>
            <a className="text-xs font-medium text-gray-400 hover:text-teal-700 transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs font-medium text-gray-400 hover:text-teal-700 transition-colors" href="#">Contact Support</a>
          </div>
          <p className="text-xs font-medium text-gray-500">© 2024 Spacelo. Space lo, Grow kro.</p>
        </div>
      </footer>
    </div>
  );
}
