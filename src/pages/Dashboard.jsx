import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopkeeperProvider } from './shopkeeper/dashboard/ShopkeeperContext';
import DashboardShell from './shopkeeper/dashboard/DashboardShell';
import { STORAGE_KEYS } from '../lib/constants';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState(false);
  const [verificationSubmitted, setVerificationSubmitted] = useState(
    localStorage.getItem('mallVerificationSubmitted') === 'true'
  );

  const [ntn, setNtn] = useState('');
  const [strn, setStrn] = useState('');
  const [signatoryName, setSignatoryName] = useState('');
  const [signatoryDesignation, setSignatoryDesignation] = useState('');
  const [signatoryContact, setSignatoryContact] = useState('');
  const [secpDoc, setSecpDoc] = useState(null);
  const [affDoc, setAffDoc] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE) || 'Shopkeeper';
  const isMallOwner = userRole === 'Mall Owner';
  const chainName = localStorage.getItem(STORAGE_KEYS.CHAIN_NAME) || 'Imtiaz Supermarket';

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    localStorage.removeItem(STORAGE_KEYS.FULL_NAME);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.CHAIN_NAME);
    localStorage.removeItem(STORAGE_KEYS.BRANCH_AREA);
    localStorage.removeItem('mallVerificationSubmitted');
    navigate('/login');
  };

  const handleUploadSecp = () => {
    setSecpDoc('secp_trade_license_registered.pdf');
  };

  const handleUploadAff = () => {
    setAffDoc('franchise_agreement_signed.pdf');
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    if (!secpDoc) {
      setErrorMsg('Please upload SECP / Trade License Document');
      return;
    }
    if (!affDoc) {
      setErrorMsg('Please upload Chain Affiliation Document');
      return;
    }
    localStorage.setItem('mallVerificationSubmitted', 'true');
    setVerificationSubmitted(true);
    setErrorMsg('');
  };

  // Render OTP verification pending state
  if (!isApproved) {
    const showForm = isMallOwner && !verificationSubmitted;

    return (
      <div className="bg-background text-on-background min-h-full flex flex-col font-manrope overflow-y-auto">
        {/* TopAppBar */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 w-full z-40">
          <div className="flex items-center justify-between px-4 py-3 w-full mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-teal-800 italic">Spacelo</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-[#ba1a1a] font-bold text-[14px]">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Logout
            </button>
          </div>
        </header>

        {/* Pending Card or Form */}
        <main className="flex-grow p-4 pb-12">
          {showForm ? (
            <div className="w-full bg-white p-5 rounded-2xl border border-[#ebefec] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5 max-w-md mx-auto">
              <div className="border-b border-[#ebefec] pb-3 text-center">
                <div className="w-14 h-14 bg-[#fe6a34]/10 text-[#fe6a34] rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
                </div>
                <h2 className="text-[18px] font-black text-[#181c1b]">Chain Verification Form</h2>
                <p className="text-[12px] text-[#6e7975] mt-1">Submit your branch corporate information for approval</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[12px] font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                {/* Tax Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#181c1b]">NTN (Required)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 1234567-8"
                      value={ntn}
                      onChange={(e) => setNtn(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#181c1b]">STRN (Required)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 12-34-5678-9"
                      value={strn}
                      onChange={(e) => setStrn(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-xs" 
                    />
                  </div>
                </div>

                {/* SECP License Document */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#181c1b]">SECP / Trade License Document</label>
                  {secpDoc ? (
                    <div className="flex items-center justify-between p-2.5 bg-[#f1f4f1] border border-[#005344]/20 rounded-lg text-xs">
                      <span className="flex items-center gap-1.5 text-[#005344] font-semibold truncate">
                        <span className="material-symbols-outlined text-[16px]">description</span>
                        {secpDoc}
                      </span>
                      <button type="button" onClick={() => setSecpDoc(null)} className="material-symbols-outlined text-red-500 text-[18px]">delete</button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleUploadSecp} 
                      className="w-full py-3 border-2 border-dashed border-[#bec9c4] rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#6e7975] hover:border-[#005344] hover:text-[#005344] bg-[#f7faf7] transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                      <span>Upload SECP / Trade License (PDF/JPG)</span>
                    </button>
                  )}
                </div>

                {/* Authorized Signatory Info */}
                <div className="space-y-3.5 border-t border-[#ebefec] pt-3">
                  <h3 className="text-xs font-black text-[#005344] uppercase tracking-wider">Authorized Signatory</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#181c1b]">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="As listed on CNIC / Appointment Letter"
                      value={signatoryName}
                      onChange={(e) => setSignatoryName(e.target.value)}
                      className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-xs" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#181c1b]">Designation</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Branch Manager"
                        value={signatoryDesignation}
                        onChange={(e) => setSignatoryDesignation(e.target.value)}
                        className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-xs" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#181c1b]">Contact Details</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Phone or Corporate Email"
                        value={signatoryContact}
                        onChange={(e) => setSignatoryContact(e.target.value)}
                        className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-xs" 
                      />
                    </div>
                  </div>
                </div>

                {/* Chain Affiliation Document */}
                <div className="space-y-1.5 border-t border-[#ebefec] pt-3">
                  <label className="text-[11px] font-bold text-[#181c1b]">Appointment Letter / Franchise Agreement</label>
                  {affDoc ? (
                    <div className="flex items-center justify-between p-2.5 bg-[#f1f4f1] border border-[#005344]/20 rounded-lg text-xs">
                      <span className="flex items-center gap-1.5 text-[#005344] font-semibold truncate">
                        <span className="material-symbols-outlined text-[16px]">description</span>
                        {affDoc}
                      </span>
                      <button type="button" onClick={() => setAffDoc(null)} className="material-symbols-outlined text-red-500 text-[18px]">delete</button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleUploadAff} 
                      className="w-full py-3 border-2 border-dashed border-[#bec9c4] rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#6e7975] hover:border-[#005344] hover:text-[#005344] bg-[#f7faf7] transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                      <span>Upload Affiliation Proof (PDF/JPG)</span>
                    </button>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Submit Verification Documents
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#ebefec] text-center flex flex-col items-center max-w-sm mx-auto mt-8">
              <div className="w-20 h-20 bg-[#fe6a34]/10 text-[#fe6a34] rounded-full flex items-center justify-center mb-6 animate-pulse">
                {isMallOwner ? (
                  <span className="text-[32px] font-black text-[#fe6a34] uppercase">
                    {chainName ? chainName[0] : 'M'}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[44px]">hourglass_empty</span>
                )}
              </div>
              <h2 className="text-[20px] font-extrabold text-[#181c1b] mb-3">
                {isMallOwner ? 'Verification Pending' : 'Application Pending'}
              </h2>
              
              <div className="bg-[#f7faf7] border border-[#e0e3e0] rounded-xl p-4 mb-8 max-w-sm text-left flex gap-3 items-start">
                {isMallOwner ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-[#fe6a34] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 uppercase">
                      {chainName ? chainName[0] : 'M'}
                    </div>
                    <p className="text-[13px] text-[#3e4945] font-semibold leading-relaxed">
                      Your account is pending verification. We are confirming your affiliation with <strong className="font-black text-[#005344]">{chainName}</strong>. This may take 1–2 business days.
                    </p>
                  </>
                ) : (
                  <p className="text-[14px] text-[#3e4945] font-semibold leading-relaxed text-center w-full">
                    Your Application Is Pending Admin Approval. Once Approved You Will Enjoy Services and also receive Email On Approval.
                  </p>
                )}
              </div>

              <button 
                onClick={() => {
                  localStorage.setItem('mallVerificationSubmitted', 'true');
                  setIsApproved(true);
                }}
                className="w-full bg-[#fe6a34] hover:bg-[#e05620] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-[14px]"
              >
                <span className="material-symbols-outlined">check_circle</span>
                Simulate Admin Approval (Demo App)
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Approved: Render the fully state-managed, modular app
  return (
    <ShopkeeperProvider>
      <DashboardShell handleLogout={handleLogout} />
    </ShopkeeperProvider>
  );
}
