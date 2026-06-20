import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopkeeperProvider } from './shopkeeper/dashboard/ShopkeeperContext';
import DashboardShell from './shopkeeper/dashboard/DashboardShell';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Render OTP verification pending state
  if (!isApproved) {
    return (
      <div className="bg-background text-on-background min-h-full flex flex-col font-manrope">
        {/* TopAppBar */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 w-full z-40">
          <div className="flex items-center justify-between px-4 py-3 w-full mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-teal-800 italic">Spacelo</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-[#ba1a1a] font-bold text-[14px]">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Logout
            </button>
          </div>
        </header>

        {/* Pending Card */}
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="w-full bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#ebefec] text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-[#fe6a34]/10 text-[#fe6a34] rounded-full flex items-center justify-center mb-6 animate-pulse">
              <span className="material-symbols-outlined text-[44px]">hourglass_empty</span>
            </div>
            <h2 className="text-[24px] font-extrabold text-[#181c1b] mb-3">Application Pending</h2>
            
            <div className="bg-[#f7faf7] border border-[#e0e3e0] rounded-xl p-4 mb-8 max-w-sm">
              <p className="text-[14px] text-[#3e4945] font-semibold leading-relaxed">
                Your Application Is Pending Admin Approval. Once Approved You Will Enjoy Services and also receive Email On Approval.
              </p>
            </div>

            <button 
              onClick={() => setIsApproved(true)}
              className="w-full bg-[#fe6a34] hover:bg-[#e05620] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-[14px]"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Simulate Admin Approval (Demo App)
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Approved: Render the fully state-managed, modular app
  return (
    <ShopkeeperProvider>
      <DashboardShell handleLogout={handleLogout} />
    </ShopkeeperProvider>
  );
}
