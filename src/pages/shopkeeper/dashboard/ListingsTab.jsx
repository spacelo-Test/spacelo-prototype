import React, { useState, useEffect } from "react";
import { useShopkeeper } from "./ShopkeeperContext";
import { STORAGE_KEYS } from "../../../lib/constants";

export default function ListingsTab() {
  const {
    spaces,
    setSpaces,
    listings,
    setListings,
    requests,
    currentView,
    setCurrentView,
    viewParams,
    setViewParams,
    newListingStep,
    setNewListingStep,
    newListingData,
    setNewListingData,
    resetListingForm,
    navigateToView,
    pushNotification,
    unlistedSpaces,
  } = useShopkeeper();

  const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE) || "Shopkeeper";
  const isMallOwner = userRole === "Mall Owner";
  const chainName =
    localStorage.getItem(STORAGE_KEYS.CHAIN_NAME) || "Imtiaz Supermarket";
  const branchArea =
    localStorage.getItem(STORAGE_KEYS.BRANCH_AREA) || "Johar Town Branch";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isInlineSearch, setIsInlineSearch] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const bookingsSectionRef = React.useRef(null);

  // Helper for space type labels
  const getSpaceTypeLabel = (type) => {
    const types = {
      shelf: "Shelf",
      end_cap: "End-Cap",
      window_display: "Window Display",
      floor_stand: "Floor Stand",
      checkout_counter: "Checkout Counter",
      entrance_display: "Entrance Display",
      promotional_aisle: "Promotional Aisle",
      other: "Other",
    };
    return types[type] || "Other";
  };

  // Status badges classes
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Live":
        return "bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20";
      case "Pending Approval":
        return "bg-[#ffab00]/10 text-[#ab6b00] border border-[#ffab00]/20";
      case "Inactive":
      case "Expired":
        return "bg-gray-100 text-gray-500 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };

  // Load existing listing data if editing
  useEffect(() => {
    if (currentView === "create-listing" && viewParams) {
      const listingToEdit = listings.find(
        (l) => Number(l.id) === Number(viewParams),
      );
      if (listingToEdit) {
        setIsEditing(true);
        setNewListingData({ ...listingToEdit });
      }
    } else if (currentView === "create-listing") {
      setIsEditing(false);
    }
  }, [currentView, viewParams, listings]);

  // Duration month calculation
  const calculateMonths = (start, end) => {
    if (!start || !end) return 0;
    const sDate = new Date(start);
    const eDate = new Date(end);
    if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) return 0;

    const diffTime = Math.abs(eDate - sDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.round(diffDays / 30.4);
    return months || 1;
  };

  // Start Date / End Date logic
  useEffect(() => {
    if (newListingData.startDate && newListingData.endDate) {
      const months = calculateMonths(
        newListingData.startDate,
        newListingData.endDate,
      );
      const pricePerMo =
        newListingData.totalPrice && months > 0
          ? Math.round(newListingData.totalPrice / months)
          : 0;

      // format label
      const startF = new Date(newListingData.startDate).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" },
      );
      const endF = new Date(newListingData.endDate).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" },
      );
      const label = `${months} month${months > 1 ? "s" : ""} — ${startF} to ${endF}`;

      setNewListingData((prev) => ({
        ...prev,
        durationMonths: months,
        durationLabel: label,
        pricePerMonth: pricePerMo,
      }));
    }
  }, [
    newListingData.startDate,
    newListingData.endDate,
    newListingData.totalPrice,
  ]);

  // Handle saving listing
  const handleSaveListing = () => {
    const selectedSpace = spaces.find(
      (s) => Number(s.id) === Number(newListingData.spaceId),
    );
    const spacePhoto =
      selectedSpace && selectedSpace.photos && selectedSpace.photos.length > 0
        ? selectedSpace.photos[0]
        : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80";

    if (isEditing) {
      // Edit listing
      const existingListing = listings.find((l) => l.id === viewParams);
      const updatedListing = {
        ...existingListing,
        ...newListingData,
        updatedAt: Date.now()
      };

      setListings((prev) =>
        prev.map((l) => (l.id === viewParams ? updatedListing : l)),
      );

      // Write directly to localStorage synchronously
      const savedListings = JSON.parse(localStorage.getItem('spacelo_listings') || '[]');
      const updatedListings = savedListings.map((l) =>
        l.id === viewParams ? updatedListing : l
      );
      localStorage.setItem('spacelo_listings', JSON.stringify(updatedListings));

      pushNotification(
        "admin",
        "Listing Updated",
        `Commercial offer for "${selectedSpace?.nickname}" has been updated.`,
        { tab: "listings", view: "listing-detail", id: viewParams },
      );
    } else {
      // Create listing
      const newId =
        listings.length > 0 ? Math.max(...listings.map((l) => l.id)) + 1 : 1;
      const createdListing = {
        ...newListingData,
        id: newId,
        status: "Pending Approval",
        verified: false,
        bookingsCount: 0,
        photo: spacePhoto,
      };
      setListings((prev) => [...prev, createdListing]);
      // Update space status to Listed
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === newListingData.spaceId
            ? { ...s, status: "Listed", listingId: newId }
            : s,
        ),
      );

      pushNotification(
        "contract",
        "Listing Submitted",
        `Listing for "${selectedSpace?.nickname}" submitted for admin review.`,
        { tab: "listings", view: "listing-detail", id: newId },
      );
    }
    resetListingForm();
    setIsEditing(false);
    setCurrentView("main");
    setViewParams(null);
  };

  // VIEW 1: Main Listings list
  if (currentView === "main") {
    const liveListings = listings.filter((l) => l.status === "Live").length;
    const pendingListings = listings.filter(
      (l) => l.status === "Pending Approval",
    ).length;

    const filteredListings = listings.filter((listing) => {
      const space = spaces.find(
        (s) => Number(s.id) === Number(listing.spaceId),
      );
      const spaceName = space ? space.nickname : "";

      const matchesSearch =
        spaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.productPreference
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        listing.durationLabel.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeFilter === "All") return matchesSearch;
      return matchesSearch && listing.status === activeFilter;
    });

    return (
      <div className="flex-grow flex flex-col relative h-full overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#e0e3e0] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          {isInlineSearch ? (
            <div className="flex items-center w-full gap-2">
              <span className="material-symbols-outlined text-[#6e7975]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings..."
                className="flex-grow text-[15px] outline-none border-b border-[#005344] py-1"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsInlineSearch(false);
                  setSearchQuery("");
                }}
                className="material-symbols-outlined text-[#6e7975]"
              >
                close
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-[20px] font-black text-[#181c1b]">
                My Listings
              </h1>
              <button
                onClick={() => setIsInlineSearch(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-[#005344]"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            </>
          )}
        </div>

        {/* Summary strip */}
        <div className="bg-[#005344]/5 border-b border-[#e0e3e0] px-4 py-2 text-[12px] text-[#005344] font-medium">
          {liveListings} live • {pendingListings} pending approval
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide bg-white border-b border-[#e0e3e0]">
          {["All", "Live", "Pending Approval", "Inactive", "Expired"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-[#005344] text-white"
                    : "bg-[#f0f3f0] text-[#6e7975] hover:bg-gray-200"
                }`}
              >
                {filter === "Pending Approval" ? "Pending" : filter}
              </button>
            ),
          )}
        </div>

        {/* Listings List */}
        <div className="flex-grow overflow-y-auto p-4 pb-28 space-y-3">
          {filteredListings.length > 0
            ? filteredListings.map((listing) => {
                const space = spaces.find(
                  (s) => Number(s.id) === Number(listing.spaceId),
                );
                const nickname = space ? space.nickname : "Unknown Space";
                const type = space ? space.type : "shelf";

                return (
                  <div
                    key={listing.id}
                    onClick={() => {
                      setCurrentView("listing-detail");
                      setViewParams(listing.id);
                    }}
                    className="bg-white p-3 rounded-xl border border-[#e0e3e0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex gap-3 cursor-pointer hover:border-[#005344] transition-all"
                  >
                    {/* Left: Thumbnail */}
                    <img
                      src={
                        listing.photo ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={nickname}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    />

                    {/* Right: Info */}
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 min-w-0 flex-wrap">
                            <span className="bg-[#f0f3f0] text-[#005344] px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex-shrink-0">
                              {getSpaceTypeLabel(type)}
                            </span>
                            <span className="text-[14px] font-bold text-[#181c1b] truncate">
                              {nickname}
                            </span>
                            {isMallOwner ? (
                              <span className="bg-[#00875a]/10 text-[#00875a] text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 border border-[#00875a]/20 flex-shrink-0">
                                <span className="material-symbols-outlined text-[10px] font-bold">
                                  check
                                </span>
                                {chainName} Branch — {branchArea}
                              </span>
                            ) : (
                              listing.verified && (
                                <span
                                  className="material-symbols-outlined text-[14px] text-[#005344] flex-shrink-0 font-bold"
                                  title="Verified Space"
                                >
                                  verified
                                </span>
                              )
                            )}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0 ${getStatusBadgeClass(listing.status)}`}
                          >
                            {listing.status === "Pending Approval"
                              ? "Pending"
                              : listing.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#6e7975] mt-1 font-medium truncate flex items-center gap-1.5">
                          {isMallOwner && (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#005344] flex-shrink-0">
                              <span className="w-3.5 h-3.5 rounded-full bg-[#005344] text-[#96ebd5] flex items-center justify-center font-bold text-[8px] uppercase">
                                {chainName[0]}
                              </span>
                              <span>{chainName}</span>
                              <span className="text-gray-300">•</span>
                            </div>
                          )}
                          <span>{listing.durationLabel}</span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <span className="text-[15px] font-black text-[#005344]">
                            PKR{" "}
                            {(Number(listing.totalPrice) || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#6e7975] ml-1">
                            /total
                          </span>
                        </div>

                        {listing.status === "Pending Approval" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setListings((prev) =>
                                prev.map((l) =>
                                  l.id === listing.id
                                    ? { ...l, status: "Live", verified: true }
                                    : l,
                                ),
                              );
                              pushNotification(
                                "admin",
                                "Listing Approved",
                                `Commercial listing for "${nickname}" is now Live.`,
                                {
                                  tab: "listings",
                                  view: "listing-detail",
                                  id: listing.id,
                                },
                              );
                            }}
                            className="bg-[#00875a] hover:bg-[#005c3d] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all z-10"
                          >
                            <span className="material-symbols-outlined text-[12px] font-bold">
                              check_circle
                            </span>
                            Approve
                          </button>
                        )}

                        <span className="text-[11px] text-[#6e7975]">
                          {listing.bookingsCount} booking
                          {listing.bookingsCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            : (() => {
                const emptyState = (() => {
                  switch (activeFilter) {
                    case "Inactive":
                      return {
                        icon: "block",
                        title: "No Inactive Listings",
                        desc: "This is the inactive listings list. Inactive or deactivated listings will appear here.",
                        showBtn: false,
                      };
                    case "Expired":
                      return {
                        icon: "history",
                        title: "No Expired Listings",
                        desc: "This is the expired listings list. Listings whose duration has expired will appear here.",
                        showBtn: false,
                      };
                    case "Live":
                      return {
                        icon: "sell",
                        title: "No Live Listings",
                        desc: "This is the live listings list. Active listings currently live on the marketplace will appear here.",
                        showBtn: true,
                      };
                    case "Pending Approval":
                      return {
                        icon: "pending_actions",
                        title: "No Pending Listings",
                        desc: "This is the pending listings list. Listings waiting for admin approval will appear here.",
                        showBtn: false,
                      };
                    default:
                      return {
                        icon: "sell",
                        title: "No listings match your filter",
                        desc: "Create an active listing so brands can book your available spaces.",
                        showBtn: true,
                      };
                  }
                })();

                return (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="material-symbols-outlined text-[#6e7975] text-[64px]">
                      {emptyState.icon}
                    </span>
                    <p className="text-[#181c1b] font-bold mt-2">
                      {emptyState.title}
                    </p>
                    <p className="text-[#6e7975] text-[13px] mt-1 max-w-[240px]">
                      {emptyState.desc}
                    </p>
                    {emptyState.showBtn && (
                      <button
                        onClick={() => {
                          resetListingForm();
                          setCurrentView("create-listing");
                        }}
                        className="mt-4 bg-[#005344] text-white px-5 py-2 rounded-xl text-[14px] font-bold shadow-md hover:bg-[#003d32] transition-all"
                      >
                        Create Listing
                      </button>
                    )}
                  </div>
                );
              })()}
        </div>

        <button
          onClick={() => {
            resetListingForm();
            setViewParams(null);
            setCurrentView("create-listing");
          }}
          className="absolute bottom-20 right-6 w-14 h-14 bg-[#fe6a34] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all z-40"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    );
  }

  // VIEW 2: Create Listing 3-Step Form
  if (currentView === "create-listing") {
    const handleNext = () => {
      if (newListingStep < 3) {
        setNewListingStep(newListingStep + 1);
      } else {
        handleSaveListing();
      }
    };

    const handlePrev = () => {
      if (newListingStep > 1) {
        setNewListingStep(newListingStep - 1);
      } else {
        resetListingForm();
        setIsEditing(false);
        setCurrentView("main");
        setViewParams(null);
      }
    };

    const handleSelectSpace = (spaceId) => {
      setNewListingData((prev) => ({ ...prev, spaceId }));
    };

    const selectedSpace = spaces.find(
      (s) => Number(s.id) === Number(newListingData.spaceId),
    );

    // Validations
    const isStep1Valid = !!newListingData.spaceId;

    const isDurationValid =
      newListingData.durationMonths >= 1 && newListingData.durationMonths <= 12;
    const isPreferenceValid =
      !!newListingData.productPreference &&
      newListingData.productPreference.trim().length > 10;
    const isStep2Valid =
      !!newListingData.startDate &&
      !!newListingData.endDate &&
      !!newListingData.totalPrice &&
      isDurationValid &&
      isPreferenceValid;

    const isStep3Valid = true;

    const getStepValidity = (step) => {
      switch (step) {
        case 1:
          return isStep1Valid;
        case 2:
          return isStep2Valid;
        case 3:
          return isStep3Valid;
        default:
          return false;
      }
    };

    return (
      <div className="flex-grow flex flex-col relative h-full overflow-hidden bg-[#f7faf7] pb-20">
        {/* Form Header */}
        <div className="bg-white border-b border-[#e0e3e0] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-[#005344]"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-[16px] font-black text-[#181c1b] text-center flex-grow">
            {isEditing ? "Edit Listing Offer" : "Create New Listing"}
          </h1>
          <div className="w-8 h-8"></div>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-white border-b border-[#e0e3e0] px-6 py-3">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#e0e3e0] z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#005344] transition-all duration-300 z-0"
              style={{ width: `${((newListingStep - 1) / 2) * 100}%` }}
            ></div>

            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px] relative z-10 transition-all ${
                  newListingStep === stepNum
                    ? "bg-[#005344] text-white ring-4 ring-[#005344]/10"
                    : newListingStep > stepNum
                      ? "bg-[#005344] text-white"
                      : "bg-white text-[#6e7975] border border-[#e0e3e0]"
                }`}
              >
                {newListingStep > stepNum ? (
                  <span className="material-symbols-outlined text-[14px]">
                    check
                  </span>
                ) : (
                  stepNum
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-[#6e7975] font-semibold mt-1.5 px-0">
            <span>Select Space</span>
            <span>Commercials & Preference</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-grow overflow-y-auto p-4">
          {/* STEP 1: SELECT SPACE */}
          {newListingStep === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-[18px] font-black text-[#181c1b]">
                  Select a space from inventory
                </h2>
                <p className="text-[13px] text-[#6e7975] mt-1">
                  Only unlisted spaces can be commercialized. To list an already
                  listed space, remove its existing listing first.
                </p>
              </div>

              {unlistedSpaces.length > 0 ? (
                <div className="space-y-3">
                  {unlistedSpaces.map((space) => {
                    const isSelected = newListingData.spaceId === space.id;
                    const mainPhoto =
                      space.photos && space.photos.length > 0
                        ? space.photos[0]
                        : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80";

                    return (
                      <div
                        key={space.id}
                        onClick={() => handleSelectSpace(space.id)}
                        className={`p-3 rounded-xl border flex gap-3 items-center cursor-pointer transition-all relative ${
                          isSelected
                            ? "border-[#005344] bg-[#005344]/5 ring-2 ring-[#005344]/15"
                            : "border-[#e0e3e0] bg-white hover:bg-gray-50"
                        }`}
                      >
                        <img
                          src={mainPhoto}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-[#f0f3f0] text-[#005344] px-1 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex-shrink-0">
                              {getSpaceTypeLabel(space.type)}
                            </span>
                            <span className="text-[13px] font-bold text-[#181c1b] truncate">
                              {space.nickname}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#6e7975] block mt-0.5">
                            Floor {space.floor} • {space.dimensions.l}x
                            {space.dimensions.w} in
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#005344] rounded-full flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[14px]">
                              check
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white p-4 rounded-xl border border-[#e0e3e0]">
                  <span className="material-symbols-outlined text-gray-300 text-[64px]">
                    grid_view
                  </span>
                  <p className="text-[#181c1b] font-bold mt-2">
                    All spaces are already listed
                  </p>
                  <p className="text-[#6e7975] text-[13px] mt-1 max-w-[280px]">
                    Add a new space to your physical inventory or remove an
                    active listing first.
                  </p>
                  <button
                    onClick={() => navigateToView("inventory", "main")}
                    className="mt-4 bg-[#005344] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#003d32] transition-all"
                  >
                    Go to Space Inventory
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: COMMERCIALS & PREFERENCE */}
          {newListingStep === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-[18px] font-black text-[#181c1b]">
                  Commercials & Preferences
                </h2>
                <p className="text-[13px] text-[#6e7975]">
                  Specify listing duration, pricing, and product preferences.
                </p>
              </div>

              <div className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider">
                      Start Date*
                    </label>
                    <input
                      type="date"
                      value={newListingData.startDate}
                      onChange={(e) =>
                        setNewListingData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider">
                      End Date*
                    </label>
                    <input
                      type="date"
                      value={newListingData.endDate}
                      onChange={(e) =>
                        setNewListingData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                    />
                  </div>
                </div>

                {/* Duration chip */}
                {newListingData.startDate && newListingData.endDate && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-black flex items-center gap-1.5 ${
                        isDurationValid
                          ? "bg-[#005344]/5 text-[#005344]"
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        calendar_today
                      </span>
                      {newListingData.durationLabel}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider">
                    Total Price (PKR)*
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#181c1b] text-[14px]">
                      PKR
                    </span>
                    <input
                      type="number"
                      value={newListingData.totalPrice}
                      onChange={(e) =>
                        setNewListingData((prev) => ({
                          ...prev,
                          totalPrice: e.target.value,
                        }))
                      }
                      placeholder="E.g., 120000"
                      className="w-full bg-white border border-[#e0e3e0] py-3 pl-12 pr-4 rounded-xl text-[14px] font-bold outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                    />
                  </div>
                </div>

                {/* Monthly breakdown preview */}
                {newListingData.totalPrice &&
                  newListingData.durationMonths > 0 && (
                    <div className="bg-[#005344]/5 border border-[#005344]/10 p-3 rounded-xl text-[13px] flex justify-between items-center">
                      <span className="text-[#6e7975] font-medium">
                        Estimated monthly payout:
                      </span>
                      <span className="font-bold text-[#005344] text-[15px]">
                        PKR{" "}
                        {Math.round(
                          newListingData.totalPrice /
                            newListingData.durationMonths,
                        ).toLocaleString()}{" "}
                        /mo
                      </span>
                    </div>
                  )}

                {/* Validation Error Message */}
                {newListingData.startDate &&
                  newListingData.endDate &&
                  !isDurationValid && (
                    <p className="text-red-500 text-[11px] font-bold">
                      * Listing duration must be between 1 and 12 months. Please
                      adjust dates.
                    </p>
                  )}

                {/* Product Preferences Textarea */}
                <div className="space-y-2 border-t border-[#e0e3e0] pt-4 mt-2">
                  <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider">
                    Product Restrictions & Preferences*
                  </label>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={newListingData.productPreference}
                    onChange={(e) =>
                      setNewListingData((prev) => ({
                        ...prev,
                        productPreference: e.target.value,
                      }))
                    }
                    placeholder="E.g., FMCG foods only. Prefer beverage stacks or biscuit crates. Strictly no household cleaners or chemical items due to proximity to bakery section."
                    className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                  ></textarea>
                  <div className="text-[11px] text-[#6e7975] text-right font-medium">
                    {newListingData.productPreference
                      ? newListingData.productPreference.length
                      : 0}
                    /500 characters (minimum 10)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & SAVE */}
          {newListingStep === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-[18px] font-black text-[#181c1b]">
                  Review listing details
                </h2>
                <p className="text-[13px] text-[#6e7975] mt-1">
                  Once submitted, this offer will go to admins for security
                  verification before showing up on the marketplace.
                </p>
              </div>

              <div className="space-y-3">
                {/* Space Summary */}
                <div className="bg-white rounded-xl border border-[#e0e3e0] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <h3 className="text-[11px] font-black text-[#005344] uppercase tracking-wider mb-2">
                    Space Details (Inventory)
                  </h3>
                  <div className="flex gap-3 items-center">
                    <img
                      src={
                        selectedSpace?.photos && selectedSpace.photos.length > 0
                          ? selectedSpace.photos[0]
                          : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
                      }
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div>
                      <span className="bg-[#f0f3f0] text-[#005344] px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                        {getSpaceTypeLabel(selectedSpace?.type)}
                      </span>
                      <h4 className="text-[13px] font-bold text-[#181c1b] mt-0.5">
                        {selectedSpace?.nickname}
                      </h4>
                      <p className="text-[11px] text-[#6e7975] mt-0.5">
                        Floor {selectedSpace?.floor}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Offer details */}
                <div className="bg-white rounded-xl border border-[#e0e3e0] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3">
                  <h3 className="text-[11px] font-black text-[#005344] uppercase tracking-wider border-b border-[#e0e3e0] pb-2">
                    Listing Commercials
                  </h3>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px]">
                    <div>
                      <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                        Duration
                      </span>
                      <span className="font-bold text-[#181c1b]">
                        {newListingData.durationLabel}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                        Total Rental Fee
                      </span>
                      <span className="font-bold text-[#181c1b]">
                        PKR{" "}
                        {(
                          Number(newListingData.totalPrice) || 0
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                        Monthly Payout P/M
                      </span>
                      <span className="font-bold text-[#181c1b]">
                        PKR{" "}
                        {(
                          Number(newListingData.pricePerMonth) || 0
                        ).toLocaleString()}{" "}
                        /month
                      </span>
                    </div>
                    <div className="col-span-2 border-t border-[#e0e3e0] pt-2.5">
                      <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                        Acceptable Products
                      </span>
                      <span className="text-[#181c1b] italic">
                        {newListingData.productPreference}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#ffab00]/5 border border-[#ffab00]/20 rounded-xl p-3 text-[11px] text-[#ab6b00] font-semibold flex gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#ab6b00]">
                    info
                  </span>
                  <div>
                    Admins usually approve commercial listings in 24–48 hours
                    after ensuring safety standards are met.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e0e3e0] z-20 flex gap-3">
          <button
            onClick={handlePrev}
            className="flex-grow py-3 border border-[#005344] text-[#005344] rounded-xl text-[14px] font-bold hover:bg-[#005344]/5 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            {newListingStep === 1 ? "Cancel" : "Back"}
          </button>

          <button
            onClick={handleNext}
            disabled={!getStepValidity(newListingStep)}
            className={`flex-grow py-3 rounded-xl text-[14px] font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
              getStepValidity(newListingStep)
                ? "bg-[#005344] text-white hover:bg-[#003d32]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {newListingStep === 3 ? "Submit Listing" : "Continue"}
            {newListingStep < 3 && (
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // VIEW 3: Listing Detail view
  if (currentView === "listing-detail") {
    const listing = listings.find((l) => Number(l.id) === Number(viewParams));

    if (!listing) {
      return (
        <div className="p-4 text-center">
          <p>Listing not found.</p>
          <button
            onClick={() => setCurrentView("main")}
            className="mt-2 text-[#005344] font-bold"
          >
            Go back
          </button>
        </div>
      );
    }

    const space = spaces.find((s) => Number(s.id) === Number(listing.spaceId));
    const relatedRequests = requests.filter((r) => r.listingId === listing.id);

    const activeBookings = relatedRequests.filter(
      (r) =>
        r.status !== "Completed" &&
        r.status !== "Rejected" &&
        r.status !== "Cancelled",
    );
    const completedBookings = relatedRequests.filter(
      (r) => r.status === "Completed",
    );
    const hasActiveBookings = relatedRequests.some(
      (r) => r.status === "Accepted",
    );

    const handleRemoveListing = () => {
      if (hasActiveBookings) return;
      // Set space status back to Unlisted
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === listing.spaceId
            ? { ...s, status: "Unlisted", listingId: null }
            : s,
        ),
      );
      // Remove listing
      setListings((prev) => prev.filter((l) => l.id !== listing.id));
      pushNotification(
        "admin",
        "Listing Removed",
        `Commercial listing for "${space?.nickname}" has been removed.`,
        { tab: "listings", view: "main" },
      );
      setCurrentView("main");
    };

    const totalFee = parseInt(listing.totalPrice) || 0;
    const commissionFee = Math.round(totalFee * 0.15);
    const netPayoutFee = totalFee - commissionFee;

    return (
      <div className="flex-grow flex flex-col relative h-full overflow-hidden bg-[#f7faf7]">
        {/* Detail Header */}
        <div className="bg-white border-b border-[#e0e3e0] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setCurrentView("main")}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-[#005344]"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-[16px] font-black text-[#181c1b] text-center flex-grow">
            Listing Details
          </h1>
          <div className="w-8 h-8"></div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 pb-12 space-y-4">
          {/* Photo */}
          <div className="w-full h-48 rounded-xl overflow-hidden border border-[#e0e3e0] bg-white relative">
            <img
              src={
                listing.photo ||
                "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
              }
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title block */}
          <div className="bg-white p-4 rounded-xl border border-[#e0e3e0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#f0f3f0] text-[#005344] px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider">
                {getSpaceTypeLabel(space?.type)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(listing.status)}`}
              >
                {listing.status}
              </span>
              {listing.verified && (
                <span className="bg-[#00875a]/10 text-[#005344] border border-[#00875a]/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">
                    verified
                  </span>{" "}
                  Verified Listing
                </span>
              )}
            </div>

            <h2 className="text-[18px] font-black text-[#181c1b]">
              {space?.nickname || "Unknown Space"}
            </h2>

            <div className="text-[13px] text-[#6e7975] flex items-center gap-1.5 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[18px] text-[#fe6a34]">
                calendar_month
              </span>
              <span>
                {listing.startDate} – {listing.endDate}
              </span>
            </div>
          </div>

          {/* Offer Summary Card */}
          <div className="bg-white p-4 rounded-xl border border-[#e0e3e0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3">
            <h3 className="text-[12px] font-black text-[#005344] uppercase tracking-wider border-b border-[#e0e3e0] pb-2">
              Offer Summary
            </h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px]">
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Total Rental Price
                </span>
                <span className="font-black text-[16px] text-[#005344]">
                  PKR {totalFee.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Per Month (Reference)
                </span>
                <span className="font-bold text-[14px] text-[#181c1b]">
                  PKR {(Number(listing.pricePerMonth) || 0).toLocaleString()}{" "}
                  /mo
                </span>
              </div>
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Platform Commission (15%)
                </span>
                <span className="font-semibold text-gray-500 text-[13px]">
                  PKR {commissionFee.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Est. Net Payout
                </span>
                <span className="font-bold text-[#005344] text-[13px]">
                  PKR {netPayoutFee.toLocaleString()}
                </span>
              </div>
              <div className="col-span-2 border-t border-[#e0e3e0] pt-2">
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Listing Duration Offer
                </span>
                <span className="font-bold text-[#181c1b]">
                  {listing.durationLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Space Reference Card (Read-only) */}
          <div className="bg-white p-4 rounded-xl border border-[#e0e3e0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex justify-between items-center border-b border-[#e0e3e0] pb-2">
              <h3 className="text-[12px] font-black text-[#005344] uppercase tracking-wider">
                Space Reference (Read-only)
              </h3>
              <span className="text-[10px] font-bold text-[#6e7975] bg-gray-100 px-2 py-0.5 rounded">
                Specs
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px]">
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Space Type
                </span>
                <span className="font-bold text-[#181c1b]">
                  {getSpaceTypeLabel(space?.type)}
                </span>
              </div>
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Physical Dimensions
                </span>
                <span className="font-bold text-[#181c1b]">
                  {space?.dimensions?.l}x{space?.dimensions?.w}x
                  {space?.dimensions?.h} {space?.dimensions?.unit}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Location inside Shop
                </span>
                <span className="font-bold text-[#181c1b]">
                  Floor {space?.floor}
                </span>
              </div>
            </div>
          </div>

          {/* Product Preferences */}
          <div className="bg-white p-4 rounded-xl border border-[#e0e3e0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-2">
            <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
              Product Preferences
            </span>
            <p className="text-[#181c1b] text-[13px] italic font-medium leading-relaxed bg-[#f7faf7] p-3 rounded-lg border border-[#e0e3e0]">
              {listing.productPreference || "No product preference declared."}
            </p>
          </div>

          {/* Bookings Section */}
          <div ref={bookingsSectionRef} className="space-y-3">
            <h3 className="text-[12px] font-black text-[#005344] uppercase tracking-wider pl-1">
              Bookings for this Listing
            </h3>

            {/* Active Bookings Group */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#6e7975] uppercase tracking-wider pl-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Active Requests & Bookings ({activeBookings.length})
              </div>
              {activeBookings.length > 0 ? (
                <div className="space-y-2">
                  {activeBookings.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => {
                        if (req.status === "Accepted") {
                          navigateToView("requests", "booking-detail", req.id);
                        } else {
                          navigateToView("requests", "detail", req.id);
                        }
                      }}
                      className="p-3 bg-white border border-[#e0e3e0] rounded-xl flex items-center justify-between shadow-sm cursor-pointer hover:border-[#005344] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-[12px] ${req.logoBg || "bg-[#005344]"}`}
                        >
                          {req.logo}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[13px] text-[#181c1b]">
                              {req.brand}
                            </span>
                            {req.verified && (
                              <span className="material-symbols-outlined text-[14px] text-blue-500">
                                verified
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#6e7975] block mt-0.5">
                            {req.requestedDates}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            req.status === "Accepted"
                              ? "bg-[#00875a]/10 text-[#00875a]"
                              : req.status === "Pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {req.status}
                        </span>
                        <span className="material-symbols-outlined text-[#6e7975] text-[18px]">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[12px] text-[#6e7975] bg-white border border-[#e0e3e0] p-4 rounded-xl text-center shadow-sm">
                  No active bookings yet.
                </div>
              )}
            </div>

            {/* Completed Bookings Group */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#6e7975] uppercase tracking-wider pl-1 flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                Completed Bookings ({completedBookings.length})
              </div>
              {completedBookings.length > 0 ? (
                <div className="space-y-2">
                  {completedBookings.map((req) => (
                    <div
                      key={req.id}
                      onClick={() =>
                        navigateToView("requests", "booking-detail", req.id)
                      }
                      className="p-3 bg-white border border-[#e0e3e0] rounded-xl flex items-center justify-between shadow-sm cursor-pointer hover:border-[#005344] transition-all opacity-80"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-[12px] bg-gray-400`}
                        >
                          {req.logo}
                        </span>
                        <div>
                          <span className="font-bold text-[13px] text-[#181c1b]">
                            {req.brand}
                          </span>
                          <span className="text-[11px] text-[#6e7975] block mt-0.5">
                            {req.requestedDates}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-500">
                          Completed
                        </span>
                        <span className="material-symbols-outlined text-[#6e7975] text-[18px]">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[12px] text-[#6e7975] bg-white border border-[#e0e3e0] p-4 rounded-xl text-center shadow-sm">
                  No completed bookings.
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {listing.status === "Pending Approval" && (
              <button
                onClick={() => {
                  setListings((prev) =>
                    prev.map((l) =>
                      l.id === listing.id
                        ? { ...l, status: "Live", verified: true }
                        : l,
                    ),
                  );
                  pushNotification(
                    "admin",
                    "Listing Approved",
                    `Commercial listing for "${space?.nickname}" is now Live.`,
                    { tab: "listings", view: "listing-detail", id: listing.id },
                  );
                }}
                className="w-full py-3 bg-[#00875a] text-white rounded-xl text-[13px] font-black hover:bg-[#005c3d] transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">
                  verified
                </span>
                Simulate Admin Approval
              </button>
            )}

            <button
              onClick={() => {
                resetListingForm();
                setCurrentView("create-listing");
                setViewParams(listing.id);
              }}
              className="w-full py-3 bg-[#005344] text-white rounded-xl text-[13px] font-black hover:bg-[#003d32] transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">
                edit
              </span>
              Edit Listing
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  bookingsSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                disabled={relatedRequests.length === 0}
                className={`py-3 border rounded-xl text-[13px] font-black transition-all text-center flex items-center justify-center gap-1.5 bg-white ${
                  relatedRequests.length === 0
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-[#005344] text-[#005344] hover:bg-[#005344]/5"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  visibility
                </span>
                View Bookings
              </button>

              <button
                onClick={handleRemoveListing}
                disabled={hasActiveBookings}
                className={`py-3 border rounded-xl text-[13px] font-black transition-all text-center flex items-center justify-center gap-1.5 bg-white ${
                  hasActiveBookings
                    ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                    : "border-[#de350b] text-[#de350b] hover:bg-[#de350b]/5"
                }`}
                title={
                  hasActiveBookings
                    ? "Cannot remove listing with active bookings"
                    : ""
                }
              >
                <span className="material-symbols-outlined text-[16px]">
                  delete
                </span>
                Remove Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
