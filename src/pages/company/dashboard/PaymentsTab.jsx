import React, { useState } from 'react';
import { useCompany } from './CompanyContext';

export default function PaymentsTab() {
  const { requests, spaces } = useCompany();
  const [filter, setFilter] = useState('All');

  // Filter requests that are active or completed/cancelled to show financials
  const financialRequests = requests.filter(r => 
    r.status === 'Active' || r.status === 'Completed' || r.status === 'Accepted'
  );

  // Escrow balance total
  const totalEscrow = requests
    .filter(r => r.status === 'Active')
    .reduce((sum, r) => sum + (r.offeredPrice - r.pricePerMonth), 0);

  // Spent total (mock base spend + active booking prices)
  const spentThisMonth = requests
    .filter(r => r.status === 'Active')
    .reduce((sum, r) => sum + r.pricePerMonth, 0) + 120000;

  const totalSpentAllTime = spentThisMonth + 345000; // Mock all-time spend

  const getSpaceInfo = (spaceId) => {
    return spaces.find(s => s.id === spaceId) || {
      nickname: `Space #${spaceId}`,
      shop: "Retail Outlet",
      area: "Unknown Area"
    };
  };

  const getFilteredTransactions = () => {
    return financialRequests.filter(tr => {
      if (filter === 'All') return true;
      if (filter === 'In Escrow') return tr.status === 'Active';
      if (filter === 'Released') return tr.status === 'Active' && tr.timelineStep >= 6;
      if (filter === 'Refunded') return tr.cancelled === true;
      return true;
    });
  };

  const handleDownloadInvoice = (id) => {
    alert(`Downloading receipt invoice for Booking #${id}...`);
  };

  return (
    <div className="p-4 space-y-6 overflow-y-auto pb-24 h-full font-manrope">
      
      {/* Header */}
      <div>
        <h2 className="text-[18px] font-black text-[#005344] tracking-tight">Payments Dashboard</h2>
        <p className="text-[11px] text-[#6e7975] mt-0.5">Track upfront deposits, escrow holds, and invoices.</p>
      </div>

      {/* Spend Summaries Grid */}
      <section className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-white border border-[#e0e3e0] p-3.5 rounded-xl shadow-sm space-y-1 col-span-2">
          <p className="font-bold text-[#6e7975] uppercase text-[9px] tracking-wider">Total in escrow</p>
          <div className="flex justify-between items-end">
            <span className="font-black text-[#005344] text-[20px]">PKR {totalEscrow.toLocaleString()}</span>
            <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded uppercase">Escrow Locked</span>
          </div>
        </div>

        <div className="bg-white border border-[#e0e3e0] p-3 rounded-xl shadow-sm space-y-1">
          <p className="font-bold text-[#6e7975] uppercase text-[9px]">Spend (This Month)</p>
          <p className="font-black text-[#181c1b] text-[15px]">PKR {spentThisMonth.toLocaleString()}</p>
        </div>

        <div className="bg-white border border-[#e0e3e0] p-3 rounded-xl shadow-sm space-y-1">
          <p className="font-bold text-[#6e7975] uppercase text-[9px]">Spent (All Time)</p>
          <p className="font-black text-[#181c1b] text-[15px]">PKR {totalSpentAllTime.toLocaleString()}</p>
        </div>
      </section>

      {/* Filter Quick Chips Row */}
      <section className="space-y-3.5">
        <div className="flex justify-between items-center text-xs px-1">
          <h3 className="text-[11px] font-black uppercase text-[#6e7975] tracking-wider">Transaction Records</h3>
          <div className="flex gap-2 overflow-x-auto text-[9px] font-black max-w-[200px] scrollbar-none">
            {["All", "In Escrow", "Released", "Refunded"].map((chip) => (
              <button
                key={chip}
                onClick={() => setFilter(chip)}
                className={`px-2 py-1 rounded border shrink-0 ${filter === chip ? 'bg-[#005344] border-[#005344] text-white' : 'bg-[#ebefec] border-transparent text-[#3e4945]'}`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        {getFilteredTransactions().length === 0 ? (
          <div className="bg-white border border-[#e0e3e0] rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[#bec9c4] text-[36px] mb-1">receipt</span>
            <p className="text-xs font-bold text-[#6e7975]">No transaction records found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {getFilteredTransactions().map((t) => {
              const space = getSpaceInfo(t.spaceId);
              return (
                <div 
                  key={t.id}
                  className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm text-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-[#181c1b]">{space.shop}</h4>
                      <p className="text-[10px] text-[#6e7975] mt-0.5">{space.nickname}</p>
                    </div>
                    <button 
                      onClick={() => handleDownloadInvoice(t.id)}
                      className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full text-[18px]"
                    >
                      download
                    </button>
                  </div>

                  {/* Releases tracker */}
                  <div className="bg-[#f7faf7] p-2.5 rounded-lg border border-[#e0e3e0] space-y-1.5 text-[10px] font-semibold text-[#3e4945]">
                    <div className="flex justify-between items-center">
                      <span>Total Value:</span>
                      <strong className="text-[#181c1b] font-black">PKR {t.offeredPrice.toLocaleString()}</strong>
                    </div>
                    {t.cancelled ? (
                      <div className="flex justify-between items-center text-[#ba1a1a]">
                        <span>Refunded Cancel Amount:</span>
                        <strong className="font-black">PKR {(t.offeredPrice - t.pricePerMonth).toLocaleString()}</strong>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center text-[#00875a]">
                          <span>Released (Month 1):</span>
                          <strong className="font-black">PKR {t.pricePerMonth.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between items-center text-blue-700">
                          <span>Escrow Locked (Month 2 & 3):</span>
                          <strong className="font-black">PKR {(t.offeredPrice - t.pricePerMonth).toLocaleString()}</strong>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-[#ebefec] text-[10px] font-bold">
                    <span className="text-[#6e7975] uppercase">{t.durationLabel}</span>
                    <span className={`px-1.5 py-0.5 rounded uppercase ${t.cancelled ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                      {t.cancelled ? 'Refunded' : 'Paid'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Refunds History Section */}
      <section className="space-y-2.5 pt-2 border-t border-[#ebefec]">
        <h3 className="text-[11px] font-black uppercase text-[#6e7975] tracking-wider px-1">Refund Activity</h3>
        <div className="bg-[#f7faf7] p-3.5 border border-[#e0e3e0] rounded-xl text-xs flex gap-2.5 items-start">
          <span className="material-symbols-outlined text-[#00875a] text-[18px]">info</span>
          <p className="text-[10px] text-[#6e7975] leading-relaxed font-semibold">
            All refunds are dispatched immediately to your default card method. Bank accounts take 2–3 business days to settle refunds.
          </p>
        </div>
      </section>

    </div>
  );
}
