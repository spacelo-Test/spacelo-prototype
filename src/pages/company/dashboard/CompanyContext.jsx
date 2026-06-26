import React, { createContext, useContext, useState } from 'react';

const CompanyContext = createContext();

export function useCompany() {
  return useContext(CompanyContext);
}

export function CompanyProvider({ children }) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('main');
  const [viewParams, setViewParams] = useState(null);

  // 1. Mock Spaces (Browsing Database)
  const [spaces, setSpaces] = useState([
    {
      id: 1,
      nickname: "End-Cap — Aisle 3 (Beverages)",
      shop: "Imtiaz Supermarket",
      branch: "Johar Town Branch",
      type: "end_cap",
      floor: "Ground",
      aisle: "3",
      section: "Beverages",
      dimensions: { l: 90, w: 45, h: 160, unit: "cm" },
      footfall: "High (200+)",
      price: 45000,
      rating: 4.9,
      city: "Lahore",
      area: "Johar Town",
      photos: ["https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80"],
      desc: "High traffic end-cap display near beverage aisles. Ideal for FMCG liquid brands."
    },
    {
      id: 2,
      nickname: "Checkout Counter A",
      shop: "Naheed Supermarket",
      branch: "Bahadurabad Branch",
      type: "checkout_counter",
      floor: "Ground",
      aisle: "Checkout Area",
      section: "FMCG/Snacks",
      dimensions: { l: 60, w: 30, h: 80, unit: "cm" },
      footfall: "High (200+)",
      price: 35000,
      rating: 4.8,
      city: "Karachi",
      area: "Bahadurabad",
      photos: ["https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=400&q=80"],
      desc: "Prime checkout stand for impulse items like confectionery and pocket items."
    },
    {
      id: 3,
      nickname: "Window Display — Main Street",
      shop: "Al-Fatah Hypermarket",
      branch: "Gulberg Branch",
      type: "window_display",
      floor: "Ground",
      aisle: "Entrance",
      section: "Fashion/Cosmetics",
      dimensions: { l: 180, w: 60, h: 200, unit: "cm" },
      footfall: "High (200+)",
      price: 60000,
      rating: 4.7,
      city: "Lahore",
      area: "Gulberg",
      photos: ["https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=400&q=80"],
      desc: "Large window display at front entrance facing main road. High pedestrian & customer viewing."
    },
    {
      id: 4,
      nickname: "Main Entrance Promotional Stand",
      shop: "Metro Cash & Carry",
      branch: "Thokar Niaz Baig Branch",
      type: "entrance_display",
      floor: "Ground",
      aisle: "Main Entrance",
      section: "Promo",
      dimensions: { l: 150, w: 150, h: 220, unit: "cm" },
      footfall: "High (200+)",
      price: 50000,
      rating: 4.8,
      city: "Lahore",
      area: "Thokar Niaz Baig",
      photos: ["https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=400&q=80"],
      desc: "Large floor stand at entrance lobby. Seen by every shopper entering the store."
    },
    {
      id: 5,
      nickname: "Middle Aisle Shelf",
      shop: "Euro Store",
      branch: "DHA Phase 5 Branch",
      type: "shelf",
      floor: "Ground",
      aisle: "5",
      section: "Snacks",
      dimensions: { l: 100, w: 30, h: 150, unit: "cm" },
      footfall: "Medium (50–200)",
      price: 20000,
      rating: 4.5,
      city: "Karachi",
      area: "DHA Phase 5",
      photos: ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"],
      desc: "Double shelf at center of FMCG aisle. Perfect for brand blocking."
    },
    {
      id: 6,
      nickname: "Bulk Promotional Aisle A",
      shop: "Imtiaz Supermarket",
      branch: "Gulberg Branch",
      type: "promotional_aisle",
      floor: "Ground",
      aisle: "Promo Aisle",
      section: "FMCG",
      dimensions: { l: 300, w: 100, h: 200, unit: "cm" },
      footfall: "High (200+)",
      price: 90000,
      rating: 4.9,
      city: "Lahore",
      area: "Gulberg",
      photos: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80"],
      desc: "Full promotional island in the main corridor. High capacity for special campaigns."
    },
    {
      id: 7,
      nickname: "End-Cap — Aisle 2 (Snacks)",
      shop: "Imtiaz Supermarket",
      branch: "DHA Phase 6 Branch",
      type: "end_cap",
      floor: "Ground",
      aisle: "2",
      section: "Snacks",
      dimensions: { l: 90, w: 45, h: 160, unit: "cm" },
      footfall: "High (200+)",
      price: 42000,
      rating: 4.9,
      city: "Lahore",
      area: "DHA Phase 6",
      photos: ["https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80"],
      desc: "End-cap facing snack aisle, high visibility."
    }
  ]);

  // 2. Outgoing Requests State
  const [requests, setRequests] = useState([
    {
      id: 101,
      spaceId: 1,
      brand: "Nestlé",
      productName: "MILO Drinks",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      durationLabel: "3 months (Jun 1 – Aug 31, 2026)",
      offeredPrice: 120000,
      pricePerMonth: 40000,
      status: "Countered",
      time: "1 hour ago",
      contractSignedByBrand: false,
      contractSignedByShopkeeper: false,
      proofs: [],
      timelineStep: 1,
      counterHistory: [
        { by: "company", date: "June 20, 2026", price: 120000, note: "Initial test offer." },
        { by: "shopkeeper", date: "June 21, 2026", price: 135000, note: "This beverages aisle has high footfall. Final price is PKR 135,000." }
      ]
    },
    {
      id: 102,
      spaceId: 2,
      brand: "Nestlé",
      productName: "KitKat Chocolates",
      startDate: "2026-07-01",
      endDate: "2026-12-31",
      durationLabel: "6 months (Jul 1 – Dec 31, 2026)",
      offeredPrice: 210000,
      pricePerMonth: 35000,
      status: "Accepted",
      time: "4 hours ago",
      contractSignedByBrand: false,
      contractSignedByShopkeeper: true,
      proofs: [],
      timelineStep: 2,
      counterHistory: []
    },
    {
      id: 103,
      spaceId: 3,
      brand: "Nestlé",
      productName: "Nescafé Coffee",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      durationLabel: "1 month (Jun 1 – Jun 30, 2026)",
      offeredPrice: 60000,
      pricePerMonth: 60000,
      status: "Active",
      time: "Yesterday",
      contractSignedByBrand: true,
      contractSignedByShopkeeper: true,
      proofs: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80"],
      timelineStep: 6, // Product Placed / Active
      counterHistory: [],
      monthlyBreakdown: [
        { month: "June 2026", gross: 60000, commission: 9000, net: 51000, status: "Released" }
      ]
    },
    {
      id: 104,
      spaceId: 4,
      brand: "Nestlé",
      productName: "Everyday Milk Powder",
      startDate: "2026-06-15",
      endDate: "2026-08-15",
      durationLabel: "2 months (Jun 15 – Aug 15, 2026)",
      offeredPrice: 100000,
      pricePerMonth: 50000,
      status: "Pending",
      time: "2 days ago",
      contractSignedByBrand: false,
      contractSignedByShopkeeper: false,
      proofs: [],
      timelineStep: 0,
      counterHistory: []
    }
  ]);

  // 3. Campaigns (Bulk requests)
  const [campaigns, setCampaigns] = useState([
    {
      id: "camp_1",
      name: "Imtiaz Launch Campaign",
      chain: "Imtiaz Supermarket",
      month: "June 2026",
      stats: { accepted: 2, pending: 1, rejected: 1 },
      branches: [
        { id: 201, name: "Johar Town Branch", area: "Johar Town, Lahore", status: "Accepted", price: 45000, type: "end_cap" },
        { id: 202, name: "Gulberg Branch", area: "Gulberg, Lahore", status: "Counter-offered", price: 90000, type: "promotional_aisle" },
        { id: 203, name: "DHA Phase 6 Branch", area: "DHA Phase 6, Lahore", status: "Pending", price: 42000, type: "end_cap" },
        { id: 204, name: "Clifton Branch", area: "Clifton, Karachi", status: "Rejected", price: 45000, type: "end_cap" }
      ]
    }
  ]);

  // 4. Custom Alerts list
  const [alerts, setAlerts] = useState([
    { id: 1, spaceType: "End-Cap", chain: "Imtiaz Supermarket", location: "Lahore", channel: "Push & Email", active: true },
    { id: 2, spaceType: "Checkout Counter", chain: "All Store Chains", location: "Karachi", channel: "Push", active: false }
  ]);

  // 5. Notifications log
  const [notifications, setNotifications] = useState([
    { id: 301, type: "counter", title: "Counter-offer received", body: "Imtiaz Gulberg sent a counter-offer of PKR 90,000 for Promotional Aisle A.", time: "1 hour ago", read: false },
    { id: 302, type: "contract", title: "Contract Ready to Sign", body: "Naheed Supermarket signed the contract for Checkout Counter. Please review and sign.", time: "4 hours ago", read: false },
    { id: 303, type: "payment", title: "Payment Secured", body: "Nestlé payment of PKR 60,000 has been secured in escrow for Al-Fatah Window Display.", time: "Yesterday", read: true }
  ]);

  // 6. Notification Settings
  const [notifSettings, setNotifSettings] = useState({
    requestAccepted: { push: true, email: true },
    counterReceived: { push: true, email: true },
    contractReady: { push: true, email: true },
    paymentConfirmed: { push: true, email: false },
    proofUploaded: { push: true, email: true },
    disputeUpdate: { push: true, email: true }
  });

  // Navigation helpers
  const navigateToView = (tab, view = 'main', params = null) => {
    setCurrentTab(tab);
    setCurrentView(view);
    setViewParams(params);
  };

  const createAlert = (alertData) => {
    const newAlert = {
      id: Date.now(),
      ...alertData,
      active: true
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const deleteAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id) => {
    setAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, active: !alert.active } : alert));
  };

  const addRequest = (reqData) => {
    const newReq = {
      id: Date.now(),
      brand: "Nestlé",
      status: "Pending",
      time: "Just now",
      contractSignedByBrand: false,
      contractSignedByShopkeeper: false,
      proofs: [],
      timelineStep: 0,
      counterHistory: [],
      ...reqData
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const respondToCounter = (reqId, action, counterData = null) => {
    setRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        if (action === 'accept') {
          return { ...req, status: 'Accepted', timelineStep: 2 };
        } else if (action === 'reject') {
          return { ...req, status: 'Rejected' };
        } else if (action === 'counter') {
          return {
            ...req,
            status: 'Countered',
            counterHistory: [
              ...req.counterHistory,
              { by: 'company', date: 'Just now', price: counterData.price, note: counterData.note }
            ]
          };
        }
      }
      return req;
    }));
  };

  const signContract = (reqId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, contractSignedByBrand: true, timelineStep: 3 };
      }
      return req;
    }));
  };

  const securePayment = (reqId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { 
          ...req, 
          status: 'Active', 
          timelineStep: 4, 
          monthlyBreakdown: [
            { month: "July 2026", gross: req.offeredPrice, commission: req.offeredPrice * 0.15, net: req.offeredPrice * 0.85, status: "In Escrow" }
          ]
        };
      }
      return req;
    }));
  };

  const raiseDispute = (reqId, reason, detail) => {
    setRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { 
          ...req, 
          status: 'Disputed',
          dispute: { reason, detail, time: 'Just now', status: 'Open' }
        };
      }
      return req;
    }));
  };

  const cancelBooking = (reqId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, status: 'Completed', cancelled: true };
      }
      return req;
    }));
  };

  const [recentlyViewed, setRecentlyViewed] = useState([
    {
      id: 1,
      nickname: "End-Cap — Aisle 3 (Beverages)",
      shop: "Imtiaz Supermarket",
      branch: "Johar Town Branch",
      type: "end_cap",
      price: 45000,
      photos: ["https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80"],
    },
    {
      id: 2,
      nickname: "Checkout Counter A",
      shop: "Naheed Supermarket",
      branch: "Bahadurabad Branch",
      type: "checkout_counter",
      price: 35000,
      photos: ["https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=400&q=80"],
    }
  ]);

  const availableChains = [
    { id: 'imtiaz', name: 'Imtiaz Supermarket', verified: true },
    { id: 'naheed', name: 'Naheed Supermarket', verified: true },
    { id: 'eurostores', name: 'Euro Store', verified: true },
    { id: 'alfatah', name: 'Al-Fatah Hypermarket', verified: true },
    { id: 'metro', name: 'Metro Cash & Carry', verified: true }
  ];

  const sendRequest = (reqData) => {
    addRequest({ ...reqData, isAdvance: false });
  };

  const sendAdvanceRequest = (reqData) => {
    addRequest({ ...reqData, isAdvance: true });
  };

  return (
    <CompanyContext.Provider value={{
      currentTab,
      setCurrentTab,
      currentView,
      setCurrentView,
      viewParams,
      setViewParams,
      navigateToView,
      spaces,
      setSpaces,
      requests,
      setRequests,
      campaigns,
      setCampaigns,
      alerts,
      createAlert,
      deleteAlert,
      toggleAlert,
      notifications,
      setNotifications,
      notifSettings,
      setNotifSettings,
      addRequest,
      respondToCounter,
      signContract,
      securePayment,
      raiseDispute,
      cancelBooking,
      recentlyViewed,
      setRecentlyViewed,
      availableChains,
      sendRequest,
      sendAdvanceRequest
    }}>
      {children}
    </CompanyContext.Provider>
  );
}
