import React, { useState } from 'react';

export default function CompanyVerification({ onSubmitted }) {
  const [legalName, setLegalName] = useState('');
  const [ntn, setNtn] = useState('');
  const [strn, setStrn] = useState('');
  const [signatoryName, setSignatoryName] = useState('');
  const [signatoryDesignation, setSignatoryDesignation] = useState('');
  const [signatoryContact, setSignatoryContact] = useState('');
  const [secpDoc, setSecpDoc] = useState(null);
  const [authDoc, setAuthDoc] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!secpDoc) {
      setErrorMsg('Please upload your SECP Incorporation Certificate');
      return;
    }
    if (!authDoc) {
      setErrorMsg('Please upload your Brand Authorization / Tax Certificate');
      return;
    }
    setErrorMsg('');
    onSubmitted();
  };

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-[#ebefec] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5 max-w-md mx-auto">
      <div className="border-b border-[#ebefec] pb-3 text-center">
        <div className="w-14 h-14 bg-[#fe6a34]/10 text-[#fe6a34] rounded-full flex items-center justify-center mb-3 mx-auto">
          <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
        </div>
        <h2 className="text-[18px] font-black text-[#181c1b]">Company Verification Form</h2>
        <p className="text-[12px] text-[#6e7975] mt-1">Submit your corporate documents for admin approval</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[12px] font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Legal Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#181c1b]">Company Legal Name (Required)</label>
          <input
            type="text"
            required
            placeholder="e.g. Nestlé Pakistan Ltd."
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="w-full h-10 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-2 focus:ring-[#005344] outline-none text-xs"
          />
        </div>

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

        {/* SECP Incorporation Certificate */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#181c1b]">SECP Incorporation Certificate</label>
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
              onClick={() => setSecpDoc('secp_incorporation_certificate.pdf')}
              className="w-full py-3 border-2 border-dashed border-[#bec9c4] rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#6e7975] hover:border-[#005344] hover:text-[#005344] bg-[#f7faf7] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>Upload SECP Certificate (PDF/JPG)</span>
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
                placeholder="e.g. Brand Manager"
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

        {/* Brand Authorization Document */}
        <div className="space-y-1.5 border-t border-[#ebefec] pt-3">
          <label className="text-[11px] font-bold text-[#181c1b]">Brand Authorization Letter / Tax Certificate</label>
          {authDoc ? (
            <div className="flex items-center justify-between p-2.5 bg-[#f1f4f1] border border-[#005344]/20 rounded-lg text-xs">
              <span className="flex items-center gap-1.5 text-[#005344] font-semibold truncate">
                <span className="material-symbols-outlined text-[16px]">description</span>
                {authDoc}
              </span>
              <button type="button" onClick={() => setAuthDoc(null)} className="material-symbols-outlined text-red-500 text-[18px]">delete</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthDoc('brand_authorization_letter.pdf')}
              className="w-full py-3 border-2 border-dashed border-[#bec9c4] rounded-lg flex items-center justify-center gap-1.5 text-xs text-[#6e7975] hover:border-[#005344] hover:text-[#005344] bg-[#f7faf7] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>Upload Authorization Proof (PDF/JPG)</span>
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
