import React, { createContext, useContext, useState } from 'react';

const ShopkeeperContext = createContext();

export function useShopkeeper() {
  return useContext(ShopkeeperContext);
}

export function ShopkeeperProvider({ children }) {

  // ─── LAYER 1: PHYSICAL SPACE INVENTORY ───────────────────────────────────
  const [spaces, setSpaces] = useState(() => {
    const saved = localStorage.getItem('spacelo_spaces');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        nickname: "Shelf A — Ground Floor",
        type: "shelf",
        floor: "Ground",
        dimensions: { l: 48, w: 16, h: 72, unit: "inches" },
        footfall: "High (200+)",
        suitableProducts: ["FMCG", "Beverages", "Snacks"],
        photos: [
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=400&q=80"
        ],
        status: "Listed",
        listingId: 1,
        desc: "High footfall shelf in FMCG aisle. Excellent visibility for impulse purchases near checkout flow."
      },
      {
        id: 2,
        nickname: "Window Display — Ground Floor",
        type: "window_display",
        floor: "Ground",
        dimensions: { l: 72, w: 24, h: 80, unit: "inches" },
        footfall: "High (200+)",
        suitableProducts: ["Cosmetics", "Apparel", "Electronics"],
        photos: [
          "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=400&q=80"
        ],
        status: "Listed",
        listingId: 2,
        desc: "Prime street-facing window display at main entrance. Maximum street visibility."
      },
      {
        id: 3,
        nickname: "End-Cap — Ground Floor",
        type: "end_cap",
        floor: "Ground",
        dimensions: { l: 36, w: 18, h: 64, unit: "inches" },
        footfall: "Medium (50–200)",
        suitableProducts: ["Beverages", "Snacks", "FMCG"],
        photos: [
          "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80"
        ],
        status: "Unlisted",
        listingId: null,
        desc: "End-cap display at beverages aisle. Good for featured brand promotions."
      },
      {
        id: 4,
        nickname: "Checkout Counter Stand",
        type: "checkout_counter",
        floor: "Ground",
        dimensions: { l: 24, w: 12, h: 32, unit: "inches" },
        footfall: "High (200+)",
        suitableProducts: ["Snacks", "FMCG", "Cosmetics"],
        photos: [
          "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=400&q=80"
        ],
        status: "Listed",
        listingId: 3,
        desc: "Compact display stand at checkout. Maximum impulse purchase visibility for every customer."
      },
      {
        id: 5,
        nickname: "First Floor Promo Stand",
        type: "promotional_aisle",
        floor: "First",
        dimensions: { l: 80, w: 40, h: 72, unit: "inches" },
        footfall: "Low (Under 50)",
        suitableProducts: ["Apparel", "Electronics"],
        photos: [],
        status: "Inactive",
        listingId: null,
        desc: "Large floor stand on first floor. Currently inactive — photos pending upload."
      }
    ];
  });

  // ─── LAYER 2: COMMERCIAL LISTINGS ─────────────────────────────────────────
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('spacelo_listings');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        spaceId: 1,
        startDate: "Jan 1, 2025",
        endDate: "Mar 31, 2025",
        durationMonths: 3,
        durationLabel: "3 months — Jan to Mar 2025",
        totalPrice: 135000,
        pricePerMonth: 45000,
        productPreference: "FMCG products only — beverages, snacks, and personal care. No electronics or heavy items.",
        status: "Live",
        verified: true,
        bookingsCount: 1,
        photo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: 2,
        spaceId: 2,
        startDate: "Feb 1, 2025",
        endDate: "Mar 31, 2025",
        durationMonths: 2,
        durationLabel: "2 months — Feb to Mar 2025",
        totalPrice: 80000,
        pricePerMonth: 40000,
        productPreference: "Fashion, cosmetics, or premium brand products only. Must match our store aesthetic.",
        status: "Pending Approval",
        verified: false,
        bookingsCount: 0,
        photo: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: 3,
        spaceId: 4,
        startDate: "Jan 15, 2025",
        endDate: "Feb 14, 2025",
        durationMonths: 1,
        durationLabel: "1 month — Jan 15 to Feb 14, 2025",
        totalPrice: 25000,
        pricePerMonth: 25000,
        productPreference: "Any FMCG or snack brand. Prefer known brands with strong packaging design.",
        status: "Live",
        verified: true,
        bookingsCount: 2,
        photo: "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=400&q=80"
      }
    ];
  });

  // ─── REGULAR REQUESTS ─────────────────────────────────────────────────────
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
      }
    ];

    defaults.forEach(d => {
      if (!list.some(r => Number(r.id) === Number(d.id))) {
        list.push(d);
      }
    });

    return list;
  });

  // ─── ADVANCE REQUESTS ─────────────────────────────────────────────────────
  const [advanceRequests, setAdvanceRequests] = useState(() => {
    const saved = localStorage.getItem('spacelo_advance_requests');
    let list = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {}
    }
    const defaults = [
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

  // ─── DISPUTES ─────────────────────────────────────────────────────────────
  const [disputes, setDisputes] = useState(() => {
    const saved = localStorage.getItem('spacelo_disputes');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        requestId: 2,
        brand: "Nestle Pakistan",
        logo: "N",
        logoBg: "bg-red-600",
        spaceName: "Checkout Counter Stand",
        reason: "Product not placed in agreed position",
        detail: "The photos submitted show product placed behind the counter, not on the counter stand as contracted. The agreed position was front-facing, visible to customers at checkout.",
        raisedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
        status: "Open",
        timeline: [
          { event: "Dispute raised by Nestle Pakistan", time: "6 hours ago", by: "company" },
          { event: "24-hour resolution window started", time: "6 hours ago", by: "system" }
        ]
      }
    ];
  });

  // ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([
    { id: 1, type: "request", title: "New Request Received", body: "Unilever Pakistan requested Shelf A — Ground Floor for Jan–Mar 2025.", time: "2:15 PM", group: "Today", read: false, deepLink: { tab: "requests", view: "detail", id: 1 } },
    { id: 5, type: "dispute", title: "Dispute Raised", body: "Nestle Pakistan raised a dispute on Checkout Counter Stand booking.", time: "8:00 AM", group: "Today", read: false, deepLink: { tab: "disputes", view: "detail", id: 1 } },
    { id: 2, type: "contract", title: "Contract Ready to Sign", body: "Nestle Pakistan booking contract is ready for your e-signature.", time: "Yesterday, 3:00 PM", group: "Yesterday", read: false, deepLink: { tab: "requests", view: "booking-detail", id: 2 } },
    { id: 6, type: "advance", title: "Advance Request Received", body: "P&G Pakistan sent an advance request for Shelf A — Ground Floor (Apr–Jun 2025).", time: "3 days ago", group: "Earlier", read: true, deepLink: { tab: "requests", view: "advance" } },
    { id: 3, type: "payment", title: "Payout Released", body: "PKR 38,250 released for Tapal Tea — December 2024 installment.", time: "5 days ago", group: "Earlier", read: true, deepLink: { tab: "earnings" } },
    { id: 4, type: "review", title: "New Review Received", body: "Tapal Tea left a 5★ review for Shelf A — Ground Floor campaign.", time: "5 days ago", group: "Earlier", read: true, deepLink: { tab: "profile", view: "reviews" } }
  ]);

  // ─── PAYOUT METHODS ───────────────────────────────────────────────────────
  const [payoutMethods, setPayoutMethods] = useState([
    { id: 1, type: "JazzCash", title: "JazzCash Mobile Wallet", account: "0300-****-567", isDefault: true },
    { id: 2, type: "Bank", title: "Habib Bank Limited", account: "PK21HABB0001234567890", isDefault: false }
  ]);

  // ─── REVIEWS ──────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState([
    {
      id: 1, brand: "Tapal Tea", logo: "T", date: "December 31, 2024", rating: 5,
      categories: { accuracy: 5, cleanliness: 5, cooperation: 5, value: 5 },
      text: "Excellent placement — product was positioned exactly as contracted. Sales saw a direct 18% bump during the campaign. Highly professional shopkeeper.",
      reply: ""
    },
    {
      id: 2, brand: "Reckitt Pakistan", logo: "R", date: "November 20, 2024", rating: 4,
      categories: { accuracy: 4, cleanliness: 4, cooperation: 5, value: 4 },
      text: "Good display size and professional setup. Communication was prompt throughout. Will book this space again for next quarter.",
      reply: "Thank you Reckitt team! We look forward to hosting your products again."
    }
  ]);

  // ─── NOTIFICATION SETTINGS ────────────────────────────────────────────────
  const [notifSettings, setNotifSettings] = useState({
    newRequests:  { push: true,  email: true  },
    payments:     { push: true,  email: true  },
    contracts:    { push: true,  email: false },
    disputes:     { push: true,  email: true  },
    reviews:      { push: false, email: false },
    reminders:    { push: true,  email: false }
  });

  // ─── NAVIGATION STATE ─────────────────────────────────────────────────────
  const [activeTab, setActiveTab]     = useState('dashboard');
  const [currentView, setCurrentView] = useState('main');
  const [viewParams, setViewParams]   = useState(null);
  const [prevTab, setPrevTab]         = useState(null);

  // ─── INVENTORY FORM STATE ─────────────────────────────────────────────────
  const [newSpaceStep, setNewSpaceStep] = useState(1);
  const [newSpaceData, setNewSpaceData] = useState({
    type: 'shelf', floor: 'Ground',
    dimensions: { l: '', w: '', h: '', unit: 'inches' },
    footfall: 'Medium (50–200)', suitableProducts: [], photos: [], nearbyContext: ''
  });

  // ─── LISTING FORM STATE ───────────────────────────────────────────────────
  const [newListingStep, setNewListingStep] = useState(1);
  const [newListingData, setNewListingData] = useState({
    spaceId: null, startDate: '', endDate: '',
    durationMonths: 0, durationLabel: '',
    totalPrice: '', pricePerMonth: 0, productPreference: ''
  });

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  const navigateToView = (tab, view = 'main', params = null) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
    setCurrentView(view);
    setViewParams(params);
  };

  const goBack = () => {
    if (prevTab && prevTab !== activeTab) {
      setActiveTab(prevTab);
      setCurrentView('main');
      setViewParams(null);
    } else {
      setCurrentView('main');
      setViewParams(null);
    }
  };

  const pushNotification = (type, title, body, link) => {
    setNotifications(prev => [{
      id: Date.now(), type, title, body,
      time: "Just now", group: "Today",
      read: false, deepLink: link
    }, ...prev]);
  };

  const resetSpaceForm = () => {
    setNewSpaceStep(1);
    setNewSpaceData({
      type: 'shelf', floor: 'Ground',
      dimensions: { l: '', w: '', h: '', unit: 'inches' },
      footfall: 'Medium (50–200)', suitableProducts: [], photos: [], nearbyContext: ''
    });
  };

  const resetListingForm = () => {
    setNewListingStep(1);
    setNewListingData({
      spaceId: null, startDate: '', endDate: '',
      durationMonths: 0, durationLabel: '',
      totalPrice: '', pricePerMonth: 0, productPreference: ''
    });
  };

  const unlistedSpaces = spaces.filter(s => s.status === 'Unlisted');
  const pendingRequestsTotal = requests.filter(r => r.status === 'Pending').length +
                               advanceRequests.filter(r => r.status === 'Pending').length;

  React.useEffect(() => {
    localStorage.setItem('spacelo_spaces', JSON.stringify(spaces));
  }, [spaces]);

  React.useEffect(() => {
    localStorage.setItem('spacelo_listings', JSON.stringify(listings));
  }, [listings]);

  React.useEffect(() => {
    localStorage.setItem('spacelo_requests', JSON.stringify(requests));
  }, [requests]);

  React.useEffect(() => {
    localStorage.setItem('spacelo_advance_requests', JSON.stringify(advanceRequests));
  }, [advanceRequests]);

  React.useEffect(() => {
    localStorage.setItem('spacelo_disputes', JSON.stringify(disputes));
  }, [disputes]);

  // Real-time synchronization across browser tabs
  React.useEffect(() => {
    const handleStorage = (e) => {
      try {
        if (e.key === 'spacelo_spaces' && e.newValue) {
          setSpaces(JSON.parse(e.newValue));
        }
        if (e.key === 'spacelo_listings' && e.newValue) {
          setListings(JSON.parse(e.newValue));
        }
        if (e.key === 'spacelo_requests' && e.newValue) {
          setRequests(JSON.parse(e.newValue));
        }
        if (e.key === 'spacelo_advance_requests' && e.newValue) {
          setAdvanceRequests(JSON.parse(e.newValue));
        }
        if (e.key === 'spacelo_disputes' && e.newValue) {
          setDisputes(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error("Storage sync error:", err);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <ShopkeeperContext.Provider value={{
      spaces, setSpaces,
      listings, setListings,
      requests, setRequests,
      advanceRequests, setAdvanceRequests,
      disputes, setDisputes,
      notifications, setNotifications,
      payoutMethods, setPayoutMethods,
      reviews, setReviews,
      notifSettings, setNotifSettings,
      activeTab, setActiveTab,
      currentView, setCurrentView,
      viewParams, setViewParams,
      newSpaceStep, setNewSpaceStep,
      newSpaceData, setNewSpaceData,
      newListingStep, setNewListingStep,
      newListingData, setNewListingData,
      navigateToView,
      goBack,
      pushNotification,
      resetSpaceForm,
      resetListingForm,
      unlistedSpaces,
      pendingRequestsTotal
    }}>
      {children}
    </ShopkeeperContext.Provider>
  );
}
