import React from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Global keyframe styles (injected once)
───────────────────────────────────────────── */
const KEYFRAMES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

/* ─────────────────────────────────────────────
   Hero phone-frame illustration data
───────────────────────────────────────────── */
const HERO_FRAMES = [
  {
    icon: 'storefront',
    label: 'Shopkeeper',
    gradient: 'linear-gradient(150deg, #007a62 0%, #005344 55%, #003d32 100%)',
    iconColor: '#a7f3d0',
    delay: 80,
  },
  {
    icon: 'corporate_fare',
    label: 'Mall Owner',
    gradient: 'linear-gradient(150deg, #ff8a5c 0%, #fe6a34 55%, #c24a18 100%)',
    iconColor: '#fff',
    delay: 150,
  },
  {
    icon: 'business_center',
    label: 'Company / Brand',
    gradient: 'linear-gradient(150deg, #00b27a 0%, #00875a 55%, #005e3d 100%)',
    iconColor: '#d1fae5',
    delay: 220,
  },
];

/* ─────────────────────────────────────────────
   Role card data
───────────────────────────────────────────── */
const ROLES = [
  {
    icon: 'storefront',
    title: 'Shopkeeper',
    subtitle: 'Manage your spaces and bookings',
    role: 'Shopkeeper',
    accentColor: '#7ee3c4',
    badgeBg: 'rgba(0,83,68,0.4)',
    badgeBorder: 'rgba(0,135,90,0.4)',
    delay: '0ms',
  },
  {
    icon: 'corporate_fare',
    title: 'Mall / Chain Owner',
    subtitle: 'Oversee multiple locations and reports',
    role: 'Mall Owner',
    accentColor: '#fe9d77',
    badgeBg: 'rgba(254,106,52,0.28)',
    badgeBorder: 'rgba(254,106,52,0.45)',
    delay: '90ms',
  },
  {
    icon: 'business_center',
    title: 'Company / Brand',
    subtitle: 'Find and book display spaces',
    role: 'Company/Brand',
    accentColor: '#6dd9b0',
    badgeBg: 'rgba(0,135,90,0.28)',
    badgeBorder: 'rgba(0,135,90,0.4)',
    delay: '180ms',
  },
];

/* ─────────────────────────────────────────────
   RoleCard sub-component
───────────────────────────────────────────── */
function RoleCard({ roleData, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Continue as ${roleData.title}`}
      style={{
        animation: `fadeUp 0.45s ease ${roleData.delay} both`,
        background: hovered
          ? 'rgba(255,255,255,0.18)'
          : 'rgba(255,255,255,0.09)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1.5px solid ${hovered ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.16)'}`,
        borderRadius: '1rem',
        padding: '1.5rem 1.25rem',
        cursor: 'pointer',
        transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
        transform: hovered ? 'scale(1.05) translateY(-3px)' : 'scale(1) translateY(0)',
        boxShadow: hovered
          ? '0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)'
          : '0 4px 18px rgba(0,0,0,0.22)',
        textAlign: 'left',
        width: '100%',
        fontFamily: "'Manrope', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.45rem',
        outline: 'none',
      }}
    >
      {/* Icon badge */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 46,
          height: 46,
          borderRadius: '0.75rem',
          background: roleData.badgeBg,
          border: `1.5px solid ${roleData.badgeBorder}`,
          marginBottom: '0.15rem',
          transition: 'background 0.2s ease',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '1.5rem',
            color: roleData.accentColor,
          }}
        >
          {roleData.icon}
        </span>
      </span>

      {/* Title */}
      <span
        style={{
          fontSize: '0.92rem',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.2,
          letterSpacing: '-0.1px',
        }}
      >
        {roleData.title}
      </span>

      {/* Subtitle */}
      <span
        style={{
          fontSize: '0.73rem',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.52)',
          lineHeight: 1.5,
        }}
      >
        {roleData.subtitle}
      </span>

      {/* Arrow */}
      <span
        style={{
          marginTop: '0.5rem',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.32)',
          transition: 'color 0.2s ease, transform 0.2s ease',
          display: 'inline-block',
          transform: hovered ? 'translateX(5px)' : 'translateX(0)',
          letterSpacing: '0.03em',
        }}
      >
        Get started →
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────
   HeroFrame sub-component
───────────────────────────────────────────── */
function HeroFrame({ frame }) {
  return (
    <div
      style={{
        background: frame.gradient,
        borderRadius: '22px',
        border: '2px solid rgba(255,255,255,0.14)',
        aspectRatio: '9 / 16',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 36px rgba(0,0,0,0.38)',
        animation: `fadeUp 0.5s ease ${frame.delay}ms both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow top-right */}
      <span
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '65%',
          height: '65%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)',
          pointerEvents: 'none',
        }}
      />
      {/* Decorative glow bottom-left */}
      <span
        style={{
          position: 'absolute',
          bottom: '-14%',
          left: '-14%',
          width: '48%',
          height: '48%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none',
        }}
      />
      {/* Notch */}
      <span
        style={{
          position: 'absolute',
          top: 9,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '34%',
          height: 5,
          borderRadius: 99,
          background: 'rgba(0,0,0,0.28)',
        }}
      />
      {/* Simulated screen rows */}
      <span
        style={{
          position: 'absolute',
          top: '22%',
          left: '14%',
          right: '14%',
          height: '8%',
          borderRadius: 6,
          background: 'rgba(255,255,255,0.08)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: '34%',
          left: '14%',
          right: '28%',
          height: '5%',
          borderRadius: 6,
          background: 'rgba(255,255,255,0.06)',
        }}
      />
      {/* Main icon */}
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: 'clamp(1.6rem, 5.5vw, 2.4rem)',
          color: frame.iconColor,
          zIndex: 1,
          marginBottom: 7,
          textShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }}
      >
        {frame.icon}
      </span>
      {/* Label */}
      <span
        style={{
          fontSize: 'clamp(0.45rem, 1.6vw, 0.65rem)',
          color: 'rgba(255,255,255,0.72)',
          fontWeight: 700,
          textAlign: 'center',
          zIndex: 1,
          padding: '0 6px',
          letterSpacing: '0.02em',
        }}
      >
        {frame.label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LauncherPage (default export)
───────────────────────────────────────────── */
export default function LauncherPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        className="min-h-screen w-full flex flex-col items-center overflow-x-hidden"
        style={{
          background: 'linear-gradient(160deg, #005344 0%, #003d32 58%, #00261f 100%)',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {/* ══════════════════════
            HEADER — Wordmark
        ══════════════════════ */}
        <header
          className="w-full flex flex-col items-center pt-10 sm:pt-14 pb-2 px-6"
          style={{ animation: 'fadeIn 0.5s ease both' }}
        >
          <h1
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: 'clamp(2.6rem, 7vw, 3.6rem)',
              color: '#ffffff',
              letterSpacing: '-0.6px',
              lineHeight: 1.1,
              textShadow: '0 2px 28px rgba(0,0,0,0.28)',
              margin: 0,
            }}
          >
            Spacelo
          </h1>
          <p
            className="mt-2"
            style={{
              fontSize: 'clamp(0.65rem, 1.8vw, 0.78rem)',
              color: 'rgba(255,255,255,0.50)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Smart retail space rentals.
          </p>
        </header>

        {/* ══════════════════════
            HERO — Phone frames
        ══════════════════════ */}
        <section
          className="w-full flex justify-center px-6 py-5 sm:py-7"
          style={{ animation: 'fadeIn 0.4s ease 0.08s both' }}
        >
          <div
            className="grid grid-cols-3 w-full"
            style={{
              maxWidth: 340,
              gap: 'clamp(0.5rem, 2vw, 1.1rem)',
            }}
          >
            {HERO_FRAMES.map((frame) => (
              <HeroFrame key={frame.label} frame={frame} />
            ))}
          </div>
        </section>

        {/* ══════════════════════
            MAIN — Role selection
        ══════════════════════ */}
        <main className="w-full flex flex-col items-center px-4 sm:px-8 pb-4 flex-1">
          {/* Section heading */}
          <div
            className="text-center mb-5"
            style={{ animation: 'fadeUp 0.45s ease 0.22s both' }}
          >
            <h2
              style={{
                fontSize: 'clamp(0.95rem, 3vw, 1.2rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.2px',
                margin: 0,
              }}
            >
              Choose your role to get started
            </h2>
            <p
              className="mt-1"
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.42)',
                fontWeight: 500,
              }}
            >
              Select how you'll use Spacelo
            </p>
          </div>

          {/* Role cards */}
          <div
            className="w-full"
            style={{
              maxWidth: 720,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'clamp(0.6rem, 2vw, 1rem)',
            }}
          >
            {ROLES.map((roleData) => (
              <RoleCard
                key={roleData.role}
                roleData={roleData}
                onClick={() => navigate('/login', { state: { role: roleData.role } })}
              />
            ))}
          </div>

          {/* — or — separator */}
          <div
            className="flex items-center w-full mt-6"
            style={{
              maxWidth: 280,
              gap: '0.75rem',
              animation: 'fadeIn 0.5s ease 0.52s both',
            }}
          >
            <div
              className="flex-1"
              style={{ height: 1, background: 'rgba(255,255,255,0.14)' }}
            />
            <span
              style={{
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.32)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              — or —
            </span>
            <div
              className="flex-1"
              style={{ height: 1, background: 'rgba(255,255,255,0.14)' }}
            />
          </div>

          {/* Admin link */}
          <div
            className="mt-4"
            style={{ animation: 'fadeIn 0.5s ease 0.62s both' }}
          >
            <button
              onClick={() => navigate('/admin')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.48)',
                letterSpacing: '0.02em',
                padding: '4px 2px',
                borderBottom: '1px solid transparent',
                transition: 'color 0.18s ease, border-bottom-color 0.18s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.88)';
                e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.48)';
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
              onFocus={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.88)';
                e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.45)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.48)';
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              Admin Panel →
            </button>
          </div>
        </main>

        {/* ══════════════════════
            FOOTER
        ══════════════════════ */}
        <footer
          className="w-full text-center pt-3 pb-7"
          style={{ animation: 'fadeIn 0.5s ease 0.72s both' }}
        >
          <p
            style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            © 2025 Spacelo. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
