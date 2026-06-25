import React from "react";
import { useShopkeeper } from "./ShopkeeperContext";
import HomeTab from "./HomeTab";
import InventoryTab from "./InventoryTab";
import ListingsTab from "./ListingsTab";
import RequestsTab from "./RequestsTab";
import EarningsTab from "./EarningsTab";
import ProfileTab from "./ProfileTab";
import DisputesView from "./DisputesView";
import NotificationsCenter from "./NotificationsCenter";

export default function DashboardShell({ handleLogout }) {
  const {
    activeTab,
    currentView,
    notifications,
    disputes,
    pendingRequestsTotal,
    navigateToView,
  } = useShopkeeper();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const openDisputes = disputes.filter((d) => d.status === "Open").length;

  const renderContent = () => {
    if (activeTab === "profile") {
      if (currentView === "notifications") return <NotificationsCenter />;
      return <ProfileTab handleLogout={handleLogout} />;
    }
    if (activeTab === "disputes") return <DisputesView />;
    switch (activeTab) {
      case "dashboard":
        return <HomeTab />;
      case "inventory":
        return <InventoryTab />;
      case "listings":
        return <ListingsTab />;
      case "requests":
        return <RequestsTab />;
      case "earnings":
        return <EarningsTab />;
      default:
        return <HomeTab />;
    }
  };

  const TABS = [
    { id: "dashboard", label: "Home", icon: "dashboard" },
    { id: "inventory", label: "Inventory", icon: "grid_view" },
    { id: "listings", label: "Listings", icon: "sell" },
    { id: "requests", label: "Requests", icon: "inbox" },
    { id: "earnings", label: "Earnings", icon: "payments" },
  ];

  const showHeaderAndNav =
    (currentView === "main" || currentView === "advance") &&
    activeTab !== "disputes";
  const isScrollableTab = activeTab !== "inventory" && activeTab !== "listings";

  return (
    <div className="bg-[#f7faf7] text-[#181c1b] h-full flex flex-col font-manrope relative select-none">
      {/* ── TOP APP BAR ──────────────────────────────────────────────────── */}
      {showHeaderAndNav && (
        <header className="bg-white border-b border-[#e0e3e0] sticky top-0 w-full z-40 px-4 h-14 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <span
            className="text-[22px] font-black text-[#005344] italic cursor-pointer tracking-tight"
            onClick={() => navigateToView("dashboard", "main")}
          >
            Spacelo
          </span>

          <div className="flex items-center gap-1.5">
            {/* Dispute alert dot */}
            {openDisputes > 0 && (
              <button
                onClick={() => navigateToView("disputes", "main")}
                className="p-1.5 rounded-full bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/20 transition-colors relative"
              >
                <span
                  className="material-symbols-outlined text-[20px] text-[#ba1a1a]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  report_problem
                </span>
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#ba1a1a] rounded-full" />
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => navigateToView("profile", "notifications")}
              className="p-1.5 rounded-full hover:bg-[#ebefec] transition-colors relative"
            >
              <span className="material-symbols-outlined text-[24px] text-[#3e4945]">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-0.5 bg-[#fe6a34] text-white text-[8px] font-black rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => navigateToView("profile", "main")}
              className="w-8 h-8 rounded-full bg-[#005344] text-[#96ebd5] flex items-center justify-center font-black text-[13px] hover:opacity-90 transition-opacity ring-2 ring-transparent hover:ring-[#005344]/30"
            >
              S
            </button>
          </div>
        </header>
      )}

      {/* ── MAIN SCROLL AREA ─────────────────────────────────────────────── */}
      <div
        className={`flex-grow ${isScrollableTab ? "overflow-y-auto overscroll-none pb-20" : "overflow-hidden flex flex-col"} relative`}
      >
        {renderContent()}
      </div>

      {/* ── BOTTOM TAB BAR ───────────────────────────────────────────────── */}
      {showHeaderAndNav && (
        <nav className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-[#bec9c4] shadow-[0_-2px_20px_rgba(0,0,0,0.07)] h-16 flex items-stretch max-w-[390px]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const badge = tab.id === "requests" ? pendingRequestsTotal : 0;
            return (
              <button
                key={tab.id}
                onClick={() => navigateToView(tab.id, "main")}
                className="flex-grow flex flex-col items-center justify-center gap-0.5 relative transition-colors"
                style={{ color: isActive ? "#005344" : "#6e7975" }}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#005344] rounded-b-full" />
                )}

                {/* Badge */}
                {badge > 0 && (
                  <span className="absolute top-1.5 right-3.5 min-w-[15px] h-[15px] px-0.5 bg-[#fe6a34] text-white text-[8px] font-black rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}

                <span
                  className="material-symbols-outlined transition-all"
                  style={{
                    fontSize: "22px",
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {tab.icon}
                </span>
                <span className="text-[9px] font-black tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
