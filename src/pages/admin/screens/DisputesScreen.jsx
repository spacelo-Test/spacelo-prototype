import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

// ─── helpers ────────────────────────────────────────────────────────────────

const statusColor = {
  Open:           'bg-[#ba1a1a]/10 text-[#ba1a1a]',
  'Under Review': 'bg-[#ffab00]/15 text-[#b37a00]',
  Resolved:       'bg-[#00875a]/10 text-[#00875a]',
};

const priorityConfig = {
  High:   { cls: 'bg-[#ba1a1a]/10 text-[#ba1a1a]', icon: 'priority_high' },
  Medium: { cls: 'bg-[#ffab00]/15 text-[#b37a00]', icon: 'remove' },
  Low:    { cls: 'bg-gray-100 text-gray-500',        icon: 'low_priority' },
};

const TABS = ['All', 'Open', 'Under Review', 'Resolved'];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cls = statusColor[status] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] ?? priorityConfig.Low;
  return (
    <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.cls}`}>
      <span className="material-symbols-outlined text-[12px]">{cfg.icon}</span>
      {priority}
    </span>
  );
}

function SpaceChip({ name }) {
  if (!name) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#005344]/8 text-[#005344] border border-[#005344]/15">
      <span className="material-symbols-outlined text-[12px]">store</span>
      {name}
    </span>
  );
}

// ─── dispute card ─────────────────────────────────────────────────────────────

function DisputeCard({ dispute, onMarkUnderReview, onResolve }) {
  const isOpen     = dispute.status === 'Open';
  const isResolved = dispute.status === 'Resolved';

  return (
    <div className="bg-white border border-[#e0e3e0] rounded-2xl shadow-sm p-5 flex flex-col gap-4">

      {/* ── Top row: id, status, priority, date ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-black text-[#181c1b] text-[14px]">
          Dispute #{dispute.id}
        </span>
        <StatusBadge status={dispute.status} />
        {dispute.priority && <PriorityBadge priority={dispute.priority} />}
        <span className="ml-auto text-xs text-[#6e7975] flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">calendar_today</span>
          {formatDate(dispute.raisedAt)}
        </span>
      </div>

      {/* ── Body: parties ── */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#181c1b]">
          <span className="font-bold">{dispute.raisedBy}</span>
          {' '}raised a dispute between{' '}
          <span className="font-bold text-[#005344]">{dispute.shopkeeper}</span>
          {' '}and{' '}
          <span className="font-bold text-[#fe6a34]">{dispute.brand}</span>
        </p>

        {/* Space chip */}
        {dispute.space && (
          <div className="flex items-center gap-2">
            <SpaceChip name={dispute.space} />
          </div>
        )}

        {/* Reason */}
        {dispute.reason && (
          <div>
            <span className="text-sm font-bold text-[#181c1b]">{dispute.reason}</span>
            {dispute.detail && (
              <p className="text-xs text-[#6e7975] mt-0.5 leading-relaxed">{dispute.detail}</p>
            )}
          </div>
        )}
      </div>

      {/* ── Actions (hidden if resolved) ── */}
      {!isResolved && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-[#e0e3e0]">
          {isOpen && (
            <button
              onClick={() => onMarkUnderReview(dispute.id)}
              className="flex items-center gap-1.5 bg-[#ffab00] text-white rounded-xl px-4 py-2 font-bold text-sm hover:bg-[#e09900] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">rate_review</span>
              Mark as Under Review
            </button>
          )}
          <button
            onClick={() => onResolve(dispute.id)}
            className="flex items-center gap-1.5 bg-[#00875a] text-white rounded-xl px-4 py-2 font-bold text-sm hover:bg-[#006e49] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">task_alt</span>
            Mark as Resolved
          </button>
        </div>
      )}
    </div>
  );
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#6e7975]">
      <span className="material-symbols-outlined text-[56px] text-[#e0e3e0]">gavel</span>
      <p className="text-[15px] font-semibold text-center">
        No {filter !== 'All' ? filter.toLowerCase() : ''} disputes found.
      </p>
      <p className="text-sm text-center">Everything looks clean here.</p>
    </div>
  );
}

// ─── main screen ──────────────────────────────────────────────────────────────

export default function DisputesScreen() {
  const { disputes = [], resolveDispute } = useAdmin();

  // Mirror context disputes in local state so we can update status optimistically
  const [localDisputes, setLocalDisputes] = useState(disputes);
  const [activeTab, setActiveTab] = useState('All');

  // ── computed summary counts ────────────────────────────────────────────────
  const openCount     = localDisputes.filter((d) => d.status === 'Open').length;
  const reviewCount   = localDisputes.filter((d) => d.status === 'Under Review').length;
  const resolvedCount = localDisputes.filter((d) => d.status === 'Resolved').length;

  // ── filtered list ──────────────────────────────────────────────────────────
  const filtered =
    activeTab === 'All'
      ? localDisputes
      : localDisputes.filter((d) => d.status === activeTab);

  // ── handlers ───────────────────────────────────────────────────────────────
  function handleMarkUnderReview(id) {
    setLocalDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Under Review' } : d))
    );
  }

  function handleResolve(id) {
    resolveDispute?.(id);
    setLocalDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Resolved' } : d))
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full bg-[#f7faf7]">

      {/* ── Page heading + summary ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[20px] font-black text-[#181c1b]">Disputes</h1>
        <p className="text-sm text-[#6e7975] font-semibold">
          <span className="text-[#ba1a1a] font-black">{openCount}</span> open
          {' · '}
          <span className="text-[#b37a00] font-black">{reviewCount}</span> under review
          {' · '}
          <span className="text-[#00875a] font-black">{resolvedCount}</span> resolved
        </p>
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
            {tab === 'Open' && openCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#ba1a1a] text-white text-[10px] font-black">
                {openCount}
              </span>
            )}
            {tab === 'Under Review' && reviewCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#ffab00] text-white text-[10px] font-black">
                {reviewCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Dispute cards / empty state ── */}
      {filtered.length === 0 ? (
        <EmptyState filter={activeTab} />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              onMarkUnderReview={handleMarkUnderReview}
              onResolve={handleResolve}
            />
          ))}
        </div>
      )}
    </div>
  );
}
