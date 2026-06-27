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
      nickname: "End-Cap — Ground Floor",
      shop: "Imtiaz Supermarket",
      branch: "Johar Town Branch",
      type: "end_cap",
      floor: "Ground",
      dimensions: { l: 36, w: 18, h: 64, unit: "inches" },
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
      nickname: "Checkout Counter Stand",
      shop: "Naheed Supermarket",
      branch: "Bahadurabad Branch",
      type: "checkout_counter",
      floor: "Ground",
      dimensions: { l: 24, w: 12, h: 32, unit: "inches" },
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
      dimensions: { l: 72, w: 24, h: 80, unit: "inches" },
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
      nickname: "Main Entrance Promo Stand",
      shop: "Metro Cash & Carry",
      branch: "Thokar Niaz Baig Branch",
      type: "entrance_display",
      floor: "Ground",
      dimensions: { l: 60, w: 60, h: 88, unit: "inches" },
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
      dimensions: { l: 40, w: 12, h: 60, unit: "inches" },
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
      nickname: "Bulk Promo Aisle A",
      shop: "Imtiaz Supermarket",
      branch: "Gulberg Branch",
      type: "promotional_aisle",
      floor: "Ground",
      dimensions: { l: 120, w: 40, h: 80, unit: "inches" },
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
      nickname: "End-Cap — Snacks",
      shop: "Imtiaz Supermarket",
      branch: "DHA Phase 6 Branch",
      type: "end_cap",
      floor: "Ground",
      dimensions: { l: 36, w: 18, h: 64, unit: "inches" },
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
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('spacelo_requests');
    let list = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {}
    }
    const defaults = [
      {
        id: 1,
        brand: "Unilever Pakistan",
        logo: "U",
        logoBg: "bg-blue-600",
        trustScore: 4.9,
        verified: true,
        listingId: 1,
        spaceId: 1,
        requestedDates: "Jan 1 – Mar 31, 2025",
        durationMonths: 3,
        offeredPrice: 135000,
        pricePerMonth: 45000,
        productName: "Sunsilk Shampoo 200ml Range",
        status: "Pending",
        type: "regular",
        time: "2 hours ago",
        contractSignedByBrand: false,
        contractSignedByShopkeeper: false,
        proofs: [],
        timelineStep: 0,
        counterHistory: [],
        monthlyBreakdown: [
          { month: "January 2025", gross: 45000, commission: 6750, net: 38250, status: "In Escrow" },
          { month: "February 2025", gross: 45000, commission: 6750, net: 38250, status: "In Escrow" },
          { month: "March 2025", gross: 45000, commission: 6750, net: 38250, status: "In Escrow" }
        ]
      },
      {
        id: 2,
        brand: "Nestle Pakistan",
        logo: "N",
        logoBg: "bg-red-600",
        trustScore: 4.7,
        verified: true,
        listingId: 3,
        spaceId: 4,
        requestedDates: "Jan 15 – Feb 14, 2025",
        durationMonths: 1,
        offeredPrice: 25000,
        pricePerMonth: 25000,
        productName: "Milo 3-in-1 Sachets Display Stand",
        status: "Accepted",
        type: "regular",
        time: "Yesterday",
        contractSignedByBrand: true,
        contractSignedByShopkeeper: false,
        proofs: [],
        timelineStep: 2,
        counterHistory: [],
        monthlyBreakdown: [
          { month: "January 2025", gross: 25000, commission: 3750, net: 21250, status: "In Escrow" }
        ]
      },
      {
        id: 3,
        brand: "Tapal Tea",
        logo: "T",
        logoBg: "bg-green-700",
        trustScore: 4.6,
        verified: true,
        listingId: 1,
        spaceId: 1,
        requestedDates: "Oct 1 – Dec 31, 2024",
        durationMonths: 3,
        offeredPrice: 135000,
        pricePerMonth: 45000,
        productName: "Tapal Danedar Family Pack — Full Shelf Display",
        status: "Completed",
        type: "regular",
        time: "5 days ago",
        contractSignedByBrand: true,
        contractSignedByShopkeeper: true,
        proofs: [
          "https://images.unsplash.com/photo-1506617424151-74f5609c1fa6?auto=format&fit=crop&w=400&q=80"
        ],
        timelineStep: 7,
        counterHistory: [],
        monthlyBreakdown: [
          { month: "October 2024", gross: 45000, commission: 6750, net: 38250, status: "Released" },
          { month: "November 2024", gross: 45000, commission: 6750, net: 38250, status: "Released" },
          { month: "December 2024", gross: 45000, commission: 6750, net: 38250, status: "Released" }
        ]
      },
      {
        id: 101,
        brand: "Nestlé",
        logo: "N",
        logoBg: "bg-red-600",
        trustScore: 4.7,
        verified: true,
        listingId: 1,
        spaceId: 1,
        requestedDates: "2026-06-01 – 2026-08-31",
        durationMonths: 3,
        durationLabel: "3 months (Jun 1 – Aug 31, 2026)",
        offeredPrice: 120000,
        pricePerMonth: 40000,
        status: "Countered",
        type: "regular",
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
        brand: "Nestlé",
        logo: "N",
        logoBg: "bg-red-600",
        trustScore: 4.7,
        verified: true,
        listingId: 3,
        spaceId: 4,
        requestedDates: "2026-07-01 – 2026-12-31",
        durationMonths: 6,
        durationLabel: "6 months (Jul 1 – Dec 31, 2026)",
        offeredPrice: 210000,
        pricePerMonth: 35000,
        status: "Accepted",
        type: "regular",
        time: "4 hours ago",
        contractSignedByBrand: false,
        contractSignedByShopkeeper: true,
        proofs: [],
        timelineStep: 2,
        counterHistory: []
      },
      {
        id: 103,
        brand: "Nestlé",
        logo: "N",
        logoBg: "bg-red-600",
        trustScore: 4.7,
        verified: true,
        listingId: 2,
        spaceId: 2,
        requestedDates: "2026-06-01 – 2026-06-30",
        durationMonths: 1,
        durationLabel: "1 month (Jun 1 – Jun 30, 2026)",
        offeredPrice: 60000,
        pricePerMonth: 60000,
        status: "Active",
        type: "regular",
        time: "Yesterday",
        contractSignedByBrand: true,
        contractSignedByShopkeeper: true,
        proofs: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80"],
        timelineStep: 6,
        counterHistory: [],
        monthlyBreakdown: [
          { month: "June 2026", gross: 60000, commission: 9000, net: 51000, status: "Released" }
        ]
      },
      {
        id: 104,
        brand: "Nestlé",
        logo: "N",
        logoBg: "bg-red-600",
        trustScore: 4.7,
        verified: true,
        listingId: 3,
        spaceId: 4,
        requestedDates: "2026-06-15 – 2026-08-15",
        durationMonths: 2,
        durationLabel: "2 months (Jun 15 – Aug 15, 2026)",
        offeredPrice: 100000,
        pricePerMonth: 50000,
        status: "Pending",
        type: "regular",
        time: "2 days ago",
        contractSignedByBrand: false,
        contractSignedByShopkeeper: false,
        proofs: [],
        timelineStep: 0,
        counterHistory: []
      },
      {
        id: 201,
        brand: "P&G Pakistan",
        logo: "P",
        logoBg: "bg-purple-600",
        trustScore: 4.8,
        verified: true,
        listingId: 1,
        spaceId: 1,
        requestedDates: "Apr 1 – Jun 30, 2025",
        durationMonths: 3,
        offeredPrice: 135000,
        pricePerMonth: 45000,
        productName: "Head & Shoulders Anti-Dandruff Range",
        status: "Pending",
        type: "advance",
        isAdvance: true,
        time: "3 days ago",
        advanceNote: "Booking in advance — our current campaign runs until March 2025. Want to secure this shelf for Q2.",
        contractSignedByBrand: false,
        contractSignedByShopkeeper: false,
        proofs: [],
        timelineStep: 0,
        counterHistory: [],
        monthlyBreakdown: [
          { month: "April 2025", gross: 45000, commission: 6750, net: 38250, status: "In Escrow" },
          { month: "May 2025", gross: 45000, commission: 6750, net: 38250, status: "In Escrow" },
          { month: "June 2025", gross: 45000, commission: 6750, net: 38250, status: "In Escrow" }
        ]
      },
      {
        id: 202,
        brand: "Reckitt Pakistan",
        logo: "R",
        logoBg: "bg-orange-600",
        trustScore: 4.5,
        verified: true,
        listingId: 3,
        spaceId: 4,
        requestedDates: "Mar 1 – Mar 31, 2025",
        durationMonths: 1,
        offeredPrice: 25000,
        pricePerMonth: 25000,
        productName: "Dettol Hand Wash — Checkout Display",
        status: "Countered",
        type: "advance",
        isAdvance: true,
        time: "1 week ago",
        advanceNote: "Flexible on dates — can shift by up to 2 weeks if needed for scheduling.",
        contractSignedByBrand: false,
        contractSignedByShopkeeper: false,
        proofs: [],
        timelineStep: 0,
        counterHistory: [
          {
            by: "shopkeeper",
            date: "Jan 10, 2025",
            newDates: "Mar 15 – Apr 14, 2025",
            newPrice: 26000,
            note: "Slight date shift needed for handover from current booking. Price adjusted slightly."
          }
        ],
        monthlyBreakdown: [
          { month: "March 2025", gross: 25000, commission: 3750, net: 21250, status: "In Escrow" }
        ]
      }
    ];

    defaults.forEach(d => {
      if (!list.some(r => Number(r.id) === Number(d.id))) {
        list.push(d);
      }
    });

    return list;
  });

  // 3. Campaigns (Bulk requests)
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('spacelo_campaigns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
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
    ];
  });

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
      nickname: "End-Cap — Ground Floor (Beverages)",
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

  const createCampaign = (campaignData) => {
    const newCamp = {
      id: 'camp_' + Date.now(),
      stats: { accepted: 0, pending: campaignData.branches.length, rejected: 0 },
      ...campaignData
    };
    setCampaigns(prev => [newCamp, ...prev]);

    // Also send individual requests to the requests database so they show up under Outgoing Requests
    campaignData.branches.forEach(b => {
      const duration = 3; // default 3 months
      const newReq = {
        id: Date.now() + Math.round(Math.random() * 100000), // ensure unique key
        brand: "Nestlé",
        logo: "N",
        logoBg: "bg-red-600",
        trustScore: 4.7,
        verified: true,
        spaceId: b.spaceId || b.id,
        requestedDates: campaignData.month || "Jun 1 – Aug 31, 2026",
        durationMonths: duration,
        offeredPrice: b.price,
        pricePerMonth: Math.round(b.price / duration),
        productName: campaignData.productName || "Product Launch",
        status: "Pending",
        type: "regular",
        time: "Just now",
        contractSignedByBrand: false,
        contractSignedByShopkeeper: false,
        proofs: [],
        timelineStep: 0,
        counterHistory: [],
        campaignId: newCamp.id
      };
      setRequests(prev => [newReq, ...prev]);
    });
  };

  const sendRequest = (reqData) => {
    addRequest({ ...reqData, isAdvance: false });
  };

  const sendAdvanceRequest = (reqData) => {
    addRequest({ ...reqData, isAdvance: true });
  };

  // Sync Outgoing Requests to localStorage
  React.useEffect(() => {
    localStorage.setItem('spacelo_requests', JSON.stringify(requests));
  }, [requests]);

  // Sync Campaigns to localStorage
  React.useEffect(() => {
    localStorage.setItem('spacelo_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // Sync dynamic spaces from shopkeeper listings in localStorage
  React.useEffect(() => {
    const savedSpaces = localStorage.getItem('spacelo_spaces');
    const savedListings = localStorage.getItem('spacelo_listings');
    if (savedSpaces && savedListings) {
      const sSpaces = JSON.parse(savedSpaces);
      const sListings = JSON.parse(savedListings);
      
      const liveListings = sListings.filter(l => l.status === 'Live');
      setSpaces(prev => {
        const base = prev.filter(s => s.id < 1000);
        const dynamic = liveListings.map(listing => {
          const space = sSpaces.find(s => s.id === listing.spaceId);
          if (!space) return null;
          
          // Avoid duplication
          const shopName = space.isMallOwner ? (space.chainName || 'Store Chain') : 'Super Store';
          if (base.some(s => s.nickname === space.nickname && s.shop === shopName)) {
            return null;
          }

          return {
            id: listing.id + 1000,
            originalListingId: listing.id,
            nickname: space.nickname,
            shop: shopName,
            branch: space.branchArea || 'Johar Town Branch',
            type: space.type,
            floor: space.floor,
            dimensions: space.dimensions,
            footfall: space.footfall,
            price: listing.pricePerMonth,
            rating: 4.8,
            city: 'Lahore',
            area: 'Johar Town',
            photos: space.photos && space.photos.length > 0 ? space.photos : ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"],
            desc: space.desc || listing.productPreference
          };
        }).filter(Boolean);
        return [...base, ...dynamic];
      });
    }
  }, []);

  // Real-time synchronization across browser tabs
  React.useEffect(() => {
    const handleStorage = (e) => {
      try {
        if (e.key === 'spacelo_requests' && e.newValue) {
          setRequests(JSON.parse(e.newValue));
        }
        if ((e.key === 'spacelo_listings' || e.key === 'spacelo_spaces') && e.newValue) {
          const savedSpaces = localStorage.getItem('spacelo_spaces');
          const savedListings = localStorage.getItem('spacelo_listings');
          if (savedSpaces && savedListings) {
            const sSpaces = JSON.parse(savedSpaces);
            const sListings = JSON.parse(savedListings);
            const liveListings = sListings.filter(l => l.status === 'Live');
            setSpaces(prev => {
              const base = prev.filter(s => s.id < 1000);
              const dynamic = liveListings.map(listing => {
                const space = sSpaces.find(s => s.id === listing.spaceId);
                if (!space) return null;
                const shopName = space.isMallOwner ? (space.chainName || 'Store Chain') : 'Super Store';
                if (base.some(s => s.nickname === space.nickname && s.shop === shopName)) {
                  return null;
                }
                return {
                  id: listing.id + 1000,
                  originalListingId: listing.id,
                  nickname: space.nickname,
                  shop: shopName,
                  branch: space.branchArea || 'Johar Town Branch',
                  type: space.type,
                  floor: space.floor,
                  dimensions: space.dimensions,
                  footfall: space.footfall,
                  price: listing.pricePerMonth,
                  rating: 4.8,
                  city: 'Lahore',
                  area: 'Johar Town',
                  photos: space.photos && space.photos.length > 0 ? space.photos : ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"],
                  desc: space.desc || listing.productPreference
                };
              }).filter(Boolean);
              return [...base, ...dynamic];
            });
          }
        }
      } catch (err) {
        console.error("Storage sync error:", err);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
      sendAdvanceRequest,
      createCampaign
    }}>
      {children}
    </CompanyContext.Provider>
  );
}
