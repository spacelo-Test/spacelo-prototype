import React, { useState } from 'react';
import { useShopkeeper } from './ShopkeeperContext';

export default function RequestsTab() {
  const {
    requests,
    setRequests,
    listings,
    currentView,
    setCurrentView,
    viewParams,
    setViewParams,
    pushNotification
  } = useShopkeeper();

  const [proofPhotos, setProofPhotos] = useState([]);
  const [activeTabFilter, setActiveTabFilter] = useState('Pending');

  const getStatusBadge = (status) => {
    const maps = {
      'Active': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Live': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Pending': 'bg-[#ffab00]/10 text-[#ab6b00] border border-[#ffab00]/20',
      'Completed': 'bg-[#3e4945]/10 text-[#3e4945] border border-[#3e4945]/20',
      'Released': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Failed': 'bg-[#de350b]/10 text-[#de350b] border border-[#de350b]/20',
      'Disputed': 'bg-[#de350b]/10 text-[#de350b] border border-[#de350b]/20',
      'Cancelled': 'bg-[#6c757d]/10 text-[#6c757d] border border-[#6c757d]/20',
      'Accepted': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Rejected': 'bg-[#de350b]/10 text-[#de350b] border border-[#de350b]/20'
    };
    return maps[status] || 'bg-gray-100 text-gray-800';
  };

  // 1. Requests Inbox View (Screen 5)
  if (currentView === 'inbox') {
    const filteredRequests = requests.filter(req => {
      if (activeTabFilter === 'All') return true;
      if (activeTabFilter === 'Pending') return req.status === 'Pending';
      if (activeTabFilter === 'Accepted') return req.status === 'Accepted' || req.status === 'Completed';
      if (activeTabFilter === 'Rejected') return req.status === 'Rejected' || req.status === 'Cancelled';
      return true;
    });

    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-[22px] font-black text-[#005344]">Booking Requests</h2>
          <button onClick={() => setCurrentView('calendar')} className="text-xs font-bold text-[#005344] hover:underline flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span> Calendar
          </button>
        </div>

        <div className="flex border-b border-[#e0e3e0]">
          {['All', 'Pending', 'Accepted', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTabFilter(tab)}
              className="flex-1 pb-3 text-[12px] font-black tracking-wider uppercase border-b-2 text-center transition-all"
              style={{
                borderBottomColor: tab === activeTabFilter ? '#005344' : 'transparent',
                color: tab === activeTabFilter ? '#005344' : '#6e7975'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4 pt-1">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 bg-white border border-[#e0e3e0] rounded-xl">
              <span className="material-symbols-outlined text-[36px] text-gray-300">inbox</span>
              <p className="text-xs text-[#6e7975] mt-2 font-medium">No booking requests found</p>
            </div>
          ) : (
            filteredRequests.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-3.5 hover:border-[#005344] transition-all"
              >
                <div 
                  onClick={() => { setCurrentView('detail'); setViewParams(item.id); }}
                  className="flex justify-between items-start cursor-pointer"
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 ${item.logoBg} rounded-xl flex items-center justify-center text-white font-extrabold text-[18px]`}>
                      {item.logo}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-[#181c1b]">{item.brand}</h4>
                      <p className="text-[11px] text-[#6e7975] mt-0.5">Space: {listings.find(l => l.id === item.spaceId)?.title || "Shelf space"}</p>
                      <p className="text-[11px] text-[#6e7975] mt-1 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                        {item.dates}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    <p className="text-[14px] font-black text-[#005344]">PKR {item.price}</p>
                    <span className="text-[9px] text-[#6e7975]">{item.time}</span>
                  </div>
                </div>

                {item.status === 'Pending' && (
                  <div className="flex gap-2 pt-2 border-t border-[#ebefec]">
                    <button 
                      onClick={() => {
                        setRequests(requests.map(r => r.id === item.id ? { ...r, status: 'Accepted' } : r));
                        pushNotification("payment", "Booking Accepted", `Nestle booking is now Accepted. Payout processing.`, { tab: "bookings", view: "detail", id: item.id });
                      }}
                      className="flex-1 py-2.5 bg-[#00875a] text-white font-bold rounded-lg text-xs"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setRequests(requests.map(r => r.id === item.id ? { ...r, status: 'Rejected' } : r))}
                      className="flex-1 py-2.5 bg-white border border-[#bec9c4] text-[#ba1a1a] font-bold rounded-lg text-xs"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // 2. Booking Detail View (Screen 6)
  if (currentView === 'detail' && viewParams) {
    const booking = requests.find(r => r.id === viewParams);
    if (!booking) return <p className="p-4">Booking not found</p>;
    const space = listings.find(l => l.id === booking.spaceId);
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('inbox')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[20px] font-black text-[#005344]">Booking details</h2>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975] mb-3">Booking Status Timeline</p>
          <div className="relative pl-6 space-y-4 border-l-2 border-l-[#bec9c4]">
            <div className="relative">
              <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                booking.status === 'Accepted' || booking.status === 'Completed' ? 'bg-[#00875a]' : 'bg-[#ffab00]'
              }`}>
                <span className="material-symbols-outlined text-[10px]">check</span>
              </span>
              <p className="text-[13px] font-extrabold text-[#181c1b]">1. Space Booked</p>
              <p className="text-[11px] text-[#6e7975]">{booking.time}</p>
            </div>
            <div className="relative">
              <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                booking.status === 'Accepted' || booking.status === 'Completed' ? 'bg-[#00875a]' : 'bg-gray-300'
              }`}>
                <span className="material-symbols-outlined text-[10px]">check</span>
              </span>
              <p className="text-[13px] font-extrabold text-[#181c1b]">2. Payment Escrowed</p>
            </div>
            <div className="relative">
              <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                booking.proofs.length > 0 || booking.status === 'Completed' ? 'bg-[#00875a]' : 'bg-gray-300'
              }`}>
                <span className="material-symbols-outlined text-[10px]">check</span>
              </span>
              <p className="text-[13px] font-extrabold text-[#181c1b]">3. Product Placed Proof</p>
            </div>
            <div className="relative">
              <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                booking.status === 'Completed' ? 'bg-[#00875a]' : 'bg-gray-300'
              }`}>
                <span className="material-symbols-outlined text-[10px]">check</span>
              </span>
              <p className="text-[13px] font-extrabold text-[#181c1b]">4. Payout Released</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 flex gap-4 items-center">
          <img className="w-16 h-16 object-cover rounded-lg shrink-0" src={space?.photo} alt="" />
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-extrabold text-[#181c1b] truncate">{space?.title}</h3>
            <p className="text-xs text-[#6e7975] mt-0.5">Rented to: <span className="font-bold text-[#005344]">{booking.brand}</span></p>
            <p className="text-xs text-[#6e7975]">{booking.dates}</p>
          </div>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 space-y-2 text-xs">
          <p className="font-extrabold text-[#181c1b] border-b border-[#ebefec] pb-2 text-[13px]">Financial Summary</p>
          <div className="flex justify-between"><span className="text-[#6e7975]">Agreed Price</span><span>PKR {booking.price}</span></div>
          <div className="flex justify-between"><span className="text-[#6e7975]">Platform Fee (10%)</span><span className="text-[#ba1a1a]">- PKR {booking.price * 0.1}</span></div>
          <div className="flex justify-between border-t border-[#ebefec] pt-2 font-black text-[#005344] text-sm">
            <span>Net Payout</span><span>PKR {booking.price * 0.9}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!booking.contractSignedByShopkeeper ? (
            <button 
              onClick={() => setCurrentView('contract')}
              className="w-full bg-[#fe6a34] text-white py-3.5 rounded-xl font-bold text-sm"
            >
              Review & Sign Contract
            </button>
          ) : (
            <div className="bg-[#00875a]/10 border border-[#00875a]/20 text-[#00875a] p-3 rounded-xl flex items-center gap-2 text-xs font-bold justify-center">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Contract Signed by Both Parties
            </div>
          )}

          {booking.contractSignedByShopkeeper && booking.proofs.length === 0 && (
            <button
              onClick={() => setCurrentView('proof-upload')}
              className="w-full bg-[#005344] text-white py-3.5 rounded-xl font-bold text-sm"
            >
              Upload Product Placement Proof
            </button>
          )}
        </div>

        {booking.proofs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#6e7975]">Placement Verification Photo</h3>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#bec9c4]">
              <img className="w-full h-full object-cover" src={booking.proofs[0]} alt="" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Booking Calendar View (Screen 7)
  if (currentView === 'calendar') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-[22px] font-black text-[#005344]">Booking Calendar</h2>
          <button onClick={() => setCurrentView('inbox')} className="text-xs font-bold text-[#005344] hover:underline">Inbox List</button>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 space-y-4">
          <p className="text-center font-bold text-[#181c1b]">June 2026</p>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => <span key={i} className="font-bold text-[#6e7975] py-2">{d}</span>)}
            <span className="py-2 opacity-25">31</span>
            {Array.from({ length: 30 }).map((_, idx) => {
              const day = idx + 1;
              let bg = 'bg-white';
              let border = 'border border-gray-100';
              if (day >= 10 && day <= 15) {
                bg = 'bg-[#3e4945]/15';
                border = 'border border-[#3e4945]/30';
              } else if (day >= 25 && day <= 28) {
                bg = 'bg-[#ffab00]/15';
                border = 'border border-[#ffab00]/30';
              }
              return (
                <span key={idx} className={`py-2 rounded-lg ${bg} ${border}`}>
                  {day}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 4. Contract Viewer & E-Sign View (Screen 10)
  if (currentView === 'contract' && viewParams) {
    const booking = requests.find(r => r.id === viewParams);
    const space = listings.find(l => l.id === booking?.spaceId);
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('detail')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[20px] font-black text-[#005344]">Review Contract</h2>
        </div>

        <div className="bg-[#f1f4f1] p-4 rounded-xl border border-[#e0e3e0] text-xs space-y-2">
          <p className="font-extrabold text-[#005344] text-[13px] border-b border-[#e0e3e0] pb-1.5">Key Deal Terms</p>
          <div className="flex justify-between"><span>Display Space:</span><span className="font-bold">{space?.title}</span></div>
          <div className="flex justify-between"><span>Brand Tenant:</span><span className="font-bold">{booking?.brand}</span></div>
          <div className="flex justify-between"><span>Total Price:</span><span className="font-black text-[#005344]">PKR {booking?.price}</span></div>
        </div>

        <div className="bg-white border border-[#bec9c4] rounded-xl p-4 h-48 overflow-y-auto text-[10px] text-[#3e4945] leading-relaxed space-y-3 font-mono">
          <p className="font-bold text-center">RETAIL PLACEMENT AGREEMENT</p>
          <p>1. **Grant of Lease**: Landlord leases to Tenant display space for product placement.</p>
          <p>2. **Use of Space**: Tenant shall place only approved products matching category guidelines.</p>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 space-y-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-[#6e7975]">Draw Signature Below</p>
          <div className="h-32 border-2 border-dashed border-[#bec9c4] rounded-xl bg-[#f7faf7] flex items-center justify-center relative cursor-pointer">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">edit</span>
          </div>

          <button 
            onClick={() => {
              setRequests(requests.map(r => r.id === booking.id ? { ...r, contractSignedByShopkeeper: true } : r));
              pushNotification("request", "Contract signed", `Signed contract for ${booking.brand} booking.`, { tab: "bookings", view: "detail", id: booking.id });
              setCurrentView('detail');
            }}
            className="w-full bg-[#00875a] text-white py-3 rounded-xl font-bold text-xs"
          >
            Agree & Sign Contract
          </button>
        </div>
      </div>
    );
  }

  // 5. Proof Upload View (Screen 11)
  if (currentView === 'proof-upload' && viewParams) {
    const booking = requests.find(r => r.id === viewParams);
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('detail')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[20px] font-black text-[#005344]">Upload Setup Proof</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {proofPhotos.map((p, idx) => (
            <div key={idx} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-[#bec9c4]">
              <img className="w-full h-full object-cover" src={p} alt="" />
              <button type="button" onClick={() => setProofPhotos(proofPhotos.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full">
                <span className="material-symbols-outlined text-[10px]">close</span>
              </button>
            </div>
          ))}
          {proofPhotos.length < 3 && (
            <button 
              onClick={() => setProofPhotos([...proofPhotos, "https://images.unsplash.com/photo-1506617424151-74f5609c1fa6?auto=format&fit=crop&w=400&q=80"])}
              className="aspect-square border-2 border-dashed border-[#bec9c4] rounded-xl flex flex-col items-center justify-center text-[#6e7975] bg-[#f7faf7]"
            >
              <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
            </button>
          )}
        </div>

        <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl space-y-1 text-xs">
          <p className="font-extrabold text-[#3e4945] text-[10px]">VERIFICATION METADATA</p>
          <p className="text-[#00875a] font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> Geo-verified & Timestamped</p>
        </div>

        <button 
          onClick={() => {
            setRequests(requests.map(r => r.id === booking.id ? { ...r, proofs: ["https://images.unsplash.com/photo-1506617424151-74f5609c1fa6?auto=format&fit=crop&w=400&q=80"], status: 'Completed' } : r));
            pushNotification("payment", "Placement Verified", `Nestle verification complete. net payout deposited.`, { tab: "bookings", view: "detail", id: booking.id });
            setProofPhotos([]);
            setCurrentView('detail');
          }}
          disabled={proofPhotos.length === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-xs ${
            proofPhotos.length > 0 ? 'bg-[#005344] text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          Verify & Submit Proof
        </button>
      </div>
    );
  }

  return null;
}
