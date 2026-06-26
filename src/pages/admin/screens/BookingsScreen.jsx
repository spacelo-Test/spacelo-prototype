import React, { useState, useMemo } from 'react';
import { useAdmin } from '../AdminContext';

// ─── Color map helpers ────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Active:      'bg-blue-50 text-blue-700',
  Completed:   'bg-[#00875a]/10 text-[#00875a]',
  Pending:     'bg-[#ffab00]/15 text-[#b37a00]',
  Cancelled:   'bg-[#ba1a1a]/10 text-[#ba1a1a]',
  Disputed:    'bg-[#ba1a1a]/10 text-[#ba1a1a]',
  Accepted:    'bg-[#005344]/10 text-[#005344]',
};

const PAYOUT_COLORS = {
  Released:   'bg-[#005344]/10 text-[#005344]',
  'In Escrow':'bg-[#ffab00]/15 text-[#b37a00]',
  'Not Yet':  'bg-gray-100 text-gray-500',
  Partial:    'bg-blue-50 text-blue-700',
};

function StatusBadge({ status, map }) {
  const cls = (map ?? STATUS_COLORS)[status] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${cls}`}>
      {status}
    </span>
  );
}

// ─── KPI Stat Card ────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, iconBg, iconColor, valueColor }) {
  return (
    <div className="bg-white border border-[#e0e3e0] rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm flex-1 min-w-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <span
          className={`material-symbols-outlined text-[22px] ${iconColor}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-[#6e7975] uppercase tracking-wide leading-none">{label}</p>
        <p className={`text-[15px] font-black mt-0.5 leading-tight truncate ${valueColor ?? 'text-[#181c1b]'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Filter Tab Button ────────────────────────────────────────────────────────
function FilterTab({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap ${
        active
          ? 'bg-[#005344] text-white shadow-sm'
          : 'bg-white text-[#6e7975] border border-[#e0e3e0] hover:border-[#005344] hover:text-[#005344]'
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
            active ? 'bg-white/20 text-white' : 'bg-[#e0e3e0] text-[#6e7975]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Booking Table Row ────────────────────────────────────────────────────────
function BookingRow({ booking, index }) {
  const isEven = index % 2 === 0;

  const fmtPKR = (n) =>
    n != null ? `PKR ${Number(n).toLocaleString()}` : '—';

  return (
    <tr
      className={`transition-all hover:shadow-sm ${
        isEven ? 'bg-[#f7faf7]' : 'bg-white'
      }`}
    >
      {/* ID */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="font-mono font-black text-[12px] text-[#005344]">
          #{String(booking.id).padStart(3, '0')}
        </span>
      </td>

      {/* Shopkeeper */}
      <td className="px-4 py-3">
        <div>
          <p className="text-[12px] font-black text-[#181c1b] leading-tight truncate max-w-[130px]">
            {booking.shopkeeperName}
          </p>
          <p className="text-[10px] text-[#6e7975] font-medium truncate max-w-[130px]">
            {booking.branchArea}
          </p>
        </div>
      </td>

      {/* Brand */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 ${
              booking.brandLogoBg ?? 'bg-[#005344]'
            }`}
          >
            {booking.brandName?.[0] ?? '?'}
          </div>
          <span className="text-[12px] font-bold text-[#181c1b] truncate max-w-[110px]">
            {booking.brandName}
          </span>
        </div>
      </td>

      {/* Space */}
      <td className="px-4 py-3">
        <p className="text-[12px] text-[#181c1b] font-semibold truncate max-w-[120px]">
          {booking.spaceName}
        </p>
      </td>

      {/* Duration */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-[12px] font-semibold text-[#181c1b]">
          {booking.durationMonths} mo
        </span>
      </td>

      {/* Amount */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-[12px] font-black text-[#181c1b]">
          {fmtPKR(booking.totalAmount)}
        </span>
      </td>

      {/* Commission */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-[12px] font-semibold text-[#6e7975]">
          {fmtPKR(booking.commission)}
        </span>
      </td>

      {/* Start → End */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-bold text-[#181c1b]">{booking.startDate}</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#6e7975] text-[12px]">arrow_forward</span>
            <span className="text-[11px] font-bold text-[#181c1b]">{booking.endDate}</span>
          </div>
        </div>
      </td>

      {/* Status badge */}
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={booking.status} map={STATUS_COLORS} />
      </td>

      {/* Payout badge */}
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={booking.payoutStatus} map={PAYOUT_COLORS} />
      </td>
    </tr>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function BookingsScreen() {
  const { bookings } = useAdmin();

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery]   = useState('');

  const COMMISSION_RATE = 0.15;

  // ── Derived KPI totals from all bookings
  const totalBookings    = bookings.length;
  const totalGrossValue  = bookings.reduce((s, b) => s + (b.totalAmount ?? 0), 0);
  const totalCommission  = bookings.reduce((s, b) => s + (b.commission ?? 0), 0);

  // ── Tab counts
  const tabCounts = useMemo(() => ({
    All:       bookings.length,
    Active:    bookings.filter((b) => b.status === 'Active').length,
    Completed: bookings.filter((b) => b.status === 'Completed').length,
    Pending:   bookings.filter((b) => b.status === 'Pending').length,
  }), [bookings]);

  // ── Filtered + searched bookings
  const filtered = useMemo(() => {
    let list = bookings;

    // Status filter
    if (activeFilter !== 'All') {
      list = list.filter((b) => b.status === activeFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.shopkeeperName?.toLowerCase().includes(q) ||
          b.brandName?.toLowerCase().includes(q) ||
          b.spaceName?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [bookings, activeFilter, searchQuery]);

  const fmtPKR = (n) =>
    n != null ? `PKR ${Number(n).toLocaleString()}` : '—';

  return (
    <div className="p-5 space-y-5 font-manrope min-h-full bg-[#f7faf7]">

      {/* ── Page Heading + summary ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-black text-[#181c1b] leading-tight">Bookings</h1>
          <p className="text-[13px] text-[#6e7975] font-semibold mt-0.5">
            {totalBookings} total booking{totalBookings !== 1 ? 's' : ''} on platform
          </p>
        </div>
        <button className="flex-shrink-0 flex items-center gap-1.5 bg-white text-[#005344] border border-[#e0e3e0] text-[12px] font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-[#f7faf7] transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[16px]">download</span>
          Export CSV
        </button>
      </div>

      {/* ── KPI Row ────────────────────────────────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        <KpiCard
          icon="receipt_long"
          label="Total Bookings"
          value={totalBookings}
          iconBg="bg-[#005344]/10"
          iconColor="text-[#005344]"
          valueColor="text-[#005344]"
        />
        <KpiCard
          icon="payments"
          label="Total Gross Value (PKR)"
          value={fmtPKR(totalGrossValue)}
          iconBg="bg-[#fe6a34]/10"
          iconColor="text-[#fe6a34]"
          valueColor="text-[#181c1b]"
        />
        <KpiCard
          icon="account_balance_wallet"
          label="Commission Earned (PKR)"
          value={fmtPKR(totalCommission)}
          iconBg="bg-[#00875a]/10"
          iconColor="text-[#00875a]"
          valueColor="text-[#00875a]"
        />
      </div>

      {/* ── Filter Tabs + Search ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
          {['All', 'Active', 'Completed', 'Pending'].map((tab) => (
            <FilterTab
              key={tab}
              label={tab}
              count={tabCounts[tab]}
              active={activeFilter === tab}
              onClick={() => setActiveFilter(tab)}
            />
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-0 w-full sm:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7975] text-[18px] pointer-events-none select-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search by shopkeeper, brand or space…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-white border border-[#e0e3e0] rounded-xl text-[12px] font-semibold text-[#181c1b] placeholder:text-[#6e7975] focus:outline-none focus:ring-2 focus:ring-[#005344]/30 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#6e7975] hover:text-[#181c1b]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Bookings Table ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
            <div className="w-14 h-14 bg-[#e0e3e0] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-[#6e7975]">receipt_long</span>
            </div>
            <div>
              <p className="text-[14px] font-black text-[#181c1b]">
                {searchQuery || activeFilter !== 'All'
                  ? 'No bookings match your filter'
                  : 'No bookings yet'}
              </p>
              <p className="text-[12px] text-[#6e7975] font-medium mt-1">
                {searchQuery
                  ? `No results for "${searchQuery}".`
                  : activeFilter !== 'All'
                  ? `No ${activeFilter.toLowerCase()} bookings found.`
                  : 'Bookings will appear here once made.'}
              </p>
            </div>
            {(searchQuery || activeFilter !== 'All') && (
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                className="text-[12px] font-bold text-[#005344] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          /* ── Table ── */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e0e3e0] bg-[#f7faf7]">
                  {[
                    'ID',
                    'Shopkeeper',
                    'Brand',
                    'Space',
                    'Duration',
                    'Amount',
                    'Commission',
                    'Start → End',
                    'Status',
                    'Payout',
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-[10px] font-black text-[#6e7975] uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3f0]">
                {filtered.map((booking, i) => (
                  <BookingRow key={booking.id} booking={booking} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination placeholder ────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-[12px] text-[#6e7975] font-semibold">
            Showing 1–{filtered.length} of {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-1">
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-[#e0e3e0] text-[12px] font-bold text-[#6e7975] bg-white opacity-50 cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              disabled
              className="px-3 py-1.5 rounded-lg border border-[#e0e3e0] text-[12px] font-bold text-[#6e7975] bg-white opacity-50 cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── Commission Info Box ───────────────────────────────────────────── */}
      <div className="bg-[#005344]/5 border border-[#005344]/15 rounded-2xl px-4 py-3 flex items-start gap-3">
        <span
          className="material-symbols-outlined text-[#005344] text-[20px] flex-shrink-0 mt-0.5"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          info
        </span>
        <div>
          <p className="text-[12px] font-black text-[#005344]">Platform Commission Rate: 15%</p>
          <p className="text-[11px] text-[#6e7975] font-medium mt-0.5 leading-relaxed">
            Spacelo deducts a 15% platform fee from each booking's gross value. The remaining 85%
            is held in escrow and released to the shopkeeper upon campaign completion and confirmation.
          </p>
        </div>
      </div>

    </div>
  );
}
