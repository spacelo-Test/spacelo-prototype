import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

// ─── helpers ────────────────────────────────────────────────────────────────

const roleColor = {
  Shopkeeper:      { bg: 'bg-[#005344]/10', text: 'text-[#005344]' },
  'Mall Owner':    { bg: 'bg-[#fe6a34]/10', text: 'text-[#fe6a34]' },
  'Company/Brand': { bg: 'bg-[#00875a]/10', text: 'text-[#00875a]' },
};

const roleAvatarBg = {
  Shopkeeper:      'bg-[#005344]',
  'Mall Owner':    'bg-[#fe6a34]',
  'Company/Brand': 'bg-[#00875a]',
};

const statusColor = {
  Approved:  'bg-[#00875a]/10 text-[#00875a]',
  Rejected:  'bg-[#ba1a1a]/10 text-[#ba1a1a]',
};

const TABS = ['All', 'Shopkeeper', 'Mall Owner', 'Company/Brand'];

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

// ─── sub-components ─────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  const c = roleColor[role] ?? { bg: 'bg-gray-100', text: 'text-gray-500' };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${c.bg} ${c.text}`}
    >
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

function DocPill({ label }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#f7faf7] border border-[#e0e3e0] text-xs rounded-full px-2 py-0.5 text-[#181c1b]">
      <span className="material-symbols-outlined text-[12px] text-[#6e7975]">description</span>
      {label}
    </span>
  );
}

function AvatarCircle({ name, role }) {
  const bg = roleAvatarBg[role] ?? 'bg-[#6e7975]';
  return (
    <div
      className={`w-12 h-12 shrink-0 rounded-full ${bg} flex items-center justify-center text-white font-black text-sm select-none`}
    >
      {getInitials(name)}
    </div>
  );
}

// ─── pending card ─────────────────────────────────────────────────────────────

function PendingCard({ user, onApprove, onReject }) {
  return (
    <div className="bg-white border border-[#e0e3e0] rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-4">
      {/* Left: avatar + info */}
      <div className="flex gap-3 flex-1 min-w-0">
        <AvatarCircle name={user.name} role={user.role} />

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {/* Name + role */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-[#181c1b] text-[15px] leading-tight">{user.name}</span>
            <RoleBadge role={user.role} />
          </div>

          {/* Email */}
          <div className="flex items-center gap-1 text-sm text-[#6e7975]">
            <span className="material-symbols-outlined text-[15px]">mail</span>
            <span className="truncate">{user.email}</span>
          </div>

          {/* Phone */}
          {user.phone && (
            <div className="flex items-center gap-1 text-sm text-[#6e7975]">
              <span className="material-symbols-outlined text-[15px]">call</span>
              <span>{user.phone}</span>
            </div>
          )}

          {/* Business name / chain */}
          {user.businessName && (
            <div className="flex items-center gap-1 text-sm text-[#181c1b] font-semibold">
              <span className="material-symbols-outlined text-[15px] text-[#6e7975]">storefront</span>
              {user.businessName}
              {user.chainName && (
                <span className="text-[#6e7975] font-normal">· {user.chainName}</span>
              )}
            </div>
          )}

          {/* Submitted date */}
          <div className="flex items-center gap-1 text-xs text-[#6e7975] mt-0.5">
            <span className="material-symbols-outlined text-[13px]">schedule</span>
            Submitted {formatDate(user.submittedAt)}
          </div>

          {/* Docs pills */}
          {user.docs && user.docs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {user.docs.map((doc, i) => (
                <DocPill key={i} label={doc} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex sm:flex-col gap-2 justify-end items-start shrink-0">
        <button
          onClick={() => onApprove(user.id)}
          className="flex items-center gap-1 bg-[#00875a] text-white rounded-xl px-4 py-2 font-bold text-sm hover:bg-[#006e49] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          Approve
        </button>
        <button
          onClick={() => onReject(user.id)}
          className="flex items-center gap-1 border border-[#ba1a1a] text-[#ba1a1a] rounded-xl px-4 py-2 font-bold text-sm hover:bg-[#ba1a1a]/5 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">cancel</span>
          Reject
        </button>
      </div>
    </div>
  );
}

// ─── processed card ───────────────────────────────────────────────────────────

function ProcessedCard({ user }) {
  return (
    <div className="bg-white border border-[#e0e3e0] rounded-2xl shadow-sm p-4 flex items-center gap-3">
      <AvatarCircle name={user.name} role={user.role} />
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-black text-[#181c1b] text-sm">{user.name}</span>
          <RoleBadge role={user.role} />
        </div>
        <span className="text-xs text-[#6e7975] truncate">{user.email}</span>
        {user.businessName && (
          <span className="text-xs text-[#6e7975]">{user.businessName}</span>
        )}
      </div>
      <StatusBadge status={user.processedStatus} />
    </div>
  );
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#6e7975]">
      <span className="material-symbols-outlined text-[56px] text-[#e0e3e0]">hourglass_empty</span>
      <p className="text-[15px] font-semibold text-center">No pending approvals.</p>
      <p className="text-sm text-center">All caught up!</p>
    </div>
  );
}

// ─── main screen ──────────────────────────────────────────────────────────────

export default function PendingApprovalsScreen() {
  const { pendingApprovals = [], approveUser, rejectUser } = useAdmin();

  const [activeTab, setActiveTab] = useState('All');

  // Items that have been acted on in this session
  const [processed, setProcessed] = useState([]);

  // ── derived lists ──────────────────────────────────────────────────────────
  const rawPending = pendingApprovals.filter(
    (u) => u.status === 'pending' && !processed.some((p) => p.id === u.id)
  );

  const filteredPending =
    activeTab === 'All' ? rawPending : rawPending.filter((u) => u.role === activeTab);

  const filteredProcessed =
    activeTab === 'All' ? processed : processed.filter((u) => u.role === activeTab);

  const totalPending = rawPending.length;

  // ── handlers ───────────────────────────────────────────────────────────────
  function handleApprove(id) {
    approveUser?.(id);
    const user = pendingApprovals.find((u) => u.id === id);
    if (user) {
      setProcessed((prev) => [...prev, { ...user, processedStatus: 'Approved' }]);
    }
  }

  function handleReject(id) {
    rejectUser?.(id);
    const user = pendingApprovals.find((u) => u.id === id);
    if (user) {
      setProcessed((prev) => [...prev, { ...user, processedStatus: 'Rejected' }]);
    }
  }

  const showEmpty = filteredPending.length === 0 && filteredProcessed.length === 0;

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full bg-[#f7faf7]">

      {/* ── Page heading ── */}
      <div className="flex items-center gap-3">
        <h1 className="text-[20px] font-black text-[#181c1b]">Pending Approvals</h1>
        {totalPending > 0 && (
          <span className="flex items-center justify-center min-w-[26px] h-[26px] px-1.5 rounded-full bg-[#fe6a34] text-white text-xs font-black">
            {totalPending}
          </span>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
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

      {/* ── Empty state ── */}
      {showEmpty && <EmptyState />}

      {/* ── Pending cards ── */}
      {filteredPending.length > 0 && (
        <div className="flex flex-col gap-4">
          {filteredPending.map((user) => (
            <PendingCard
              key={user.id}
              user={user}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      {/* ── Processed section ── */}
      {filteredProcessed.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-black text-[#181c1b]">Processed</h2>
            <span className="text-xs text-[#6e7975] font-semibold">
              ({filteredProcessed.length})
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {filteredProcessed.map((user) => (
              <ProcessedCard key={user.id + '-processed'} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
