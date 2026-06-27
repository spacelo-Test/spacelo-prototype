import React, { useState } from 'react';
import { useCompany } from './CompanyContext';

export default function RequestsTab() {
  const { 
    requests, 
    campaigns, 
    spaces, 
    respondToCounter,
    currentView,
    setCurrentView,
    viewParams,
    setViewParams,
    navigateToView,
    availableChains,
    createCampaign
  } = useCompany();

  const [activeSubTab, setActiveSubTab] = useState('requests'); // 'requests' or 'campaigns'
  const [statusFilter, setStatusFilter] = useState('All');

  // Counter proposal form states
  const [counterPrice, setCounterPrice] = useState('');
  const [counterStartDate, setCounterStartDate] = useState('2026-06-01');
  const [counterEndDate, setCounterEndDate] = useState('2026-08-31');
  const [counterNote, setCounterNote] = useState('');

  // Filters logic
  const filteredRequests = requests.filter(r => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Pending') return r.status === 'Pending';
    if (statusFilter === 'Counter-offered') return r.status === 'Countered';
    if (statusFilter === 'Accepted') return r.status === 'Accepted';
    if (statusFilter === 'Rejected') return r.status === 'Rejected';
    if (statusFilter === 'Advance') return r.isAdvance === true;
    return true;
  });

  const selectedRequest = requests.find(r => r.id === viewParams);
  const selectedCampaign = campaigns.find(c => c.id === viewParams);

  // Helper function to resolve space info
  const getSpaceInfo = (spaceId) => {
    return spaces.find(s => s.id === spaceId) || {
      nickname: `Space #${spaceId}`,
      shop: "Retail Outlet",
      area: "Unknown Area",
      type: "shelf",
      price: 30000
    };
  };

  const handleOpenRequestDetail = (id) => {
    setCurrentView('detail');
    setViewParams(id);
  };

  const handleOpenCampaignDetail = (id) => {
    setCurrentView('campaign-detail');
    setViewParams(id);
  };

  const handleBackToList = () => {
    setCurrentView('main');
    setViewParams(null);
  };

  const handleOpenCounterForm = () => {
    setCurrentView('counter');
    setCounterPrice(selectedRequest.offeredPrice);
    setCounterNote('');
  };

  const handleSubmitCounter = (e) => {
    e.preventDefault();
    respondToCounter(selectedRequest.id, 'counter', {
      price: Number(counterPrice),
      note: counterNote
    });
    alert('Counter-offer submitted successfully!');
    setCurrentView('detail');
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      Pending: "bg-[#fff3e0] text-[#ab6b00]",
      Countered: "bg-blue-50 text-blue-700 border border-blue-200",
      Accepted: "bg-green-50 text-green-700 border border-green-200",
      Rejected: "bg-red-50 text-red-700 border border-red-200",
      Active: "bg-[#ebfbf3] text-[#00875a]",
      Completed: "bg-gray-100 text-gray-600"
    };
    return classes[status] || "bg-gray-100 text-gray-600";
  };

  const getSpaceTypeLabel = (type) => {
    const labels = {
      shelf: "Shelf",
      end_cap: "End-Cap",
      window_display: "Window Display",
      floor_stand: "Floor Stand",
      checkout_counter: "Checkout Counter",
      entrance_display: "Entrance Display",
      promotional_aisle: "Promotional Aisle"
    };
    return labels[type] || "Retail Space";
  };

  // RENDER 1: Outgoing Request Detail (with negotiation history)
  if (currentView === 'detail' && selectedRequest) {
    const space = getSpaceInfo(selectedRequest.spaceId);
    return (
      <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
        {/* TopAppBar */}
        <header className="bg-white sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
          <div className="flex items-center justify-between px-4 h-16 w-full mx-auto max-w-[390px]">
            <div className="flex items-center gap-2">
              <button onClick={handleBackToList} className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full">
                arrow_back
              </button>
              <h1 className="text-[17px] font-black text-[#005344]">Request Status</h1>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusBadgeClass(selectedRequest.status)}`}>
              {selectedRequest.status}
            </span>
          </div>
        </header>

        <main className="flex-grow pt-4 pb-28 px-4 w-full mx-auto max-w-[390px] space-y-5 overflow-y-auto">
          {/* Space Summary Card */}
          <div className="bg-white border border-[#e0e3e0] p-3 rounded-xl shadow-sm flex gap-3 items-center">
            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
              <img src={space.photos ? space.photos[0] : ""} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-grow text-xs">
              <span className="text-[9px] bg-[#fe6a34]/10 text-[#fe6a34] font-black px-1.5 py-0.2 rounded uppercase">
                {getSpaceTypeLabel(space.type)}
              </span>
              <h4 className="font-black text-[#181c1b] truncate mt-0.5">{space.nickname}</h4>
              <p className="text-[10px] text-[#6e7975]">{space.shop} — {space.area}</p>
            </div>
          </div>

          {/* Timeline and History Logs */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#005344] border-b border-[#ebefec] pb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">history</span>
              Negotiation Logs
            </h3>

            {/* Stepper history items */}
            <div className="space-y-4 relative pl-4 border-l border-dashed border-[#bec9c4] ml-2 text-xs">
              {/* Original Offer */}
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 bg-[#005344] rounded-full ring-4 ring-white"></span>
                <p className="font-black text-[#181c1b]">Original Request Sent</p>
                <p className="text-[10px] text-[#6e7975] mt-0.5">{selectedRequest.time}</p>
                <div className="bg-[#f7faf7] p-2 rounded-lg border border-[#e0e3e0] mt-1.5 text-[11px] text-[#3e4945]">
                  <p>• <strong>Product</strong>: {selectedRequest.productName}</p>
                  <p>• <strong>Dates</strong>: {selectedRequest.durationLabel}</p>
                  <p>• <strong>Offer</strong>: PKR {selectedRequest.offeredPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* Counter History */}
              {selectedRequest.counterHistory.map((log, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full ring-4 ring-white ${log.by === 'company' ? 'bg-[#0d9488]' : 'bg-[#fe6a34]'}`}></span>
                  <p className="font-black text-[#181c1b]">
                    {log.by === 'company' ? 'You Counter-offered' : 'Shopkeeper Counter-offered'}
                  </p>
                  <p className="text-[10px] text-[#6e7975] mt-0.5">{log.date}</p>
                  <div className="bg-[#f7faf7] p-2 rounded-lg border border-[#e0e3e0] mt-1.5 text-[11px] text-[#3e4945] space-y-0.5">
                    <p>• <strong>Proposed Price</strong>: PKR {(log.newPrice || log.price || 0).toLocaleString()}</p>
                    {log.note && <p>• <strong>Note</strong>: <span className="italic">"{log.note}"</span></p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Blocks */}
          {selectedRequest.status === 'Countered' && (
            <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-3">
              <div className="bg-[#fe6a34]/10 p-3 rounded-lg border border-[#fe6a34]/20 text-xs text-[#b25000] space-y-1">
                <p className="font-black">Shopkeeper Proposal Summary:</p>
                <p>• <strong>Rent</strong>: PKR {(selectedRequest.counterHistory[selectedRequest.counterHistory.length - 1].newPrice || selectedRequest.counterHistory[selectedRequest.counterHistory.length - 1].price || 0).toLocaleString()} Total</p>
                <p className="italic">"{selectedRequest.counterHistory[selectedRequest.counterHistory.length - 1].note}"</p>
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  onClick={() => respondToCounter(selectedRequest.id, 'reject')}
                  className="flex-1 py-3 border border-[#ba1a1a] text-[#ba1a1a] rounded-xl text-xs font-bold shadow-sm"
                >
                  Reject Proposal
                </button>
                <button 
                  onClick={handleOpenCounterForm}
                  className="flex-1 py-3 border border-[#005344] text-[#005344] rounded-xl text-xs font-bold shadow-sm"
                >
                  Send Counter
                </button>
              </div>

              <button 
                onClick={() => {
                  respondToCounter(selectedRequest.id, 'accept');
                  alert('Proposal accepted successfully!');
                }}
                className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3 rounded-xl text-xs shadow-md active:scale-95 flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Accept Counter-offer
              </button>
            </div>
          )}

          {selectedRequest.status === 'Accepted' && (
            <div className="bg-white border border-green-100 p-4 rounded-xl shadow-sm text-center space-y-3">
              <p className="text-xs font-bold text-green-700 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Request Accepted! Proceed to E-Sign Contract
              </p>
              <button 
                onClick={() => navigateToView('bookings', 'booking-detail', selectedRequest.id)}
                className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all"
              >
                Open Booking & Contract
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // RENDER 2: Outgoing Counter Offer Form (NOT chat)
  if (currentView === 'counter' && selectedRequest) {
    const space = getSpaceInfo(selectedRequest.spaceId);
    return (
      <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
        {/* TopAppBar */}
        <header className="bg-white sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
          <div className="flex items-center justify-between px-4 h-16 w-full mx-auto max-w-[390px]">
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentView('detail')} className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full">
                arrow_back
              </button>
              <h1 className="text-[17px] font-black text-[#005344]">Submit Counter-offer</h1>
            </div>
          </div>
        </header>

        <main className="flex-grow pt-4 pb-28 px-4 w-full mx-auto max-w-[390px] space-y-5 overflow-y-auto">
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
            <div className="border-b border-[#ebefec] pb-2 text-xs">
              <p className="font-bold text-[#6e7975]">Negotiation with:</p>
              <p className="font-black text-[#181c1b] text-sm mt-0.5">{space.shop}</p>
              <p className="text-[#6e7975] mt-0.5">{space.nickname}</p>
            </div>

            <form onSubmit={handleSubmitCounter} className="space-y-4">
              {/* Proposed Price */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-[#3e4945]">New Proposed Price (PKR Total)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#6e7975]">PKR</span>
                  <input 
                    type="number"
                    required
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    className="w-full h-11 pl-12 pr-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-black"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#3e4945]">Start Date</label>
                  <input 
                    type="date"
                    value={counterStartDate}
                    onChange={(e) => setCounterStartDate(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#3e4945]">End Date</label>
                  <input 
                    type="date"
                    value={counterEndDate}
                    onChange={(e) => setCounterEndDate(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Note */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-[#3e4945]">
                  <span>Factual Note (Optional)</span>
                  <span className="text-[10px] text-[#6e7975]">{counterNote.length}/200</span>
                </div>
                <textarea 
                  maxLength={200}
                  rows={3}
                  placeholder="Keep it brief and factual. Counter-offers are not open chats."
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  className="w-full p-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3 rounded-xl text-xs shadow-md"
              >
                Send Counter-proposal
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'create-campaign') {
    return (
      <CampaignCreatorView 
        onBack={() => setCurrentView('main')}
        spaces={spaces}
        availableChains={availableChains}
        onLaunch={(data) => {
          createCampaign(data);
          setCurrentView('main');
          alert('Bulk Campaign launched successfully!');
        }}
      />
    );
  }

  // RENDER 3: Bulk Campaign Detail Screen
  if (currentView === 'campaign-detail' && selectedCampaign) {
    return (
      <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
        {/* TopAppBar */}
        <header className="bg-white sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
          <div className="flex items-center justify-between px-4 h-16 w-full mx-auto max-w-[390px]">
            <div className="flex items-center gap-2">
              <button onClick={handleBackToList} className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full">
                arrow_back
              </button>
              <h1 className="text-[16px] font-black text-[#005344]">Campaign Details</h1>
            </div>
            <span className="text-[9px] bg-[#0d9488]/10 text-[#0d9488] font-black px-2 py-0.5 rounded uppercase">
              Bulk Campaign
            </span>
          </div>
        </header>

        <main className="flex-grow pt-4 pb-28 px-4 w-full mx-auto max-w-[390px] space-y-5 overflow-y-auto">
          {/* Campaign summary card */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-3">
            <div>
              <span className="text-[9px] font-bold text-[#6e7975] uppercase">{selectedCampaign.chain}</span>
              <h3 className="text-sm font-black text-[#181c1b] leading-tight">{selectedCampaign.name}</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-[#ebefec] pt-2.5">
              <div className="bg-green-50 p-2 rounded border border-green-100">
                <p className="text-[9px] font-bold text-[#00875a]">Accepted</p>
                <p className="font-black text-[#00875a] text-sm mt-0.5">{selectedCampaign.stats.accepted}</p>
              </div>
              <div className="bg-[#fff3e0] p-2 rounded border border-[#fff3e0]">
                <p className="text-[9px] font-bold text-[#ab6b00]">Pending</p>
                <p className="font-black text-[#ab6b00] text-sm mt-0.5">{selectedCampaign.stats.pending}</p>
              </div>
              <div className="bg-red-50 p-2 rounded border border-red-100">
                <p className="text-[9px] font-bold text-red-700">Rejected</p>
                <p className="font-black text-red-700 text-sm mt-0.5">{selectedCampaign.stats.rejected}</p>
              </div>
            </div>
          </div>

          {/* Branch Breakdown List */}
          <section className="space-y-2.5">
            <h4 className="text-[11px] font-black uppercase text-[#6e7975] tracking-wider px-1">Branch-wise Status</h4>
            <div className="space-y-3">
              {selectedCampaign.branches.map((b) => (
                <div 
                  key={b.id}
                  className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-3 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-black text-[#181c1b]">{b.name}</h5>
                      <p className="text-[10px] text-[#6e7975] mt-0.5">{b.area}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${getStatusBadgeClass(b.status)}`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#ebefec] flex items-center justify-between text-[11px]">
                    <span className="text-[#6e7975] font-semibold uppercase">{getSpaceTypeLabel(b.type)}</span>
                    <span className="font-black text-[#005344]">PKR {b.price.toLocaleString()}</span>
                  </div>

                  {/* Branch counter-action buttons if status is Counter-offered */}
                  {b.status === "Counter-offered" && (
                    <div className="flex gap-2 pt-2 border-t border-[#ebefec]">
                      <button 
                        onClick={() => alert(`Rejected counter-offer from ${b.name}`)}
                        className="flex-1 py-2 border border-[#ba1a1a] text-[#ba1a1a] font-bold rounded-lg text-[10px]"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => alert(`Accepted counter-offer of PKR ${b.price} from ${b.name}!`)}
                        className="flex-grow-[2] py-2 bg-[#005344] text-white font-bold rounded-lg text-[10px]"
                      >
                        Accept Counter
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // RENDER 4: Main Requests Lists (Outgoing Single & Bulk tabs)
  return (
    <div className="bg-[#f7faf7] h-full flex flex-col font-manrope overflow-hidden">
      {/* Sub tabs header */}
      <section className="bg-white border-b border-[#e0e3e0] shrink-0">
        <div className="flex justify-around items-center h-12">
          <button 
            onClick={() => { setActiveSubTab('requests'); setStatusFilter('All'); }}
            className={`flex-grow h-full font-black text-xs relative transition-all ${activeSubTab === 'requests' ? 'text-[#005344]' : 'text-[#6e7975]'}`}
          >
            Outgoing Requests
            {activeSubTab === 'requests' && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#005344] rounded-t-full" />
            )}
          </button>
          
          <button 
            onClick={() => { setActiveSubTab('campaigns'); setStatusFilter('All'); }}
            className={`flex-grow h-full font-black text-xs relative transition-all ${activeSubTab === 'campaigns' ? 'text-[#005344]' : 'text-[#6e7975]'}`}
          >
            Bulk Campaigns
            {activeSubTab === 'campaigns' && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#005344] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Filter Quick Chips Row */}
        {activeSubTab === 'requests' && (
          <div className="flex gap-2 overflow-x-auto px-4 py-2 border-t border-[#ebefec] scrollbar-none snap-x text-[10px]">
            {["All", "Pending", "Counter-offered", "Accepted", "Rejected", "Advance"].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-full font-black border shrink-0 snap-start transition-all ${statusFilter === filter ? 'bg-[#005344] border-[#005344] text-white' : 'bg-[#ebefec] border-transparent text-[#3e4945]'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lists scroll container */}
      <div className="flex-grow overflow-y-auto p-4 pb-20 space-y-4">
        {activeSubTab === 'requests' ? (
          /* OUTGOING REQUESTS */
          filteredRequests.length === 0 ? (
            <div className="bg-white border border-[#e0e3e0] rounded-xl p-8 text-center flex flex-col items-center justify-center mt-6">
              <span className="material-symbols-outlined text-[#bec9c4] text-[40px] mb-1">outbox</span>
              <p className="text-xs font-bold text-[#6e7975]">No requests matching this filter.</p>
            </div>
          ) : (
            filteredRequests.map((r) => {
              const space = getSpaceInfo(r.spaceId);
              return (
                <div 
                  key={r.id}
                  onClick={() => handleOpenRequestDetail(r.id)}
                  className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative"
                >
                  {r.isAdvance && (
                    <span className="absolute top-2 right-2 text-[8px] bg-[#0d9488]/10 text-[#0d9488] font-black px-1.5 py-0.5 rounded uppercase">
                      Advance Request
                    </span>
                  )}
                  
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img src={space.photos ? space.photos[0] : ""} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-grow text-xs space-y-0.5">
                      <h4 className="font-black text-[#181c1b] truncate pr-16">{space.shop}</h4>
                      <p className="font-bold text-[#6e7975]">{space.nickname}</p>
                      <p className="text-[10px] text-[#6e7975]">Product: {r.productName}</p>
                    </div>
                  </div>

                  {r.status === 'Countered' && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mt-2.5 text-[10px] text-blue-700 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                      <span>Counter-offer received: PKR {(r.counterHistory[r.counterHistory.length - 1].newPrice || r.counterHistory[r.counterHistory.length - 1].price || 0).toLocaleString()}</span>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-[#ebefec] flex items-center justify-between text-[10px]">
                    <span className="text-[#3e4945] font-semibold">{r.durationLabel}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#005344]">PKR {r.offeredPrice.toLocaleString()}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${getStatusBadgeClass(r.status)}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* BULK CAMPAIGNS */
          <div className="space-y-4">
            <button 
              onClick={() => {
                setCurrentView('create-campaign');
                setViewParams(null);
              }}
              className="w-full py-3 bg-[#005344] text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Launch Bulk Campaign
            </button>

            {campaigns.length === 0 ? (
              <div className="bg-white border border-[#e0e3e0] rounded-xl p-8 text-center flex flex-col items-center justify-center mt-2">
                <span className="material-symbols-outlined text-[#bec9c4] text-[40px] mb-1">campaign</span>
                <p className="text-xs font-bold text-[#6e7975]">No bulk campaigns launched.</p>
              </div>
            ) : (
              campaigns.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => handleOpenCampaignDetail(c.id)}
                  className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold text-[#6e7975] uppercase">{c.chain}</span>
                      <h4 className="text-xs font-black text-[#181c1b] leading-tight">{c.name}</h4>
                    </div>
                    <span className="text-[8px] bg-[#0d9488]/10 text-[#0d9488] font-black px-1.5 py-0.5 rounded uppercase">
                      Bulk Campaign
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold border-t border-[#ebefec] pt-2">
                    <div className="text-green-700">Accepted: {c.stats.accepted}</div>
                    <div className="text-[#ab6b00]">Pending: {c.stats.pending}</div>
                    <div className="text-red-700">Rejected: {c.stats.rejected}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignCreatorView({ onBack, spaces, availableChains, onLaunch }) {
  const [step, setStep] = useState(1);
  const [selectedChain, setSelectedChain] = useState(null);
  const [campName, setCampName] = useState('');
  const [spaceType, setSpaceType] = useState('end_cap');
  const [month, setMonth] = useState('June 2026');
  const [proposedPrice, setProposedPrice] = useState(45000);
  const [productName, setProductName] = useState('');
  const [selectedBranches, setSelectedBranches] = useState([]);

  // Dynamically resolve branches that have spaces for the selected chain
  const chainSpaces = selectedChain
    ? spaces.filter(s => s.shop.toLowerCase().includes(selectedChain.name.split(' ')[0].toLowerCase()))
    : [];

  const handleToggleBranch = (space) => {
    if (selectedBranches.some(b => b.id === space.id)) {
      setSelectedBranches(prev => prev.filter(b => b.id !== space.id));
    } else {
      setSelectedBranches(prev => [...prev, space]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedChain) {
      alert("Please select a retail chain.");
      return;
    }
    if (step === 2) {
      if (!campName.trim() || !productName.trim() || !proposedPrice) {
        alert("Please fill in all campaign details.");
        return;
      }
    }
    if (step === 3 && selectedBranches.length === 0) {
      alert("Please select at least one branch.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = () => {
    onLaunch({
      name: campName,
      chain: selectedChain.name,
      month: month,
      productName: productName,
      branches: selectedBranches.map(b => ({
        id: b.id,
        name: b.branch || b.nickname,
        area: `${b.area || b.city}, Pakistan`,
        status: "Pending",
        price: Number(proposedPrice),
        type: spaceType
      }))
    });
  };

  const getSpaceTypeLabel = (type) => {
    const labels = {
      shelf: "Shelf",
      end_cap: "End-Cap",
      window_display: "Window Display",
      floor_stand: "Floor Stand",
      checkout_counter: "Checkout Counter",
      entrance_display: "Entrance Display",
      promotional_aisle: "Promotional Aisle"
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
      {/* TopAppBar */}
      <header className="bg-white sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
        <div className="flex items-center justify-between px-4 h-16 w-full mx-auto max-w-[390px]">
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full text-[20px]">
              arrow_back
            </button>
            <h1 className="text-[17px] font-black text-[#005344]">Launch Campaign</h1>
          </div>
          <span className="text-[10px] font-black text-[#6e7975] uppercase tracking-wider">
            Step {step} of 4
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1 shrink-0">
        <div className="bg-[#005344] h-1 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>

      <main className="flex-grow pt-4 pb-28 px-4 w-full mx-auto max-w-[390px] space-y-5 overflow-y-auto">
        {step === 1 && (
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#005344] border-b border-[#ebefec] pb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">store</span>
              Step 1: Select Retail Chain
            </h3>
            <div className="space-y-2.5">
              {availableChains.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedChain(c)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedChain?.id === c.id 
                      ? 'border-[#005344] bg-[#005344]/5' 
                      : 'border-[#e0e3e0] bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="font-extrabold text-xs text-[#3e4945]">{c.name}</span>
                  {selectedChain?.id === c.id && (
                    <span className="material-symbols-outlined text-[#005344] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#005344] border-b border-[#ebefec] pb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              Step 2: Campaign Details
            </h3>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#3e4945]">Campaign Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Q3 Beverages Launch"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full h-11 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-bold" 
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#3e4945]">Product Name / SKU</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sunsilk Green Tea 250ml"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full h-11 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-bold" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#3e4945]">Preferred Space Type</label>
                  <select 
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-bold"
                  >
                    <option value="end_cap">End-Cap</option>
                    <option value="shelf">Shelf</option>
                    <option value="checkout_counter">Checkout Counter</option>
                    <option value="entrance_display">Entrance Display</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#3e4945]">Target Month</label>
                  <select 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-bold"
                  >
                    <option>June 2026</option>
                    <option>July 2026</option>
                    <option>August 2026</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#3e4945]">Proposed Price per Branch (PKR Total)</label>
                <input 
                  type="number" 
                  required
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="w-full h-11 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-bold" 
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#005344] border-b border-[#ebefec] pb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">rule_folder</span>
              Step 3: Select Branches ({selectedBranches.length} selected)
            </h3>
            {chainSpaces.length === 0 ? (
              <p className="text-xs text-gray-500 font-bold text-center py-6">No branches in database for this chain.</p>
            ) : (
              <div className="space-y-2.5">
                {chainSpaces.map(space => {
                  const isChecked = selectedBranches.some(b => b.id === space.id);
                  return (
                    <div 
                      key={space.id}
                      onClick={() => handleToggleBranch(space)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-[#005344] bg-[#005344]/5' 
                          : 'border-[#e0e3e0] bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-xs text-[#181c1b]">{space.branch || space.nickname}</h4>
                        <p className="text-[10px] text-[#6e7975] mt-0.5">{space.area || space.city}</p>
                      </div>
                      <span className="material-symbols-outlined text-[#005344] text-[20px]">
                        {isChecked ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#005344] border-b border-[#ebefec] pb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Step 4: Review Campaign
            </h3>
            <div className="space-y-3.5 text-xs text-[#3e4945]">
              <div className="border-b border-[#ebefec] pb-2">
                <span className="text-[9px] font-bold text-[#6e7975] uppercase">Campaign Name</span>
                <p className="font-black text-[#181c1b] text-[13px]">{campName}</p>
              </div>
              <div className="border-b border-[#ebefec] pb-2">
                <span className="text-[9px] font-bold text-[#6e7975] uppercase">Product Name</span>
                <p className="font-black text-[#181c1b]">{productName}</p>
              </div>
              <div className="border-b border-[#ebefec] pb-2">
                <span className="text-[9px] font-bold text-[#6e7975] uppercase">Target Chain & Space</span>
                <p className="font-black text-[#181c1b]">{selectedChain.name} — {getSpaceTypeLabel(spaceType).toUpperCase()}</p>
              </div>
              <div className="border-b border-[#ebefec] pb-2">
                <span className="text-[9px] font-bold text-[#6e7975] uppercase">Target Month & Price per branch</span>
                <p className="font-black text-[#181c1b]">{month} • PKR {Number(proposedPrice).toLocaleString()}/branch</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-[#6e7975] uppercase block mb-1">Target Branches ({selectedBranches.length})</span>
                <div className="max-h-[120px] overflow-y-auto border border-[#ebefec] rounded-lg p-2.5 bg-gray-50 space-y-1">
                  {selectedBranches.map(b => (
                    <p key={b.id} className="font-bold text-[11px] text-[#181c1b]">• {b.branch || b.nickname} ({b.area})</p>
                  ))}
                </div>
              </div>
              <div className="bg-[#005344]/5 p-3 rounded-lg border border-[#005344]/20 flex justify-between items-center mt-3 shrink-0">
                <span className="font-bold text-[11px] text-[#005344]">Total Budget:</span>
                <span className="font-black text-[#005344] text-[15px]">PKR {(proposedPrice * selectedBranches.length).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <button 
              onClick={handlePrev}
              className="flex-1 py-3 border border-[#bec9c4] text-[#6e7975] bg-white font-bold rounded-xl text-xs hover:bg-gray-50 transition-all cursor-pointer"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="flex-[2] py-3 bg-[#005344] hover:bg-[#003d32] text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="flex-[2] py-3 bg-[#fe6a34] hover:bg-[#e05620] text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              Launch Bulk Campaign
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
