import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';

// ─── helpers ────────────────────────────────────────────────────────────────

const spaceTypeColor = {
  shelf:             { bg: 'bg-[#005344]/10', text: 'text-[#005344]' },
  end_cap:           { bg: 'bg-[#fe6a34]/10', text: 'text-[#fe6a34]' },
  window_display:    { bg: 'bg-[#00875a]/10', text: 'text-[#00875a]' },
  checkout_counter:  { bg: 'bg-blue-100 text-blue-700', text: 'text-blue-700' },
  promotional_aisle: { bg: 'bg-purple-100 text-purple-700', text: 'text-purple-700' },
  other:             { bg: 'bg-gray-100 text-gray-500', text: 'text-gray-500' },
};

const spaceTypeLabel = {
  shelf: 'Shelf',
  end_cap: 'End-Cap',
  window_display: 'Window Display',
  floor_stand: 'Floor Stand',
  checkout_counter: 'Checkout Counter',
  entrance_display: 'Entrance Display',
  promotional_aisle: 'Promotional Aisle',
  other: 'Other',
};

const statusColor = {
  Approved: 'bg-[#00875a]/10 text-[#00875a]',
  Rejected: 'bg-[#ba1a1a]/10 text-[#ba1a1a]',
};

const TABS = ['All', 'Shelves', 'End-Caps', 'Window Displays', 'Other'];

function getOwnerName(space) {
  if (space.nickname && space.nickname.toLowerCase().includes('centre')) {
    return 'Centre One Mall';
  }
  return 'Super Store - Gulshan';
}

function TypeBadge({ type }) {
  const c = spaceTypeColor[type] ?? { bg: 'bg-gray-100', text: 'text-gray-500' };
  const label = spaceTypeLabel[type] ?? 'Space';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
      {label}
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

function SuitabilityPill({ label }) {
  return (
    <span className="inline-flex items-center bg-[#f0f3f0] text-xs font-bold rounded-full px-2 py-0.5 text-[#181c1b] border border-[#e0e3e0]">
      {label}
    </span>
  );
}

// ─── listing card ────────────────────────────────────────────────────────────

function ListingCard({ listing, space, onApprove, onReject }) {
  const ownerName = getOwnerName(space);
  const typeLabel = spaceTypeLabel[space.type] ?? 'Space';

  return (
    <div className="bg-white border border-[#e0e3e0] rounded-2xl shadow-sm p-5 flex flex-col lg:flex-row gap-5 hover:shadow-md transition-shadow">
      {/* Photo and general properties */}
      <div className="flex gap-4 flex-1 min-w-0">
        {/* Left: Thumbnail image */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-[#e0e3e0] relative">
          <img
            src={listing.photo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
            alt={space.nickname}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1.5 left-1.5">
            <TypeBadge type={space.type} />
          </div>
        </div>

        {/* Mid: Info and context */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#6e7975]">storefront</span>
            <span className="text-[12px] font-bold text-[#6e7975] uppercase tracking-wider">{ownerName}</span>
          </div>

          <h3 className="font-black text-[#181c1b] text-[16px] leading-snug">{space.nickname}</h3>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6e7975] font-medium mt-0.5">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">straighten</span>
              <span>
                {space.dimensions?.l}×{space.dimensions?.w}×{space.dimensions?.h} {space.dimensions?.unit}
              </span>
            </div>
            {space.floor && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">layers</span>
                <span>Floor {space.floor}</span>
              </div>
            )}
            {space.footfall && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">groups</span>
                <span>{space.footfall} Footfall</span>
              </div>
            )}
          </div>

          {/* Product preference */}
          {listing.productPreference && (
            <div className="mt-2 bg-[#f7faf7] border border-[#e0e3e0] rounded-xl p-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e7975] mb-0.5">
                Brand Preference
              </div>
              <p className="text-[12px] text-[#6e7975] italic leading-relaxed line-clamp-2">
                "{listing.productPreference}"
              </p>
            </div>
          )}

          {/* Suitable tags */}
          {space.suitableProducts && space.suitableProducts.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {space.suitableProducts.map((p, i) => (
                <SuitabilityPill key={i} label={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing / Duration Summary */}
      <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col justify-between items-center lg:items-end border-t lg:border-t-0 lg:border-l border-[#e0e3e0] pt-4 lg:pt-0 lg:pl-5 gap-3">
        <div className="text-left lg:text-right flex flex-col">
          <div className="text-[11px] font-bold text-[#6e7975] uppercase tracking-wider">
            Duration & Cost
          </div>
          <div className="text-[18px] font-black text-[#005344] leading-tight mt-0.5">
            PKR {listing.totalPrice?.toLocaleString()}
          </div>
          <div className="text-[12px] text-[#6e7975] font-semibold">
            PKR {listing.pricePerMonth?.toLocaleString()}/mo
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#fe6a34] mt-1.5 bg-[#fe6a34]/5 border border-[#fe6a34]/15 px-2.5 py-0.5 rounded-full self-start lg:self-end">
            <span className="material-symbols-outlined text-[13px] fill-none">schedule</span>
            {listing.durationMonths} Month{listing.durationMonths > 1 ? 's' : ''}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex lg:flex-col gap-2 shrink-0 self-end lg:w-full">
          <button
            onClick={() => onApprove(listing.id)}
            className="flex-grow lg:w-full flex items-center justify-center gap-1.5 bg-[#00875a] text-white rounded-xl px-4 py-2 font-bold text-sm hover:bg-[#006e49] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Approve
          </button>
          <button
            onClick={() => onReject(listing.id)}
            className="flex-grow lg:w-full flex items-center justify-center gap-1.5 border border-[#ba1a1a] text-[#ba1a1a] rounded-xl px-4 py-2 font-bold text-sm hover:bg-[#ba1a1a]/5 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">cancel</span>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── processed card ───────────────────────────────────────────────────────────

function ProcessedCard({ listing, space }) {
  const ownerName = getOwnerName(space);
  return (
    <div className="bg-white border border-[#e0e3e0] rounded-2xl shadow-sm p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-[#e0e3e0]">
          <img
            src={listing.photo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'}
            alt={space.nickname}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#181c1b] text-sm truncate">{space.nickname}</span>
            <TypeBadge type={space.type} />
          </div>
          <span className="text-xs text-[#6e7975] mt-0.5 font-semibold">
            {ownerName} · PKR {listing.totalPrice?.toLocaleString()} ({listing.durationMonths}m)
          </span>
        </div>
      </div>
      <StatusBadge status={listing.processedStatus} />
    </div>
  );
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#6e7975]">
      <span className="material-symbols-outlined text-[56px] text-[#e0e3e0]">list_alt</span>
      <p className="text-[15px] font-semibold text-center">No pending listing approvals.</p>
      <p className="text-sm text-center">All commercial space offers have been processed.</p>
    </div>
  );
}

// ─── main screen ──────────────────────────────────────────────────────────────

export default function PendingListingsScreen() {
  const { listings = [], spaces = [], approveListing, rejectListing } = useAdmin();
  const [activeTab, setActiveTab] = useState('All');

  // Items acted on in this session
  const [processed, setProcessed] = useState([]);

  // Filter listings by status 'Pending Approval' and not acted on yet in this session
  const rawPending = listings.filter(
    (l) => l.status === 'Pending Approval' && !processed.some((p) => p.id === l.id)
  );

  // Apply tab filters based on space types
  const getFilteredPending = () => {
    switch (activeTab) {
      case 'Shelves':
        return rawPending.filter((l) => {
          const space = spaces.find((s) => Number(s.id) === Number(l.spaceId));
          return space && space.type === 'shelf';
        });
      case 'End-Caps':
        return rawPending.filter((l) => {
          const space = spaces.find((s) => Number(s.id) === Number(l.spaceId));
          return space && space.type === 'end_cap';
        });
      case 'Window Displays':
        return rawPending.filter((l) => {
          const space = spaces.find((s) => Number(s.id) === Number(l.spaceId));
          return space && space.type === 'window_display';
        });
      case 'Other':
        return rawPending.filter((l) => {
          const space = spaces.find((s) => Number(s.id) === Number(l.spaceId));
          return space && !['shelf', 'end_cap', 'window_display'].includes(space.type);
        });
      default:
        return rawPending;
    }
  };

  const getFilteredProcessed = () => {
    switch (activeTab) {
      case 'Shelves':
        return processed.filter((l) => {
          const space = spaces.find((s) => Number(s.id) === Number(l.spaceId));
          return space && space.type === 'shelf';
        });
      case 'End-Caps':
        return processed.filter((l) => {
          const space = spaces.find((s) => Number(s.id) === Number(l.spaceId));
          return space && space.type === 'end_cap';
        });
      case 'Window Displays':
        return processed.filter((l) => {
          const space = spaces.find((s) => Number(s.id) === Number(l.spaceId));
          return space && space.type === 'window_display';
        });
      case 'Other':
        return processed.filter((l) => {
          const space = spaces.find((s) => Number(s.id) === Number(l.spaceId));
          return space && !['shelf', 'end_cap', 'window_display'].includes(space.type);
        });
      default:
        return processed;
    }
  };

  const filteredPending = getFilteredPending();
  const filteredProcessed = getFilteredProcessed();
  const totalPending = rawPending.length;

  const handleApprove = (id) => {
    approveListing?.(id);
    const listing = listings.find((l) => l.id === id);
    if (listing) {
      setProcessed((prev) => [...prev, { ...listing, processedStatus: 'Approved' }]);
    }
  };

  const handleReject = (id) => {
    rejectListing?.(id);
    const listing = listings.find((l) => l.id === id);
    if (listing) {
      setProcessed((prev) => [...prev, { ...listing, processedStatus: 'Rejected' }]);
    }
  };

  const showEmpty = filteredPending.length === 0 && filteredProcessed.length === 0;

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full bg-[#f7faf7]">
      {/* Page Heading */}
      <div className="flex items-center gap-3">
        <h1 className="text-[20px] font-black text-[#181c1b]">Listing Approvals</h1>
        {totalPending > 0 && (
          <span className="flex items-center justify-center min-w-[26px] h-[26px] px-1.5 rounded-full bg-[#fe6a34] text-white text-xs font-black">
            {totalPending}
          </span>
        )}
      </div>

      {/* Filter Tabs */}
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

      {/* Empty State */}
      {showEmpty && <EmptyState />}

      {/* Pending Listings List */}
      {filteredPending.length > 0 && (
        <div className="flex flex-col gap-4">
          {filteredPending.map((listing) => {
            const space = spaces.find((s) => Number(s.id) === Number(listing.spaceId)) || {};
            return (
              <ListingCard
                key={listing.id}
                listing={listing}
                space={space}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            );
          })}
        </div>
      )}

      {/* Processed Section */}
      {filteredProcessed.length > 0 && (
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-black text-[#181c1b]">Processed</h2>
            <span className="text-xs text-[#6e7975] font-semibold">
              ({filteredProcessed.length})
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {filteredProcessed.map((listing) => {
              const space = spaces.find((s) => Number(s.id) === Number(listing.spaceId)) || {};
              return (
                <ProcessedCard
                  key={listing.id + '-processed'}
                  listing={listing}
                  space={space}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
