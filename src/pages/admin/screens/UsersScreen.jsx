import React, { useState, useMemo } from 'react';
import { useAdmin } from '../AdminContext';

// ─── helpers ────────────────────────────────────────────────────────────────

const statusColor = {
  Active:    'bg-[#00875a]/10 text-[#00875a]',
  Pending:   'bg-[#ffab00]/15 text-[#b37a00]',
  Suspended: 'bg-[#ba1a1a]/10 text-[#ba1a1a]',
};

const roleConfig = {
  Shopkeeper:      { bg: 'bg-[#005344]',  badgeCls: 'bg-[#005344]/10 text-[#005344]' },
  'Mall Owner':    { bg: 'bg-[#fe6a34]',  badgeCls: 'bg-[#fe6a34]/10 text-[#fe6a34]' },
  'Company/Brand': { bg: 'bg-[#00875a]',  badgeCls: 'bg-[#00875a]/10 text-[#00875a]' },
};

const ROLE_TABS = ['All', 'Shopkeeper', 'Mall Owner', 'Company/Brand', 'Suspended'];

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatRevenue(amount) {
  if (amount == null) return '—';
  return `PKR ${Number(amount).toLocaleString('en-PK')}`;
}

// ─── sub-components ─────────────────────────────────────────────────────────

function AvatarCircle({ name, role }) {
  const bg = roleConfig[role]?.bg ?? 'bg-[#6e7975]';
  return (
    <div
      className={`w-9 h-9 shrink-0 rounded-full ${bg} flex items-center justify-center text-white font-black text-xs select-none`}
    >
      {getInitials(name)}
    </div>
  );
}

function RoleBadge({ role }) {
  const cls = roleConfig[role]?.badgeCls ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${cls}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const cls = statusColor[status] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>
      {status}
    </span>
  );
}

// ─── action button ────────────────────────────────────────────────────────────

function ActionButton({ status, userId, onSuspend, onActivate, onApprove }) {
  if (status === 'Active') {
    return (
      <button
        onClick={() => onSuspend(userId)}
        className="inline-flex items-center gap-1 border border-[#ba1a1a] text-[#ba1a1a] rounded-lg px-3 py-1 text-xs font-bold hover:bg-[#ba1a1a]/5 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[13px]">block</span>
        Suspend
      </button>
    );
  }
  if (status === 'Suspended') {
    return (
      <button
        onClick={() => onActivate(userId)}
        className="inline-flex items-center gap-1 bg-[#00875a] text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-[#006e49] active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[13px]">check_circle</span>
        Activate
      </button>
    );
  }
  if (status === 'Pending') {
    return (
      <button
        onClick={() => onApprove(userId)}
        className="inline-flex items-center gap-1 bg-[#ffab00] text-white rounded-lg px-3 py-1 text-xs font-bold hover:bg-[#e09900] active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[13px]">how_to_reg</span>
        Approve
      </button>
    );
  }
  return null;
}

// ─── table row ────────────────────────────────────────────────────────────────

function UserRow({ user, onSuspend, onActivate, onApprove }) {
  return (
    <tr className="border-b border-[#e0e3e0] last:border-0 hover:bg-[#f7faf7] transition-colors group">

      {/* Name + avatar */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <AvatarCircle name={user.name} role={user.role} />
          <div className="flex flex-col">
            <span className="font-bold text-[#181c1b] text-sm leading-tight">{user.name}</span>
            {user.businessName && (
              <span className="text-[11px] text-[#6e7975] leading-tight">{user.businessName}</span>
            )}
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 py-3 whitespace-nowrap">
        <RoleBadge role={user.role} />
      </td>

      {/* Email */}
      <td className="px-4 py-3 text-sm text-[#6e7975] max-w-[200px]">
        <span className="truncate block">{user.email}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={user.status} />
      </td>

      {/* Joined */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#6e7975]">
        {formatDate(user.joinedAt)}
      </td>

      {/* Bookings */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#181c1b] font-semibold text-center">
        {user.totalBookings ?? 0}
      </td>

      {/* Revenue */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#181c1b] font-semibold">
        {formatRevenue(user.totalRevenue)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 whitespace-nowrap">
        <ActionButton
          status={user.status}
          userId={user.id}
          onSuspend={onSuspend}
          onActivate={onActivate}
          onApprove={onApprove}
        />
      </td>
    </tr>
  );
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <tr>
      <td colSpan={8}>
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#6e7975]">
          <span className="material-symbols-outlined text-[48px] text-[#e0e3e0]">person_search</span>
          <p className="text-sm font-semibold text-center">No users match your search.</p>
        </div>
      </td>
    </tr>
  );
}

// ─── main screen ──────────────────────────────────────────────────────────────

export default function UsersScreen() {
  const { users = [], suspendUser, activateUser, approveUser } = useAdmin();

  // Local mirror for optimistic status updates
  const [localUsers, setLocalUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const totalCount = localUsers.length;

  // ── filter logic ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = localUsers;

    // Tab filter
    if (activeTab === 'Suspended') {
      list = list.filter((u) => u.status === 'Suspended');
    } else if (activeTab !== 'All') {
      list = list.filter((u) => u.role === activeTab);
    }

    // Search filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [localUsers, activeTab, searchQuery]);

  // ── handlers ───────────────────────────────────────────────────────────────
  function handleSuspend(id) {
    suspendUser?.(id);
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'Suspended' } : u))
    );
  }

  function handleActivate(id) {
    activateUser?.(id);
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'Active' } : u))
    );
  }

  function handleApprove(id) {
    approveUser?.(id);
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'Active' } : u))
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full bg-[#f7faf7]">

      {/* ── Page heading + count ── */}
      <div className="flex items-center gap-3">
        <h1 className="text-[20px] font-black text-[#181c1b]">Users</h1>
        <span className="flex items-center justify-center min-w-[30px] h-[26px] px-2 rounded-full bg-[#005344]/10 text-[#005344] text-xs font-black">
          {totalCount}
        </span>
      </div>

      {/* ── Search + filter row ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

        {/* Search input */}
        <div className="relative flex-1 max-w-[360px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#6e7975] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e0e3e0] bg-white text-sm text-[#181c1b] placeholder:text-[#6e7975] focus:outline-none focus:border-[#005344] focus:ring-2 focus:ring-[#005344]/15 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7975] hover:text-[#181c1b] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Role / status tabs */}
        <div className="flex gap-2 flex-wrap">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${
                activeTab === tab
                  ? 'bg-[#005344] text-white border-[#005344]'
                  : 'bg-white text-[#6e7975] border-[#e0e3e0] hover:border-[#005344] hover:text-[#005344]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Users table ── */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left">
            <thead>
              <tr className="bg-[#f7faf7] border-b border-[#e0e3e0]">
                {['Name', 'Role', 'Email', 'Status', 'Joined', 'Bookings', 'Revenue', 'Actions'].map(
                  (col) => (
                    <th
                      key={col}
                      className={`px-4 py-3 text-xs font-black text-[#6e7975] uppercase tracking-wider whitespace-nowrap ${
                        col === 'Bookings' ? 'text-center' : ''
                      }`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                filtered.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onSuspend={handleSuspend}
                    onActivate={handleActivate}
                    onApprove={handleApprove}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with result count */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[#e0e3e0] flex items-center justify-between">
            <span className="text-xs text-[#6e7975] font-semibold">
              Showing {filtered.length} of {totalCount} users
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#005344] font-bold hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
