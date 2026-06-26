import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Register from './pages/Register'
import Verify from './pages/Verify'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ShopkeeperOnboarding from './pages/shopkeeper/ShopkeeperOnboarding'
import ShopkeeperOnboardingStep2 from './pages/shopkeeper/ShopkeeperOnboardingStep2'
import ShopkeeperOnboardingStep3 from './pages/shopkeeper/ShopkeeperOnboardingStep3'
import MallOnboardingStep1 from './pages/mall/MallOnboardingStep1'
import MallOnboardingStep2 from './pages/mall/MallOnboardingStep2'
import MallOnboardingStep3 from './pages/mall/MallOnboardingStep3'
import CompanyOnboardingStep1 from './pages/company/CompanyOnboardingStep1'
import CompanyOnboardingStep2 from './pages/company/CompanyOnboardingStep2'
import CompanyOnboardingStep3 from './pages/company/CompanyOnboardingStep3'
import Dashboard from './pages/Dashboard'
import LauncherPage from './pages/LauncherPage'
import AdminPage from './pages/admin/AdminPage'

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdmin = location.pathname.startsWith('/admin');
  const isLauncher = location.pathname === '/';

  // Admin panel: full-width, no phone frame
  if (isAdmin) {
    return (
      <div className="font-manrope">
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </div>
    );
  }

  // Launcher page: full-screen, no phone frame
  if (isLauncher) {
    return (
      <div className="font-manrope">
        <Routes>
          <Route path="/" element={<LauncherPage />} />
        </Routes>
      </div>
    );
  }

  // All other routes: wrapped in phone frame
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-4 sm:py-8 font-manrope">
      {/* Mobile Device Simulator Frame */}
      <div className="w-[375px] sm:w-[414px] h-[812px] bg-background rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden relative border-[12px] border-gray-900 flex flex-col transform translate-x-0">
        
        {/* Fake Phone Status Bar */}
        <div className="h-6 w-full bg-background absolute top-0 z-50 flex justify-center items-end">
          <div className="w-32 h-5 bg-gray-900 rounded-b-2xl"></div>
        </div>

        {/* Scrollable App Content */}
        <div className={`flex-1 ${isDashboard ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'} overflow-x-hidden pt-6 relative bg-background`}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding/shopkeeper" element={<ShopkeeperOnboarding />} />
            <Route path="/onboarding/shopkeeper/step2" element={<ShopkeeperOnboardingStep2 />} />
            <Route path="/onboarding/shopkeeper/step3" element={<ShopkeeperOnboardingStep3 />} />
            {/* Mall Owner Onboarding */}
            <Route path="/onboarding/mall" element={<MallOnboardingStep1 />} />
            <Route path="/onboarding/mall/step2" element={<MallOnboardingStep2 />} />
            <Route path="/onboarding/mall/step3" element={<MallOnboardingStep3 />} />
            {/* Company/Brand Onboarding */}
            <Route path="/onboarding/company" element={<CompanyOnboardingStep1 />} />
            <Route path="/onboarding/company/step2" element={<CompanyOnboardingStep2 />} />
            <Route path="/onboarding/company/step3" element={<CompanyOnboardingStep3 />} />
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App
