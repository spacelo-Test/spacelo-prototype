import React, { useState } from 'react';
import { useShopkeeper } from './ShopkeeperContext';
import DisputeTimer from './DisputeTimer';

/* ── Disputes Detail View ───────────────────────────────────────────────────── */
function DisputeDetail({ disputeId, onBack }) {
  const { disputes, setDisputes, navigateToView } = useShopkeeper();
  const [hasReUploaded, setHasReUploaded] = useState(false);
  const dispute = disputes.find(d => Number(d.id) === Number(disputeId));

  if (!dispute) return <div className="p-4 text-xs text-[#6e7975]">Dispute not found.</div>;

  const markResolved = () => {
    setDisputes(prev =>
      prev.map(d => Number(d.id) === Number(disputeId) ? { ...d, status: 'Resolved', timeline: [...d.timeline, { event: 'Dispute resolved by shopkeeper', time: 'Just now', by: 'shopkeeper' }] } : d)
    );
    onBack();
  };

  return (
    <div className="p-4 space-y-5 pb-8">
      {/* header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ebefec] transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[#005344] text-[22px]">arrow_back</span>
        </button>
        <h2 className="text-[20px] font-black text-[#005344]">Dispute Detail</h2>
      </div>

      {/* summary card */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        {/* brand */}
        <div className="flex gap-3 items-center">
          <div className={`w-12 h-12 ${dispute.logoBg} rounded-xl flex items-center justify-center text-white font-black text-[22px] shrink-0`}>
            {dispute.logo}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-black text-[#181c1b]">{dispute.brand}</h3>
            <p className="text-[11px] text-[#6e7975]">{dispute.spaceName}</p>
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${
            dispute.status === 'Open'
              ? 'bg-[#ba1a1a]/10 text-[#ba1a1a] border-[#ba1a1a]/20'
              : 'bg-[#005344]/10 text-[#005344] border-[#005344]/20'
          }`}>
            {dispute.status}
          </span>
        </div>

        {/* reason */}
        <div>
          <p className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide mb-1">Reason</p>
          <p className="text-[13px] font-black text-[#181c1b]">{dispute.reason}</p>
        </div>

        {/* concern detail */}
        <div>
          <p className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide mb-1.5">Company's Concern</p>
          <div className="bg-[#f7faf7] border border-[#e0e3e0] rounded-xl p-3 text-xs text-[#3e4945] leading-relaxed">
            {dispute.detail}
          </div>
        </div>

        {/* raised at */}
        <p className="text-[10px] text-[#6e7975]">
          Raised: {new Date(dispute.raisedAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      </div>

      {/* timer — prominent */}
      {dispute.status === 'Open' && (
        <DisputeTimer expiresAt={dispute.expiresAt} />
      )}

      {/* resolution actions */}
      {dispute.status === 'Open' && (
        <div className="space-y-2">
          <button
            onClick={() => {
              navigateToView('requests', 'proof-upload', dispute.requestId);
              setHasReUploaded(true);
            }}
            className="w-full py-4 bg-[#005344] text-white rounded-2xl font-black text-[13px] shadow-[0_4px_16px_rgba(0,83,68,0.35)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
            Re-upload Proof Photos
          </button>

          <button
            onClick={markResolved}
            disabled={!hasReUploaded}
            className={`w-full py-4 rounded-2xl font-black text-[13px] border-2 transition-all flex items-center justify-center gap-2 ${
              hasReUploaded
                ? 'border-[#005344] text-[#005344] hover:bg-[#005344]/5'
                : 'border-[#e0e3e0] text-[#bec9c4] cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Mark as Resolved
          </button>
          {!hasReUploaded && (
            <p className="text-[10px] text-[#6e7975] text-center">Re-upload proof first to enable mark as resolved</p>
          )}
        </div>
      )}

      {/* dispute timeline */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide">Dispute Timeline</p>
        <div className="relative pl-4 border-l-2 border-[#e0e3e0] space-y-4">
          {dispute.timeline.map((item, i) => (
            <div key={i} className="relative">
              <span className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                item.by === 'company' ? 'bg-[#0052cc]'
                : item.by === 'shopkeeper' ? 'bg-[#005344]'
                : 'bg-[#6e7975]'
              }`} />
              <div className="bg-white border border-[#e0e3e0] rounded-xl p-3 ml-2 text-xs space-y-0.5">
                <p className="font-bold text-[#181c1b]">{item.event}</p>
                <p className="text-[#bec9c4]">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* info note */}
      <div className="bg-[#ffab00]/5 border border-[#ffab00]/20 rounded-xl p-3 flex gap-2 items-start text-[10px] text-[#7a4f00]">
        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
        <p>If unresolved in time, admin will review and decide based on contract and proof. Platform admin decision is final and binding.</p>
      </div>
    </div>
  );
}

/* ── Disputes List View ─────────────────────────────────────────────────────── */
function DisputesList({ onSelectDispute, navigateToView }) {
  const { disputes } = useShopkeeper();
  const open = disputes.filter(d => d.status === 'Open');
  const resolved = disputes.filter(d => d.status !== 'Open');

  return (
    <div className="p-4 space-y-5 pb-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateToView('dashboard', 'main')}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ebefec] transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[#005344] text-[22px]">arrow_back</span>
        </button>
        <h1 className="text-[22px] font-black text-[#005344]">Disputes</h1>
      </div>

      {/* open disputes */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide px-1">
          Open Disputes {open.length > 0 && <span className="text-[#ba1a1a]">({open.length})</span>}
        </p>

        {open.length === 0 ? (
          <div className="bg-white border border-[#e0e3e0] rounded-2xl p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-[#005344]/5 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[#005344] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            </div>
            <div>
              <p className="text-[13px] font-black text-[#181c1b]">No open disputes</p>
              <p className="text-xs text-[#6e7975] mt-1">You have no active disputes at this time.</p>
            </div>
          </div>
        ) : (
          open.map(d => (
            <div
              key={d.id}
              onClick={() => onSelectDispute(d.id)}
              className="bg-white border border-[#e0e3e0] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#ba1a1a] hover:shadow-[0_4px_16px_rgba(186,26,26,0.08)] transition-all active:scale-[0.98] overflow-hidden"
              style={{ borderLeft: '3px solid #ba1a1a' }}
            >
              <div className="p-4 space-y-3">
                {/* brand row */}
                <div className="flex gap-3 items-start">
                  <div className={`w-10 h-10 ${d.logoBg} rounded-xl flex items-center justify-center text-white font-black text-[18px] shrink-0`}>
                    {d.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-black text-[#181c1b]">{d.brand}</p>
                      <span className="text-[8px] font-black uppercase tracking-wider bg-[#ba1a1a]/10 text-[#ba1a1a] border border-[#ba1a1a]/20 px-1.5 py-0.5 rounded-full">Open</span>
                    </div>
                    <p className="text-[11px] text-[#6e7975]">{d.spaceName}</p>
                    <p className="text-[11px] text-[#181c1b] font-bold mt-0.5 line-clamp-1">{d.reason}</p>
                  </div>
                </div>
                {/* timer compact */}
                <DisputeTimer expiresAt={d.expiresAt} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* resolved disputes */}
      {resolved.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide px-1">Resolved</p>
          {resolved.map(d => (
            <div
              key={d.id}
              onClick={() => onSelectDispute(d.id)}
              className="bg-[#f7faf7] border border-[#e0e3e0] rounded-2xl p-4 cursor-pointer hover:border-[#005344] transition-all"
            >
              <div className="flex gap-3 items-center">
                <div className={`w-9 h-9 ${d.logoBg} rounded-lg opacity-60 flex items-center justify-center text-white font-black text-[16px] shrink-0`}>
                  {d.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-[#6e7975]">{d.brand}</p>
                  <p className="text-[10px] text-[#bec9c4] truncate">{d.reason}</p>
                </div>
                <span className="text-[8px] font-black uppercase text-[#005344] bg-[#005344]/10 px-2 py-1 rounded-full border border-[#005344]/20">
                  Resolved
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Root DisputesView ──────────────────────────────────────────────────────── */
export default function DisputesView() {
  const { currentView, setCurrentView, viewParams, setViewParams, navigateToView } = useShopkeeper();

  const selectDispute = (id) => {
    setCurrentView('detail');
    setViewParams(id);
  };

  if (currentView === 'detail' && viewParams != null) {
    return (
      <DisputeDetail
        disputeId={viewParams}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  return (
    <DisputesList
      onSelectDispute={selectDispute}
      navigateToView={navigateToView}
    />
  );
}
