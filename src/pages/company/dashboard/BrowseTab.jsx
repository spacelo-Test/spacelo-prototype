import React, { useState } from 'react';
import { useCompany } from './CompanyContext';

export default function BrowseTab() {
  const { 
    spaces, 
    recentlyViewed, 
    availableChains, 
    sendRequest, 
    sendAdvanceRequest, 
    createAlert 
  } = useCompany();

  const [browseMode, setBrowseMode] = useState('home'); // 'home' | 'search' | 'advance'
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [spaceMode, setSpaceMode] = useState(null); // 'regular' | 'advance'

  // Search mode state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    area: '',
    spaceTypes: [],
    chainId: '',
    priceMin: '',
    priceMax: '',
    dateStart: '2026-06-01',
    dateEnd: '2026-08-31',
    minTrustScore: 0,
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  // Advance booking mode state
  const [advanceStep, setAdvanceStep] = useState(1);
  const [advanceForm, setAdvanceForm] = useState({
    dateStart: '2026-07-01',
    dateEnd: '2026-09-30',
    city: '',
    area: '',
    spaceTypes: [],
    chainId: '',
  });
  const [advanceSearched, setAdvanceSearched] = useState(false);
  const [advanceStepError, setAdvanceStepError] = useState('');

  // Request bottom sheet
  const [requestSheetOpen, setRequestSheetOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    dateStart: '2026-06-01',
    dateEnd: '2026-08-31',
    offerPrice: '',
    productName: '',
  });

  // Notify Me Alert Modal
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyForm, setNotifyForm] = useState({
    channel: 'Both',
  });

  // UI Helpers
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

  const getSpaceTypeIcon = (type) => {
    const icons = {
      shelf: "grid_view",
      end_cap: "view_carousel",
      window_display: "storefront",
      floor_stand: "view_in_ar",
      checkout_counter: "point_of_sale",
      entrance_display: "door_front",
      promotional_aisle: "space_bar"
    };
    return icons[type] || "category";
  };

  // Check if a space has a booking overlapping with dates
  const getBookedUntilDate = (spaceId) => {
    // Space 3 is booked until 2026-06-30
    if (spaceId === 3) return '2026-06-30';
    // Space 5 is booked until 2026-07-15
    if (spaceId === 5) return '2026-07-15';
    return null;
  };

  const isSpaceBooked = (spaceId, start, end) => {
    const bookedUntil = getBookedUntilDate(spaceId);
    if (!bookedUntil) return false;
    if (!start) return true; // Assume booked if search range undefined but space has booked status
    return new Date(start) <= new Date(bookedUntil);
  };

  // Filter regular spaces
  const getRegularSpaces = () => {
    return spaces.filter(space => {
      // Filter out currently booked spaces for selected dates
      if (isSpaceBooked(space.id, filters.dateStart, filters.dateEnd)) {
        return false;
      }
      
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        space.nickname.toLowerCase().includes(query) ||
        space.shop.toLowerCase().includes(query) ||
        space.area.toLowerCase().includes(query);
      const matchesCity = filters.city ? space.city === filters.city : true;
      const matchesArea = filters.area ? space.area.toLowerCase().includes(filters.area.toLowerCase()) : true;
      const matchesTypes = filters.spaceTypes.length > 0 ? filters.spaceTypes.includes(space.type) : true;
      
      // Chain brand matching: context availableChains gives us IDs
      let matchesChain = true;
      if (filters.chainId) {
        const chain = availableChains.find(c => c.id === filters.chainId);
        matchesChain = chain ? space.shop.toLowerCase().includes(chain.name.split(' ')[0].toLowerCase()) : true;
      }

      const matchesMinPrice = filters.priceMin ? space.price >= Number(filters.priceMin) : true;
      const matchesMaxPrice = filters.priceMax ? space.price <= Number(filters.priceMax) : true;
      const matchesRating = space.rating >= filters.minTrustScore;

      return matchesSearch && matchesCity && matchesArea && matchesTypes && matchesChain && matchesMinPrice && matchesMaxPrice && matchesRating;
    });
  };

  // Filter advance spaces
  const getAdvanceSpaces = () => {
    return spaces.filter(space => {
      const bookedUntil = getBookedUntilDate(space.id);
      if (!bookedUntil) return false; // Only show booked spaces that free up
      
      // Free up on or before selected start date
      const matchesAvailability = new Date(bookedUntil) <= new Date(advanceForm.dateStart);
      if (!matchesAvailability) return false;

      const matchesCity = advanceForm.city ? space.city === advanceForm.city : true;
      const matchesArea = advanceForm.area ? space.area.toLowerCase().includes(advanceForm.area.toLowerCase()) : true;
      const matchesTypes = advanceForm.spaceTypes.length > 0 ? advanceForm.spaceTypes.includes(space.type) : true;
      
      let matchesChain = true;
      if (advanceForm.chainId) {
        const chain = availableChains.find(c => c.id === advanceForm.chainId);
        matchesChain = chain ? space.shop.toLowerCase().includes(chain.name.split(' ')[0].toLowerCase()) : true;
      }

      return matchesCity && matchesArea && matchesTypes && matchesChain;
    });
  };

  // Date duration auto-calculator
  const calculateDurationMonths = (start, end) => {
    if (!start || !end) return 0;
    const dtStart = new Date(start);
    const dtEnd = new Date(end);
    const months = (dtEnd.getFullYear() - dtStart.getFullYear()) * 12 + (dtEnd.getMonth() - dtStart.getMonth());
    return Math.max(1, months);
  };

  // Handlers
  const handleOpenDetail = (space, mode) => {
    setSelectedSpace(space);
    setSpaceMode(mode);
    setRequestForm({
      dateStart: mode === 'regular' ? filters.dateStart : advanceForm.dateStart,
      dateEnd: mode === 'regular' ? filters.dateEnd : advanceForm.dateEnd,
      offerPrice: space.price * calculateDurationMonths(
        mode === 'regular' ? filters.dateStart : advanceForm.dateStart,
        mode === 'regular' ? filters.dateEnd : advanceForm.dateEnd
      ),
      productName: ''
    });
  };

  const handleOpenRequestSheet = () => {
    setRequestSheetOpen(true);
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!requestForm.productName.trim()) {
      alert("Please enter the product name to proceed.");
      return;
    }

    const duration = calculateDurationMonths(requestForm.dateStart, requestForm.dateEnd);
    const reqPayload = {
      spaceId: selectedSpace.spaceId || selectedSpace.id,
      listingId: selectedSpace.listingId || null,
      spaceName: selectedSpace.nickname || selectedSpace.name || '',
      productName: requestForm.productName,
      startDate: requestForm.dateStart,
      endDate: requestForm.dateEnd,
      durationLabel: `${duration} month(s) (${requestForm.dateStart} to ${requestForm.dateEnd})`,
      durationMonths: duration,
      offeredPrice: Number(requestForm.offerPrice),
      pricePerMonth: Math.round(Number(requestForm.offerPrice) / duration),
      status: 'Pending'
    };

    if (spaceMode === 'regular') {
      sendRequest(reqPayload);
      alert("Booking request sent! Check your Requests tab.");
    } else {
      sendAdvanceRequest(reqPayload);
      alert("Advance request sent! Check your Requests tab.");
    }

    setRequestSheetOpen(false);
    setSelectedSpace(null);
    setBrowseMode('home');
  };

  const handleCreateAlert = () => {
    createAlert({
      spaceType: selectedSpace.type,
      chain: selectedSpace.shop,
      location: selectedSpace.city,
      channel: notifyForm.channel
    });
    setShowNotifyModal(false);
    alert(`Success! You will be notified via ${notifyForm.channel} when a space at ${selectedSpace.shop} becomes available.`);
  };

  const handleAdvanceStepNext = () => {
    setAdvanceStepError('');
    if (advanceStep === 1) {
      const duration = calculateDurationMonths(advanceForm.dateStart, advanceForm.dateEnd);
      if (duration < 1) {
        setAdvanceStepError('Minimum duration of 1 month is required.');
        return;
      }
      if (duration > 12) {
        setAdvanceStepError('Maximum duration of 12 months is allowed.');
        return;
      }
    }
    if (advanceStep === 2 && !advanceForm.city) {
      setAdvanceStepError('City is required to proceed.');
      return;
    }
    setAdvanceStep(prev => prev + 1);
  };

  // Shared Sub-component renders
  const renderHome = () => {
    return (
      <div className="space-y-6 p-4 pb-20">
        {/* Top search bar entry */}
        <div 
          onClick={() => setBrowseMode('search')}
          className="relative bg-white border border-[#e0e3e0] rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 cursor-pointer hover:border-[#005344] transition-all"
        >
          <span className="material-symbols-outlined text-[#6e7975] text-[20px]">search</span>
          <span className="text-xs text-[#6e7975]">Search spaces, shops, or chains...</span>
        </div>

        {/* Large Entry Cards */}
        <section className="space-y-4">
          {/* Card 1: Available Spaces */}
          <div 
            onClick={() => setBrowseMode('search')}
            className="bg-white border border-[#e0e3e0] border-l-4 border-l-[#005344] rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#005344]/10 text-[#005344] rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">storefront</span>
              </div>
              <div>
                <h3 className="text-xs font-black text-[#181c1b]">Search Available Spaces</h3>
                <p className="text-[10px] text-[#6e7975] mt-0.5 leading-relaxed">
                  Browse live listings filtered by city, space type, chain, price and dates
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <span className="text-[10px] font-black text-[#005344] uppercase tracking-wider">Browse Now →</span>
            </div>
          </div>

          {/* Card 2: Request Advance Booking */}
          <div 
            onClick={() => setBrowseMode('advance')}
            className="bg-white border border-[#e0e3e0] border-l-4 border-l-[#fe6a34] rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fe6a34]/10 text-[#fe6a34] rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
              </div>
              <div>
                <h3 className="text-xs font-black text-[#181c1b]">Request Advance Booking</h3>
                <p className="text-[10px] text-[#6e7975] mt-0.5 leading-relaxed">
                  Find spaces for future dates — even if currently occupied by another brand
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <span className="text-[10px] font-black text-[#fe6a34] uppercase tracking-wider">Select Dates →</span>
            </div>
          </div>
        </section>

        {/* Recently Viewed Spaces */}
        {recentlyViewed && recentlyViewed.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-[11px] font-black uppercase text-[#6e7975] tracking-wider px-1">Recently Viewed Spaces</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
              {recentlyViewed.map((space) => {
                const fullSpace = spaces.find(s => s.id === space.id) || space;
                return (
                  <div 
                    key={space.id}
                    onClick={() => handleOpenDetail(fullSpace, 'regular')}
                    className="snap-start min-w-[150px] max-w-[150px] bg-white border border-[#e0e3e0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <div className="h-20 w-full overflow-hidden bg-gray-100">
                      <img src={space.photos[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2 space-y-0.5">
                      <span className="bg-[#fe6a34]/15 text-[#fe6a34] text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                        {getSpaceTypeLabel(space.type)}
                      </span>
                      <h4 className="text-[10px] font-black text-[#181c1b] truncate mt-1">{space.nickname}</h4>
                      <p className="text-[9px] text-[#6e7975] truncate">{space.shop}</p>
                      <p className="text-[10px] font-black text-[#005344] mt-1">PKR {space.price.toLocaleString()}/mo</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  };

  const renderSearch = () => {
    const results = getRegularSpaces();
    return (
      <div className="bg-[#f7faf7] h-full flex flex-col font-manrope overflow-hidden">
        {/* Header toolbar */}
        <section className="bg-white border-b border-[#e0e3e0] p-3 space-y-3 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setBrowseMode('home')}
                className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full text-[20px]"
              >
                arrow_back
              </button>
              <h2 className="text-sm font-black text-[#005344]">Search Spaces</h2>
            </div>
            
            <button 
              onClick={() => setFilterPanelOpen(true)}
              className="p-1.5 hover:bg-[#ebefec] rounded-full transition-colors flex items-center text-[#005344]"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>

          {/* Search bar input */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7975] text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search store, branch, area..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-[#F3F4F6] rounded-xl outline-none text-xs focus:ring-1 focus:ring-[#005344] border-transparent"
            />
          </div>

          {/* View Toggles & Match counts */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-[10px] font-bold text-[#6e7975] uppercase">{results.length} spaces matching</span>
            <div className="flex border border-[#bec9c4] rounded-lg overflow-hidden shrink-0">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-[10px] font-bold transition-all ${viewMode === 'list' ? 'bg-[#005344] text-white' : 'bg-white text-[#6e7975]'}`}
              >
                List
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 text-[10px] font-bold transition-all ${viewMode === 'map' ? 'bg-[#005344] text-white' : 'bg-white text-[#6e7975]'}`}
              >
                Map
              </button>
            </div>
          </div>
        </section>

        {/* Results Panel */}
        <div className="flex-grow overflow-y-auto pb-20">
          {viewMode === 'list' ? (
            /* LIST VIEW */
            results.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center mt-8">
                <span className="material-symbols-outlined text-[#bec9c4] text-[48px] mb-2">sentiment_dissatisfied</span>
                <p className="text-xs font-bold text-[#6e7975]">No spaces found matching your criteria.</p>
                <button 
                  onClick={() => setFilters({
                    city: '', area: '', spaceTypes: [], chainId: '', priceMin: '', priceMax: '', dateStart: '2026-06-01', dateEnd: '2026-08-31', minTrustScore: 0
                  })}
                  className="text-xs text-[#005344] font-black underline mt-2"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {results.map((space) => {
                  const duration = calculateDurationMonths(filters.dateStart, filters.dateEnd);
                  const totalPrice = space.price * duration;
                  return (
                    <div 
                      key={space.id}
                      onClick={() => handleOpenDetail(space, 'regular')}
                      className="bg-white border border-[#e0e3e0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex p-3 gap-3"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border relative">
                        <img src={space.photos[0]} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-green-600 text-white font-black text-[7px] px-1.5 py-0.2 rounded uppercase">
                          Available
                        </span>
                      </div>
                      
                      <div className="min-w-0 flex-grow flex flex-col justify-between text-xs">
                        <div>
                          <div className="flex justify-between items-center gap-1.5 flex-wrap">
                            <span className="bg-[#fe6a34]/15 text-[#fe6a34] text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                              {getSpaceTypeLabel(space.type)}
                            </span>
                            <span className="text-[9px] font-black text-[#fe6a34] flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px] filled">star</span>
                              {space.rating}
                            </span>
                          </div>
                          
                          <h4 className="font-black text-[#181c1b] truncate mt-1">{space.nickname}</h4>
                          <p className="text-[10px] text-[#6e7975] mt-0.5">{space.shop} — {space.area}</p>
                        </div>

                        <div className="flex justify-between items-end border-t border-[#ebefec] pt-1.5 mt-1.5">
                          <span className="text-[9px] text-[#6e7975] font-semibold">{space.city}</span>
                          <span className="font-black text-[#005344] text-right">
                            {duration > 0 ? (
                              <>
                                <p className="text-[11px]">PKR {totalPrice.toLocaleString()}</p>
                                <p className="text-[8px] text-[#6e7975] font-bold">for {duration} mo</p>
                              </>
                            ) : (
                              <p className="text-[11px]">PKR {space.price.toLocaleString()}/mo</p>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* MAP VIEW */
            <div className="w-full h-full bg-[#e5e9e5] relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#005344_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
              
              {results.map((s, idx) => {
                const positions = [
                  { top: '30%', left: '35%' },
                  { top: '60%', left: '20%' },
                  { top: '25%', left: '70%' },
                  { top: '48%', left: '55%' },
                  { top: '40%', left: '15%' }
                ];
                const pos = positions[idx % positions.length];
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedPin(s)}
                    className="absolute cursor-pointer transform hover:scale-110 active:scale-95 transition-transform"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <span className="material-symbols-outlined text-[#005344] text-[30px] filled drop-shadow-md">
                      location_on
                    </span>
                  </button>
                );
              })}

              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[9px] font-bold px-3 py-1 rounded-full">
                Tap pins to inspect details
              </p>

              {/* Map Popup */}
              {selectedPin && (
                <div className="absolute bottom-14 left-3 right-3 bg-white border border-[#e0e3e0] p-2.5 rounded-xl shadow-2xl flex gap-2.5 items-center z-30">
                  <img src={selectedPin.photos[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border" />
                  <div className="min-w-0 flex-1 text-xs">
                    <h5 className="font-black text-[#181c1b] truncate">{selectedPin.nickname}</h5>
                    <p className="text-[9px] text-[#6e7975]">{selectedPin.shop} — PKR {selectedPin.price.toLocaleString()}/mo</p>
                  </div>
                  <button 
                    onClick={() => handleOpenDetail(selectedPin, 'regular')}
                    className="bg-[#005344] text-white text-[10px] font-black px-3.5 py-2 rounded-lg shrink-0"
                  >
                    View
                  </button>
                  <button onClick={() => setSelectedPin(null)} className="material-symbols-outlined text-[#6e7975] text-[18px]">close</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters bottom sheet overlay */}
        {filterPanelOpen && (
          <div className="fixed inset-0 z-[100] bg-[#181c1b]/40 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white rounded-t-2xl w-full max-w-[390px] p-5 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto">
              
              <div className="flex justify-between items-center pb-2 border-b border-[#ebefec]">
                <h3 className="text-sm font-black text-[#005344] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  Filters
                </h3>
                <button onClick={() => setFilterPanelOpen(false)} className="material-symbols-outlined text-gray-400 text-[20px]">close</button>
              </div>

              <div className="space-y-4 text-xs">
                {/* City Dropdown */}
                <div className="space-y-1">
                  <label className="font-bold text-[#181c1b]">City</label>
                  <select 
                    value={filters.city}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none text-xs"
                  >
                    <option value="">All Cities</option>
                    <option>Lahore</option>
                    <option>Karachi</option>
                    <option>Islamabad</option>
                  </select>
                </div>

                {/* Area Input */}
                <div className="space-y-1">
                  <label className="font-bold text-[#181c1b]">Area / Locality</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Gulberg, DHA"
                    value={filters.area}
                    onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none text-xs"
                  />
                </div>

                {/* Space Type Chips */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#181c1b]">Space Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["shelf", "end_cap", "window_display", "floor_stand", "checkout_counter", "entrance_display", "promotional_aisle"].map(type => {
                      const isSelected = filters.spaceTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setFilters(prev => {
                              const types = prev.spaceTypes.includes(type)
                                ? prev.spaceTypes.filter(t => t !== type)
                                : [...prev.spaceTypes, type];
                              return { ...prev, spaceTypes: types };
                            });
                          }}
                          className={`px-3 py-1.5 rounded-full font-bold border transition-all text-[9px] uppercase ${isSelected ? 'bg-[#005344] border-[#005344] text-white' : 'bg-[#ebefec] border-transparent text-[#3e4945]'}`}
                        >
                          {getSpaceTypeLabel(type)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Chain Brand dropdown */}
                <div className="space-y-1">
                  <label className="font-bold text-[#181c1b]">Chain Brand</label>
                  <select 
                    value={filters.chainId}
                    onChange={(e) => setFilters(prev => ({ ...prev, chainId: e.target.value }))}
                    className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none text-xs"
                  >
                    <option value="">All Shops & Malls</option>
                    {availableChains.map(chain => (
                      <option key={chain.id} value={chain.id}>
                        {chain.name} {chain.verified ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="space-y-1">
                  <label className="font-bold text-[#181c1b]">Price Budget (PKR)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      placeholder="Min Price"
                      value={filters.priceMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none text-xs"
                    />
                    <input 
                      type="number" 
                      placeholder="Max Price"
                      value={filters.priceMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Date Ranges */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-[#181c1b]">Start Date</label>
                    <input 
                      type="date"
                      value={filters.dateStart}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateStart: e.target.value }))}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#181c1b]">End Date</label>
                    <input 
                      type="date"
                      value={filters.dateEnd}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateEnd: e.target.value }))}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Trust Score Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Min Trust Score</span>
                    <span className="text-[#fe6a34]">{filters.minTrustScore}★ & above</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={5} 
                    step={0.5}
                    value={filters.minTrustScore}
                    onChange={(e) => setFilters(prev => ({ ...prev, minTrustScore: Number(e.target.value) }))}
                    className="w-full h-1 bg-[#ebefec] rounded-lg appearance-none cursor-pointer accent-[#fe6a34]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#ebefec] flex gap-2">
                <button 
                  onClick={() => setFilters({
                    city: '', area: '', spaceTypes: [], chainId: '', priceMin: '', priceMax: '', dateStart: '2026-06-01', dateEnd: '2026-08-31', minTrustScore: 0
                  })}
                  className="flex-1 py-2.5 border border-[#bec9c4] text-[#3e4945] rounded-xl font-bold hover:bg-[#F3F4F6] text-xs transition-all"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setFilterPanelOpen(false)}
                  className="flex-grow-[2] py-2.5 bg-[#005344] text-white rounded-xl font-bold hover:bg-[#003d32] text-xs shadow-md transition-all"
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAdvance = () => {
    if (advanceSearched) {
      const results = getAdvanceSpaces();
      return (
        <div className="bg-[#f7faf7] h-full flex flex-col font-manrope overflow-hidden">
          <section className="bg-white border-b border-[#e0e3e0] p-3 space-y-1 shrink-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAdvanceSearched(false)}
                className="material-symbols-outlined text-[#fe6a34] hover:bg-[#ebefec] p-1 rounded-full text-[20px]"
              >
                arrow_back
              </button>
              <h2 className="text-sm font-black text-[#fe6a34]">Advance Booking Results</h2>
            </div>
            <p className="text-[10px] text-[#6e7975] font-bold uppercase pl-7">
              Showing spaces available from {advanceForm.dateStart}
            </p>
            <p className="text-[11px] text-[#3e4945] font-bold pl-7 mt-1.5">
              {results.length} spaces matching criteria
            </p>
          </section>

          <div className="flex-grow overflow-y-auto p-4 pb-20 space-y-4">
            {results.length === 0 ? (
              <div className="bg-white border border-[#e0e3e0] rounded-xl p-8 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[#bec9c4] text-[40px] mb-2 animate-bounce">notifications_active</span>
                <p className="text-xs font-bold text-[#6e7975]">No spaces match your advance request criteria.</p>
                <p className="text-[10px] text-[#6e7975] mt-1">Try broader dates or a different area.</p>
                <button 
                  onClick={() => navigateToView('profile', 'alerts')}
                  className="w-full bg-[#fe6a34] text-white text-xs font-black py-2.5 rounded-xl shadow mt-4 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                  Set a Notification Alert Instead
                </button>
              </div>
            ) : (
              results.map((space) => {
                const bookedUntil = getBookedUntilDate(space.id);
                return (
                  <div 
                    key={space.id}
                    onClick={() => handleOpenDetail(space, 'advance')}
                    className="bg-white border border-[#e0e3e0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex p-3 gap-3"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border relative">
                      <img src={space.photos[0]} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-[#fe6a34] text-white font-black text-[7px] px-1.5 py-0.2 rounded uppercase">
                        Booked
                      </span>
                    </div>

                    <div className="min-w-0 flex-grow flex flex-col justify-between text-xs">
                      <div>
                        <div className="flex justify-between items-center gap-1">
                          <span className="bg-[#fe6a34]/15 text-[#fe6a34] text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                            {getSpaceTypeLabel(space.type)}
                          </span>
                          <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-200 px-1 rounded font-bold uppercase shrink-0">
                            Frees Up {bookedUntil}
                          </span>
                        </div>
                        <h4 className="font-black text-[#181c1b] truncate mt-1">{space.nickname}</h4>
                        <p className="text-[10px] text-[#6e7975] mt-0.5">{space.shop} — {space.area}</p>
                      </div>

                      <div className="flex justify-between items-end border-t border-[#ebefec] pt-1.5 mt-1.5">
                        <span className="text-[9px] text-[#6e7975]">{space.city}</span>
                        <span className="font-black text-[#005344] text-right text-[11px]">
                          PKR {space.price.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
        {/* Header */}
        <header className="bg-white sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
          <div className="flex items-center justify-between px-4 h-16 w-full mx-auto max-w-[390px]">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setBrowseMode('home'); setAdvanceStep(1); }}
                className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full text-[20px]"
              >
                arrow_back
              </button>
              <h1 className="text-[16px] font-black text-[#005344]">Advance Request</h1>
            </div>
            <span className="text-[10px] font-bold text-[#6e7975]">Step {advanceStep} of 4</span>
          </div>
        </header>

        <main className="flex-grow pt-4 pb-28 px-4 w-full mx-auto max-w-[390px] space-y-5 overflow-y-auto">
          {/* Progress Indicator */}
          <div className="w-full bg-[#ebefec] h-1.5 rounded-full overflow-hidden shrink-0">
            <div className="bg-[#fe6a34] h-full transition-all duration-300" style={{ width: `${(advanceStep / 4) * 100}%` }}></div>
          </div>

          {advanceStepError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-bold">
              {advanceStepError}
            </div>
          )}

          {/* STEP 1: DATES */}
          {advanceStep === 1 && (
            <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-black text-[#181c1b]">When do you need the space?</h2>
                <p className="text-[10px] text-[#6e7975] mt-0.5">Select your desired booking period (min 1 month)</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#3e4945]">Start Date</label>
                    <input 
                      type="date"
                      value={advanceForm.dateStart}
                      onChange={(e) => setAdvanceForm(prev => ({ ...prev, dateStart: e.target.value }))}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#3e4945]">End Date</label>
                    <input 
                      type="date"
                      value={advanceForm.dateEnd}
                      onChange={(e) => setAdvanceForm(prev => ({ ...prev, dateEnd: e.target.value }))}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="bg-[#f7faf7] border border-[#e0e3e0] p-3 rounded-lg flex justify-between items-center font-bold">
                  <span className="text-[#6e7975]">Booking Duration:</span>
                  <span className="text-[#005344] font-black">
                    {calculateDurationMonths(advanceForm.dateStart, advanceForm.dateEnd)} month(s)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {advanceStep === 2 && (
            <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-black text-[#181c1b]">Where do you need it?</h2>
                <p className="text-[10px] text-[#6e7975] mt-0.5">Choose city and specify locality details</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#181c1b]">City (Required)</label>
                  <select 
                    value={advanceForm.city}
                    onChange={(e) => setAdvanceForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                  >
                    <option value="">Select City</option>
                    <option>Lahore</option>
                    <option>Karachi</option>
                    <option>Islamabad</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#181c1b]">Area / Locality (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Gulberg, DHA"
                    value={advanceForm.area}
                    onChange={(e) => setAdvanceForm(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SPACE TYPE */}
          {advanceStep === 3 && (
            <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-black text-[#181c1b]">What type of space?</h2>
                <p className="text-[10px] text-[#6e7975] mt-0.5">Visual chip selector (multi-select allowed)</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "shelf", label: "Shelf" },
                  { id: "end_cap", label: "End-Cap" },
                  { id: "window_display", label: "Window Display" },
                  { id: "floor_stand", label: "Floor Stand" },
                  { id: "checkout_counter", label: "Checkout Counter" },
                  { id: "entrance_display", label: "Entrance Display" },
                  { id: "promotional_aisle", label: "Promotional Aisle" }
                ].map((t) => {
                  const isSelected = advanceForm.spaceTypes.includes(t.id);
                  return (
                    <div 
                      key={t.id}
                      onClick={() => {
                        setAdvanceForm(prev => {
                          const types = prev.spaceTypes.includes(t.id)
                            ? prev.spaceTypes.filter(s => s !== t.id)
                            : [...prev.spaceTypes, t.id];
                          return { ...prev, spaceTypes: types };
                        });
                      }}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-[#fe6a34]/10 border-[#fe6a34] text-[#fe6a34]' : 'bg-[#f7faf7] border-[#e0e3e0] text-[#6e7975]'}`}
                    >
                      <span className="material-symbols-outlined text-[22px] mb-1">{getSpaceTypeIcon(t.id)}</span>
                      <span className="font-bold text-[10px] text-center">{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CHAIN BRAND */}
          {advanceStep === 4 && (
            <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-black text-[#181c1b]">Any specific chain or shop?</h2>
                <p className="text-[10px] text-[#6e7975] mt-0.5">Leave blank to search all verified outlets</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#181c1b]">Select Corporate Chain</label>
                  <select 
                    value={advanceForm.chainId}
                    onChange={(e) => setAdvanceForm(prev => ({ ...prev, chainId: e.target.value }))}
                    className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                  >
                    <option value="">All Shops & Malls (Default)</option>
                    {availableChains.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.verified ? '✓' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP NAVIGATION CTAS */}
          <div className="flex gap-2.5 pt-2">
            {advanceStep > 1 && (
              <button 
                onClick={() => setAdvanceStep(prev => prev - 1)}
                className="flex-1 py-3 border border-[#bec9c4] text-[#3e4945] rounded-xl text-xs font-bold"
              >
                Back
              </button>
            )}
            
            {advanceStep < 4 ? (
              <button 
                onClick={handleAdvanceStepNext}
                className="flex-[2] py-3 bg-[#005344] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow"
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  setAdvanceSearched(true);
                }}
                className="flex-[2] py-3 bg-[#fe6a34] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow"
              >
                <span>Search</span>
                <span className="material-symbols-outlined text-[16px]">search</span>
              </button>
            )}
          </div>
        </main>
      </div>
    );
  };

  const renderDetail = () => {
    const isBooked = isSpaceBooked(selectedSpace.id, requestForm.dateStart, requestForm.dateEnd);
    const bookedUntil = getBookedUntilDate(selectedSpace.id);
    const duration = calculateDurationMonths(requestForm.dateStart, requestForm.dateEnd);
    const totalPrice = selectedSpace.price * (duration || 1);

    return (
      <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
        {/* TopAppBar */}
        <header className="bg-white sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
          <div className="flex items-center justify-between px-4 h-16 w-full mx-auto max-w-[390px]">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedSpace(null)} 
                className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full text-[20px]"
              >
                arrow_back
              </button>
              <h1 className="text-[16px] font-black text-[#005344]">Space Detail</h1>
            </div>
            <span className="text-[10px] bg-[#005344]/10 text-[#005344] font-black px-2 py-0.5 rounded uppercase">
              PKR {selectedSpace.price.toLocaleString()}/mo
            </span>
          </div>
        </header>

        <main className="flex-grow pt-4 pb-28 px-4 w-full mx-auto max-w-[390px] space-y-5 overflow-y-auto">
          {/* Photo Carousel */}
          <div className="w-full h-44 rounded-xl overflow-hidden shadow-sm relative">
            <img src={selectedSpace.photos[0]} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded">
              Swipeable Carousel (1 of 1 Photo)
            </div>
          </div>

          {/* Heading block */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] bg-[#fe6a34]/10 text-[#fe6a34] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                {getSpaceTypeLabel(selectedSpace.type)}
              </span>
              <span className="text-[9px] bg-[#0d9488]/10 text-[#0d9488] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px] filled">verified</span>
                Verified Branch
              </span>
            </div>
            
            <h2 className="text-[17px] font-black text-[#181c1b] leading-tight">{selectedSpace.nickname}</h2>
            <p className="text-xs font-bold text-[#3e4945] flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px] text-[#005344]">location_on</span>
              {selectedSpace.shop} — {selectedSpace.area}, {selectedSpace.city}
            </p>
          </div>

          {/* Rating */}
          <div className="bg-white border border-[#e0e3e0] p-3 rounded-xl shadow-sm flex justify-between items-center text-xs">
            <div>
              <p className="font-bold text-[#6e7975] text-[9px]">Store Rating</p>
              <div className="flex items-center gap-1 text-[#fe6a34] font-black text-sm mt-0.5">
                <span className="material-symbols-outlined text-[16px] filled">star</span>
                {selectedSpace.rating} ★
              </div>
            </div>
            <span className="text-[9px] bg-[#00875a]/10 text-[#00875a] px-2 py-0.5 rounded font-black">
              Verified Partner
            </span>
          </div>

          {/* Space Details */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-[#005344] border-b pb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Space Profile
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed">
              <div>
                <p className="font-bold text-[#6e7975]">Dimensions (L×W×H)</p>
                <p className="font-black text-[#181c1b] mt-0.5">
                  {selectedSpace.dimensions.l} × {selectedSpace.dimensions.w} × {selectedSpace.dimensions.h} {selectedSpace.dimensions.unit}
                </p>
              </div>
              <div>
                <p className="font-bold text-[#6e7975]">Daily Footfall</p>
                <p className="font-black text-[#181c1b] mt-0.5">{selectedSpace.footfall}</p>
              </div>
              <div className="col-span-2">
                <p className="font-bold text-[#6e7975]">Floor Location</p>
                <p className="font-black text-[#181c1b] mt-0.5">Floor {selectedSpace.floor}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#ebefec]">
              <p className="text-[10px] font-bold text-[#6e7975] mb-1">Suitable Product Categories</p>
              <div className="flex flex-wrap gap-1">
                {["FMCG", "Snacks", "Beverages"].map((tag, idx) => (
                  <span key={idx} className="bg-[#ebefec] text-[#3e4945] text-[9px] font-black px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#ebefec] text-[11px] leading-relaxed text-[#3e4945]">
              <p className="font-bold text-[#181c1b]">Placement Details:</p>
              <p className="mt-0.5 italic">"{selectedSpace.desc}"</p>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm text-xs flex justify-between items-center">
            <div>
              <p className="font-bold text-[#6e7975] text-[9px]">Calculated Cost</p>
              <p className="font-black text-[#005344] text-[16px] mt-0.5">
                PKR {totalPrice.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#6e7975]">Rate Reference</p>
              <p className="font-bold text-[#3e4945] mt-0.5">
                = PKR {selectedSpace.price.toLocaleString()} / month
              </p>
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-[#005344] border-b pb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Availability Schedule
            </h3>
            
            <div className="flex gap-4 text-[10px] font-bold justify-center">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-sm"></span> Available</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm"></span> Booked</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {["June 2026", "July 2026", "August 2026"].map((month, idx) => {
                const datesMap = {
                  0: '2026-06-15',
                  1: '2026-07-15',
                  2: '2026-08-15'
                };
                const mBooked = isSpaceBooked(selectedSpace.id, datesMap[idx], datesMap[idx]);
                return (
                  <div key={idx} className={`p-2 rounded-lg border text-center text-xs font-black ${mBooked ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                    <p>{month}</p>
                    <p className="text-[9px] font-bold mt-0.5">{mBooked ? 'Booked' : 'Available'}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA CONDITIONAL BLOCKS */}
          <div className="pt-2">
            {spaceMode === 'regular' ? (
              !isBooked ? (
                /* Regular available space */
                <button 
                  onClick={handleOpenRequestSheet}
                  className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send Booking Request
                </button>
              ) : (
                /* Regular but currently booked space */
                <div className="space-y-2">
                  <button 
                    onClick={() => { setSpaceMode('advance'); handleOpenRequestSheet(); }}
                    className="w-full border-2 border-[#005344] text-[#005344] hover:bg-[#ebefec] font-bold py-3 rounded-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-1.5 bg-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">forward</span>
                    Request Advance Booking
                  </button>
                  <button 
                    onClick={() => setShowNotifyModal(true)}
                    className="w-full border border-dashed border-[#fe6a34] text-[#fe6a34] hover:bg-[#fcf3e8] font-bold py-2.5 rounded-xl transition-all active:scale-95 text-xs flex items-center justify-center gap-1.5 bg-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                    Notify Me When Available
                  </button>
                </div>
              )
            ) : (
              /* Advance Booking mode request */
              <div className="space-y-2">
                <button 
                  onClick={handleOpenRequestSheet}
                  className="w-full bg-[#fe6a34] hover:bg-[#e05620] text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">forward</span>
                  Send Advance Request
                </button>
                <p className="text-[9px] text-[#6e7975] font-semibold text-center mt-1">
                  This request will go to the shopkeeper's Advance Requests queue
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Request details input sheet */}
        {requestSheetOpen && (
          <div className="fixed inset-0 z-[100] bg-[#181c1b]/40 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-white rounded-t-2xl w-full max-w-[390px] p-5 shadow-2xl space-y-4 max-h-[90%] overflow-y-auto">
              
              <div className="flex justify-between items-center pb-2 border-b border-[#ebefec]">
                <h3 className="text-sm font-black text-[#005344] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Proposal Details
                </h3>
                <button onClick={() => setRequestSheetOpen(false)} className="material-symbols-outlined text-gray-400 text-[20px]">close</button>
              </div>

              {/* Space summary card read-only */}
              <div className="bg-[#f7faf7] border border-[#e0e3e0] p-3 rounded-xl flex gap-3 items-center">
                <img src={selectedSpace.photos[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-50 border shrink-0" />
                <div className="min-w-0 flex-1 text-[11px] leading-tight">
                  <span className="bg-[#fe6a34]/10 text-[#fe6a34] font-black px-1.5 rounded uppercase text-[8px]">
                    {getSpaceTypeLabel(selectedSpace.type)}
                  </span>
                  <h4 className="font-black text-[#181c1b] truncate mt-0.5">{selectedSpace.nickname}</h4>
                  <p className="text-[#6e7975]">{selectedSpace.shop} — PKR {selectedSpace.price.toLocaleString()}/mo</p>
                </div>
              </div>

              {/* Input Form Fields */}
              <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
                {/* Date range read-only reference */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#3e4945]">Start Date</label>
                    <input 
                      type="date"
                      required
                      value={requestForm.dateStart}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, dateStart: e.target.value }))}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#3e4945]">End Date</label>
                    <input 
                      type="date"
                      required
                      value={requestForm.dateEnd}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, dateEnd: e.target.value }))}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                    />
                  </div>
                </div>

                {/* Offer Price */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#3e4945]">
                    <span>Offer Price (PKR Total)</span>
                    <span className="text-[#fe6a34]">Asking: PKR {(selectedSpace.price * (calculateDurationMonths(requestForm.dateStart, requestForm.dateEnd) || 1)).toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#6e7975]">PKR</span>
                    <input 
                      type="number"
                      required
                      value={requestForm.offerPrice}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, offerPrice: e.target.value }))}
                      className="w-full h-11 pl-12 pr-4 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-black text-sm"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div className="space-y-1">
                  <label className="font-bold text-[#3e4945]">Product Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Nestlé Everyday Powder"
                    value={requestForm.productName}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, productName: e.target.value }))}
                    className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3.5 rounded-xl text-xs shadow-md transition-all mt-2"
                >
                  Send Request
                </button>

                <p className="text-[9px] text-[#6e7975] font-semibold text-center">
                  {spaceMode === 'regular' 
                    ? 'Shopkeeper will respond within 24 hours.' 
                    : 'This is an advance request. Booking activates on your selected start date.'}
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Notify Modal popup */}
        {showNotifyModal && (
          <div className="fixed inset-0 z-[100] bg-[#181c1b]/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl relative overflow-hidden flex flex-col space-y-4">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#fe6a34]"></div>
              
              <div className="flex justify-between items-center pb-2 border-b border-[#ebefec]">
                <h3 className="text-sm font-black text-[#fe6a34] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                  Set Availability Alert
                </h3>
                <button onClick={() => setShowNotifyModal(false)} className="material-symbols-outlined text-gray-400 text-[18px]">close</button>
              </div>

              <div className="space-y-3.5 text-xs text-[#3e4945] leading-relaxed">
                <div className="bg-[#f7faf7] border border-[#e0e3e0] p-3 rounded-lg space-y-1 font-semibold">
                  <p>• <strong>Type</strong>: {getSpaceTypeLabel(selectedSpace.type)}</p>
                  <p>• <strong>Shop</strong>: {selectedSpace.shop}</p>
                  <p>• <strong>Location</strong>: {selectedSpace.city} — {selectedSpace.area}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#181c1b]">Notification Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Push", "Email", "Both"].map(channel => (
                      <button
                        key={channel}
                        type="button"
                        onClick={() => setNotifyForm({ channel })}
                        className={`py-2 rounded-lg font-bold border text-center transition-all ${notifyForm.channel === channel ? 'bg-[#fe6a34]/15 border-[#fe6a34] text-[#fe6a34]' : 'bg-[#F3F4F6] border-transparent text-[#6e7975]'}`}
                      >
                        {channel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCreateAlert}
                className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3 rounded-xl text-xs shadow"
              >
                Save Availability Alert
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render logic based on mode
  if (selectedSpace) {
    return renderDetail();
  }

  switch (browseMode) {
    case 'home':
      return renderHome();
    case 'search':
      return renderSearch();
    case 'advance':
      return renderAdvance();
    default:
      return renderHome();
  }
}
