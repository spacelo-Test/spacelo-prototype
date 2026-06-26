import React from 'react';
import { useAdmin } from '../AdminContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function roleColor(role) {
  switch (role) {
    case 'Shopkeeper': return '#005344';
    case 'Mall Owner':  return '#fe6a34';
    case 'Company':
    case 'Company/Brand': return '#00875a';
    default:            return '#6e7975';
  }
}

function RoleBadge({ role }) {
  const colors = {
    Shopkeeper: 'bg-[#005344]/10 text-[#005344]',
    'Mall Owner': 'bg-[#fe6a34]/10 text-[#fe6a34]',
    Company: 'bg-[#00875a]/10 text-[#00875a]',
    'Company/Brand': 'bg-[#00875a]/10 text-[#00875a]',
  };
  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${colors[role] || 'bg-gray-100 text-gray-500'}`}>
      {role}
    </span>
  );
}

function DisputeStatusBadge({ status }) {
  const map = {
    Open: 'bg-red-100 text-red-700',
    'Under Review': 'bg-amber-100 text-amber-700',
    Resolved: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    High:   'bg-red-50 text-red-600 border border-red-200',
    Medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    Low:    'bg-gray-50 text-gray-500 border border-gray-200',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[priority] || 'bg-gray-50 text-gray-400'}`}>
      {priority}
    </span>
  );
}

function ChainStatusBadge({ status }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
      Inactive
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, subtitle, iconColor, accentBorder }) {
  return (
    <div
      className={`bg-white border border-[#e0e3e0] rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow
        ${accentBorder ? 'border-l-4 border-l-[#ba1a1a]' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <span
          className="material-symbols-outlined text-[22px]"
          style={{
            color: iconColor || '#6e7975',
            fontVariationSettings: "'FILL' 1",
          }}
        >
          {icon}
        </span>
        <span className="text-[11px] font-semibold text-[#6e7975] leading-tight text-right max-w-[100px]">
          {subtitle}
        </span>
      </div>
      <div>
        <div className="text-[28px] font-black text-[#181c1b] leading-none tracking-tight">
          {value}
        </div>
        <div className="text-[12px] font-semibold text-[#6e7975] mt-1">{label}</div>
      </div>
    </div>
  );
}

// ─── AdminOverview ────────────────────────────────────────────────────────────

export default function AdminOverview() {
  const { adminStats, pendingApprovals, disputes, chains, approveUser, rejectUser } = useAdmin();

  const recentPending = pendingApprovals.filter(p => p.status === 'pending').slice(0, 3);
  const recentDisputes = disputes.slice(0, 3);
  const topChains = [...chains]
    .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
    .slice(0, 5);

  const kpiCards = [
    {
      icon: 'group',
      label: 'Total Users',
      value: adminStats.totalUsers,
      subtitle: 'Registered accounts',
      iconColor: '#005344',
    },
    {
      icon: 'hourglass_empty',
      label: 'Pending Approvals',
      value: adminStats.pendingApprovals,
      subtitle: 'Awaiting review',
      iconColor: '#ffab00',
      accentBorder: adminStats.pendingApprovals > 0,
    },
    {
      icon: 'warning',
      label: 'Open Disputes',
      value: adminStats.openDisputes,
      subtitle: 'Requires attention',
      iconColor: '#ba1a1a',
    },
    {
      icon: 'store',
      label: 'Total Chains',
      value: adminStats.totalChains,
      subtitle: 'Mall & store chains',
      iconColor: '#fe6a34',
    },
    {
      icon: 'receipt_long',
      label: 'Total Bookings',
      value: adminStats.totalBookings,
      subtitle: 'All time',
      iconColor: '#6e7975',
    },
    {
      icon: 'payments',
      label: 'Platform Revenue',
      value: `PKR ${adminStats.totalRevenue.toLocaleString()}`,
      subtitle: 'Gross booking value',
      iconColor: '#005344',
    },
    {
      icon: 'account_balance_wallet',
      label: 'Commission Earned',
      value: `PKR ${adminStats.totalCommission.toLocaleString()}`,
      subtitle: 'Spacelo platform cut',
      iconColor: '#00875a',
    },
    {
      icon: 'verified',
      label: 'Active Chains',
      value: chains.filter(c => c.status === 'Active').length,
      subtitle: 'Verified & live',
      iconColor: '#00875a',
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── Page Heading ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-[24px] font-black text-[#181c1b] leading-tight">
          Platform Overview
        </h1>
        <p className="text-[13px] text-[#6e7975] mt-1 font-medium">
          All data is live from localStorage.{' '}
          <span className="text-[#005344] font-bold">Last updated: Just now.</span>
        </p>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <KpiCard key={i} {...card} />
        ))}
      </div>

      {/* ── Middle Two-Column Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Pending Approvals */}
        <div className="bg-white border border-[#e0e3e0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-black text-[#181c1b]">
              Recent Pending Approvals
            </h3>
            <span className="bg-[#ffab00]/10 text-[#ffab00] text-[10px] font-black px-2 py-0.5 rounded-full">
              {adminStats.pendingApprovals} pending
            </span>
          </div>

          {recentPending.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#6e7975] font-semibold">
              <span className="material-symbols-outlined text-[32px] text-[#e0e3e0] block mb-2">
                check_circle
              </span>
              All approvals reviewed
            </div>
          ) : (
            <div className="space-y-3">
              {recentPending.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#f7faf7] border border-[#e0e3e0] hover:border-[#005344]/20 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-black text-white shrink-0"
                    style={{ backgroundColor: roleColor(user.role) }}
                  >
                    {user.avatar || getInitials(user.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold text-[#181c1b] truncate">
                        {user.name}
                      </span>
                      <RoleBadge role={user.role} />
                    </div>
                    <div className="text-[11px] text-[#6e7975] font-medium mt-0.5 truncate">
                      {user.businessName || user.chainName || 'No Business'} · Submitted {user.submittedAt}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => approveUser(user.id)}
                      className="flex items-center gap-0.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black px-2 py-1 rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      Approve
                    </button>
                    <button
                      onClick={() => rejectUser(user.id)}
                      className="flex items-center gap-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2 py-1 rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All */}
          <div className="mt-4 pt-3 border-t border-[#e0e3e0]">
            <button className="text-[12px] font-bold text-[#005344] hover:underline flex items-center gap-1">
              View all pending approvals
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Recent Disputes */}
        <div className="bg-white border border-[#e0e3e0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-black text-[#181c1b]">
              Recent Disputes
            </h3>
            <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full">
              {adminStats.openDisputes} open
            </span>
          </div>

          {recentDisputes.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#6e7975] font-semibold">
              <span className="material-symbols-outlined text-[32px] text-[#e0e3e0] block mb-2">
                verified_user
              </span>
              No disputes raised
            </div>
          ) : (
            <div className="space-y-3">
              {recentDisputes.map(dispute => (
                <div
                  key={dispute.id}
                  className="flex flex-col gap-2 p-3 rounded-xl bg-[#f7faf7] border border-[#e0e3e0] hover:border-[#ba1a1a]/20 transition-colors"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-black text-[#6e7975] font-mono">
                          #{dispute.id}
                        </span>
                        <DisputeStatusBadge status={dispute.status} />
                        <PriorityBadge priority={dispute.priority} />
                      </div>
                      <div className="text-[13px] font-bold text-[#181c1b] mt-1">
                        {dispute.shopkeeper}
                        <span className="text-[#6e7975] font-medium mx-1">vs</span>
                        {dispute.brand}
                      </div>
                    </div>
                    <span className="text-[10px] text-[#6e7975] font-medium shrink-0 mt-0.5">
                      {dispute.raisedAt}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-[#6e7975] font-medium leading-relaxed">
                    {dispute.detail}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* View All */}
          <div className="mt-4 pt-3 border-t border-[#e0e3e0]">
            <button className="text-[12px] font-bold text-[#005344] hover:underline flex items-center gap-1">
              View all disputes
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Top Chains by Revenue ─────────────────────────────────────────── */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-black text-[#181c1b]">
            Top Chains by Revenue
          </h3>
          <span className="text-[11px] font-semibold text-[#6e7975]">
            Monthly gross
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e0e3e0]">
                {['Chain Name', 'Owner', 'Branches', 'City', 'Monthly Revenue', 'Status'].map(col => (
                  <th
                    key={col}
                    className="pb-3 text-[11px] font-black text-[#6e7975] uppercase tracking-wider pr-4 last:pr-0 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f1]">
              {topChains.map((chain, idx) => (
                <tr
                  key={chain.id}
                  className="hover:bg-[#f7faf7] transition-colors"
                >
                  {/* Chain Name */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      {/* Rank medal for top 3 */}
                      {idx === 0 && (
                        <span className="material-symbols-outlined text-[16px] text-[#ffab00]"
                          style={{ fontVariationSettings: "'FILL' 1" }}>
                          emoji_events
                        </span>
                      )}
                      {idx === 1 && (
                        <span className="material-symbols-outlined text-[16px] text-[#9e9e9e]"
                          style={{ fontVariationSettings: "'FILL' 1" }}>
                          emoji_events
                        </span>
                      )}
                      {idx === 2 && (
                        <span className="material-symbols-outlined text-[16px] text-[#cd7f32]"
                          style={{ fontVariationSettings: "'FILL' 1" }}>
                          emoji_events
                        </span>
                      )}
                      {idx > 2 && (
                        <span className="w-5 h-5 rounded-full bg-[#f1f4f1] text-[#6e7975] text-[10px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                      )}
                      <span className="text-[13px] font-bold text-[#181c1b] whitespace-nowrap">
                        {chain.name}
                      </span>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="py-3.5 pr-4">
                    <span className="text-[13px] text-[#3e4945] font-medium whitespace-nowrap">
                      {chain.owner}
                    </span>
                  </td>

                  {/* Branches */}
                  <td className="py-3.5 pr-4">
                    <span className="text-[13px] font-bold text-[#181c1b]">
                      {chain.branches}
                    </span>
                  </td>

                  {/* City */}
                  <td className="py-3.5 pr-4">
                    <span className="text-[13px] text-[#6e7975] font-medium">
                      {chain.city}
                    </span>
                  </td>

                  {/* Revenue */}
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-black text-[#005344] whitespace-nowrap">
                        PKR {chain.monthlyRevenue.toLocaleString()}
                      </span>
                      {/* Mini revenue bar */}
                      <div className="w-24 h-1.5 bg-[#f1f4f1] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#005344] rounded-full"
                          style={{
                            width: `${Math.min(100, (chain.monthlyRevenue / 4200000) * 100).toFixed(0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5">
                    <ChainStatusBadge status={chain.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
