import React from 'react';
import { useShopkeeper } from './ShopkeeperContext';

export default function HomeTab() {
  const { 
    listings, 
    requests, 
    navigateToView 
  } = useShopkeeper();

  const getStatusBadge = (status) => {
    const maps = {
      'Active': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Live': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Pending': 'bg-[#ffab00]/10 text-[#ab6b00] border border-[#ffab00]/20',
      'In Process': 'bg-[#0052cc]/10 text-[#0052cc] border border-[#0052cc]/20',
      'Completed': 'bg-[#3e4945]/10 text-[#3e4945] border border-[#3e4945]/20',
      'Released': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Failed': 'bg-[#de350b]/10 text-[#de350b] border border-[#de350b]/20',
      'Disputed': 'bg-[#de350b]/10 text-[#de350b] border border-[#de350b]/20',
      'Cancelled': 'bg-[#6c757d]/10 text-[#6c757d] border border-[#6c757d]/20',
      'Accepted': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Rejected': 'bg-[#de350b]/10 text-[#de350b] border border-[#de350b]/20'
    };
    return maps[status] || 'bg-gray-100 text-gray-800';
  };

  const pendingSignature = requests.find(r => r.id === 1 && !r.contractSignedByShopkeeper);

  return (
    <div className="p-4 space-y-6">
      
      {/* KPI Summary Card */}
      <div className="relative bg-[#005344] rounded-2xl p-5 shadow-[0_8px_24px_rgba(0,83,68,0.25)] text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/5 rounded-full"></div>
        <div className="absolute right-0 top-12 w-20 h-20 bg-white/5 rounded-full"></div>

        {/* Hero: earnings + trust score */}
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[11px] text-white/70 font-bold uppercase tracking-wider">Earnings This Month</p>
            <p className="text-[28px] font-black mt-1 leading-none">PKR 14,500</p>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#9df3dc] mt-2">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +32% vs last month
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full shrink-0">
            <span className="material-symbols-outlined text-[16px] text-[#ffd166] filled" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-[13px] font-black">4.8</span>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="relative grid grid-cols-3 gap-2 mt-5">
          <div className="bg-white/10 rounded-xl p-3">
            <span className="material-symbols-outlined text-[18px] text-[#fe6a34]">account_balance_wallet</span>
            <p className="text-[15px] font-black mt-1.5 leading-none">9,000</p>
            <p className="text-[9px] text-white/70 font-bold uppercase tracking-wide mt-1">Pending Payout</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="material-symbols-outlined text-[18px] text-[#9df3dc]">event_available</span>
            <p className="text-[15px] font-black mt-1.5 leading-none">
              {requests.filter(r => r.status === 'Accepted').length}
            </p>
            <p className="text-[9px] text-white/70 font-bold uppercase tracking-wide mt-1">Active Bookings</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="material-symbols-outlined text-[18px] text-[#9df3dc]">storefront</span>
            <p className="text-[15px] font-black mt-1.5 leading-none">
              {listings.filter(l => l.status === 'Live' || l.status === 'Active').length}
            </p>
            <p className="text-[9px] text-white/70 font-bold uppercase tracking-wide mt-1">Live Listings</p>
          </div>
        </div>
      </div>

      {/* Action Needed Strip */}
      {pendingSignature && (
        <div className="space-y-2">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975] px-1">Action Needed</h3>
          <div className="bg-[#fe6a34]/10 border border-[#fe6a34]/20 rounded-xl p-3 flex gap-3 items-center">
            <span className="material-symbols-outlined text-[#fe6a34] text-[28px] shrink-0">warning</span>
            <div className="flex-1">
              <p className="text-[13px] font-extrabold text-[#5d1900]">Signature Pending</p>
              <p className="text-[11px] text-[#5d1900]/80">Unilever booking requires your signature to begin.</p>
            </div>
            <button 
              onClick={() => navigateToView('bookings', 'detail', pendingSignature.id)}
              className="bg-[#fe6a34] text-white text-[12px] font-bold py-1.5 px-3 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              Sign
            </button>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* SVG Earnings Trend Mini-chart */}
        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div>
            <h4 className="text-[12px] font-bold text-[#6e7975]">Earnings Trend</h4>
            <p className="text-[14px] font-extrabold text-[#005344] mt-0.5">Jun vs May</p>
          </div>
          <div className="h-16 mt-3 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00875a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00875a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,35 Q25,10 50,25 T100,5 L100,40 L0,40 Z" fill="url(#chartGradient)" />
              <path d="M0,35 Q25,10 50,25 T100,5" fill="none" stroke="#00875a" strokeWidth="2.5" />
              <circle cx="100" cy="5" r="3" fill="#fe6a34" />
            </svg>
          </div>
          <span className="text-[10px] text-[#00875a] font-bold mt-2 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[10px]">trending_up</span> +32% increase
          </span>
        </div>

        {/* SVG Booking Status Donut Chart */}
        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div>
            <h4 className="text-[12px] font-bold text-[#6e7975]">Booking Status</h4>
            <p className="text-[14px] font-extrabold text-[#3e4945] mt-0.5">Total: {requests.length} bookings</p>
          </div>
          <div className="flex items-center justify-center h-16 mt-3">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ebefec" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#00875a" strokeWidth="3" 
                strokeDasharray="33 100" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3e4945" strokeWidth="3" 
                strokeDasharray="33 100" strokeDashoffset="-33" />
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ffab00" strokeWidth="3" 
                strokeDasharray="34 100" strokeDashoffset="-66" />
            </svg>
          </div>
          <div className="flex gap-2 justify-center mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffab00]" title="Pending"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00875a]" title="Accepted"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3e4945]" title="Completed"></span>
          </div>
        </div>
      </div>

      {/* Recent Activity / Upcoming Bookings list */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975]">Recent Activity</h3>
          <button 
            onClick={() => navigateToView('bookings', 'inbox')} 
            className="text-[12px] font-bold text-[#005344] hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {requests.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigateToView('bookings', 'detail', item.id)}
              className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex justify-between items-start cursor-pointer hover:border-[#005344] transition-all"
            >
              <div className="flex gap-3">
                <div className={`w-10 h-10 ${item.logoBg} rounded-xl flex items-center justify-center text-white font-extrabold text-[18px]`}>
                  {item.logo}
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-[#181c1b]">{item.brand}</h4>
                  <p className="text-[11px] text-[#6e7975] mt-0.5">
                    {listings.find(l => l.id === item.spaceId)?.title || "Retail Space"}
                  </p>
                  <p className="text-[11px] text-[#6e7975] mt-1 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                    {item.dates}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
                <p className="text-[14px] font-black text-[#005344]">PKR {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-2">
        <button
          onClick={() => navigateToView('bookings', 'detail', 2)}
          className="w-full bg-white border border-[#bec9c4] text-[#005344] font-bold py-3.5 rounded-xl hover:bg-[#ebefec] active:scale-[0.98] transition-all text-[13px] flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
          Upload Proof Photo
        </button>
      </div>

    </div>
  );
}
