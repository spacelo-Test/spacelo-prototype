import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Register from './pages/Register'
import Verify from './pages/Verify'
import Login from './pages/Login'
import MerchantOnboarding from './pages/merchant/MerchantOnboarding'
import MerchantOnboardingStep2 from './pages/merchant/MerchantOnboardingStep2'
import MerchantOnboardingStep3 from './pages/merchant/MerchantOnboardingStep3'
import MerchantOnboardingStep4 from './pages/merchant/MerchantOnboardingStep4'
import MallOnboardingStep1 from './pages/mall/MallOnboardingStep1'
import MallOnboardingStep2 from './pages/mall/MallOnboardingStep2'
import MallOnboardingStep3 from './pages/mall/MallOnboardingStep3'
import MallOnboardingStep4 from './pages/mall/MallOnboardingStep4'
import CompanyOnboardingStep1 from './pages/company/CompanyOnboardingStep1'
import CompanyOnboardingStep2 from './pages/company/CompanyOnboardingStep2'
import CompanyOnboardingStep3 from './pages/company/CompanyOnboardingStep3'
import CompanyOnboardingStep4 from './pages/company/CompanyOnboardingStep4'

// Mobile Simulator wrapper component
function Placeholder({ title }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full bg-surface p-4">
      <div className="w-full bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-center border border-surface-container">
        <h1 className="text-2xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-on-surface-variant mb-6">This onboarding flow has not been converted yet.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90">
          Go Back
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-4 sm:py-8 font-manrope">
      {/* Mobile Device Simulator Frame */}
      <div className="w-[375px] sm:w-[414px] h-[812px] bg-background rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden relative border-[12px] border-gray-900 flex flex-col">
        
        {/* Fake Phone Status Bar (Optional touch for realism) */}
        <div className="h-6 w-full bg-background absolute top-0 z-50 flex justify-center items-end">
          <div className="w-32 h-5 bg-gray-900 rounded-b-2xl"></div> {/* Fake Notch */}
        </div>

        {/* Scrollable App Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6 relative bg-background">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding/merchant" element={<MerchantOnboarding />} />
            <Route path="/onboarding/merchant/step2" element={<MerchantOnboardingStep2 />} />
            <Route path="/onboarding/merchant/step3" element={<MerchantOnboardingStep3 />} />
            <Route path="/onboarding/merchant/step4" element={<MerchantOnboardingStep4 />} />
            {/* Mall Owner Onboarding */}
            <Route path="/onboarding/mall" element={<MallOnboardingStep1 />} />
            <Route path="/onboarding/mall/step2" element={<MallOnboardingStep2 />} />
            <Route path="/onboarding/mall/step3" element={<MallOnboardingStep3 />} />
            <Route path="/onboarding/mall/step4" element={<MallOnboardingStep4 />} />
            {/* Company/Brand Onboarding */}
            <Route path="/onboarding/company" element={<CompanyOnboardingStep1 />} />
            <Route path="/onboarding/company/step2" element={<CompanyOnboardingStep2 />} />
            <Route path="/onboarding/company/step3" element={<CompanyOnboardingStep3 />} />
            <Route path="/onboarding/company/step4" element={<CompanyOnboardingStep4 />} />
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App
