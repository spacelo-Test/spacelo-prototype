import React, { useState } from 'react';
import { useCompany } from './CompanyContext';

export default function HomeTab() {
  const { navigateToView, requests } = useCompany();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [isApproved, setIsApproved] = useState(localStorage.getItem('companyApproved') === 'true');

  // Filter lists for counts
  const activeBookings = requests.filter(r => r.status === 'Active');
  const pendingRequests = requests.filter(r => r.status === 'Pending' || r.status === 'Countered');
  const pendingProofs = requests.filter(r => r.status === 'Active' && r.proofs.length === 0);
  const openDisputes = requests.filter(r => r.status === 'Disputed');
  
  // Action needed checks
  const contractsToSign = requests.filter(r => r.status === 'Accepted' && !r.contractSignedByBrand);
  const countersToReview = requests.filter(r => r.status === 'Countered');
  const proofsToVerify = requests.filter(r => r.status === 'Active' && r.proofs.length > 0);
  
  // Spend calculation (mocked)
  const totalSpend = activeBookings.reduce((sum, r) => sum + r.offeredPrice, 0) + 120000; // base mock spend

  const handleDismissBanner = () => {
    setBannerDismissed(true);
  };

  const handleSimulateApproval = () => {
    localStorage.setItem('companyApproved', 'true');
    setIsApproved(true);
    alert('Admin approved company profile successfully!');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Greeting Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-bold text-[#6e7975] uppercase tracking-wider">Company Dashboard</span>
          <h1 className="text-[22px] font-black text-[#181c1b] tracking-tight">Nestlé Pakistan</h1>
        </div>
        <div className="flex gap-2">
          {!isApproved && (
            <button 
              onClick={handleSimulateApproval}
              className="bg-[#fe6a34] hover:bg-[#e05620] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[12px]">security</span>
              Approve Profile
            </button>
          )}
        </div>
      </div>

      {/* Verification Pending Banner */}
      {!isApproved && !bannerDismissed && (
        <div className="bg-[#fcf3e8] border border-[#f3d9b8] p-4 rounded-xl relative flex gap-3 items-start shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#fe6a34]/20 text-[#fe6a34] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <div className="pr-6">
            <h4 className="text-xs font-bold text-[#b25000]">Verification Pending</h4>
            <p className="text-[11px] text-[#803c02] mt-0.5 leading-relaxed font-semibold">
              Your account is pending verification. Upload your business documents in Profile Settings to start booking spaces.
            </p>
          </div>
          <button 
            onClick={handleDismissBanner}
            className="absolute top-3 right-3 text-[#b25000] hover:bg-[#fe6a34]/10 rounded-full p-0.5 material-symbols-outlined text-[16px]"
          >
            close
          </button>
        </div>
      )}

      {/* KPI Cards Horizontal Scroll */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-black uppercase text-[#6e7975] tracking-wider px-1">Campaign Overview</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
          <div className="snap-start min-w-[130px] bg-white border border-[#e0e3e0] rounded-xl p-3 shadow-sm flex flex-col justify-between h-[80px]">
            <span className="text-[10px] font-bold text-[#6e7975] uppercase">Active Bookings</span>
            <span className="text-[20px] font-black text-[#005344]">{activeBookings.length}</span>
          </div>
          <div className="snap-start min-w-[130px] bg-white border border-[#e0e3e0] rounded-xl p-3 shadow-sm flex flex-col justify-between h-[80px] border-l-4 border-l-[#fe6a34]">
            <span className="text-[10px] font-bold text-[#6e7975] uppercase">Pending Requests</span>
            <span className="text-[20px] font-black text-[#fe6a34]">{pendingRequests.length}</span>
          </div>
          <div className="snap-start min-w-[140px] bg-white border border-[#e0e3e0] rounded-xl p-3 shadow-sm flex flex-col justify-between h-[80px]">
            <span className="text-[10px] font-bold text-[#6e7975] uppercase">Spend (This Month)</span>
            <span className="text-[18px] font-black text-[#005344]">PKR {totalSpend.toLocaleString()}</span>
          </div>
          <div className="snap-start min-w-[130px] bg-white border border-[#e0e3e0] rounded-xl p-3 shadow-sm flex flex-col justify-between h-[80px]">
            <span className="text-[10px] font-bold text-[#6e7975] uppercase">Booked (Month)</span>
            <span className="text-[20px] font-black text-[#005344]">{activeBookings.length + 1} spaces</span>
          </div>
          <div className="snap-start min-w-[140px] bg-white border border-[#e0e3e0] rounded-xl p-3 shadow-sm flex flex-col justify-between h-[80px]">
            <span className="text-[10px] font-bold text-[#6e7975] uppercase">Pending Proofs</span>
            <span className="text-[20px] font-black text-[#ab3500]">{pendingProofs.length}</span>
          </div>
          <div className="snap-start min-w-[130px] bg-white border border-[#e0e3e0] rounded-xl p-3 shadow-sm flex flex-col justify-between h-[80px]">
            <span className="text-[10px] font-bold text-[#6e7975] uppercase">Open Disputes</span>
            <span className="text-[20px] font-black text-red-600">{openDisputes.length}</span>
          </div>
        </div>
      </section>

      {/* Action-Needed Alert Strip */}
      {(contractsToSign.length > 0 || countersToReview.length > 0 || proofsToVerify.length > 0 || openDisputes.length > 0) && (
        <section className="space-y-2">
          <h3 className="text-[11px] font-black uppercase text-[#6e7975] tracking-wider px-1">Attention Required</h3>
          <div className="space-y-2">
            {contractsToSign.map(r => (
              <div 
                key={r.id}
                onClick={() => navigateToView('bookings', 'booking-detail', r.id)}
                className="bg-white border border-[#e0e3e0] p-3 rounded-xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-[#ebefec] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#fe6a34] text-[20px]">draw</span>
                  <span className="text-xs font-bold text-[#3e4945]">Contract awaiting your signature ({r.productName})</span>
                </div>
                <span className="material-symbols-outlined text-[#005344] text-[18px]">chevron_right</span>
              </div>
            ))}

            {countersToReview.map(r => (
              <div 
                key={r.id}
                onClick={() => navigateToView('requests', 'detail', r.id)}
                className="bg-white border border-[#e0e3e0] p-3 rounded-xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-[#ebefec] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#005344] text-[20px]">swap_horiz</span>
                  <span className="text-xs font-bold text-[#3e4945]">Counter-offer to review for {r.productName}</span>
                </div>
                <span className="material-symbols-outlined text-[#005344] text-[18px]">chevron_right</span>
              </div>
            ))}

            {proofsToVerify.map(r => (
              <div 
                key={r.id}
                onClick={() => navigateToView('bookings', 'booking-detail', r.id)}
                className="bg-white border border-[#e0e3e0] p-3 rounded-xl flex items-center justify-between shadow-sm cursor-pointer hover:bg-[#ebefec] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#0d9488] text-[20px]">photo_camera</span>
                  <span className="text-xs font-bold text-[#3e4945]">Proof uploaded & ready to view ({r.productName})</span>
                </div>
                <span className="material-symbols-outlined text-[#005344] text-[18px]">chevron_right</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Bookings Summary List */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[11px] font-black uppercase text-[#6e7975] tracking-wider">Active Campaigns</h3>
          <button onClick={() => navigateToView('bookings')} className="text-[11px] font-bold text-[#005344] hover:underline">View All</button>
        </div>

        {activeBookings.length === 0 ? (
          <div className="bg-white border border-[#e0e3e0] rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[#6e7975] text-[40px] mb-2">bookmark_border</span>
            <p className="text-xs font-bold text-[#6e7975]">No active campaigns currently.</p>
            <button 
              onClick={() => navigateToView('browse')} 
              className="mt-3 bg-[#005344] text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              Browse Spaces
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBookings.map(b => (
              <div 
                key={b.id}
                onClick={() => navigateToView('bookings', 'booking-detail', b.id)}
                className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-[#181c1b]">{b.productName}</h4>
                    <p className="text-[10px] text-[#6e7975] mt-0.5">Space ID: #{b.spaceId}</p>
                  </div>
                  <span className="text-[10px] bg-[#ebfbf3] text-[#00875a] px-2 py-0.5 rounded font-bold uppercase">
                    Active
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-[#ebefec] flex items-center justify-between text-[11px]">
                  <span className="text-[#3e4945] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {b.durationLabel}
                  </span>
                  <span className="text-[#005344] font-black">
                    PKR {b.pricePerMonth.toLocaleString()}/mo
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sticky-feel Quick Actions */}
      <div className="pt-2">
        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-md space-y-2.5">
          <button 
            onClick={() => navigateToView('browse')}
            className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            Browse & Book Spaces
          </button>
          <button 
            onClick={() => navigateToView('requests')}
            className="w-full border-2 border-[#005344] text-[#005344] hover:bg-[#ebefec] font-bold py-2.5 rounded-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">inbox</span>
            View Outgoing Requests
          </button>
        </div>
      </div>
    </div>
  );
}
