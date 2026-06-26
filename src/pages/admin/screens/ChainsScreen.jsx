import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Active:    'bg-[#00875a]/10 text-[#00875a]',
    Inactive:  'bg-gray-100 text-gray-500',
    Pending:   'bg-[#ffab00]/15 text-[#b37a00]',
    Suspended: 'bg-[#ba1a1a]/10 text-[#ba1a1a]',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold flex-shrink-0 ${
        map[status] ?? 'bg-gray-100 text-gray-500'
      }`}
    >
      {status}
    </span>
  );
}

// ─── Mini Stat Card (inside chain card) ──────────────────────────────────────
function MiniStat({ icon, label, value, valueClass }) {
  return (
    <div className="flex-1 bg-[#f7faf7] border border-[#e0e3e0] rounded-xl px-2.5 py-2 flex flex-col items-center gap-0.5 min-w-0">
      <span className="material-symbols-outlined text-[#6e7975] text-[17px]">{icon}</span>
      <p className={`text-[12px] font-black leading-tight text-center truncate w-full ${valueClass ?? 'text-[#181c1b]'}`}>
        {value}
      </p>
      <p className="text-[9px] text-[#6e7975] font-semibold uppercase tracking-wide text-center leading-none">
        {label}
      </p>
    </div>
  );
}

// ─── Summary Pill Card ───────────────────────────────────────────────────────
function SummaryPill({ icon, label, value, iconBg, iconColor }) {
  return (
    <div className="bg-white border border-[#e0e3e0] rounded-xl px-4 py-3 flex-shrink-0 flex items-center gap-3 shadow-sm min-w-[158px]">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
        <span
          className={`material-symbols-outlined text-[20px] ${iconColor}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-[#6e7975] uppercase tracking-wide leading-none truncate">
          {label}
        </p>
        <p className="text-[15px] font-black text-[#181c1b] mt-0.5 leading-tight truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Format Revenue helper ───────────────────────────────────────────────────
function fmtRevenue(n) {
  if (!n) return 'PKR 0';
  if (n >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `PKR ${(n / 1_000).toFixed(0)}K`;
  return `PKR ${n.toLocaleString()}`;
}

// ─── Chain Card ─────────────────────────────────────────────────────────────
function ChainCard({ chain }) {
  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return d ?? '—';
    }
  };

  return (
    <div className="bg-white border border-[#e0e3e0] rounded-2xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">

      {/* ── Top: Logo initial + Name + Status badge ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#005344]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[15px] font-black text-[#005344] uppercase select-none">
              {chain.name?.[0] ?? '?'}
            </span>
          </div>
          <h3 className="text-[18px] font-black text-[#181c1b] leading-tight truncate">{chain.name}</h3>
        </div>
        <StatusBadge status={chain.status} />
      </div>

      {/* ── Owner + City ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[12px] text-[#6e7975] font-semibold">
          <span className="material-symbols-outlined text-[14px] flex-shrink-0">person</span>
          <span className="truncate">{chain.owner ?? '—'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#6e7975] font-semibold">
          <span className="material-symbols-outlined text-[14px] flex-shrink-0">location_on</span>
          <span className="truncate">{chain.city ?? '—'}</span>
        </div>
      </div>

      {/* ── Stats Row: Branches / Listings / Revenue ── */}
      <div className="flex gap-2">
        <MiniStat
          icon="store_mall_directory"
          label="Branches"
          value={chain.branches ?? 0}
        />
        <MiniStat
          icon="view_list"
          label="Listings"
          value={chain.totalListings ?? 0}
        />
        <MiniStat
          icon="payments"
          label="Monthly Rev"
          value={fmtRevenue(chain.monthlyRevenue)}
          valueClass="text-[#00875a]"
        />
      </div>

      {/* ── Member Since ── */}
      <p className="text-[11px] text-[#6e7975] italic font-medium">
        Member since {formatDate(chain.joinedAt)}
      </p>

      {/* ── Footer ── */}
      <div className="flex justify-end pt-1.5 border-t border-[#f0f3f0]">
        <button className="text-[13px] font-bold text-[#005344] hover:text-[#003d32] flex items-center gap-1 transition-colors">
          View Details
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ChainsScreen() {
  const { chains } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');

  // ── Derived summary stats
  const totalChains        = chains.length;
  const activeChains       = chains.filter((c) => c.status === 'Active').length;
  const totalListings      = chains.reduce((s, c) => s + (c.totalListings ?? 0), 0);
  const totalMonthlyRev    = chains.reduce((s, c) => s + (c.monthlyRevenue ?? 0), 0);

  // ── Filtered list
  const filtered = chains.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.ownerName?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-5 space-y-6 font-manrope min-h-full bg-[#f7faf7]">

      {/* ── Page Heading ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-black text-[#181c1b] leading-tight">
            Chains &amp; Malls
          </h1>
          <p className="text-[13px] text-[#6e7975] font-semibold mt-0.5">
            {totalChains} registered chain{totalChains !== 1 ? 's' : ''} on platform
          </p>
        </div>
        <button className="flex-shrink-0 flex items-center gap-1.5 bg-[#005344] text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-[#003d32] transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Chain
        </button>
      </div>

      {/* ── Summary Strip (horizontal scroll) ────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        <SummaryPill
          icon="corporate_fare"
          label="Total Chains"
          value={totalChains}
          iconBg="bg-[#005344]/10"
          iconColor="text-[#005344]"
        />
        <SummaryPill
          icon="check_circle"
          label="Active Chains"
          value={activeChains}
          iconBg="bg-[#00875a]/10"
          iconColor="text-[#00875a]"
        />
        <SummaryPill
          icon="view_list"
          label="Total Listings"
          value={totalListings.toLocaleString()}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <SummaryPill
          icon="payments"
          label="Monthly Revenue"
          value={fmtRevenue(totalMonthlyRev)}
          iconBg="bg-[#fe6a34]/10"
          iconColor="text-[#fe6a34]"
        />
      </div>

      {/* ── Search Bar ───────────────────────────────────────────────────── */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7975] text-[20px] pointer-events-none select-none">
          search
        </span>
        <input
          type="text"
          placeholder="Search by chain name, owner, or city…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e0e3e0] rounded-xl text-[13px] font-semibold text-[#181c1b] placeholder:text-[#6e7975] focus:outline-none focus:ring-2 focus:ring-[#005344]/30 shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7975] hover:text-[#181c1b] flex items-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* ── Chains Grid / Empty State ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 bg-[#e0e3e0] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-[#6e7975]">store_mall_directory</span>
          </div>
          <div>
            <p className="text-[16px] font-black text-[#181c1b]">
              {searchQuery ? 'No chains match your search' : 'No chains registered yet'}
            </p>
            <p className="text-[13px] text-[#6e7975] font-medium mt-1">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different term.`
                : 'Once chains onboard to Spacelo, they will appear here.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[13px] font-bold text-[#005344] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((chain) => (
              <ChainCard key={chain.id} chain={chain} />
            ))}
          </div>

          {/* ── Footer count ── */}
          <p className="text-[12px] text-[#6e7975] text-center font-semibold pb-4">
            Showing {filtered.length} of {totalChains} chain{totalChains !== 1 ? 's' : ''}
          </p>
        </>
      )}
    </div>
  );
}
