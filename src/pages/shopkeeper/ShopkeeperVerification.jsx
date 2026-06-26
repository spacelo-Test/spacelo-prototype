import React, { useState } from 'react';

export default function ShopkeeperVerification({ onSubmitted }) {
  const [shopName, setShopName] = useState('');
  const [cnic, setCnic] = useState('');
  const [ntn, setNtn] = useState('');
  const [licenseDoc, setLicenseDoc] = useState(null);
  const [cnicDoc, setCnicDoc] = useState(null);
  const [addressDoc, setAddressDoc] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!licenseDoc) {
      setErrorMsg('Please upload your Shop Registration / Trade License');
      return;
    }
    if (!cnicDoc) {
      setErrorMsg('Please upload your CNIC document');
      return;
    }
    setErrorMsg('');
    onSubmitted();
  };

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-[#ebefec] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5 max-w-md mx-auto">
      <div className="border-b border-[#ebefec] pb-3 text-center">
        <div className="w-14 h-14 bg-[#005344]/10 text-[#005344] rounded-full flex items-center justify-center mb-3 mx-auto">
          <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
        </div>
        <h2 className="text-[18px] font-black text-[#181c1b]">Shop Verification Form</h2>
        <p className="text-[12px] text-[#6e7975] mt-1">Submit your shop &amp; identity details for admin approval</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[12px] font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shop Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#181c1b]">Shop / Business Name (Required)</label>
          <input
            type="text"
            required
            placeholder="e.g. Al-Madina Superstore"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-xs"
          />
        </div>

        {/* CNIC + NTN */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#181c1b]">CNIC Number (Required)</label>
            <input
              type="text"
              required
              placeholder="12345-1234567-1"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#181c1b]">NTN (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 1234567-8"
              value={ntn}
              onChange={(e) => setNtn(e.target.value)}
              className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-xs"
            />
          </div>
        </div>

        {/* Trade License Document */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#181c1b]">Shop Registration / Trade License</label>
          {licenseDoc ? (
            <div className="flex items-center justify-between p-2.5 bg-[#f1f4f1] border border-[#005344]/20 rounded-lg text-xs">
              <span className="flex items-center gap-1.5 text-[#005344] font-semibold truncate">
                <span className="material-symbols-outlined text-[16px]">description</span>
                {licenseDoc}
              </span>
              <button type="button" onClick={() => setLicenseDoc(null)} className="material-symbols-outlined text-red-500 text-[18px]">delete</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setLicenseDoc('shop_trade_license.pdf')}
              className="w-full py-3 border-2 border-dashed border-[#bec9c4] rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#6e7975] hover:border-[#005344] hover:text-[#005344] bg-[#f7faf7] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>Upload Shop Registration / License (PDF/JPG)</span>
            </button>
          )}
        </div>

        {/* CNIC Document */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#181c1b]">Owner CNIC (Front &amp; Back)</label>
          {cnicDoc ? (
            <div className="flex items-center justify-between p-2.5 bg-[#f1f4f1] border border-[#005344]/20 rounded-lg text-xs">
              <span className="flex items-center gap-1.5 text-[#005344] font-semibold truncate">
                <span className="material-symbols-outlined text-[16px]">description</span>
                {cnicDoc}
              </span>
              <button type="button" onClick={() => setCnicDoc(null)} className="material-symbols-outlined text-red-500 text-[18px]">delete</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCnicDoc('owner_cnic_front_back.pdf')}
              className="w-full py-3 border-2 border-dashed border-[#bec9c4] rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#6e7975] hover:border-[#005344] hover:text-[#005344] bg-[#f7faf7] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>Upload CNIC Document (PDF/JPG)</span>
            </button>
          )}
        </div>

        {/* Address Proof (Optional) */}
        <div className="space-y-1.5 border-t border-[#ebefec] pt-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#181c1b]">Address Proof / Utility Bill</label>
            <span className="text-[10px] bg-[#e0e3e0] text-[#3e4945] px-2 py-0.5 rounded font-bold">OPTIONAL</span>
          </div>
          {addressDoc ? (
            <div className="flex items-center justify-between p-2.5 bg-[#f1f4f1] border border-[#005344]/20 rounded-lg text-xs">
              <span className="flex items-center gap-1.5 text-[#005344] font-semibold truncate">
                <span className="material-symbols-outlined text-[16px]">description</span>
                {addressDoc}
              </span>
              <button type="button" onClick={() => setAddressDoc(null)} className="material-symbols-outlined text-red-500 text-[18px]">delete</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddressDoc('shop_utility_bill.pdf')}
              className="w-full py-3 border-2 border-dashed border-[#bec9c4] rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#6e7975] hover:border-[#005344] hover:text-[#005344] bg-[#f7faf7] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>Upload Utility Bill (PDF/JPG)</span>
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
  );
}
