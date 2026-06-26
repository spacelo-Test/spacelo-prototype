import React, { useState, useEffect } from "react";
import { useShopkeeper } from "./ShopkeeperContext";
import { STORAGE_KEYS } from "../../../lib/constants";

export default function InventoryTab() {
  const {
    spaces,
    setSpaces,
    currentView,
    setCurrentView,
    viewParams,
    setViewParams,
    newSpaceStep,
    setNewSpaceStep,
    newSpaceData,
    setNewSpaceData,
    resetSpaceForm,
    navigateToView,
    pushNotification,
  } = useShopkeeper();

  const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE) || 'Shopkeeper';
  const isMallOwner = userRole === 'Mall Owner';
  const chainName = localStorage.getItem(STORAGE_KEYS.CHAIN_NAME) || 'Imtiaz Supermarket';

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isInlineSearch, setIsInlineSearch] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showCustomProductInput, setShowCustomProductInput] = useState(false);
  const [customProductText, setCustomProductText] = useState("");

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

  // Helper for space type icons
  const getSpaceTypeIcon = (type) => {
    const icons = {
      shelf: "shelves",
      end_cap: "view_carousel",
      window_display: "storefront",
      floor_stand: "view_in_ar",
      checkout_counter: "point_of_sale",
      entrance_display: "door_front",
      promotional_aisle: "space_bar",
      other: "category",
    };
    return icons[type] || "category";
  };

  // Status badges classes
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Listed":
        return "bg-[#00875a]/10 text-[#00875a] border border-[#00875a]/20";
      case "Unlisted":
        return "bg-gray-100 text-gray-600 border border-gray-200";
      case "Inactive":
        return "bg-[#de350b]/10 text-[#de350b] border border-[#de350b]/20";
      default:
        return "bg-gray-100 text-gray-500 border border-gray-200";
    }
  };

  // Load existing data if editing
  useEffect(() => {
    if (currentView === "add-space" && viewParams) {
      const spaceToEdit = spaces.find((s) => s.id === viewParams);
      if (spaceToEdit) {
        setIsEditing(true);
        setNewSpaceData({ ...spaceToEdit });
      }
    } else if (currentView === "add-space") {
      setIsEditing(false);
    }
  }, [currentView, viewParams, spaces]);

  // Handle saving space (create or update)
  const handleSaveSpace = () => {
    const generatedNickname = `${getSpaceTypeLabel(newSpaceData.type)} — Floor ${newSpaceData.floor}`;
    const spaceToSave = {
      ...newSpaceData,
      nickname: generatedNickname,
      dimensions: {
        ...newSpaceData.dimensions,
        unit: "inches"
      }
    };
    if (isEditing) {
      // Update existing space
      setSpaces((prev) =>
        prev.map((s) => (s.id === viewParams ? { ...spaceToSave, id: s.id, status: s.status, listingId: s.listingId } : s)),
      );
      pushNotification(
        "admin",
        "Space Updated",
        `Physical inventory details for "${generatedNickname}" have been updated.`,
        { tab: "inventory", view: "space-detail", id: viewParams },
      );
      alert("Space details updated successfully!");
    } else {
      // Create new space
      const newId =
        spaces.length > 0 ? Math.max(...spaces.map((s) => s.id)) + 1 : 1;
      const createdSpace = {
        ...spaceToSave,
        id: newId,
        status: "Unlisted",
        listingId: null,
        photos:
          newSpaceData.photos && newSpaceData.photos.length > 0
            ? newSpaceData.photos
            : [
                "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
              ],
      };
      setSpaces((prev) => [...prev, createdSpace]);
      pushNotification(
        "admin",
        "New Space Created",
        `"${generatedNickname}" is now registered in your inventory. Create a listing to rent it out.`,
        { tab: "inventory", view: "space-detail", id: newId },
      );
      alert("Item added to inventory successfully!");
    }
    resetSpaceForm();
    setShowCustomProductInput(false);
    setCustomProductText("");
    setIsEditing(false);
    setCurrentView("main");
    setViewParams(null);
  };

  // VIEW 1: Main Inventory List
  if (currentView === "main") {
    const totalSpaces = spaces.length;
    const listedSpaces = spaces.filter((s) => s.status === "Listed").length;
    const unlistedSpacesCount = spaces.filter(
      (s) => s.status === "Unlisted",
    ).length;

    const filteredSpaces = spaces.filter((space) => {
      const matchesSearch =
        space.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSpaceTypeLabel(space.type)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      if (activeFilter === "All") return matchesSearch;
      return matchesSearch && space.status === activeFilter;
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
                placeholder="Search spaces..."
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
                My Space Inventory
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
          {totalSpaces} spaces total • {listedSpaces} listed •{" "}
          {unlistedSpacesCount} unlisted
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide bg-white border-b border-[#e0e3e0]">
          {["All", "Listed", "Unlisted", "Inactive"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-3 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap flex items-center justify-center min-w-[60px] ${
                activeFilter === filter
                  ? "bg-[#005344] text-white"
                  : "bg-[#f0f3f0] text-[#6e7975] hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Space List */}
        <div className="flex-grow overflow-y-auto p-4 pb-28 space-y-3">
          {filteredSpaces.length > 0 ? (
            filteredSpaces.map((space) => {
              const mainPhoto =
                space.photos && space.photos.length > 0
                  ? space.photos[0]
                  : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  key={space.id}
                  onClick={() => {
                    setCurrentView("space-detail");
                    setViewParams(space.id);
                  }}
                  className="bg-white p-3 rounded-xl border border-[#e0e3e0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex gap-3 cursor-pointer hover:border-[#005344] transition-all"
                >
                  {/* Left: Thumbnail */}
                  <img
                    src={mainPhoto}
                    alt={space.nickname}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                  />

                  {/* Right: Info */}
                  <div className="flex-grow min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="bg-[#f0f3f0] text-[#005344] px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex-shrink-0">
                            {getSpaceTypeLabel(space.type)}
                          </span>
                          {isMallOwner && (
                            <span className="bg-[#fe6a34]/10 text-[#fe6a34] border border-[#fe6a34]/20 px-1.5 py-0.5 rounded text-[9px] font-bold truncate">
                              {chainName} Branch
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(space.status)}`}
                        >
                          {space.status}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-bold text-[#181c1b] truncate mt-1">
                        {space.nickname}
                      </h3>
                    </div>

                    <div className="text-[12px] text-[#6e7975] mt-1">
                      <div>
                        Dimensions: {space.dimensions.l}×{space.dimensions.w}×
                        {space.dimensions.h} {space.dimensions.unit}
                      </div>
                      <div className="truncate">
                        Floor {space.floor}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            (() => {
              const emptyState = (() => {
                switch (activeFilter) {
                  case "Inactive":
                    return {
                      icon: "block",
                      title: "No inactive spaces",
                      desc: "This is the inactive tab list. Deactivated spaces from your inventory will appear here.",
                      showBtn: true,
                    };
                  case "Listed":
                    return {
                      icon: "sell",
                      title: "No listed spaces",
                      desc: "Spaces with active commercial listings will appear here.",
                      showBtn: true,
                    };
                  case "Unlisted":
                    return {
                      icon: "grid_view",
                      title: "No unlisted spaces",
                      desc: "All your spaces are currently listed or inactive.",
                      showBtn: false,
                    };
                  default:
                    return {
                      icon: "add_box",
                      title: "No spaces match your filters",
                      desc: "Start adding physical retail display spaces to your store's inventory.",
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
                        resetSpaceForm();
                        setCurrentView("add-space");
                      }}
                      className="mt-4 bg-[#005344] text-white px-5 py-2 rounded-xl text-[14px] font-bold shadow-md hover:bg-[#003d32] transition-all"
                    >
                      + Add Space
                    </button>
                  )}
                </div>
              );
            })()
          )}
        </div>

        <button
          onClick={() => {
            resetSpaceForm();
            setViewParams(null);
            setCurrentView("add-space");
          }}
          className="absolute bottom-20 right-6 w-14 h-14 bg-[#fe6a34] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all z-40"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    );
  }

  // VIEW 2: Add/Edit Space 3-Step Form
  if (currentView === "add-space") {
    const handleNext = () => {
      if (newSpaceStep < 3) {
        setNewSpaceStep(newSpaceStep + 1);
      } else {
        handleSaveSpace();
      }
    };

    const handlePrev = () => {
      if (newSpaceStep > 1) {
        setNewSpaceStep(newSpaceStep - 1);
      } else {
        resetSpaceForm();
        setShowCustomProductInput(false);
        setCustomProductText("");
        setIsEditing(false);
        setCurrentView("main");
        setViewParams(null);
      }
    };

    const handleSelectType = (type) => {
      setNewSpaceData((prev) => ({ ...prev, type }));
    };

    const handleTypeOtherTextChange = (e) => {
      setNewSpaceData((prev) => ({ ...prev, otherTypeLabel: e.target.value }));
    };

    const toggleSuitableProduct = (prod) => {
      setNewSpaceData((prev) => {
        const list = prev.suitableProducts.includes(prod)
          ? prev.suitableProducts.filter((p) => p !== prod)
          : [...prev.suitableProducts, prod];
        return { ...prev, suitableProducts: list };
      });
    };

    // Simulated Photo upload
    const handleSimulateAddPhoto = () => {
      const demoPhotos = [
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=400&q=80",
      ];

      const currentPhotos = newSpaceData.photos || [];
      if (currentPhotos.length >= 5) return;

      const newPhoto = demoPhotos[currentPhotos.length % demoPhotos.length];
      setNewSpaceData((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), newPhoto],
      }));
    };

    const handleRemovePhoto = (idx) => {
      setNewSpaceData((prev) => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== idx),
      }));
    };

    const isStep1Valid =
      !!newSpaceData.type &&
      !!newSpaceData.floor &&
      !!newSpaceData.dimensions.l &&
      !!newSpaceData.dimensions.w &&
      !!newSpaceData.dimensions.h &&
      !!newSpaceData.footfall &&
      newSpaceData.suitableProducts && newSpaceData.suitableProducts.length > 0;
    const isStep2Valid = true;
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
            {isEditing ? "Edit Physical Space" : "Add Space to Inventory"}
          </h1>
          <div className="w-8 h-8"></div>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-white border-b border-[#e0e3e0] px-6 py-3">
          <div className="flex items-center justify-between relative">
            {/* Background Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#e0e3e0] z-0"></div>
            {/* Active Progress Line */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#005344] transition-all duration-300 z-0"
              style={{ width: `${((newSpaceStep - 1) / 2) * 100}%` }}
            ></div>

            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[12px] relative z-10 transition-all ${
                  newSpaceStep === stepNum
                    ? "bg-[#005344] text-white ring-4 ring-[#005344]/10"
                    : newSpaceStep > stepNum
                      ? "bg-[#005344] text-white"
                      : "bg-white text-[#6e7975] border border-[#e0e3e0]"
                }`}
              >
                {newSpaceStep > stepNum ? (
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
            <span>Details</span>
            <span>Photos</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-grow overflow-y-auto p-4">
          {/* STEP 1: DETAILS */}
          {newSpaceStep === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-[18px] font-black text-[#181c1b]">
                  Space Details
                </h2>
                <p className="text-[13px] text-[#6e7975] mt-1">
                  Provide specifications and details for your display space.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Space Type */}
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider block">
                    Space Type*
                  </label>
                  <select
                    value={newSpaceData.type}
                    onChange={(e) => setNewSpaceData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                  >
                    <option value="">Select type...</option>
                    <option value="shelf">Shelf</option>
                    <option value="end_cap">End-Cap</option>
                    <option value="window_display">Window Display</option>
                    <option value="floor_stand">Floor Stand</option>
                    <option value="checkout_counter">Checkout Counter</option>
                    <option value="entrance_display">Entrance Display</option>
                    <option value="promotional_aisle">Promotional Aisle</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {newSpaceData.type === "other" && (
                  <div className="space-y-1">
                    <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider">
                      Please specify space type*
                    </label>
                    <input
                      type="text"
                      value={newSpaceData.otherTypeLabel || ""}
                      onChange={handleTypeOtherTextChange}
                      placeholder="E.g., Cash Counter Side Shelf"
                      className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                    />
                  </div>
                )}

                {/* Floor */}
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider block">
                    Floor*
                  </label>
                  <input
                    type="text"
                    value={newSpaceData.floor}
                    onChange={(e) =>
                      setNewSpaceData((prev) => ({
                        ...prev,
                        floor: e.target.value,
                      }))
                    }
                    placeholder="E.g., Ground"
                    className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                  />
                </div>

                {/* Dimensions */}
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider block">
                    Dimensions (L × W × H in inches)*
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={newSpaceData.dimensions.l}
                      onChange={(e) =>
                        setNewSpaceData((prev) => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, l: e.target.value },
                        }))
                      }
                      placeholder="Length"
                      className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                    />
                    <span className="text-gray-400 font-bold">×</span>
                    <input
                      type="number"
                      value={newSpaceData.dimensions.w}
                      onChange={(e) =>
                        setNewSpaceData((prev) => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, w: e.target.value },
                        }))
                      }
                      placeholder="Width"
                      className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                    />
                    <span className="text-gray-400 font-bold">×</span>
                    <input
                      type="number"
                      value={newSpaceData.dimensions.h}
                      onChange={(e) =>
                        setNewSpaceData((prev) => ({
                          ...prev,
                          dimensions: { ...prev.dimensions, h: e.target.value },
                        }))
                      }
                      placeholder="Height"
                      className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                    />
                  </div>
                </div>

                {/* Footfall */}
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider block">
                    Estimated Footfall*
                  </label>
                  <select
                    value={newSpaceData.footfall}
                    onChange={(e) =>
                      setNewSpaceData((prev) => ({
                        ...prev,
                        footfall: e.target.value,
                      }))
                    }
                    className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                  >
                    <option value="">Select footfall level...</option>
                    <option value="Low (Under 50)">Low (Under 50)</option>
                    <option value="Medium (50–200)">Medium (50–200)</option>
                    <option value="High (200+)">High (200+)</option>
                  </select>
                </div>

                {/* Suitable Products Dropdown + Tag Chips */}
                <div className="space-y-2">
                  <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider block">
                    Suitable Product Types* (Select to add)
                  </label>
                  <select
                    value=""
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "Other") {
                        setShowCustomProductInput(true);
                      } else if (val && !newSpaceData.suitableProducts.includes(val)) {
                        setNewSpaceData((prev) => ({
                          ...prev,
                          suitableProducts: [...prev.suitableProducts, val],
                        }));
                      }
                    }}
                    className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                  >
                    <option value="">Select suitable products...</option>
                    {["FMCG", "Beverages", "Snacks", "Cosmetics", "Electronics", "Apparel", "Other"].map((prod) => (
                      <option key={prod} value={prod}>{prod}</option>
                    ))}
                  </select>
                  {showCustomProductInput && (
                    <div className="flex gap-2 items-center mt-2">
                      <input
                        type="text"
                        value={customProductText}
                        onChange={(e) => setCustomProductText(e.target.value)}
                        placeholder="Enter other category..."
                        className="flex-grow bg-white border border-[#e0e3e0] p-2.5 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customProductText.trim() && !newSpaceData.suitableProducts.includes(customProductText.trim())) {
                            setNewSpaceData((prev) => ({
                              ...prev,
                              suitableProducts: [...prev.suitableProducts, customProductText.trim()],
                            }));
                          }
                          setCustomProductText("");
                          setShowCustomProductInput(false);
                        }}
                        className="bg-[#005344] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#003d32]"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomProductText("");
                          setShowCustomProductInput(false);
                        }}
                        className="text-[#de350b] hover:underline text-[12px] font-bold px-1"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {newSpaceData.suitableProducts && newSpaceData.suitableProducts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {newSpaceData.suitableProducts.map((prod) => (
                        <span
                          key={prod}
                          className="bg-[#005344] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                        >
                          {prod}
                          <button
                            type="button"
                            onClick={() =>
                              setNewSpaceData((prev) => ({
                                ...prev,
                                suitableProducts: prev.suitableProducts.filter((p) => p !== prod),
                              }))
                            }
                            className="hover:text-red-300 font-black text-[13px] leading-none shrink-0"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Nearby Context */}
                <div className="space-y-1">
                  <label className="text-[12px] font-black text-[#005344] uppercase tracking-wider block">
                    Nearby Context (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={newSpaceData.nearbyContext}
                    onChange={(e) =>
                      setNewSpaceData((prev) => ({
                        ...prev,
                        nearbyContext: e.target.value,
                      }))
                    }
                    placeholder="Describe what products, banners, or checkout displays are nearby. E.g., Adjacent to cash register #2, next to bubblegum racks."
                    className="w-full bg-white border border-[#e0e3e0] p-3 rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-[#005344]/25 focus:border-[#005344] resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PHOTOS */}
          {newSpaceStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-[18px] font-black text-[#181c1b]">
                  Upload space photos
                </h2>
                <p className="text-[13px] text-[#6e7975] mt-1">
                  Upload clear photos showing the current condition and position of the space.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSimulateAddPhoto}
                  className="w-full h-32 border-2 border-dashed border-[#e0e3e0] rounded-xl flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-all text-[#005344]"
                >
                  <span className="material-symbols-outlined text-[36px]">
                    add_a_photo
                  </span>
                  <span className="text-[13px] font-bold mt-1">
                    Simulate Photo Upload
                  </span>
                  <span className="text-[11px] text-[#6e7975] mt-0.5">
                    Click to simulate adding a photo
                  </span>
                </button>

                <div className="text-[12px] text-[#6e7975] font-semibold text-right">
                  {newSpaceData.photos ? newSpaceData.photos.length : 0} photos added (min 3, max 5 recommended)
                </div>

                {/* Photos Grid */}
                {newSpaceData.photos && newSpaceData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {newSpaceData.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-xl relative overflow-hidden border border-[#e0e3e0]"
                      >
                        <img
                          src={photo}
                          alt={`Uploaded ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white flex items-center justify-center hover:bg-black"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            close
                          </span>
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-[#005344]/90 text-white text-[9px] font-black text-center py-0.5">
                            PRIMARY
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & SAVE */}
          {newSpaceStep === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-[18px] font-black text-[#181c1b]">
                  Review details & save
                </h2>
                <p className="text-[13px] text-[#6e7975] mt-1">
                  Review the space profile before adding it to your active inventory.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#e0e3e0] p-4 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                {/* Photo summary */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {newSpaceData.photos && newSpaceData.photos.length > 0 ? (
                    newSpaceData.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                      />
                    ))
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border">
                      <span className="material-symbols-outlined text-[#6e7975]">
                        image
                      </span>
                    </div>
                  )}
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px] border-t border-[#e0e3e0] pt-3">
                  <div className="col-span-2">
                    <span className="text-[#6e7975] block text-[11px] font-semibold uppercase tracking-wider">
                      Nickname (Auto-generated)
                    </span>
                    <span className="font-black text-[#005344]">
                      {newSpaceData.type ? `${getSpaceTypeLabel(newSpaceData.type)} — Floor ${newSpaceData.floor || ''}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6e7975] block text-[11px] font-semibold uppercase tracking-wider">
                      Space Type
                    </span>
                    <span className="font-bold text-[#181c1b]">
                      {getSpaceTypeLabel(newSpaceData.type)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6e7975] block text-[11px] font-semibold uppercase tracking-wider">
                      Floor
                    </span>
                    <span className="font-bold text-[#181c1b]">
                      Floor {newSpaceData.floor}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6e7975] block text-[11px] font-semibold uppercase tracking-wider">
                      Dimensions
                    </span>
                    <span className="font-bold text-[#181c1b]">
                      {newSpaceData.dimensions.l} × {newSpaceData.dimensions.w} × {newSpaceData.dimensions.h} inches
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6e7975] block text-[11px] font-semibold uppercase tracking-wider">
                      Footfall
                    </span>
                    <span className="font-bold text-[#181c1b]">
                      {newSpaceData.footfall}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#6e7975] block text-[11px] font-semibold uppercase tracking-wider">
                      Suitable Products
                    </span>
                    <span className="font-bold text-[#181c1b]">
                      {newSpaceData.suitableProducts ? newSpaceData.suitableProducts.join(", ") : ""}
                    </span>
                  </div>
                </div>

                {newSpaceData.nearbyContext && (
                  <div className="border-t border-[#e0e3e0] pt-3 text-[13px]">
                    <span className="text-[#6e7975] block text-[11px] font-semibold uppercase tracking-wider">
                      Nearby Context
                    </span>
                    <span className="text-[#181c1b]">
                      {newSpaceData.nearbyContext}
                    </span>
                  </div>
                )}
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
            {newSpaceStep === 1 ? "Cancel" : "Back"}
          </button>

          <button
            onClick={handleNext}
            disabled={!getStepValidity(newSpaceStep)}
            className={`flex-grow py-3 rounded-xl text-[14px] font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
              getStepValidity(newSpaceStep)
                ? "bg-[#005344] text-white hover:bg-[#003d32]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {newSpaceStep === 3 ? "Submit" : "Continue"}
            {newSpaceStep < 3 && (
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // VIEW 3: Space Detail view
  if (currentView === "space-detail") {
    const space = spaces.find((s) => s.id === viewParams);

    if (!space) {
      return (
        <div className="p-4 text-center">
          <p>Space not found.</p>
          <button
            onClick={() => setCurrentView("main")}
            className="mt-2 text-[#005344] font-bold"
          >
            Go back
          </button>
        </div>
      );
    }

    const mainPhoto =
      space.photos && space.photos.length > 0 ? space.photos[0] : null;

    const handleDeactivate = () => {
      if (space.status === "Listed") return;
      setSpaces((prev) =>
        prev.map((s) => (s.id === space.id ? { ...s, status: "Inactive" } : s)),
      );
      pushNotification(
        "admin",
        "Space Deactivated",
        `"${space.nickname}" status is now set to Inactive.`,
        { tab: "inventory", view: "space-detail", id: space.id },
      );
      setCurrentView("main");
    };

    const handleActivate = () => {
      setSpaces((prev) =>
        prev.map((s) => (s.id === space.id ? { ...s, status: "Unlisted" } : s)),
      );
      pushNotification(
        "admin",
        "Space Activated",
        `"${space.nickname}" status is now set back to Unlisted (Active).`,
        { tab: "inventory", view: "space-detail", id: space.id },
      );
      alert("Space activated successfully!");
      setCurrentView("main");
    };

    const handleDeleteSpace = () => {
      if (space.status === "Listed") return;
      setSpaces((prev) => prev.filter((s) => s.id !== space.id));
      pushNotification(
        "admin",
        "Space Deleted",
        `"${space.nickname}" has been deleted from your inventory.`,
        { tab: "inventory", view: "main" }
      );
      setCurrentView("main");
      setViewParams(null);
    };

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
            Space Details
          </h1>
          <div className="w-8 h-8"></div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 pb-12 space-y-4">
          {/* Photo Carousel or Placeholder */}
          {mainPhoto ? (
            <div className="w-full h-48 rounded-xl overflow-hidden border border-[#e0e3e0] bg-white relative">
              <img
                src={mainPhoto}
                alt={space.nickname}
                className="w-full h-full object-cover"
              />
              {space.photos.length > 1 && (
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  1 of {space.photos.length} photos
                </span>
              )}
            </div>
          ) : (
            <div className="w-full h-48 rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-400 border border-[#e0e3e0]">
              <span className="material-symbols-outlined text-[48px]">
                image
              </span>
              <span className="text-[12px] font-medium mt-1">
                No photos added
              </span>
            </div>
          )}

          {/* Title and Badge row */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-[#e0e3e0] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2">
              <span className="bg-[#f0f3f0] text-[#005344] px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider">
                {getSpaceTypeLabel(space.type)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(space.status)}`}
              >
                {space.status}
              </span>
            </div>
            <h2 className="text-[18px] font-black text-[#181c1b]">
              {space.nickname}
            </h2>
            {space.desc && (
              <p className="text-[13px] text-[#6e7975] mt-1">{space.desc}</p>
            )}
          </div>

          {/* Technical Specs Profile */}
          <div className="bg-white p-4 rounded-xl border border-[#e0e3e0] shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3">
            <h3 className="text-[12px] font-black text-[#005344] uppercase tracking-wider">
              Specifications
            </h3>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px]">
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Dimensions
                </span>
                <span className="font-bold text-[#181c1b]">
                  {space.dimensions.l}×{space.dimensions.w}×{space.dimensions.h}{" "}
                  {space.dimensions.unit}
                </span>
              </div>
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Floor
                </span>
                <span className="font-bold text-[#181c1b]">
                  Floor {space.floor}
                </span>
              </div>
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Daily Footfall
                </span>
                <span className="font-bold text-[#181c1b]">
                  {space.footfall}
                </span>
              </div>
              <div>
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Suitable Products
                </span>
                <span className="font-bold text-[#181c1b]">
                  {space.suitableProducts.join(", ")}
                </span>
              </div>
            </div>

            {space.nearbyContext && (
              <div className="border-t border-[#e0e3e0] pt-2 mt-2 text-[13px]">
                <span className="text-[#6e7975] block text-[10px] font-semibold uppercase tracking-wider">
                  Nearby Context
                </span>
                <span className="text-[#181c1b]">{space.nearbyContext}</span>
              </div>
            )}
          </div>

          {/* Helper Banner advising listing tab management */}
          <div className="bg-[#f0f3f0] border border-[#e0e3e0] rounded-xl p-3.5 text-[12px] text-[#6e7975] font-semibold flex gap-2.5 mt-2">
            <span className="material-symbols-outlined text-[18px] text-[#005344] flex-shrink-0">info</span>
            <span>💡 Manage listings from the Listings tab and requests from the Requests tab</span>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                resetSpaceForm();
                setCurrentView("add-space");
                setViewParams(space.id);
              }}
              className="w-full py-3 bg-[#005344] text-white rounded-xl text-[13px] font-black hover:bg-[#003d32] transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">
                edit
              </span>
              Edit Space
            </button>

            <div className="grid grid-cols-2 gap-3">
              {space.status === "Inactive" ? (
                <button
                  onClick={handleActivate}
                  className="py-3 border border-[#005344] text-[#005344] hover:bg-[#005344]/5 bg-white rounded-xl text-[13px] font-black transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  Activate Space
                </button>
              ) : (
                <button
                  onClick={handleDeactivate}
                  disabled={space.status === "Listed"}
                  className={`py-3 border rounded-xl text-[13px] font-black transition-all text-center flex items-center justify-center gap-1.5 ${
                    space.status === "Listed"
                      ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                      : "border-[#de350b] text-[#de350b] hover:bg-[#de350b]/5 bg-white"
                  }`}
                  title={
                    space.status === "Listed"
                      ? "Cannot deactivate listed space"
                      : ""
                  }
                >
                  <span className="material-symbols-outlined text-[16px]">
                    block
                  </span>
                  Deactivate
                </button>
              )}

              <button
                onClick={handleDeleteSpace}
                disabled={space.status === "Listed"}
                className={`py-3 border rounded-xl text-[13px] font-black transition-all text-center flex items-center justify-center gap-1.5 ${
                  space.status === "Listed"
                    ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
                    : "border-[#de350b] text-[#de350b] hover:bg-red-50 bg-white"
                }`}
                title={
                  space.status === "Listed"
                    ? "Cannot delete listed space"
                    : ""
                }
              >
                <span className="material-symbols-outlined text-[16px]">
                  delete
                </span>
                Delete Space
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
