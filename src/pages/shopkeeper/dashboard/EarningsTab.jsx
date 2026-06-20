import React from 'react';
import { useShopkeeper } from './ShopkeeperContext';

export default function EarningsTab() {
  const {
    currentView,
    setCurrentView,
    payoutMethods,
    setPayoutMethods,
    pushNotification
  } = useShopkeeper();

  const getStatusBadge = (status) => {
    const maps = {
      'Released': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'In Process': 'bg-[#ffab00]/10 text-[#ab6b00] border border-[#ffab00]/20',
      'Failed': 'bg-[#de350b]/10 text-[#de350b] border border-[#de350b]/20'
    };
    return maps[status] || 'bg-gray-100 text-gray-800';
  };

  // 1. Earnings Main Dashboard (Screen 12)
  if (currentView === 'main') {
    return (
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-[22px] font-black text-[#005344]">Earnings & Payments</h2>
          <button 
            onClick={() => setCurrentView('payout-settings')}
            className="text-xs font-bold text-[#005344] hover:underline flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">credit_card</span> Payouts
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-center">
            <p className="text-[10px] text-[#6e7975] font-bold uppercase tracking-wider">All-Time Earnings</p>
            <p className="text-[20px] font-black text-[#005344] mt-1">PKR 23,500</p>
          </div>
          <div className="bg-[#fe6a34]/10 border border-[#fe6a34]/20 rounded-xl p-4 text-center">
            <p className="text-[10px] text-[#fe6a34] font-bold uppercase tracking-wider">Pending Payout</p>
            <p className="text-[20px] font-black text-[#fe6a34] mt-1">PKR 9,000</p>
          </div>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <div>
              <p className="font-extrabold text-[#181c1b]">Withdraw to mobile wallet</p>
              <p className="text-[#6e7975] mt-0.5 font-medium">Default: JazzCash</p>
            </div>
            <span className="bg-[#00875a]/10 text-[#00875a] text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
          </div>
          <button 
            onClick={() => {
              pushNotification("payment", "Withdrawal processing", `Withdrawal request of 9,000 PKR is processing to your JazzCash mobile wallet.`, { tab: "earnings" });
              alert("Withdrawal request has been submitted successfully!");
            }}
            className="w-full bg-[#fe6a34] text-white py-3 rounded-xl font-bold hover:bg-[#e05620] active:scale-95 transition-all text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            Withdraw PKR 9,000
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975] px-1">Transactions history</h3>
          <div className="bg-white border border-[#e0e3e0] rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="divide-y divide-[#ebefec]">
              <div className="p-3.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-black text-[#181c1b]">Tapal Tea (Rent)</p>
                  <p className="text-[#6e7975] mt-0.5">June 16, 2026 • Platform Fee deducted</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#00875a]">+ PKR 8,100</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getStatusBadge('Released')}`}>RELEASED</span>
                </div>
              </div>
              <div className="p-3.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-black text-[#181c1b]">Nestle (Rent)</p>
                  <p className="text-[#6e7975] mt-0.5">June 20, 2026 • Holding in Escrow</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-[#ffab00]">+ PKR 9,000</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getStatusBadge('In Process')}`}>IN PROCESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Withdrawal / Payout Settings (Screen 13)
  if (currentView === 'payout-settings') {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[20px] font-black text-[#005344]">Payout Details</h2>
        </div>

        <div className="space-y-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975] px-1">Active Payout Methods</p>
          {payoutMethods.map((method) => (
            <div key={method.id} className="bg-white border border-[#e0e3e0] p-4 rounded-xl flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-[#005344] text-[32px]">credit_card</span>
                <div>
                  <p className="font-black text-[#181c1b] text-xs">{method.title}</p>
                  <p className="text-[11px] text-[#6e7975] mt-0.5">{method.account}</p>
                </div>
              </div>
              {method.isDefault ? (
                <span className="bg-[#00875a]/10 text-[#00875a] text-[9px] font-bold px-2.5 py-1 rounded-full">DEFAULT</span>
              ) : (
                <button 
                  onClick={() => setPayoutMethods(payoutMethods.map(p => p.id === method.id ? { ...p, isDefault: true } : { ...p, isDefault: false }))}
                  className="text-xs font-bold text-[#005344] hover:underline"
                >
                  Set Default
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] font-extrabold text-[#181c1b] border-b border-[#ebefec] pb-2">Add New Payout Wallet</p>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6e7975]">Wallet Type</label>
            <select className="w-full bg-[#F3F4F6] border border-[#bec9c4] h-[44px] px-3 rounded-xl text-[12px] font-bold">
              <option>JazzCash Mobile Wallet</option>
              <option>EasyPaisa Wallet</option>
              <option>Habib Bank Account</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6e7975]">Mobile Wallet Number</label>
            <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-xl p-3 text-xs" placeholder="e.g. 03001234567" type="tel" />
          </div>

          <button 
            type="button" 
            onClick={() => alert("Simulated payout method added!")}
            className="w-full bg-[#005344] text-white py-3 rounded-xl font-bold text-xs shadow-md"
          >
            Link Account
          </button>
        </div>
      </div>
    );
  }

  return null;
}
