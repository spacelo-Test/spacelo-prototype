import React from "react";
import { useNavigate } from "react-router-dom";

export default function MemberOnboardingStep2() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
      {/* TopAppBar */}
      <header className="bg-[#f7faf7] sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
        <div className="flex items-center justify-between px-4 h-16 w-full mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full"
            >
              arrow_back
            </button>
            <h1 className="text-[20px] font-bold text-[#005344]">
              Create Profile
            </h1>
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
                <span className="material-symbols-outlined text-[20px]">
                  check
                </span>
              </div>
            </div>

            {/* Step 2: Active */}
            <div className="flex flex-col items-center bg-[#f7faf7] px-1">
              <div className="w-10 h-10 rounded-full bg-[#006d5b] text-[#96ebd5] border-2 border-[#005344] flex items-center justify-center shadow-md">
                <span className="font-bold text-[16px]">2</span>
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
             <span className="text-[10px] font-bold text-[#005344]">General</span>
             <span className="text-[10px] font-bold text-[#005344]">Shop</span>
             <span className="text-[10px] text-[#6e7975]">Location</span>
          </div>
        </section>

        {/* Form Canvas */}
        <section className="bg-white p-5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#e0e3e0]">
          <div className="mb-6">
            <h2 className="text-[24px] font-bold text-[#005344] mb-1">
              Business Information
            </h2>
            <p className="text-[14px] text-[#3e4945]">
              Tell us about your shop to help us customize your experience.
            </p>
          </div>

          <form className="flex flex-col gap-5">
            {/* Shop Name */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#3e4945]">
                Shop Name
              </label>
              <input
                className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]"
                placeholder="e.g., Al-Madina Superstore"
                type="text"
              />
            </div>

            {/* Business Type */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#3e4945]">
                Business Type
              </label>
              <div className="relative">
                <select className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px] appearance-none cursor-pointer">
                  <option value="" disabled selected>
                    Select shop type...
                  </option>
                  <option value="kirana">Kirana / General Store</option>
                  <option value="minimart">Mini Mart</option>
                  <option value="supermarket">Supermarket</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="clothing">Clothing / Boutique</option>
                  <option value="electronics">Electronics</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="material-symbols-outlined text-[#6e7975]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Size */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#3e4945]">
                Shop Size (Sq Ft)
              </label>
              <input
                className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]"
                placeholder="e.g., 500"
                type="number"
              />
            </div>

            {/* Daily Average Footfall */}
            <div className="space-y-1.5">
              <label className="text-[14px] font-semibold text-[#3e4945]">
                Daily Average Footfall
              </label>
              <div className="relative">
                <select className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px] appearance-none cursor-pointer">
                  <option value="low">Low (Under 50)</option>
                  <option value="medium" selected>
                    Medium (50 - 200)
                  </option>
                  <option value="high">High (200+)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="material-symbols-outlined text-[#6e7975]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">
                  Opening Time
                </label>
                <input
                  className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]"
                  type="time"
                  defaultValue="09:00"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[14px] font-semibold text-[#3e4945]">
                  Closing Time
                </label>
                <input
                  className="w-full h-12 px-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-[16px]"
                  type="time"
                  defaultValue="22:00"
                />
              </div>
            </div>


          </form>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="sticky bottom-0 w-full z-50 bg-[#f7faf7] border-t border-[#bec9c4] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex justify-between items-center px-4 py-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center text-[#3e4945] px-4 py-2 hover:bg-[#ebefec] transition-all rounded-lg"
          >
            <span className="material-symbols-outlined mr-1 text-[20px]">
              chevron_left
            </span>
            <span className="text-[14px] font-semibold">Back</span>
          </button>
          {/* Next Button */}
          <button
            onClick={() => navigate("/onboarding/member/step3")}
            className="flex items-center justify-center bg-[#005344] text-white rounded-lg px-8 py-3 hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <span className="text-[14px] font-bold mr-1">Next</span>
            <span className="material-symbols-outlined text-[20px]">
              chevron_right
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}
