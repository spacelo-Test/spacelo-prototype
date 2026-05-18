import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompanyBlank() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center border border-surface-container">
        <h1 className="text-3xl font-bold text-primary mb-2">Company / Brand</h1>
        <p className="text-on-surface-variant mb-8">Welcome! Your onboarding flow will be available here soon.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 font-semibold bg-secondary text-white rounded-lg hover:opacity-90 transition-all">
          Go Back
        </button>
      </div>
    </div>
  );
}
