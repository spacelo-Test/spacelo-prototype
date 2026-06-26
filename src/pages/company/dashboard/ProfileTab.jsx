import React, { useState } from 'react';
import { useCompany } from './CompanyContext';

export default function ProfileTab({ handleLogout }) {
  const {
    currentView,
    setCurrentView,
    alerts,
    toggleAlert,
    deleteAlert,
    notifications,
    setNotifications,
    notifSettings,
    setNotifSettings
  } = useCompany();

  const [companyName, setCompanyName] = useState('Nestlé Pakistan');
  const [contactPerson, setContactPerson] = useState('Sarah Khan');
  const [contactEmail, setContactEmail] = useState('sarah.khan@nestle.pk');

  const unreadNotifs = notifications.filter(n => !n.read);
  const readNotifs = notifications.filter(n => n.read);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    alert('All notifications marked as read.');
  };

  const handleToggleSetting = (eventKey, type) => {
    setNotifSettings(prev => ({
      ...prev,
      [eventKey]: {
        ...prev[eventKey],
        [type]: !prev[eventKey][type]
      }
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Company profile updated successfully!');
    setCurrentView('main');
  };

  // View helper
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

  // RENDER 1: Profile Main Menu
  if (currentView === 'main') {
    return (
      <div className="p-4 space-y-6 overflow-y-auto pb-28 h-full font-manrope">
        {/* Profile Card */}
        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-sm flex gap-4 items-center">
          <div className="w-16 h-16 rounded-xl bg-[#005344] text-[#96ebd5] flex items-center justify-center font-bold text-[28px] uppercase shrink-0">
            N
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-[17px] font-black text-[#181c1b] leading-tight">Nestlé Pakistan</h3>
              <span className="material-symbols-outlined text-[#00875a] text-[18px] filled">verified</span>
            </div>
            <p className="text-[10px] text-[#6e7975] mt-0.5">Corporate Brand Account</p>
            <p className="text-[10px] text-[#005344] mt-1 font-bold">Verified Brand Member</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white border border-[#e0e3e0] rounded-xl overflow-hidden shadow-sm divide-y divide-[#ebefec]">
          <div 
            onClick={() => setCurrentView('edit-profile')}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#ebefec] text-xs transition-colors"
          >
            <span className="flex items-center gap-2.5 font-bold text-[#3e4945]">
              <span className="material-symbols-outlined text-[20px] text-[#005344]">badge</span> 
              Edit Brand Profile
            </span>
            <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
          </div>

          <div 
            onClick={() => setCurrentView('verification')}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#ebefec] text-xs transition-colors"
          >
            <span className="flex items-center gap-2.5 font-bold text-[#3e4945]">
              <span className="material-symbols-outlined text-[20px] text-[#005344]">shield</span> 
              Company Verification Docs
            </span>
            <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
          </div>

          <div 
            onClick={() => setCurrentView('alerts')}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#ebefec] text-xs transition-colors"
          >
            <span className="flex items-center gap-2.5 font-bold text-[#3e4945]">
              <span className="material-symbols-outlined text-[20px] text-[#005344]">notifications_active</span> 
              Availability Alerts ({alerts.length})
            </span>
            <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
          </div>

          <div 
            onClick={() => setCurrentView('settings')}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#ebefec] text-xs transition-colors"
          >
            <span className="flex items-center gap-2.5 font-bold text-[#3e4945]">
              <span className="material-symbols-outlined text-[20px] text-[#005344]">settings</span> 
              Notification Settings
            </span>
            <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
          </div>

          <div 
            onClick={handleLogout}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-red-50 text-xs transition-colors text-[#ba1a1a]"
          >
            <span className="flex items-center gap-2.5 font-bold">
              <span className="material-symbols-outlined text-[20px]">logout</span> 
              Log Out
            </span>
            <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
          </div>
        </div>
      </div>
    );
  }

  // RENDER 2: Edit Brand Profile View
  if (currentView === 'edit-profile') {
    return (
      <div className="p-4 space-y-6 font-manrope">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[18px] font-black text-[#005344]">Edit Brand Profile</h2>
        </div>

        <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#181c1b]">Company / Brand Name</label>
              <input 
                type="text" 
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-11 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#181c1b]">Contact Representative</label>
              <input 
                type="text" 
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full h-11 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#181c1b]">Contact Email</label>
              <input 
                type="email" 
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full h-11 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg outline-none font-bold"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3 rounded-xl text-xs shadow-md mt-2"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    );
  }

  // RENDER 3: Company Verification Checklist
  if (currentView === 'verification') {
    return (
      <div className="p-4 space-y-6 font-manrope">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[18px] font-black text-[#005344]">Corporate verification</h2>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-sm space-y-4 text-xs">
          <p className="font-bold text-[#6e7975] uppercase border-b pb-1.5 border-[#ebefec] text-[9px] tracking-wider">Verification Checklist</p>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00875a]">check_circle</span>
              <span className="font-bold text-[#3e4945]">SECP Business License</span>
            </div>
            <span className="text-[#00875a] font-bold uppercase tracking-wider text-[9px]">Verified</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00875a]">check_circle</span>
              <span className="font-bold text-[#3e4945]">Corporate NTN Registration</span>
            </div>
            <span className="text-[#00875a] font-bold uppercase tracking-wider text-[9px]">Verified</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00875a]">check_circle</span>
              <span className="font-bold text-[#3e4945]">Authorized Signatory Email</span>
            </div>
            <span className="text-[#00875a] font-bold uppercase tracking-wider text-[9px]">Verified</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffab00]">hourglass_empty</span>
              <span className="font-bold text-gray-400">Brand Catalog Review</span>
            </div>
            <span className="text-[#ffab00] font-bold uppercase tracking-wider text-[9px]">In Review</span>
          </div>
        </div>
      </div>
    );
  }

  // RENDER 4: Availability Alerts setup list
  if (currentView === 'alerts') {
    return (
      <div className="p-4 space-y-6 font-manrope">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[18px] font-black text-[#005344]">Availability Alerts</h2>
        </div>

        {alerts.length === 0 ? (
          <div className="bg-white border border-[#e0e3e0] rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[#bec9c4] text-[36px] mb-1">notifications_off</span>
            <p className="text-xs font-bold text-[#6e7975]">No availability alerts saved.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => (
              <div 
                key={a.id}
                className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm flex items-center justify-between text-xs"
              >
                <div className="space-y-1 pr-4 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#fe6a34]/15 text-[#fe6a34] text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                      {getSpaceTypeLabel(a.spaceType)}
                    </span>
                    <span className="text-[9px] text-[#6e7975] font-bold">Via {a.channel}</span>
                  </div>
                  <h4 className="font-black text-[#181c1b] truncate mt-0.5">{a.chain}</h4>
                  <p className="text-[10px] text-[#6e7975] font-semibold">{a.location} region</p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  {/* Styled Custom Switch Toggle */}
                  <button 
                    onClick={() => toggleAlert(a.id)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${a.active ? 'bg-[#005344]' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md transform ${a.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  
                  <button 
                    onClick={() => deleteAlert(a.id)}
                    className="material-symbols-outlined text-red-500 text-[18px] hover:bg-red-50 p-1 rounded"
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // RENDER 5: Notification Settings View
  if (currentView === 'settings') {
    return (
      <div className="p-4 space-y-6 font-manrope">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentView('main')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
            arrow_back
          </button>
          <h2 className="text-[18px] font-black text-[#005344]">Notification Settings</h2>
        </div>

        <div className="bg-white border border-[#e0e3e0] rounded-xl p-4 shadow-sm space-y-4 text-xs">
          <p className="font-bold text-[#6e7975] uppercase border-b pb-1.5 border-[#ebefec] text-[9px]">Event Toggles</p>
          
          <div className="space-y-4">
            {Object.keys(notifSettings).map((key) => {
              const setting = notifSettings[key];
              const labels = {
                requestAccepted: "Request Accepted",
                counterReceived: "Counter-offer Received",
                contractReady: "Contract Ready to Sign",
                paymentConfirmed: "Payment Confirmed Escrow",
                proofUploaded: "Placement Proof Uploaded",
                disputeUpdate: "Dispute Activity Alerts"
              };
              return (
                <div key={key} className="flex justify-between items-center py-1">
                  <div>
                    <h5 className="font-black text-[#181c1b]">{labels[key] || key}</h5>
                    <p className="text-[10px] text-[#6e7975] mt-0.5">Toggle push & email notifications</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleToggleSetting(key, 'push')}
                      className={`text-[9px] font-bold px-2 py-1 border rounded ${setting.push ? 'bg-[#005344] text-white border-[#005344]' : 'bg-[#F3F4F6] text-[#6e7975] border-transparent'}`}
                    >
                      Push
                    </button>
                    <button 
                      onClick={() => handleToggleSetting(key, 'email')}
                      className={`text-[9px] font-bold px-2 py-1 border rounded ${setting.email ? 'bg-[#005344] text-white border-[#005344]' : 'bg-[#F3F4F6] text-[#6e7975] border-transparent'}`}
                    >
                      Email
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // RENDER 6: Grouped Notification Center
  if (currentView === 'notifications') {
    return (
      <div className="p-4 space-y-6 font-manrope">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => navigateToView('dashboard')} className="material-symbols-outlined text-[#005344] hover:bg-[#ebefec] p-1 rounded-full">
              arrow_back
            </button>
            <h2 className="text-[18px] font-black text-[#005344]">Notifications</h2>
          </div>
          {unreadNotifs.length > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-[10px] font-bold text-[#005344] hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Group lists */}
        <div className="space-y-4">
          {unreadNotifs.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-[#fe6a34] uppercase tracking-wider px-1">New Updates</h4>
              <div className="space-y-2">
                {unreadNotifs.map(n => (
                  <div 
                    key={n.id}
                    className="bg-white border border-[#e0e3e0] border-l-4 border-l-[#fe6a34] p-3 rounded-r-xl shadow-sm text-xs relative"
                  >
                    <h5 className="font-black text-[#181c1b]">{n.title}</h5>
                    <p className="text-[#3e4945] mt-0.5">{n.body}</p>
                    <span className="text-[9px] text-[#6e7975] block mt-1.5">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold text-[#6e7975] uppercase tracking-wider px-1">Earlier</h4>
            {readNotifs.length === 0 && unreadNotifs.length === 0 ? (
              <div className="bg-white border border-[#e0e3e0] rounded-xl p-8 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-gray-300 text-[36px] mb-1">notifications_none</span>
                <p className="text-xs font-bold text-[#6e7975]">Inbox is empty.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {readNotifs.map(n => (
                  <div 
                    key={n.id}
                    className="bg-white border border-[#e0e3e0] p-3 rounded-xl shadow-sm text-xs opacity-80"
                  >
                    <h5 className="font-black text-[#181c1b]">{n.title}</h5>
                    <p className="text-[#3e4945] mt-0.5">{n.body}</p>
                    <span className="text-[9px] text-[#6e7975] block mt-1.5">{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
