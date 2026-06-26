import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import AdminOverview from './screens/AdminOverview';
import PendingApprovalsScreen from './screens/PendingApprovalsScreen';
import DisputesScreen from './screens/DisputesScreen';
import UsersScreen from './screens/UsersScreen';
import ChainsScreen from './screens/ChainsScreen';
import BookingsScreen from './screens/BookingsScreen';

// ─── Nav Items Config ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: 'overview',  label: 'Overview',           icon: 'home' },
  { key: 'approvals', label: 'Pending Approvals',   icon: 'hourglass_empty', badgeKey: 'pendingApprovals' },
  { key: 'disputes',  label: 'Disputes',            icon: 'warning',         badgeKey: 'openDisputes' },
  { key: 'users',     label: 'Users',               icon: 'group' },
  { key: 'chains',    label: 'Chains',              icon: 'store' },
  { key: 'bookings',  label: 'Bookings',            icon: 'receipt_long' },
];

const PAGE_TITLES = {
  overview:  'Overview',
  approvals: 'Pending Approvals',
  disputes:  'Disputes',
  users:     'Users',
  chains:    'Chains',
  bookings:  'Bookings',
};

// ─── Screen Renderer ──────────────────────────────────────────────────────────

function ActiveScreen({ tab }) {
  switch (tab) {
    case 'overview':  return <AdminOverview />;
    case 'approvals': return <PendingApprovalsScreen />;
    case 'disputes':  return <DisputesScreen />;
    case 'users':     return <UsersScreen />;
    case 'chains':    return <ChainsScreen />;
    case 'bookings':  return <BookingsScreen />;
    default:          return <AdminOverview />;
  }
}

// ─── AdminShell ───────────────────────────────────────────────────────────────

export default function AdminShell({ handleLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { adminStats } = useAdmin();

  const getBadgeCount = (badgeKey) => {
    if (!badgeKey) return 0;
    return adminStats[badgeKey] || 0;
  };

  return (
    <div className="flex min-h-screen font-manrope bg-[#f7faf7]">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-64 min-h-screen bg-[#005344] flex flex-col fixed top-0 left-0 z-40 shadow-xl">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <span className="text-[22px] font-black italic text-white tracking-tight leading-none">
            Spacelo
          </span>
          <span className="bg-[#fe6a34] text-white text-[10px] font-black rounded-full px-2 py-0.5 leading-tight">
            Admin
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ key, label, icon, badgeKey }) => {
            const isActive = activeTab === key;
            const count = getBadgeCount(badgeKey);

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold
                  transition-all duration-150 relative
                  ${isActive
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#fe6a34] rounded-r-full" />
                )}

                {/* Icon */}
                <span
                  className="material-symbols-outlined text-[20px] shrink-0"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>

                {/* Label */}
                <span className="flex-1 text-left truncate">{label}</span>

                {/* Badge */}
                {count > 0 && (
                  <span className="bg-[#fe6a34] text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shrink-0">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer — Logout */}
        <div className="px-3 pb-5 border-t border-white/10 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen bg-[#f7faf7]">

        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#e0e3e0] flex items-center justify-between px-6 shadow-sm">
          {/* Page Title */}
          <h2 className="text-[18px] font-black text-[#181c1b] tracking-tight">
            {PAGE_TITLES[activeTab] || 'Admin Panel'}
          </h2>

          {/* Right: Admin Identity */}
          <div className="flex items-center gap-3">
            {/* Settings button */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6e7975] hover:text-[#005344] hover:bg-[#f7faf7] transition-all">
              <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-[#e0e3e0]" />

            {/* Avatar + Name */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#005344] text-white flex items-center justify-center text-[13px] font-black">
                AD
              </div>
              <span className="text-[14px] font-bold text-[#181c1b]">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <ActiveScreen tab={activeTab} />
        </main>
      </div>
    </div>
  );
}
