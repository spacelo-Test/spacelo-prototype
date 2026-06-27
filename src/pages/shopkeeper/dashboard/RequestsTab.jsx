import React, { useState } from 'react';
import { useShopkeeper } from './ShopkeeperContext';

/* ─── helpers ──────────────────────────────────────────────────────────────── */
function getDurationMonths(r) {
  if (r.durationMonths) return r.durationMonths;
  if (r.startDate && r.endDate) {
    const dtStart = new Date(r.startDate);
    const dtEnd = new Date(r.endDate);
    if (!isNaN(dtStart) && !isNaN(dtEnd)) {
      const months = (dtEnd.getFullYear() - dtStart.getFullYear()) * 12 + (dtEnd.getMonth() - dtStart.getMonth());
      return Math.max(1, months);
    }
  }
  return 1;
}

function generateMonthlyBreakdown(offeredPrice, durationMonths, startDate) {
  const price = offeredPrice || 0;
  const monthsCount = durationMonths || 1;
  const pricePerMonth = Math.round(price / monthsCount);
  const commissionPerMonth = Math.round(pricePerMonth * 0.15);
  const netPerMonth = pricePerMonth - commissionPerMonth;
  
  let start = new Date();
  if (startDate) {
    const parsed = new Date(startDate);
    if (!isNaN(parsed)) {
      start = parsed;
    }
  }
  
  const list = [];
  for (let i = 0; i < monthsCount; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const monthName = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    list.push({
      month: monthName,
      gross: pricePerMonth,
      commission: commissionPerMonth,
      net: netPerMonth,
      status: "In Escrow"
    });
  }
  return list;
}

function StatusBadge({ status }) {
  const map = {
    Pending:   'bg-[#ffab00]/10 text-[#7a4f00] border border-[#ffab00]/30',
    Countered: 'bg-[#0052cc]/10 text-[#0052cc] border border-[#0052cc]/20',
    Accepted:  'bg-[#005344]/10 text-[#005344] border border-[#005344]/20',
    Rejected:  'bg-[#ba1a1a]/10 text-[#ba1a1a] border border-[#ba1a1a]/20',
    Completed: 'bg-[#3e4945]/10 text-[#3e4945] border border-[#3e4945]/20',
  };
  return (
    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ebefec] transition-colors shrink-0"
    >
      <span className="material-symbols-outlined text-[#005344] text-[22px]">arrow_back</span>
    </button>
  );
}

const PROOF_POOL = [
  'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1601601393049-4d50c92d20c5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506617424151-74f5609c1fa6?auto=format&fit=crop&w=400&q=80',
];

const TIMELINE_STEPS = [
  'Requested', 'Accepted', 'Contract Signed', 'Payment Secured',
  'Product Pending', 'Product Placed', 'Active', 'Completed',
];

/* ─── Booking Calendar ──────────────────────────────────────────────────────── */
function CalendarView({ onBack }) {
  const { spaces } = useShopkeeper();
  const [view, setView] = useState('month');
  const [filterSpace, setFilterSpace] = useState('all');
  const [selectedDay, setSelectedDay] = useState(null);

  // June 2025 starts on Sunday (idx 0)
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const leadingBlanks = 0; // June 1, 2025 is a Sunday

  const bookingRanges = [
    { start: 1, end: 14, label: 'Nestle — Checkout Stand', color: '#005344', spaceId: 4 },
    { start: 15, end: 28, label: 'Tapal — Shelf A', color: '#005344', spaceId: 1 },
    { start: 1,  end: 30, label: 'P&G ADVANCE — Shelf A', color: '#0d9488', spaceId: 1, isAdvance: true },
  ];

  const getDayInfo = (day) => bookingRanges.filter(r =>
    (filterSpace === 'all' || r.spaceId === parseInt(filterSpace)) &&
    day >= r.start && day <= r.end
  );

  return (
    <div className="p-4 space-y-4 pb-6">
      <div className="flex items-center gap-3">
        <BackBtn onClick={onBack} />
        <h2 className="text-[20px] font-black text-[#005344]">Booking Calendar</h2>
      </div>

      {/* controls */}
      <div className="flex gap-2 items-center">
        <div className="flex bg-white border border-[#e0e3e0] rounded-lg overflow-hidden text-[11px] font-bold">
          {['month', 'week'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 capitalize transition-colors ${view === v ? 'bg-[#005344] text-white' : 'text-[#6e7975]'}`}>
              {v}
            </button>
          ))}
        </div>
        <select
          value={filterSpace}
          onChange={e => setFilterSpace(e.target.value)}
          className="flex-1 bg-white border border-[#e0e3e0] rounded-lg px-3 py-1.5 text-[11px] font-bold text-[#3e4945] outline-none"
        >
          <option value="all">All Spaces</option>
          {spaces.map(s => <option key={s.id} value={s.id}>{s.nickname}</option>)}
        </select>
      </div>

      {/* calendar card */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl p-4 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <p className="text-center font-black text-[#181c1b] text-[15px]">June 2025</p>
        <div className="grid grid-cols-7 gap-1">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <span key={d} className="text-center text-[10px] font-black text-[#6e7975] py-1">{d}</span>
          ))}
          {Array.from({ length: leadingBlanks }).map((_, i) => <span key={`b-${i}`} />)}
          {days.map(day => {
            const info = getDayInfo(day);
            const hasRegular = info.some(r => !r.isAdvance);
            const hasAdvance = info.some(r => r.isAdvance);
            const bg = hasRegular ? 'bg-[#005344] text-white' : hasAdvance ? 'bg-[#0d9488] text-white' : 'bg-[#f7faf7] text-[#3e4945]';
            return (
              <button key={day} onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                className={`aspect-square rounded-lg text-[11px] font-bold flex items-center justify-center transition-all relative ${bg} ${selectedDay === day ? 'ring-2 ring-[#fe6a34]' : ''}`}>
                {day}
                {hasAdvance && hasRegular && (
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-[#0d9488] rounded-full border border-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 justify-center pt-1">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#3e4945]">
            <span className="w-3 h-3 rounded bg-[#005344]" /> Active Booking
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#3e4945]">
            <span className="w-3 h-3 rounded bg-[#0d9488]" /> Advance Reservation
          </span>
        </div>
      </div>

      {/* Day popup */}
      {selectedDay && (() => {
        const info = getDayInfo(selectedDay);
        return info.length > 0 ? (
          <div className="bg-white border border-[#e0e3e0] rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] space-y-2">
            <p className="text-[12px] font-black text-[#005344] uppercase tracking-wide">June {selectedDay} — Bookings</p>
            {info.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                <span className="font-bold text-[#181c1b]">{r.label}</span>
                {r.isAdvance && <span className="text-[9px] font-black text-[#0d9488] bg-[#0d9488]/10 px-1.5 py-0.5 rounded-full">ADVANCE</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3 text-xs text-[#6e7975]">No bookings on June {selectedDay}</div>
        );
      })()}
    </div>
  );
}

/* ─── Proof Upload ──────────────────────────────────────────────────────────── */
function ProofUploadView({ reqId, onBack }) {
  const { requests, advanceRequests, setRequests, setAdvanceRequests, pushNotification, disputes, setDisputes, navigateToView } = useShopkeeper();
  const [proofPhotos, setProofPhotos] = useState([]);
  const allReqs = [...requests, ...advanceRequests];
  const req = allReqs.find(r => Number(r.id) === Number(reqId));
  const isAdvance = req?.type === 'advance';
  const space = req?.spaceId;

  const openDispute = disputes?.find(d => Number(d.requestId) === Number(reqId) && d.status === 'Open');

  const addPhoto = () => {
    if (proofPhotos.length >= 3) return;
    const url = PROOF_POOL[proofPhotos.length % PROOF_POOL.length];
    setProofPhotos(prev => [...prev, url]);
  };

  const submit = () => {
    const updater = r => Number(r.id) === Number(reqId)
      ? { ...r, proofs: proofPhotos, timelineStep: 5 }
      : r;
    if (isAdvance) setAdvanceRequests(prev => prev.map(updater));
    else setRequests(prev => prev.map(updater));

    if (openDispute) {
      setDisputes(prev =>
        prev.map(d => Number(d.id) === Number(openDispute.id)
          ? {
              ...d,
              status: 'Resolved',
              timeline: [
                ...d.timeline,
                { event: 'Dispute resolved (new proof uploaded)', time: 'Just now', by: 'shopkeeper' }
              ]
            }
          : d
        )
      );
      pushNotification('dispute', 'Dispute Resolved', `Dispute resolved for ${req?.brand} by uploading new proof.`, { tab: 'disputes', view: 'detail', id: openDispute.id });
      navigateToView('disputes', 'main');
    } else {
      pushNotification('payment', 'Proof Submitted', `Placement proof uploaded for ${req?.brand}.`, { tab: 'requests', view: 'booking-detail', id: reqId });
      onBack();
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <BackBtn onClick={onBack} />
        <h2 className="text-[20px] font-black text-[#005344]">Upload Proof</h2>
      </div>

      {/* booking ref */}
      <div className="bg-[#f1f8f5] border border-[#005344]/20 rounded-xl p-3.5 text-xs space-y-0.5">
        <p className="font-black text-[#005344]">{req?.brand}</p>
        <p className="text-[#3e4945]">Space #{space} • {req?.requestedDates}</p>
      </div>

      {/* instructions */}
      <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 text-xs text-[#3e4945] space-y-1">
        <p className="font-black text-[#181c1b]">Photo Instructions</p>
        <p>Upload 1–3 photos showing the product correctly placed in the booked space. Photos must clearly show the product and its position relative to the agreed placement area.</p>
      </div>

      {/* existing proofs */}
      {req?.proofs?.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-black text-[#6e7975] uppercase tracking-wide">Previously Submitted Proof</p>
          <div className="grid grid-cols-3 gap-2">
            {req.proofs.map((p, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#e0e3e0]">
                <img src={p} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded font-bold">Submitted</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* upload grid */}
      <div>
        <p className="text-[11px] font-black text-[#6e7975] uppercase tracking-wide mb-2">New Photos — {proofPhotos.length} of 3</p>
        <div className="grid grid-cols-3 gap-2">
          {proofPhotos.map((p, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#e0e3e0]">
              <img src={p} alt="" className="w-full h-full object-cover" />
              <button onClick={() => setProofPhotos(prev => prev.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80">
                <span className="material-symbols-outlined text-[11px]">close</span>
              </button>
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded font-bold">
                {new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {proofPhotos.length < 3 && (
            <button onClick={addPhoto}
              className="aspect-square border-2 border-dashed border-[#bec9c4] rounded-xl flex flex-col items-center justify-center gap-1 text-[#6e7975] bg-[#f7faf7] hover:border-[#005344] hover:text-[#005344] transition-colors">
              <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
              <span className="text-[10px] font-bold">Add Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* geo tag */}
      <div className="flex items-center gap-2 bg-[#0052cc]/5 border border-[#0052cc]/20 rounded-xl px-3 py-2.5 text-[11px] text-[#0052cc] font-bold">
        <span className="material-symbols-outlined text-[18px]">location_on</span>
        Timestamp and location auto-applied to each photo
      </div>

      <button
        onClick={submit}
        disabled={proofPhotos.length === 0}
        className={`w-full py-4 rounded-2xl font-black text-[13px] transition-all ${
          proofPhotos.length > 0
            ? 'bg-[#fe6a34] text-white shadow-[0_4px_16px_rgba(254,106,52,0.4)] active:scale-[0.98]'
            : 'bg-[#e0e3e0] text-[#bec9c4] cursor-not-allowed'
        }`}
      >
        {openDispute ? 'Submit to Resolve Dispute' : `Submit Proof (${proofPhotos.length} photo${proofPhotos.length !== 1 ? 's' : ''})`}
      </button>
    </div>
  );
}

/* ─── Contract E-Sign ───────────────────────────────────────────────────────── */
function ContractView({ reqId, onBack }) {
  const { requests, advanceRequests, setRequests, setAdvanceRequests, pushNotification, spaces } = useShopkeeper();
  const [signed, setSigned] = useState(false);
  const allReqs = [...requests, ...advanceRequests];
  const req = allReqs.find(r => Number(r.id) === Number(reqId));
  const isAdvance = req?.type === 'advance';
  const space = spaces.find(s => s.id === req?.spaceId);
  const today = new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });

  const confirmSign = () => {
    const updater = r => Number(r.id) === Number(reqId)
      ? { ...r, contractSignedByShopkeeper: true, timelineStep: 3 }
      : r;
    if (isAdvance) setAdvanceRequests(prev => prev.map(updater));
    else setRequests(prev => prev.map(updater));
    pushNotification('contract', 'Contract Signed', `You signed the contract for ${req?.brand}.`, { tab: 'requests', view: 'booking-detail', id: reqId });
    onBack();
  };

  const isSigned = req?.contractSignedByShopkeeper || signed;

  return (
    <div className="p-4 space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <BackBtn onClick={onBack} />
        <h2 className="text-[20px] font-black text-[#005344]">Review & Sign</h2>
      </div>

      {/* key terms */}
      <div className="bg-[#f1f8f5] border border-[#005344]/20 rounded-2xl p-4 space-y-2 text-xs">
        <p className="font-black text-[#005344] text-[13px] border-b border-[#005344]/20 pb-2">Key Terms Summary</p>
        {[
          ['Space', space?.nickname || `Space #${req?.spaceId}`],
          ['Company', req?.brand],
          ['Shopkeeper', 'Super Store'],
          ['Duration', req?.requestedDates],
          ['Total Price', `PKR ${req?.offeredPrice?.toLocaleString()}`],
          ['Per Month', `PKR ${req?.pricePerMonth?.toLocaleString()}/mo`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-[#6e7975]">{k}</span>
            <span className="font-bold text-[#181c1b]">{v}</span>
          </div>
        ))}
      </div>

      {/* contract text */}
      <div className="bg-white border border-[#bec9c4] rounded-2xl p-4 h-52 overflow-y-auto text-[10px] text-[#3e4945] leading-relaxed space-y-3">
        <p className="font-black text-center text-[12px] text-[#181c1b]">RETAIL SPACE PLACEMENT AGREEMENT</p>
        <p><span className="font-bold">1. Parties.</span> This Agreement is entered into between Super Store ("Shopkeeper") and {req?.brand} ("Company"), facilitated by Spacelo ("Platform").</p>
        <p><span className="font-bold">2. Space Description.</span> Shopkeeper agrees to make available: {space?.nickname}. Dimensions: {space?.dimensions ? `${space.dimensions.l}×${space.dimensions.w}×${space.dimensions.h} ${space.dimensions.unit}` : 'As described'}. Location: {space?.type?.replace('_', ' ')}.</p>
        <p><span className="font-bold">3. Duration.</span> The placement period shall be {req?.requestedDates} ({req?.durationMonths} month{req?.durationMonths !== 1 ? 's' : ''}). Time is of the essence.</p>
        <p><span className="font-bold">4. Payment.</span> Total consideration is PKR {req?.offeredPrice?.toLocaleString()}, disbursed monthly at PKR {req?.pricePerMonth?.toLocaleString()} per month, held in escrow by Platform and released upon successful proof verification each month.</p>
        <p><span className="font-bold">5. Obligations.</span> Shopkeeper shall maintain the space in clean, accessible condition as per contracted dimensions. Company shall place only approved products: {req?.productName}. Neither party shall alter placement without mutual consent.</p>
        <p><span className="font-bold">6. Dispute Resolution.</span> Any disputes shall first be submitted through the Spacelo Platform dispute mechanism with a 24-hour resolution window. Unresolved disputes escalate to Platform admin for final decision. Platform decision is binding on both parties.</p>
        <p><span className="font-bold">7. Cancellation Policy.</span> Full refund is available only before contract signing. No refund after product is placed. Shopkeeper may claim partial compensation if Company defaults after signing.</p>
        <p className="text-[#6e7975] text-[9px]">This is a legally binding agreement facilitated through the Spacelo platform. By signing, both parties agree to all terms above and the Spacelo platform policies.</p>
      </div>

      {/* signature area */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl p-4 space-y-3">
        <p className="text-[11px] font-black text-[#6e7975] uppercase tracking-wide">E-Signature</p>
        <div className={`h-28 border-2 border-dashed rounded-xl flex items-center justify-center relative transition-all ${isSigned ? 'border-[#005344] bg-[#f1f8f5]' : 'border-[#bec9c4] bg-[#f7faf7]'}`}>
          {isSigned ? (
            <div className="text-center">
              <span className="material-symbols-outlined text-[#005344] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-[11px] font-black text-[#005344] mt-1">Signed</p>
            </div>
          ) : (
            <div className="text-center text-[#bec9c4]">
              <span className="material-symbols-outlined text-[36px]">edit</span>
              <p className="text-[10px] font-bold mt-1">Tap to Sign</p>
            </div>
          )}
        </div>
        {isSigned && <button className="text-[10px] text-[#ba1a1a] font-bold hover:underline" onClick={() => setSigned(false)}>Clear Signature</button>}
        <p className="text-[10px] text-[#6e7975]">Date: {today}</p>
      </div>

      {/* sig status cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-xl p-3 text-center border text-xs ${req?.contractSignedByBrand ? 'bg-[#005344]/5 border-[#005344]/20' : 'bg-[#ffab00]/5 border-[#ffab00]/20'}`}>
          <span className="material-symbols-outlined text-[20px] block mx-auto mb-1" style={{ color: req?.contractSignedByBrand ? '#005344' : '#ffab00', fontVariationSettings: "'FILL' 1" }}>
            {req?.contractSignedByBrand ? 'check_circle' : 'hourglass_empty'}
          </span>
          <p className="font-black text-[10px]" style={{ color: req?.contractSignedByBrand ? '#005344' : '#7a4f00' }}>
            {req?.contractSignedByBrand ? 'Company Signed ✓' : '⏳ Awaiting Company'}
          </p>
        </div>
        <div className={`rounded-xl p-3 text-center border text-xs ${isSigned ? 'bg-[#005344]/5 border-[#005344]/20' : 'bg-[#f7faf7] border-[#e0e3e0]'}`}>
          {isSigned ? (
            <>
              <span className="material-symbols-outlined text-[20px] block mx-auto mb-1 text-[#005344]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="font-black text-[10px] text-[#005344]">You Signed ✓</p>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px] block mx-auto mb-1 text-[#6e7975]">draw</span>
              <button onClick={() => setSigned(true)} className="text-[10px] font-black text-[#005344] underline">Tap to Sign</button>
            </>
          )}
        </div>
      </div>

      <button
        onClick={confirmSign}
        disabled={!isSigned}
        className={`w-full py-4 rounded-2xl font-black text-[13px] transition-all ${
          isSigned
            ? 'bg-[#005344] text-white shadow-[0_4px_16px_rgba(0,83,68,0.35)] active:scale-[0.98]'
            : 'bg-[#e0e3e0] text-[#bec9c4] cursor-not-allowed'
        }`}
      >
        Confirm & Sign Contract
      </button>
      <button className="w-full text-center text-[11px] text-[#005344] font-bold hover:underline flex items-center justify-center gap-1">
        <span className="material-symbols-outlined text-[14px]">download</span>Download PDF (simulated)
      </button>
    </div>
  );
}

/* ─── Booking Detail ────────────────────────────────────────────────────────── */
function BookingDetailView({ reqId, onBack, onGoToContract, onGoToProof, navigateToView }) {
  const { requests, advanceRequests, spaces, disputes } = useShopkeeper();
  const allReqs = [...requests, ...advanceRequests];
  const req = allReqs.find(r => Number(r.id) === Number(reqId));
  if (!req) return <div className="p-4 text-xs text-[#6e7975]">Booking not found.</div>;

  const space = spaces.find(s => s.id === req.spaceId);
  const step = req.timelineStep ?? 0;

  // Fallbacks to prevent crash if data is dynamically/partially synchronized
  const duration = req.durationMonths || getDurationMonths(req);
  const monthlyBreakdown = req.monthlyBreakdown || generateMonthlyBreakdown(req.offeredPrice, duration, req.startDate);

  const totalCommission = monthlyBreakdown.reduce((s, m) => s + m.commission, 0);
  const totalNet = monthlyBreakdown.reduce((s, m) => s + m.net, 0);

  const escrowStatusStyle = (st) => {
    if (st === 'Released') return 'bg-[#005344]/10 text-[#005344]';
    if (st === 'In Escrow') return 'bg-[#0052cc]/10 text-[#0052cc]';
    return 'bg-[#3e4945]/10 text-[#6e7975]';
  };
  const escrowIcon = (st) => st === 'Released' ? 'check_circle' : st === 'In Escrow' ? 'lock' : 'schedule';

  return (
    <div className="p-4 space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <BackBtn onClick={onBack} />
        <h2 className="text-[20px] font-black text-[#005344]">Booking Detail</h2>
      </div>

      {/* 8-step timeline stepper */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <p className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide mb-4">Booking Progress</p>
        <div className="flex items-start gap-0">
          {TIMELINE_STEPS.map((label, i) => {
            const past = i < step;
            const current = i === step;
            const future = i > step;
            return (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                {/* connector left */}
                {i > 0 && (
                  <div className={`absolute top-3 right-1/2 left-0 h-0.5 ${past || current ? 'bg-[#005344]' : 'bg-[#e0e3e0]'}`} />
                )}
                {/* connector right */}
                {i < TIMELINE_STEPS.length - 1 && (
                  <div className={`absolute top-3 left-1/2 right-0 h-0.5 ${past ? 'bg-[#005344]' : 'bg-[#e0e3e0]'}`} />
                )}
                {/* dot */}
                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                  past ? 'bg-[#005344]' : current ? 'bg-[#ffab00]' : 'bg-[#e0e3e0]'
                } ${current ? 'ring-4 ring-[#ffab00]/30 animate-pulse' : ''}`}>
                  {past
                    ? <span className="material-symbols-outlined text-white text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    : <span className={`text-[8px] font-black ${current ? 'text-white' : 'text-[#bec9c4]'}`}>{i + 1}</span>
                  }
                </div>
                <p className={`text-[8px] font-bold text-center mt-1 leading-tight ${past || current ? 'text-[#005344]' : 'text-[#bec9c4]'}`}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* company + space */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex gap-3 items-center">
        <div className={`w-12 h-12 ${req.logoBg} rounded-xl flex items-center justify-center text-white font-black text-[22px] shrink-0`}>{req.logo}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="text-[15px] font-black text-[#181c1b] truncate">{req.brand}</h3>
            {req.verified && <span className="material-symbols-outlined text-[14px] text-[#005344]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>}
          </div>
          <p className="text-[11px] text-[#6e7975]">{space?.nickname} • {space?.type?.replace('_', ' ')}</p>
          <p className="text-[11px] font-bold text-[#005344]">{req.requestedDates}</p>
        </div>
      </div>

      {/* financial breakdown */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
        <p className="text-[11px] font-black text-[#6e7975] uppercase tracking-wide border-b border-[#ebefec] pb-2">Financial Breakdown</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between"><span className="text-[#6e7975]">Company paid</span><span className="font-black text-[#181c1b]">PKR {req.offeredPrice.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-[#6e7975]">Platform commission (15%)</span><span className="font-bold text-[#ba1a1a]">−PKR {totalCommission.toLocaleString()}</span></div>
          <div className="flex justify-between pt-2 border-t border-[#ebefec]"><span className="font-black text-[#005344]">Net payout to you</span><span className="font-black text-[#005344] text-[14px]">PKR {totalNet.toLocaleString()}</span></div>
        </div>

        {/* monthly table */}
        <div className="rounded-xl overflow-hidden border border-[#e0e3e0] mt-2">
          <table className="w-full text-[10px]">
            <thead className="bg-[#f7faf7]">
              <tr>
                {['Month', 'Gross', 'Comm.', 'Net', 'Status'].map(h => (
                  <th key={h} className="px-2 py-2 text-left font-black text-[#6e7975] uppercase tracking-wide text-[8px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyBreakdown.map((row, i) => (
                <tr key={i} className="border-t border-[#f0f0f0]">
                  <td className="px-2 py-2 font-bold text-[#181c1b] whitespace-nowrap">{row.month.split(' ')[0]}</td>
                  <td className="px-2 py-2 text-[#3e4945]">{(row.gross / 1000).toFixed(0)}k</td>
                  <td className="px-2 py-2 text-[#ba1a1a]">{(row.commission / 1000).toFixed(1)}k</td>
                  <td className="px-2 py-2 font-bold text-[#005344]">{(row.net / 1000).toFixed(1)}k</td>
                  <td className="px-2 py-2">
                    <span className={`flex items-center gap-0.5 text-[8px] font-black px-1.5 py-0.5 rounded-full ${escrowStatusStyle(row.status)}`}>
                      <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>{escrowIcon(row.status)}</span>
                      {row.status === 'In Escrow' ? 'Escrow' : row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* primary CTAs */}
      <div className="space-y-2">
        {req.contractSignedByBrand && !req.contractSignedByShopkeeper && (
          <button onClick={onGoToContract}
            className="w-full py-4 bg-[#005344] text-white rounded-2xl font-black text-[13px] shadow-[0_4px_16px_rgba(0,83,68,0.35)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <span className="material-symbols-outlined text-[18px]">draw</span>
            View & Sign Contract
          </button>
        )}
        {req.contractSignedByShopkeeper && req.proofs.length === 0 && (
          <button onClick={onGoToProof}
            className="w-full py-4 bg-[#fe6a34] text-white rounded-2xl font-black text-[13px] shadow-[0_4px_16px_rgba(254,106,52,0.4)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
            Upload Placement Proof
          </button>
        )}
        {req.contractSignedByBrand && req.contractSignedByShopkeeper && (
          <div className="flex items-center gap-2 bg-[#005344]/5 border border-[#005344]/20 text-[#005344] rounded-xl p-3 text-xs font-bold justify-center">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Both Parties Signed Contract
          </div>
        )}
        {req.proofs.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-black text-[#6e7975] uppercase tracking-wide">Submitted Proof</p>
            <div className="grid grid-cols-3 gap-2">
              {req.proofs.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#e0e3e0]">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded">Verified</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* cancellation policy */}
      <div className="bg-[#3e4945]/5 border border-[#3e4945]/10 rounded-xl p-3 text-[10px] text-[#3e4945] flex gap-2">
        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">info</span>
        <p><span className="font-black">Cancellation Policy:</span> Full refund only before contract signing. No refund after product is placed.</p>
      </div>

      {/* raise / view dispute */}
      {(() => {
        const relatedDispute = disputes?.find(d => Number(d.requestId) === Number(reqId));
        if (relatedDispute) {
          const isOpen = relatedDispute.status === 'Open';
          return (
            <button
              onClick={() => navigateToView('disputes', 'detail', relatedDispute.id)}
              className={`w-full py-3 border-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isOpen
                  ? 'border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ba1a1a]/5'
                  : 'border-[#005344] text-[#005344] hover:bg-[#005344]/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isOpen ? 'report_problem' : 'check_circle'}
              </span>
              {isOpen ? 'View Active Dispute' : 'View Resolved Dispute'}
            </button>
          );
        }
        if (step >= 4) {
          return (
            <button onClick={() => navigateToView('disputes', 'main')}
              className="w-full py-3 border-2 border-[#ba1a1a] text-[#ba1a1a] rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#ba1a1a]/5 transition-colors">
              <span className="material-symbols-outlined text-[16px]">report_problem</span>
              Raise a Dispute
            </button>
          );
        }
        return null;
      })()}
    </div>
  );
}

/* ─── Counter-Offer Form ────────────────────────────────────────────────────── */
function CounterOfferView({ reqId, onBack, onDone }) {
  const { requests, advanceRequests, setRequests, setAdvanceRequests, pushNotification, spaces } = useShopkeeper();
  const allReqs = [...requests, ...advanceRequests];
  const req = allReqs.find(r => Number(r.id) === Number(reqId));
  const isAdvance = req?.type === 'advance';

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [spaceId, setSpaceId] = useState(req?.spaceId || '');
  const [note, setNote] = useState('');

  const durationDays = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000))
    : 0;
  const durationMonths = durationDays > 0 ? Math.round(durationDays / 30) : 0;
  const perMonth = price && durationMonths > 0 ? Math.round(Number(price) / durationMonths) : 0;

  const availableSpaces = spaces.filter(s => s.status === 'Unlisted' || s.id === req?.spaceId);

  const canSend = startDate && endDate && price && spaceId;

  const send = () => {
    const entry = {
      by: 'shopkeeper',
      date: 'Today',
      newDates: `${startDate} – ${endDate}`,
      newPrice: Number(price),
      note,
    };
    const updater = r => Number(r.id) === Number(reqId)
      ? { ...r, status: 'Countered', counterHistory: [...(r.counterHistory || []), entry] }
      : r;
    if (isAdvance) setAdvanceRequests(prev => prev.map(updater));
    else setRequests(prev => prev.map(updater));
    pushNotification('request', 'Counter-offer Sent', `You sent a counter-offer to ${req?.brand}.`, { tab: 'requests', view: 'detail', id: reqId });
    onDone();
  };

  return (
    <div className="p-4 space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <BackBtn onClick={onBack} />
        <div>
          <h2 className="text-[18px] font-black text-[#005344]">Send Counter-offer</h2>
          <p className="text-[11px] text-[#6e7975]">{req?.brand} · Space #{req?.spaceId}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-[10px] text-amber-800 flex gap-2 items-start">
        <span className="material-symbols-outlined text-[16px] shrink-0">info</span>
        <p>Not a chat — keep your counter brief and factual. The company will review your proposed terms.</p>
      </div>

      <div className="space-y-4">
        {/* dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide block mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full border border-[#e0e3e0] rounded-xl px-3 py-2.5 text-[12px] font-bold text-[#181c1b] bg-white outline-none focus:ring-2 focus:ring-[#005344]/30 focus:border-[#005344]" />
          </div>
          <div>
            <label className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide block mb-1">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full border border-[#e0e3e0] rounded-xl px-3 py-2.5 text-[12px] font-bold text-[#181c1b] bg-white outline-none focus:ring-2 focus:ring-[#005344]/30 focus:border-[#005344]" />
          </div>
        </div>
        {durationMonths > 0 && (
          <p className="text-[11px] text-[#005344] font-bold -mt-2">Duration: ~{durationMonths} month{durationMonths !== 1 ? 's' : ''} ({durationDays} days)</p>
        )}

        {/* price */}
        <div>
          <label className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide block mb-1">New Total Price (PKR)</label>
          <div className="flex items-center border border-[#e0e3e0] rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#005344]/30 focus-within:border-[#005344]">
            <span className="pl-3 pr-2 text-[11px] font-black text-[#6e7975] shrink-0">PKR</span>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0"
              className="flex-1 py-2.5 pr-3 text-[13px] font-black text-[#181c1b] bg-transparent outline-none" />
          </div>
          {perMonth > 0 && (
            <p className="text-[11px] text-[#005344] font-bold mt-1">= PKR {perMonth.toLocaleString()} / month</p>
          )}
        </div>

        {/* space selector */}
        <div>
          <label className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide block mb-1">Proposed Space</label>
          <select value={spaceId} onChange={e => setSpaceId(e.target.value)}
            className="w-full border border-[#e0e3e0] rounded-xl px-3 py-2.5 text-[12px] font-bold text-[#181c1b] bg-white outline-none focus:ring-2 focus:ring-[#005344]/30 focus:border-[#005344]">
            <option value="">Select a space</option>
            {availableSpaces.map(s => (
              <option key={s.id} value={s.id}>{s.nickname} {s.id === req?.spaceId ? '(original)' : ''}</option>
            ))}
          </select>
        </div>

        {/* note */}
        <div>
          <label className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide block mb-1">Brief Note (optional)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value.slice(0, 200))}
            rows={3}
            placeholder="Keep it brief and factual..."
            className="w-full border border-[#e0e3e0] rounded-xl px-3 py-2.5 text-[12px] text-[#181c1b] bg-white outline-none focus:ring-2 focus:ring-[#005344]/30 focus:border-[#005344] resize-none"
          />
          <p className="text-[10px] text-[#6e7975] text-right mt-0.5">{note.length}/200</p>
        </div>
      </div>

      <button onClick={send} disabled={!canSend}
        className={`w-full py-4 rounded-2xl font-black text-[13px] transition-all ${
          canSend ? 'bg-[#005344] text-white shadow-[0_4px_16px_rgba(0,83,68,0.35)] active:scale-[0.98]' : 'bg-[#e0e3e0] text-[#bec9c4] cursor-not-allowed'
        }`}
      >
        Send Counter-offer
      </button>
    </div>
  );
}

/* ─── Request Detail ────────────────────────────────────────────────────────── */
function RequestDetailView({ reqId, onBack, onCounter, onBooking }) {
  const { requests, advanceRequests, setRequests, setAdvanceRequests, pushNotification, spaces } = useShopkeeper();
  const allReqs = [...requests, ...advanceRequests];
  const req = allReqs.find(r => Number(r.id) === Number(reqId));
  if (!req) return <div className="p-4 text-xs">Request not found.</div>;

  const isAdvance = req.type === 'advance';
  const space = spaces.find(s => s.id === req.spaceId);
  const canAct = req.status === 'Pending' || req.status === 'Countered';

  const accept = () => {
    const duration = req.durationMonths || getDurationMonths(req);
    const breakdown = req.monthlyBreakdown || generateMonthlyBreakdown(req.offeredPrice, duration, req.startDate);
    const updater = r => Number(r.id) === Number(reqId) 
      ? { 
          ...r, 
          status: 'Accepted', 
          timelineStep: 1,
          durationMonths: duration,
          monthlyBreakdown: breakdown
        } 
      : r;
    if (isAdvance) setAdvanceRequests(prev => prev.map(updater));
    else setRequests(prev => prev.map(updater));
    pushNotification('request', 'Request Accepted', `You accepted ${req.brand}'s booking request.`, { tab: 'requests', view: 'booking-detail', id: reqId });
    onBooking();
  };

  const reject = () => {
    const updater = r => Number(r.id) === Number(reqId) ? { ...r, status: 'Rejected' } : r;
    if (isAdvance) setAdvanceRequests(prev => prev.map(updater));
    else setRequests(prev => prev.map(updater));
    onBack();
  };

  return (
    <div className="p-4 space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <BackBtn onClick={onBack} />
        <h2 className="text-[20px] font-black text-[#005344]">Request Detail</h2>
      </div>

      {/* advance banner */}
      {isAdvance && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-2 items-start text-xs">
          <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0">event_upcoming</span>
          <div>
            <p className="font-black text-amber-800">Advance Request</p>
            <p className="text-amber-700 mt-0.5">This booking starts after a space is currently occupied. Review dates carefully.</p>
            {req.advanceNote && <p className="text-amber-600 mt-1 italic">"{req.advanceNote}"</p>}
          </div>
        </div>
      )}

      {/* company profile block */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex gap-4 items-center">
        <div className={`w-14 h-14 ${req.logoBg} rounded-2xl flex items-center justify-center text-white font-black text-[26px] shrink-0`}>{req.logo}</div>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-[17px] font-black text-[#181c1b]">{req.brand}</h2>
            {req.verified && <span className="material-symbols-outlined text-[#005344] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`material-symbols-outlined text-[#fe6a34] text-[13px]`} style={{ fontVariationSettings: `'FILL' ${i < Math.round(req.trustScore) ? 1 : 0}` }}>star</span>
            ))}
            <span className="text-[11px] font-bold text-[#6e7975] ml-1">{req.trustScore} Trust Score</span>
          </div>
          <p className="text-[10px] text-[#6e7975] mt-0.5">{req.time}</p>
        </div>
        <StatusBadge status={req.status} />
      </div>

      {/* space thumbnail */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex gap-3 items-center p-3">
        {space?.photos?.[0]
          ? <img src={space.photos[0]} alt="" className="w-16 h-16 object-cover rounded-xl shrink-0" />
          : <div className="w-16 h-16 bg-[#f7faf7] rounded-xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#bec9c4] text-[28px]">storefront</span>
            </div>
        }
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black text-[#181c1b] truncate">{space?.nickname || `Space #${req.spaceId}`}</p>
          <p className="text-[11px] text-[#6e7975] capitalize">{space?.type?.replace('_', ' ')}</p>
          {space?.dimensions && (
            <p className="text-[10px] text-[#6e7975]">{space.dimensions.l}×{space.dimensions.w}×{space.dimensions.h} {space.dimensions.unit}</p>
          )}
        </div>
      </div>

      {/* info rows */}
      <div className="bg-white border border-[#e0e3e0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2.5">
        {[
          ['calendar_today', 'Requested Dates', req.requestedDates],
          ['schedule', 'Duration', `${req.durationMonths || getDurationMonths(req)} month${(req.durationMonths || getDurationMonths(req)) !== 1 ? 's' : ''}`],
          ['payments', 'Offered Price', `PKR ${req.offeredPrice?.toLocaleString()}`],
          ['trending_up', 'Per Month', `PKR ${req.pricePerMonth?.toLocaleString()}/mo`],
          ['inventory_2', 'Product', req.productName],
        ].map(([icon, label, value]) => (
          <div key={label} className="flex items-start gap-2 text-xs">
            <span className="material-symbols-outlined text-[16px] text-[#005344] mt-0.5 shrink-0">{icon}</span>
            <span className="text-[#6e7975] shrink-0 w-24">{label}</span>
            <span className="font-bold text-[#181c1b] flex-1">{value}</span>
          </div>
        ))}
      </div>

      {/* counter-history timeline */}
      {(req.counterHistory?.length > 0 || true) && (
        <div className="space-y-3">
          <p className="text-[10px] font-black text-[#6e7975] uppercase tracking-wide px-1">Negotiation Timeline</p>
          <div className="relative pl-4 border-l-2 border-[#e0e3e0] space-y-4">
            {/* original */}
            <div className="relative">
              <span className="absolute -left-[17px] top-1 w-3 h-3 rounded-full bg-[#0052cc] border-2 border-white" />
              <div className="bg-white border border-[#e0e3e0] rounded-xl p-3 ml-2 text-xs space-y-0.5">
                <p className="font-black text-[#181c1b]">Original Request — {req.brand}</p>
                <p className="text-[#6e7975]">{req.requestedDates} • PKR {req.offeredPrice?.toLocaleString()}</p>
                <p className="text-[#6e7975]">{req.time}</p>
              </div>
            </div>
            {req.counterHistory?.map((c, i) => (
              <div key={i} className="relative">
                <span className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full border-2 border-white ${c.by === 'shopkeeper' ? 'bg-[#005344]' : 'bg-[#0052cc]'}`} />
                <div className={`border rounded-xl p-3 ml-2 text-xs space-y-0.5 ${c.by === 'shopkeeper' ? 'bg-[#f1f8f5] border-[#005344]/20' : 'bg-white border-[#e0e3e0]'}`}>
                  <p className="font-black text-[#181c1b]">Counter #{i + 1} — {c.by === 'shopkeeper' ? 'You' : req.brand}</p>
                  <p className="text-[#6e7975]">{c.newDates} • PKR {c.newPrice?.toLocaleString()}</p>
                  {c.note && <p className="text-[#3e4945] italic">"{c.note}"</p>}
                  <p className="text-[#bec9c4]">{c.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* action buttons */}
      {canAct && (
        <div className="space-y-2 pt-1">
          <button onClick={accept}
            className="w-full py-4 bg-[#005344] text-white rounded-2xl font-black text-[13px] shadow-[0_4px_16px_rgba(0,83,68,0.35)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Accept Request
          </button>
          <button onClick={onCounter}
            className="w-full py-3.5 border-2 border-[#005344] text-[#005344] rounded-2xl font-black text-[12px] hover:bg-[#005344]/5 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            Counter-offer
          </button>
          <button onClick={reject}
            className="w-full py-3 text-[#ba1a1a] font-bold text-[12px] hover:underline flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[14px]">cancel</span>
            Reject Request
          </button>
        </div>
      )}
      {req.status === 'Accepted' && (
        <button onClick={onBooking}
          className="w-full py-4 bg-[#005344] text-white rounded-2xl font-black text-[13px] flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          View Booking
        </button>
      )}
      {(req.status === 'Rejected' || req.status === 'Completed') && (
        <div className="bg-[#f7faf7] border border-[#e0e3e0] rounded-xl p-3 text-xs text-[#6e7975] text-center font-bold">
          {req.status === 'Completed' ? '✓ This booking has been completed.' : '✕ This request was rejected.'}
        </div>
      )}
    </div>
  );
}

/* ─── Request Card ──────────────────────────────────────────────────────────── */
function RequestCard({ req, spaces, onTap }) {
  const space = spaces.find(s => s.id === req.spaceId);
  return (
    <div onClick={onTap}
      className="bg-white border border-[#e0e3e0] rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#005344] hover:shadow-[0_4px_16px_rgba(0,83,68,0.1)] transition-all active:scale-[0.98]">
      <div className="flex gap-3 items-start">
        <div className={`w-11 h-11 ${req.logoBg} rounded-xl flex items-center justify-center text-white font-black text-[20px] shrink-0`}>{req.logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[14px] font-black text-[#181c1b]">{req.brand}</span>
            {req.verified && <span className="material-symbols-outlined text-[#005344] text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>}
            {req.type === 'advance' && (
              <span className="text-[8px] font-black bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide">ADVANCE</span>
            )}
          </div>
          <p className="text-[10px] text-[#fe6a34] font-bold">★ {req.trustScore}</p>
          <p className="text-[11px] text-[#6e7975] mt-0.5 truncate">{space?.nickname || `Space #${req.spaceId}`}</p>
          <p className="text-[11px] text-[#6e7975] flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">calendar_today</span>
            {req.requestedDates}
          </p>
          <p className="text-[11px] text-[#3e4945] mt-0.5 truncate">{req.productName}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={req.status} />
          <p className="text-[14px] font-black text-[#005344]">PKR {req.offeredPrice?.toLocaleString()}</p>
          <p className="text-[10px] text-[#6e7975]">PKR {req.pricePerMonth?.toLocaleString()}/mo</p>
          <p className="text-[9px] text-[#bec9c4]">{req.time}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Inbox ────────────────────────────────────────────────────────────── */
function InboxView({ initialTab, spaces, onSelectReq, navigateToView }) {
  const { requests, advanceRequests } = useShopkeeper();
  const [inboxTab, setInboxTab] = useState(() => {
    if (initialTab === 'advance') return 'advance';
    if (initialTab === 'contracts') return 'contracts';
    if (initialTab === 'history') return 'history';
    return 'requests';
  });
  const [statusFilter, setStatusFilter] = useState('All');

  const getPoolAndFilters = () => {
    let pool = [];
    let filters = ['All'];

    if (inboxTab === 'requests') {
      pool = requests.filter(r => r.type !== 'advance' && r.isAdvance !== true && r.status !== 'Completed' && r.status !== 'Rejected' && !(r.status === 'Accepted' && !r.contractSignedByShopkeeper));
      filters = ['All', 'Pending', 'Countered', 'Accepted'];
    } else if (inboxTab === 'contracts') {
      pool = requests.filter(r => r.status === 'Accepted' && !r.contractSignedByShopkeeper && r.type !== 'advance' && r.isAdvance !== true);
      filters = [];
    } else if (inboxTab === 'advance') {
      pool = advanceRequests.filter(r => r.type === 'advance' || r.isAdvance === true);
      filters = ['All', 'Pending', 'Countered', 'Accepted', 'Rejected'];
    } else if (inboxTab === 'history') {
      pool = [...requests, ...advanceRequests].filter(r => r.status === 'Completed' || r.status === 'Rejected');
      filters = ['All', 'Completed', 'Rejected'];
    }

    return { pool, filters };
  };

  const { pool, filters } = getPoolAndFilters();
  const filtered = pool.filter(r => statusFilter === 'All' || r.status === statusFilter);

  const handleTabChange = (key) => {
    setInboxTab(key);
    setStatusFilter('All');
  };

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* header */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-[22px] font-black text-[#005344]">Requests</h1>
        <div className="flex items-center gap-1.5">
          <button onClick={() => navigateToView('requests', 'calendar')}
            className="flex items-center gap-1 text-[10px] font-black text-[#005344] bg-[#005344]/5 border border-[#005344]/20 px-2.5 py-1.5 rounded-lg hover:bg-[#005344]/10">
            <span className="material-symbols-outlined text-[14px]">calendar_month</span>
            Calendar
          </button>
          <button className="p-1.5 rounded-full hover:bg-[#ebefec]">
            <span className="material-symbols-outlined text-[20px] text-[#3e4945]">filter_list</span>
          </button>
        </div>
      </div>

      {/* inbox tabs (2x2 grid) */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: 'requests', label: 'Requests', color: '#005344', icon: 'inbox' },
          { key: 'contracts', label: 'Contracts to Sign', color: '#fe6a34', icon: 'draw' },
          { key: 'advance', label: 'Advance Requests', color: '#0d9488', icon: 'schedule' },
          { key: 'history', label: 'History', color: '#6e7975', icon: 'history' },
        ].map(t => (
          <button 
            key={t.key} 
            onClick={() => handleTabChange(t.key)}
            className={`p-3 rounded-xl border flex items-center gap-2 transition-all text-left ${
              inboxTab === t.key 
                ? 'bg-white border-[#005344] shadow-sm font-black text-[#005344]' 
                : 'bg-white border-[#e0e3e0] text-[#6e7975] hover:bg-[#fafbfa]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ color: inboxTab === t.key ? '#005344' : '#6e7975' }}>
              {t.icon}
            </span>
            <span className="text-[11px] uppercase tracking-wider font-extrabold truncate">{t.label}</span>
          </button>
        ))}
      </div>

      {/* status filter chips */}
      {filters.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all ${
                statusFilter === s
                  ? 'bg-[#005344] text-white border-[#005344]'
                  : 'bg-white text-[#6e7975] border-[#e0e3e0] hover:border-[#005344]/40'
              }`}>{s}</button>
          ))}
        </div>
      )}

      {/* list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-white border border-[#e0e3e0] rounded-2xl space-y-2">
            <span className="material-symbols-outlined text-[40px] text-[#bec9c4]">inbox</span>
            <p className="text-xs text-[#6e7975] font-bold">
              No requests found.
            </p>
          </div>
        ) : (
          filtered.map(req => {
            const isBooking = req.status === 'Accepted' || req.status === 'Completed';
            const handleTap = () => {
              if (isBooking) {
                navigateToView('requests', 'booking-detail', req.id);
              } else {
                onSelectReq(req.id);
              }
            };
            return (
              <RequestCard key={req.id} req={req} spaces={spaces} onTap={handleTap} />
            );
          })
        )}
      </div>
    </div>
  );
}

/* ─── Root RequestsTab ──────────────────────────────────────────────────────── */
export default function RequestsTab() {
  const {
    currentView, setCurrentView,
    viewParams, setViewParams,
    spaces, navigateToView,
  } = useShopkeeper();

  const setDetail   = (id) => { setCurrentView('detail');        setViewParams(id); };
  const setBooking  = (id) => { setCurrentView('booking-detail'); setViewParams(id); };
  const setContract = (id) => { setCurrentView('contract');      setViewParams(id); };
  const setProof    = (id) => { setCurrentView('proof-upload');  setViewParams(id); };
  const setDetailCounter = (id) => { setCurrentView('counter-offer'); setViewParams(id); };

  if (currentView === 'calendar') {
    return <CalendarView onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'proof-upload' && viewParams != null) {
    const currentId = viewParams;
    return <ProofUploadView reqId={currentId} onBack={() => setBooking(currentId)} />;
  }

  if (currentView === 'contract' && viewParams != null) {
    const currentId = viewParams;
    return <ContractView reqId={currentId} onBack={() => setBooking(currentId)} />;
  }

  if (currentView === 'booking-detail' && viewParams != null) {
    const currentId = viewParams;
    return (
      <BookingDetailView
        reqId={currentId}
        onBack={() => { setCurrentView('main'); setViewParams(null); }}
        onGoToContract={() => setContract(currentId)}
        onGoToProof={() => setProof(currentId)}
        navigateToView={navigateToView}
      />
    );
  }

  if (currentView === 'counter-offer' && viewParams != null) {
    const currentId = viewParams;
    return (
      <CounterOfferView
        reqId={currentId}
        onBack={() => setDetail(currentId)}
        onDone={() => setDetail(currentId)}
      />
    );
  }

  if (currentView === 'detail' && viewParams != null) {
    const currentId = viewParams;
    return (
      <RequestDetailView
        reqId={currentId}
        onBack={() => setCurrentView('main')}
        onCounter={() => setDetailCounter(currentId)}
        onBooking={() => setBooking(currentId)}
      />
    );
  }

  // main / advance / contracts / history
  return (
    <InboxView
      initialTab={currentView === 'advance' ? 'advance' : (viewParams || 'regular')}
      spaces={spaces}
      onSelectReq={setDetail}
      navigateToView={navigateToView}
    />
  );
}
