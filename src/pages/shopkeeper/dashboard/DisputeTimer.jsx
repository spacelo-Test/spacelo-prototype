import React, { useState, useEffect } from 'react';

/**
 * DisputeTimer — reusable countdown component.
 * Props:
 *   expiresAt  {string} ISO timestamp when the 24hr window expires
 *   onExpired  {fn}     optional callback when timer hits zero
 */
export default function DisputeTimer({ expiresAt, onExpired }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now  = Date.now();
      const diff = new Date(expiresAt).getTime() - now;
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(null);
        onExpired && onExpired();
        return false;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft({ h, m, s });
      return true;
    };

    if (!tick()) return;
    const id = setInterval(() => { if (!tick()) clearInterval(id); }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (expired) {
    return (
      <div className="flex items-center gap-2.5 bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 text-[#ba1a1a] px-4 py-3 rounded-xl">
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          gavel
        </span>
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide">Escalated to Admin</p>
          <p className="text-[11px] text-[#ba1a1a]/80 mt-0.5">Admin team is now reviewing this dispute</p>
        </div>
      </div>
    );
  }

  if (!timeLeft) return null;

  const pad = n => String(n).padStart(2, '0');
  const urgency = timeLeft.h < 4;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${urgency ? 'bg-[#ba1a1a]/10 border-[#ba1a1a]/20' : 'bg-[#ffab00]/10 border-[#ffab00]/20'}`}>
      <span
        className="material-symbols-outlined text-[22px]"
        style={{ color: urgency ? '#ba1a1a' : '#ffab00', fontVariationSettings: "'FILL' 1" }}
      >
        timer
      </span>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: urgency ? '#ba1a1a' : '#7a4f00' }}>
          Resolve before admin escalation
        </p>
        <p className="text-[15px] font-black mt-0.5" style={{ color: urgency ? '#ba1a1a' : '#ffab00' }}>
          {pad(timeLeft.h)}h {pad(timeLeft.m)}m {pad(timeLeft.s)}s remaining
        </p>
      </div>
    </div>
  );
}
