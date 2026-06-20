import React, { createContext, useContext, useState } from 'react';

const ShopkeeperContext = createContext();

export function useShopkeeper() {
  return useContext(ShopkeeperContext);
}

export function ShopkeeperProvider({ children }) {
  // Shared listings state
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Prime Checkout Shelf",
      type: "checkout_counter",
      size: "2x1.5x3 ft",
      city: "Karachi",
      area: "DHA Phase 6",
      price: 45000,
      period: "month",
      status: "Active",
      verified: true,
      bookingsCount: 4,
      rating: 4.8,
      reviewsCount: 12,
      photo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
      desc: "High footfall display near checkout counter. Excellent visibility for impulse items."
    },
    {
      id: 2,
      title: "Window Display Rack",
      type: "window",
      size: "5x3x6 ft",
      city: "Lahore",
      area: "Gulberg III",
      price: 40000,
      period: "month",
      status: "Live",
      verified: false,
      bookingsCount: 1,
      rating: 4.5,
      reviewsCount: 2,
      photo: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=400&q=80",
      desc: "Large street-facing window display. Suitable for clothing or heavy design props."
    }
  ]);

  // Shared requests/bookings state
  const [requests, setRequests] = useState([
    {
      id: 1,
      brand: "Unilever",
      logo: "U",
      logoBg: "bg-blue-600",
      spaceId: 1,
      dates: "June 25 - June 28, 2026",
      price: 4500,
      status: "Pending",
      time: "2 hours ago",
      contractSignedByBrand: true,
      contractSignedByShopkeeper: false,
      proofs: [],
      timelineStep: 1
    },
    {
      id: 2,
      brand: "Nestle",
      logo: "N",
      logoBg: "bg-red-600",
      spaceId: 2,
      dates: "July 01 - July 07, 2026",
      price: 10000,
      status: "Accepted",
      time: "Yesterday",
      contractSignedByBrand: true,
      contractSignedByShopkeeper: true,
      proofs: [],
      timelineStep: 2
    },
    {
      id: 3,
      brand: "Tapal Tea",
      logo: "T",
      logoBg: "bg-green-700",
      spaceId: 1,
      dates: "June 10 - June 15, 2026",
      price: 9000,
      status: "Completed",
      time: "5 days ago",
      contractSignedByBrand: true,
      contractSignedByShopkeeper: true,
      proofs: ["https://images.unsplash.com/photo-1506617424151-74f5609c1fa6?auto=format&fit=crop&w=400&q=80"],
      timelineStep: 4
    }
  ]);

  // Shared notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, type: "request", title: "New Request", body: "Unilever requested Prime Checkout Shelf", time: "10:15 AM", read: false, deepLink: { tab: "bookings", view: "detail", id: 1 } },
    { id: 3, type: "payment", title: "Payout Released", body: "Net Payout of 8,100 PKR released for Tapal Tea", time: "Yesterday", read: true, deepLink: { tab: "earnings" } }
  ]);

  // Shared payout settings
  const [payoutMethods, setPayoutMethods] = useState([
    { id: 1, type: "JazzCash", title: "JazzCash Mobile Wallet", account: "0300****567", isDefault: true },
    { id: 2, type: "Bank", title: "Habib Bank Limited", account: "PK21HABB000123456789012", isDefault: false }
  ]);

  // Reviews state
  const [reviews, setReviews] = useState([
    { id: 1, brand: "Tapal Tea", logo: "T", date: "June 16, 2026", rating: 5, text: "Excellent placement! Product was placed exactly as contracted, and our sales saw a direct bump. Highly professional shopkeeper.", reply: "" },
    { id: 2, brand: "Nestle", logo: "N", date: "June 12, 2026", rating: 4, text: "Good display size and great customer service. We will book this space again.", reply: "Thank you Nestle team! Welcome back anytime." }
  ]);

  // Tab navigation states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState('main');
  const [viewParams, setViewParams] = useState(null);

  // New Space Form States
  const [newSpaceStep, setNewSpaceStep] = useState('A');
  const [newSpaceData, setNewSpaceData] = useState({
    title: '', type: 'shelf', width: '', height: '', depth: '',
    address: '', city: 'Karachi', area: '', shopName: '', floor: 'Ground', ntn: '',
    price: '', period: 'month', description: '', footfall: 'Medium (50 - 200)', suitability: '', photos: [], mapPinDropped: false, bookingDays: []
  });

  // Navigator Helper
  const navigateToView = (tab, view = 'main', params = null) => {
    setActiveTab(tab);
    setCurrentView(view);
    setViewParams(params);
  };

  // Push notifications helper
  const pushNotification = (type, title, body, link) => {
    const newNotif = {
      id: notifications.length + 1,
      type, title, body,
      time: "Just now",
      read: false,
      deepLink: link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <ShopkeeperContext.Provider value={{
      listings, setListings,
      requests, setRequests,
      notifications, setNotifications,
      payoutMethods, setPayoutMethods,
      reviews, setReviews,
      activeTab, setActiveTab,
      currentView, setCurrentView,
      viewParams, setViewParams,
      newSpaceStep, setNewSpaceStep,
      newSpaceData, setNewSpaceData,
      navigateToView,
      pushNotification
    }}>
      {children}
    </ShopkeeperContext.Provider>
  );
}
