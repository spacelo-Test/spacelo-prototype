import React from 'react';
import { useShopkeeper } from './ShopkeeperContext';

export default function SpacesTab() {
  const { 
    listings, 
    setListings, 
    currentView, 
    setCurrentView, 
    viewParams, 
    setViewParams, 
    newSpaceStep, 
    setNewSpaceStep,
    newSpaceData,
    setNewSpaceData,
    navigateToView 
  } = useShopkeeper();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('All');
  const [showCalendar, setShowCalendar] = React.useState(false);

  const STEPS = ['A', 'B', 'C', 'D'];

  const getStatusBadge = (status) => {
    const maps = {
      'Active': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Live': 'bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20',
      'Pending': 'bg-[#ffab00]/10 text-[#ab6b00] border border-[#ffab00]/20',
      'Pending Approval': 'bg-[#ffab00]/10 text-[#ab6b00] border border-[#ffab00]/20',
      'Inactive': 'bg-gray-100 text-gray-500 border border-gray-200'
    };
    return maps[status] || 'bg-gray-100 text-gray-800';
  };

  // Add Listing Submit handler
  const handleCreateSpace = () => {
    const newId = listings.length + 1;
    const addedListing = {
      id: newId,
      title: newSpaceData.title || `Custom ${newSpaceData.type.toUpperCase()}`,
      type: newSpaceData.type,
      size: `${newSpaceData.width}x${newSpaceData.height}x${newSpaceData.depth} ft`,
      city: newSpaceData.city,
      area: newSpaceData.area || "Main Bazar",
      price: parseInt(newSpaceData.price) || 2000,
      period: newSpaceData.period,
      status: "Live",
      verified: false,
      bookingsCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      photo: newSpaceData.photos[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
      desc: newSpaceData.description || "Beautiful retail shelf available for placement.",
      bookingDays: newSpaceData.bookingDays
    };
    setListings([...listings, addedListing]);
    // Reset listing state values
    setNewSpaceData({
      title: '', type: 'shelf', width: '', height: '', depth: '',
      address: '', city: 'Karachi', area: '', shopName: '', floor: 'Ground', ntn: '',
      price: '', period: 'month', description: '', footfall: 'Medium (50 - 200)', suitability: '', photos: [], mapPinDropped: false, bookingDays: []
    });
    setNewSpaceStep('A');
    setShowCalendar(false);
    setCurrentView('main');
  };

  // Render Subviews
  
  // 1. Listings List View (Screen 2)
  if (currentView === 'main') {
    const filteredListings = listings.filter(space => {
      const matchesSearch = space.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            space.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            space.area.toLowerCase().includes(searchQuery.toLowerCase());
      if (selectedStatus === 'All') return matchesSearch;
      if (selectedStatus === 'Live') return matchesSearch && (space.status === 'Live' || space.status === 'Active');
      if (selectedStatus === 'Pending Approval') return matchesSearch && (space.status === 'Pending' || space.status === 'Pending Approval');
      if (selectedStatus === 'Inactive') return matchesSearch && space.status === 'Inactive';
      return matchesSearch;
    });

    return (
      <div className="p-4 space-y-4">
        <div className="relative">
          <input 
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#bec9c4] rounded-xl focus:ring-2 focus:ring-[#005344] focus:border-[#005344] outline-none transition-all text-[14px]"
            placeholder="Search displays..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e7975] text-[18px]">search</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['All', 'Live', 'Pending Approval', 'Inactive'].map((chip) => (
            <button 
              key={chip}
              onClick={() => setSelectedStatus(chip)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-bold shrink-0 transition-all border ${
                selectedStatus === chip 
                  ? 'bg-[#005344] text-white border-[#005344]' 
                  : 'bg-white text-[#3e4945] border-[#bec9c4] hover:bg-[#ebefec]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="space-y-4 pt-1">
          {filteredListings.length === 0 ? (
            <div className="text-center py-8 bg-white border border-[#e0e3e0] rounded-xl">
              <span className="material-symbols-outlined text-[36px] text-gray-300">search_off</span>
              <p className="text-xs text-[#6e7975] mt-2 font-medium">No display spaces found</p>
            </div>
          ) : (
            filteredListings.map((space) => (
              <div 
                key={space.id}
                onClick={() => { setCurrentView('detail'); setViewParams(space.id); }}
                className="bg-white border border-[#e0e3e0] rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#005344] transition-all flex"
              >
                <img className="w-28 h-28 object-cover shrink-0" src={space.photo} alt={space.title} />
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="text-[14px] font-black text-[#181c1b] leading-snug">{space.title}</h3>
                      {space.verified && (
                        <span className="material-symbols-outlined text-[#00875a] text-[16px] shrink-0 filled" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6e7975] mt-0.5 capitalize">{space.type.replace('_', ' ')} • {space.size}</p>
                    <p className="text-[11px] text-[#6e7975] mt-0.5 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {space.area}, {space.city}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#ebefec]">
                    <p className="text-[13px] font-black text-[#005344]">PKR {space.price}<span className="text-[10px] text-[#6e7975] font-normal">/{space.period}</span></p>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${getStatusBadge(space.status)}`}>
                      {space.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => { setCurrentView('add-space'); setNewSpaceStep('A'); }}
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#fe6a34] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#e05620] active:scale-90 transition-all z-40"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    );
  }

  // 2. Add Space Form Stepper View (Screen 3)
  if (currentView === 'add-space') {
    const currentStepIdx = STEPS.indexOf(newSpaceStep);
    return (
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              if (currentStepIdx <= 0) setCurrentView('main');
              else setNewSpaceStep(STEPS[currentStepIdx - 1]);
            }}
            className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full"
          >
            arrow_back
          </button>
          <h2 className="text-[18px] font-bold text-[#005344]">List New Space</h2>
          <span className="text-xs font-bold text-[#6e7975]">Step {currentStepIdx + 1} of {STEPS.length}</span>
        </div>

        {/* Stepper Progress */}
        <div className="flex justify-between items-center relative px-2 max-w-xs mx-auto">
          {/* Base track */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[#bec9c4] -translate-y-1/2 rounded-full -z-10"></div>
          {/* Filled progress line */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#00875a] -translate-y-1/2 rounded-full -z-10 transition-all duration-300"
            style={{ width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }}
          ></div>
          {STEPS.map((step, idx) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all border-2 ${
                newSpaceStep === step
                  ? 'bg-[#005344] text-white border-[#005344]'
                  : idx < currentStepIdx
                  ? 'bg-[#00875a] text-white border-[#00875a]'
                  : 'bg-white text-[#3e4945] border-[#bec9c4]'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* STEP A */}
        {newSpaceStep === 'A' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-[20px] font-bold text-[#005344]">Upload Store Space Photos</h3>
              <p className="text-xs text-[#6e7975] mt-1">Upload photos of your retail display space.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {newSpaceData.photos.map((ph, idx) => (
                <div key={idx} className="relative aspect-video bg-[#ebefec] rounded-xl overflow-hidden border border-[#bec9c4]">
                  <img className="w-full h-full object-cover" src={ph} alt="" />
                  {idx === 0 && <span className="absolute top-2 left-2 bg-[#00875a] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">PRIMARY</span>}
                  <button
                    type="button"
                    onClick={() => setNewSpaceData({ ...newSpaceData, photos: newSpaceData.photos.filter((_, i) => i !== idx) })}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full shadow-sm active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px] leading-none">close</span>
                  </button>
                </div>
              ))}
              {newSpaceData.photos.length < 4 && (
                <button 
                  type="button"
                  onClick={() => {
                    const randomImg = newSpaceData.photos.length % 2 === 0 
                      ? "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
                      : "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=400&q=80";
                    setNewSpaceData({ ...newSpaceData, photos: [...newSpaceData.photos, randomImg] });
                  }}
                  className="aspect-video border-2 border-dashed border-[#bec9c4] rounded-xl flex flex-col items-center justify-center text-[#6e7975] hover:border-[#005344] bg-[#f7faf7] transition-all"
                >
                  <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                  <span className="text-[11px] font-bold mt-1">Upload Photo</span>
                </button>
              )}
            </div>
            <button 
              onClick={() => setNewSpaceStep('B')}
              disabled={newSpaceData.photos.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold transition-all mt-4 text-[14px] flex items-center justify-center gap-1 ${
                newSpaceData.photos.length > 0 ? 'bg-[#005344] text-white hover:bg-[#003c31]' : 'bg-gray-200 text-gray-400'
              }`}
            >
              Continue to Details
            </button>
          </div>
        )}

        {/* STEP B */}
        {newSpaceStep === 'B' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[20px] font-bold text-[#005344]">Space Specifications</h3>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">Display Space Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['shelf', 'window', 'floor_rack', 'checkout_counter'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewSpaceData({ ...newSpaceData, type: t })}
                    className={`py-3 px-2 border rounded-xl text-[12px] font-bold capitalize transition-all ${
                      newSpaceData.type === t ? 'border-[#005344] bg-[#005344]/5 text-[#005344]' : 'border-[#bec9c4] bg-white text-[#3e4945]'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">Display Title</label>
              <input 
                className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-xl p-3 focus:ring-2 focus:ring-[#005344] outline-none text-[14px]"
                placeholder="e.g. Checkout Shelf"
                type="text" value={newSpaceData.title}
                onChange={(e) => setNewSpaceData({ ...newSpaceData, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">Description</label>
              <textarea
                className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-xl p-3 h-24 focus:ring-2 focus:ring-[#005344] outline-none text-[14px]"
                placeholder="Brief info about the display space..."
                value={newSpaceData.description}
                onChange={(e) => setNewSpaceData({ ...newSpaceData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">Dimensions (L × W × H in feet)</label>
              <div className="grid grid-cols-3 gap-2">
                <input className="bg-[#F3F4F6] border border-[#bec9c4] rounded-xl p-3 text-center text-[14px]" placeholder="L" type="number" value={newSpaceData.width} onChange={(e) => setNewSpaceData({ ...newSpaceData, width: e.target.value })} />
                <input className="bg-[#F3F4F6] border border-[#bec9c4] rounded-xl p-3 text-center text-[14px]" placeholder="W" type="number" value={newSpaceData.height} onChange={(e) => setNewSpaceData({ ...newSpaceData, height: e.target.value })} />
                <input className="bg-[#F3F4F6] border border-[#bec9c4] rounded-xl p-3 text-center text-[14px]" placeholder="H" type="number" value={newSpaceData.depth} onChange={(e) => setNewSpaceData({ ...newSpaceData, depth: e.target.value })} />
              </div>
            </div>
            <button 
              onClick={() => setNewSpaceStep('C')}
              disabled={!newSpaceData.width || !newSpaceData.height || !newSpaceData.depth}
              className={`w-full py-3.5 rounded-xl font-bold transition-all mt-4 text-[14px] ${
                newSpaceData.width && newSpaceData.height && newSpaceData.depth ? 'bg-[#005344] text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              Continue to Location
            </button>
          </div>
        )}

        {/* STEP C */}
        {newSpaceStep === 'C' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[20px] font-bold text-[#005344]">Location & Identity</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">City</label>
                <select 
                  className="w-full bg-[#F3F4F6] border border-[#bec9c4] h-[48px] px-3 rounded-xl text-[14px]"
                  value={newSpaceData.city} onChange={(e) => setNewSpaceData({ ...newSpaceData, city: e.target.value })}
                >
                  <option>Karachi</option>
                  <option>Lahore</option>
                  <option>Islamabad</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">Area</label>
                <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-xl p-3 text-[14px]" placeholder="DHA" type="text" value={newSpaceData.area} onChange={(e) => setNewSpaceData({ ...newSpaceData, area: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">Registered Shop Name</label>
              <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-xl p-3 text-[14px]" placeholder="Store Name" type="text" value={newSpaceData.shopName} onChange={(e) => setNewSpaceData({ ...newSpaceData, shopName: e.target.value })} />
            </div>

            {/* Google Maps Pin Drop Button */}
            <div className="pt-1">
              <button 
                type="button" 
                onClick={() => {
                  setNewSpaceData({ ...newSpaceData, mapPinDropped: true });
                  alert("Google Maps Pin dropped successfully!");
                }}
                className={`w-full flex items-center justify-center gap-2 py-3 border-2 rounded-xl font-bold transition-all text-[13px] ${
                  newSpaceData.mapPinDropped 
                    ? 'border-[#00875a] bg-[#00875a]/5 text-[#00875a]' 
                    : 'border-[#005344] text-[#005344] hover:bg-[#ebefec]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {newSpaceData.mapPinDropped ? 'Maps Pin Dropped' : 'Drop Google Maps Pin'}
              </button>
            </div>

            <button 
              onClick={() => setNewSpaceStep('D')}
              disabled={!newSpaceData.area || !newSpaceData.shopName || !newSpaceData.mapPinDropped}
              className={`w-full py-3.5 rounded-xl font-bold transition-all mt-4 text-[14px] flex items-center justify-center gap-1 ${
                newSpaceData.area && newSpaceData.shopName && newSpaceData.mapPinDropped 
                  ? 'bg-[#005344] text-white hover:bg-[#003c31]' 
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              Continue to Pricing
            </button>
          </div>
        )}

        {/* STEP D */}
        {newSpaceStep === 'D' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-[20px] font-bold text-[#005344]">Pricing Details</h3>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">Billing Period</label>
              <div className="flex items-center gap-2 border border-[#bec9c4] rounded-xl px-4 py-3 bg-[#ebefec]">
                <span className="material-symbols-outlined text-[#005344] text-[20px]">calendar_month</span>
                <span className="text-[14px] font-bold text-[#005344]">Per Month</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">Monthly Rate (PKR)</label>
              <input className="w-full bg-[#F3F4F6] border border-[#bec9c4] rounded-xl p-3 text-[14px]" placeholder="Monthly rate" type="number" value={newSpaceData.price} onChange={(e) => setNewSpaceData({ ...newSpaceData, price: e.target.value })} />
            </div>

            {/* Booking Days Calendar (collapsible) */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#3e4945]">Available Booking Days</label>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full flex items-center justify-between border border-[#bec9c4] rounded-xl px-4 py-3 bg-white hover:bg-[#f7faf7] transition-all"
              >
                <span className="flex items-center gap-2 text-[14px] font-bold text-[#005344]">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  {newSpaceData.bookingDays.length > 0
                    ? `${newSpaceData.bookingDays.length} day(s) selected`
                    : 'Select booking days'}
                </span>
                <span className={`material-symbols-outlined text-[22px] text-[#6e7975] transition-transform ${showCalendar ? 'rotate-180' : ''}`}>expand_more</span>
              </button>

              {showCalendar && (
                <div className="bg-white border border-[#e0e3e0] rounded-xl p-3.5 space-y-3">
                  <p className="text-xs font-bold text-[#3e4945]">June 2026</p>
                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="font-bold text-[#6e7975] py-1">{d}</span>)}
                    {Array.from({ length: 30 }).map((_, idx) => {
                      const day = idx + 1;
                      const selected = newSpaceData.bookingDays.includes(day);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewSpaceData({
                            ...newSpaceData,
                            bookingDays: selected
                              ? newSpaceData.bookingDays.filter((d) => d !== day)
                              : [...newSpaceData.bookingDays, day]
                          })}
                          className={`py-1.5 rounded-lg font-semibold transition-all ${
                            selected ? 'bg-[#005344] text-white' : 'bg-[#ebefec] text-[#3e4945] hover:bg-[#d7dbd8]'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleCreateSpace}
              disabled={!newSpaceData.price}
              className={`w-full py-3.5 rounded-xl font-bold transition-all mt-4 text-[14px] ${
                newSpaceData.price ? 'bg-[#00875a] text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              Submit for Approval
            </button>
          </div>
        )}

      </div>
    );
  }

  // 3. Space Detail View (Screen 4)
  if (currentView === 'detail' && viewParams) {
    const space = listings.find(l => l.id === viewParams);
    if (!space) return <p className="p-4">Listing not found</p>;
    return (
      <div className="space-y-6">
        <div className="relative aspect-video w-full bg-[#ebefec]">
          <img className="w-full h-full object-cover" src={space.photo} alt="" />
          <button 
            onClick={() => setCurrentView('main')} 
            className="absolute top-4 left-4 bg-white/80 text-[#005344] p-2 rounded-full shadow-md"
          >
            <span className="material-symbols-outlined text-[20px] font-bold">arrow_back</span>
          </button>
          <span className={`absolute bottom-4 right-4 text-[10px] font-bold uppercase px-3 py-1 rounded-full ${getStatusBadge(space.status)}`}>
            {space.status}
          </span>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h2 className="text-[20px] font-black text-[#005344]">{space.title}</h2>
              {space.verified && <span className="material-symbols-outlined text-[#00875a] text-[20px] filled">verified</span>}
            </div>
            <p className="text-[13px] text-[#6e7975] mt-1 capitalize font-medium">{space.type.replace('_', ' ')} • {space.size}</p>
            <p className="text-[13px] text-[#6e7975] mt-0.5 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {space.area}, {space.city}
            </p>
            <p className="text-[18px] font-black text-[#005344] mt-2">PKR {space.price} <span className="text-[12px] font-normal text-[#6e7975]">/ {space.period}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="py-2.5 bg-[#005344] text-white font-bold rounded-lg text-xs">Edit Details</button>
            <button className="py-2.5 border border-[#ba1a1a] text-[#ba1a1a] font-bold rounded-lg text-xs">Deactivate</button>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#6e7975]">Description</h3>
            <p className="text-[13px] text-[#3e4945] leading-relaxed bg-white border border-[#e0e3e0] p-3 rounded-xl">{space.desc}</p>
          </div>

          {/* Availability Calendar grid */}
          <div className="space-y-2">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#6e7975]">Availability</h3>
            <div className="bg-white border border-[#e0e3e0] rounded-xl p-3.5 space-y-3">
              <p className="text-xs font-bold text-[#3e4945]">June 2026</p>
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="font-bold text-[#6e7975] py-1">{d}</span>)}
                {Array.from({ length: 30 }).map((_, idx) => {
                  const day = idx + 1;
                  const hasCustomDays = space.bookingDays && space.bookingDays.length > 0;
                  const isAvailable = hasCustomDays
                    ? space.bookingDays.includes(day)
                    : !(day >= 10 && day <= 15);
                  return (
                    <span
                      key={idx}
                      className={`py-1.5 rounded-lg font-semibold ${
                        isAvailable ? 'bg-[#00875a]/10 text-[#00875a]' : 'bg-[#ffab00]/20 text-[#ab6b00]'
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
