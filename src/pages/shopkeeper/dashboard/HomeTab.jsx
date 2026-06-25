import React from 'react';
import { useShopkeeper } from './ShopkeeperContext';

export default function HomeTab() {
  const {
    spaces,
    listings,
    requests,
    advanceRequests,
    disputes,
    navigateToView,
  } = useShopkeeper();

  const getStatusBadge = (status) => {
    const maps = {
      'Pending':   'bg-[#ffab00]/10 text-[#ab6b00] border border-[#ffab00]/20',
      'Accepted':  'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Completed': 'bg-[#3e4945]/10 text-[#3e4945] border border-[#3e4945]/20',
      'Countered': 'bg-[#0052cc]/10 text-[#0052cc] border border-[#0052cc]/20',
      'Rejected':  'bg-[#de350b]/10 text-[#de350b] border border-[#de350b]/20',
    };
    return maps[status] || 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  // ── KPI derivations ────────────────────────────────────────────────────────
  const activeBookings  = requests.filter(r => r.status === 'Accepted').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length
                        + advanceRequests.filter(r => r.status === 'Pending').length;
  const liveListings    = listings.filter(l => l.status === 'Live').length;

  // ── Action-needed items ────────────────────────────────────────────────────
  const pendingReqs     = requests.filter(r => r.status === 'Pending');
  const contractsToSign = requests.filter(r => r.status === 'Accepted' && !r.contractSignedByShopkeeper);
  const proofsToUpload  = requests.filter(
    r => r.status === 'Accepted' && r.contractSignedByShopkeeper && r.proofs && r.proofs.length === 0
  );
  const openDisputes    = disputes.filter(d => d.status === 'Open');
  const pendingAdvance  = advanceRequests.filter(r => r.status === 'Pending');

  const actions = [];
  if (pendingReqs.length > 0)
    actions.push({
      label:   `${pendingReqs.length} request${pendingReqs.length > 1 ? 's' : ''} pending`,
      icon:    'inbox',
      color:   'text-[#ab6b00]',
      bg:      'bg-[#ffab00]/8',
      onClick: () => navigateToView('requests', 'main'),
    });
  if (contractsToSign.length > 0)
    actions.push({
      label:   `${contractsToSign.length} contract${contractsToSign.length > 1 ? 's' : ''} to sign`,
      icon:    'draw',
      color:   'text-[#005344]',
      bg:      'bg-[#005344]/5',
      onClick: () => navigateToView('requests', 'booking-detail', contractsToSign[0].id),
    });
  if (proofsToUpload.length > 0)
    actions.push({
      label:   `${proofsToUpload.length} proof${proofsToUpload.length > 1 ? 's' : ''} to upload`,
      icon:    'cloud_upload',
      color:   'text-[#005344]',
      bg:      'bg-[#005344]/5',
      onClick: () => navigateToView('requests', 'booking-detail', proofsToUpload[0].id),
    });
  if (openDisputes.length > 0)
    actions.push({
      label:   `${openDisputes.length} dispute${openDisputes.length > 1 ? 's' : ''} open`,
      icon:    'report_problem',
      color:   'text-[#ba1a1a]',
      bg:      'bg-[#ba1a1a]/5',
      onClick: () => navigateToView('disputes', 'main'),
    });
  if (pendingAdvance.length > 0)
    actions.push({
      label:   `${pendingAdvance.length} advance request${pendingAdvance.length > 1 ? 's' : ''}`,
      icon:    'schedule',
      color:   'text-[#6f42c1]',
      bg:      'bg-[#6f42c1]/5',
      onClick: () => navigateToView('requests', 'advance'),
    });

  // ── Upcoming bookings ──────────────────────────────────────────────────────
  const upcomingBookings = requests.filter(
    r => r.status === 'Accepted' || r.status === 'Pending'
  );

  // ── KPI cards config ───────────────────────────────────────────────────────
  const kpiCards = [
    {
      label:       'This Month',
      value:       'PKR 114,750',
      valueClass:  'text-[#005344]',
      icon:        'payments',
      iconClass:   'text-[#005344]',
    },
    {
      label:        'Pending Payout',
      value:        'PKR 21,250',
      valueClass:   'text-[#fe6a34]',
      icon:         'account_balance_wallet',
      iconClass:    'text-[#fe6a34]',
      accentBorder: true,
    },
    {
      label:      'Active Bookings',
      value:      String(activeBookings),
      valueClass: 'text-[#005344]',
      icon:       'event_available',
      iconClass:  'text-[#005344]',
    },
    {
      label:      'Pending Requests',
      value:      String(pendingRequests),
      valueClass: pendingRequests > 0 ? 'text-[#de350b]' : 'text-[#3e4945]',
      icon:       'inbox',
      iconClass:  pendingRequests > 0 ? 'text-[#de350b]' : 'text-[#6e7975]',
    },
    {
      label:      'Live Listings',
      value:      String(liveListings),
      valueClass: 'text-[#005344]',
      icon:       'sell',
      iconClass:  'text-[#005344]',
    },
    {
      label:      'Trust Score',
      value:      '4.8 \u2605',
      valueClass: 'text-[#fe6a34]',
      icon:       'star',
      iconClass:  'text-[#fe6a34]',
    },
  ];

  return (
    <div className="p-4 space-y-5 pb-6">

      {/* ── Greeting ────────────────────────────────────────────────────────── */}
      <div className="pt-1">
        <p className="text-[12px] font-bold text-[#6e7975] uppercase tracking-widest">Welcome back,</p>
        <h1 className="text-[26px] font-black text-[#005344] leading-tight mt-0.5">Super Store</h1>
      </div>

      {/* ── KPI scrollable row ──────────────────────────────────────────────── */}
      <div className="-mx-4 px-4">
        <div
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {kpiCards.map((card, i) => (
            <div
              key={i}
              className={`shrink-0 min-w-[130px] bg-white border border-[#e0e3e0] rounded-2xl p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-2${
                card.accentBorder ? ' border-l-4 border-l-[#fe6a34]' : ''
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${card.iconClass}`}>
                {card.icon}
              </span>
              <p className={`text-[16px] font-black leading-tight ${card.valueClass}`}>
                {card.value}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#6e7975] leading-tight">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action-Needed Strip ─────────────────────────────────────────────── */}
      {actions.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-[#6e7975] px-0.5">
            Action Needed
          </h2>
          <div className="space-y-2">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`w-full flex items-center gap-3 ${action.bg} border border-[#e0e3e0] rounded-xl px-4 py-3 hover:opacity-90 active:scale-[0.98] transition-all`}
              >
                <span className={`material-symbols-outlined text-[22px] shrink-0 ${action.color}`}>
                  {action.icon}
                </span>
                <span className={`flex-1 text-left text-[13px] font-extrabold ${action.color}`}>
                  {action.label}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#6e7975]">
                  chevron_right
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Upcoming Bookings ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-0.5">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-[#6e7975]">
            Upcoming Bookings
          </h2>
          <button
            onClick={() => navigateToView('requests', 'main')}
            className="text-[11px] font-bold text-[#005344] hover:underline"
          >
            View All
          </button>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="bg-white border border-[#e0e3e0] rounded-xl py-8 flex flex-col items-center gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <span className="material-symbols-outlined text-[36px] text-gray-300">event_available</span>
            <p className="text-[12px] text-[#6e7975] font-medium">No upcoming bookings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((req) => {
              const space = spaces.find(s => s.id === req.spaceId);
              return (
                <div
                  key={req.id}
                  onClick={() => navigateToView('requests', 'booking-detail', req.id)}
                  className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex gap-3 items-start cursor-pointer hover:border-[#005344] active:scale-[0.99] transition-all"
                >
                  {/* Brand logo badge */}
                  <div
                    className={`w-11 h-11 ${req.logoBg} rounded-xl flex items-center justify-center text-white font-black text-[18px] shrink-0 shadow-sm`}
                  >
                    {req.logo}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <p className="text-[14px] font-black text-[#181c1b] leading-snug truncate">
                        {req.brand}
                      </p>
                      <span
                        className={`shrink-0 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          getStatusBadge(req.status)
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6e7975] mt-0.5 truncate">
                      {space ? space.nickname : 'Retail Space'}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      <span className="material-symbols-outlined text-[11px] text-[#6e7975]">calendar_today</span>
                      <p className="text-[11px] text-[#6e7975]">{req.requestedDates}</p>
                    </div>
                    <p className="text-[13px] font-black text-[#005344] mt-1.5">
                      PKR {req.pricePerMonth.toLocaleString()}
                      <span className="text-[10px] font-normal text-[#6e7975]">/mo</span>
                    </p>
                  </div>

                  <span className="material-symbols-outlined text-[18px] text-[#bec9c4] self-center shrink-0">
                    chevron_right
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Quick Action Buttons ────────────────────────────────────────────── */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={() => navigateToView('inventory', 'add-space')}
          className="w-full bg-[#005344] text-white font-bold py-3.5 rounded-xl hover:bg-[#003c31] active:scale-[0.98] transition-all text-[13px] flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add_box</span>
          + Add Space to Inventory
        </button>
        <button
          onClick={() => navigateToView('listings', 'create-listing')}
          className="w-full bg-white border border-[#bec9c4] text-[#005344] font-bold py-3.5 rounded-xl hover:bg-[#ebefec] active:scale-[0.98] transition-all text-[13px] flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">sell</span>
          Create Listing
        </button>
      </div>

    </div>
  );
}
