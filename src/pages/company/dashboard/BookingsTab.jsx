import React, { useState } from "react";
import { useCompany } from "./CompanyContext";
import DisputeTimer from "../../shopkeeper/dashboard/DisputeTimer";

export default function BookingsTab() {
  const {
    requests,
    spaces,
    signContract,
    securePayment,
    raiseDispute,
    cancelBooking,
    currentView,
    setCurrentView,
    viewParams,
    setViewParams,
  } = useCompany();

  const [bookingFilter, setBookingFilter] = useState("All");

  // E-signature simulator state
  const [signatureDrawn, setSignatureDrawn] = useState(false);

  // Dispute form states
  const [disputeReason, setDisputeReason] = useState(
    "Product not placed in agreed space",
  );
  const [disputeDetail, setDisputeDetail] = useState("");

  // Filters logic
  // Confirmed bookings are requests that are Accepted, Active, Disputed, or Completed
  const confirmedBookings = requests.filter(
    (r) =>
      r.status === "Accepted" ||
      r.status === "Active" ||
      r.status === "Disputed" ||
      r.status === "Completed",
  );

  const filteredBookings = confirmedBookings.filter((b) => {
    if (bookingFilter === "All") return true;
    if (bookingFilter === "Confirmed")
      return b.status === "Accepted" && b.contractSignedByBrand;
    if (bookingFilter === "Product Pending") return b.timelineStep === 3; // Contract signed but payment pending, or product placement pending
    if (bookingFilter === "Product Placed")
      return b.timelineStep >= 5 && b.status === "Active";
    if (bookingFilter === "Completed")
      return b.status === "Completed" && !b.cancelled;
    if (bookingFilter === "Disputed") return b.status === "Disputed";
    return true;
  });

  const selectedBooking = requests.find((r) => r.id === viewParams);

  // Helper to resolve space info
  const getSpaceInfo = (spaceId) => {
    return (
      spaces.find((s) => s.id === spaceId) || {
        nickname: `Space #${spaceId}`,
        shop: "Retail Outlet",
        area: "Unknown Area",
        type: "shelf",
        price: 30000,
      }
    );
  };

  const handleOpenDetail = (id) => {
    setCurrentView("booking-detail");
    setViewParams(id);
  };

  const handleBackToList = () => {
    setCurrentView("main");
    setViewParams(null);
  };

  const handleSignContractSubmit = () => {
    if (!signatureDrawn) {
      alert("Please sign the contract by tapping the drawing area.");
      return;
    }
    signContract(selectedBooking.id);
    alert("Contract signed successfully by Nestlé!");
    setCurrentView("booking-detail");
  };

  const handleSecurePaymentSubmit = () => {
    securePayment(selectedBooking.id);
    alert(
      "Payment of PKR " +
        selectedBooking.offeredPrice.toLocaleString() +
        " secured in escrow! Campaign is now Active.",
    );
  };

  const handleRaiseDisputeSubmit = (e) => {
    e.preventDefault();
    const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    raiseDispute(selectedBooking.id, disputeReason, disputeDetail);
    // Add mock expiresAt directly on request's dispute object
    selectedBooking.dispute = {
      reason: disputeReason,
      detail: disputeDetail,
      expiresAt: expiresAt,
      time: "Just now",
      status: "Open",
    };
    alert("Dispute raised. Shopkeeper has 24 hours to address this concern.");
    setCurrentView("booking-detail");
  };

  const handleCancelBookingClick = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking? A fee of 1 month rent may apply under the cancellation policy.",
    );
    if (confirmCancel) {
      cancelBooking(selectedBooking.id);
      alert(
        "Booking cancelled. PKR " +
          (
            selectedBooking.offeredPrice - selectedBooking.pricePerMonth
          ).toLocaleString() +
          " refunded to your bank method.",
      );
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      Pending: "bg-[#fff3e0] text-[#ab6b00]",
      Countered: "bg-blue-50 text-blue-700 border border-blue-200",
      Accepted: "bg-green-50 text-green-700 border border-green-200",
      Rejected: "bg-red-50 text-red-700 border border-red-200",
      Active: "bg-[#ebfbf3] text-[#00875a]",
      Completed: "bg-gray-100 text-gray-600",
      Disputed: "bg-red-50 text-red-700 border border-red-200",
    };
    return classes[status] || "bg-gray-100 text-gray-600";
  };

  const getSpaceTypeLabel = (type) => {
    const labels = {
      shelf: "Shelf",
      end_cap: "End-Cap",
      window_display: "Window Display",
      floor_stand: "Floor Stand",
      checkout_counter: "Checkout Counter",
      entrance_display: "Entrance Display",
      promotional_aisle: "Promotional Aisle",
    };
    return labels[type] || "Retail Space";
  };

  // RENDER 1: Booking Detail Sub-View
  if (currentView === "booking-detail" && selectedBooking) {
    const space = getSpaceInfo(selectedBooking.spaceId);

    // Timeline steps: Requested(0) -> Accepted(1) -> Contract Signed(2) -> Payment Made(3) -> Product Pending(4) -> Product Placed(5) -> Active(6) -> Completed(7)
    const currentStep = selectedBooking.timelineStep;
    const steps = [
      "Req",
      "Acc",
      "Signed",
      "Paid",
      "Pending",
      "Placed",
      "Active",
      "Done",
    ];

    return (
      <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
        {/* TopAppBar */}
        <header className="bg-white sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
          <div className="flex items-center justify-between px-4 h-16 w-full mx-auto max-w-[390px]">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBackToList}
                className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full"
              >
                arrow_back
              </button>
              <h1 className="text-[16px] font-black text-[#005344]">
                Booking Management
              </h1>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getStatusBadgeClass(selectedBooking.status)}`}
            >
              {selectedBooking.status}
            </span>
          </div>
        </header>

        <main className="flex-grow pt-4 pb-28 px-4 w-full mx-auto max-w-[390px] space-y-5 overflow-y-auto">
          {/* Stepper Timeline Visual */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-3">
            <h3 className="text-[10px] font-bold text-[#6e7975] uppercase tracking-wider">
              Booking Progress
            </h3>
            <div className="flex items-center justify-between relative px-1">
              <div className="absolute top-[13px] left-4 right-4 h-[2px] bg-[#bec9c4] -z-0"></div>
              {steps.map((label, idx) => {
                const isPast = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={idx} className="flex flex-col items-center z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${
                        isPast
                          ? "bg-[#005344] text-white"
                          : isCurrent
                            ? "bg-[#fe6a34] text-white animate-pulse"
                            : "bg-white border border-[#bec9c4] text-[#6e7975]"
                      }`}
                    >
                      {isPast ? "✓" : idx + 1}
                    </div>
                    <span className="text-[8px] font-bold text-[#6e7975] mt-1">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Space Details Card */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm flex gap-3 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-50 border">
              <img
                src={space.photos ? space.photos[0] : ""}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-grow text-xs space-y-0.5">
              <span className="text-[9px] bg-[#fe6a34]/10 text-[#fe6a34] font-black px-1.5 py-0.2 rounded uppercase">
                {getSpaceTypeLabel(space.type)}
              </span>
              <h4 className="font-black text-[#181c1b] truncate">
                {space.shop}
              </h4>
              <p className="font-bold text-[#6e7975]">{space.nickname}</p>
              <p className="text-[10px] text-[#6e7975]">
                {space.area}, {space.city}
              </p>
            </div>
          </div>

          {/* Dispute Active Countdown Timer */}
          {selectedBooking.status === "Disputed" && selectedBooking.dispute && (
            <div className="space-y-2">
              <DisputeTimer
                expiresAt={
                  selectedBooking.dispute.expiresAt ||
                  new Date(Date.now() + 24 * 3600 * 1000).toISOString()
                }
              />
              <div className="bg-white border border-red-200 p-3 rounded-xl text-xs space-y-1">
                <p className="font-black text-[#ba1a1a]">
                  Your Disputed Reason:
                </p>
                <p className="text-[#3e4945] font-semibold">
                  {selectedBooking.dispute.reason}
                </p>
                <p className="italic text-[#6e7975] mt-1">
                  "{selectedBooking.dispute.detail}"
                </p>
              </div>
            </div>
          )}

          {/* Financial Breakdown escrow release table */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-[#005344] border-b border-[#ebefec] pb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                account_balance_wallet
              </span>
              Payment & Escrow Releases
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#f7faf7] p-2.5 rounded-lg border border-[#e0e3e0]">
                <p className="font-bold text-[#6e7975] text-[10px]">
                  Total Paid upfront
                </p>
                <p className="font-black text-[#005344] text-[14px] mt-0.5">
                  PKR {selectedBooking.offeredPrice.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#f7faf7] p-2.5 rounded-lg border border-[#e0e3e0]">
                <p className="font-bold text-[#6e7975] text-[10px]">
                  Escrow Status
                </p>
                <p className="font-black text-[#fe6a34] text-[14px] mt-0.5">
                  {selectedBooking.timelineStep >= 4
                    ? "PKR " +
                      (
                        selectedBooking.offeredPrice -
                        selectedBooking.pricePerMonth
                      ).toLocaleString()
                    : "PKR 0"}
                </p>
              </div>
            </div>

            {/* Monthly Escrow Table */}
            {selectedBooking.timelineStep >= 4 && (
              <div className="border border-[#e0e3e0] rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#ebefec] text-[#3e4945] font-black text-[10px] uppercase border-b border-[#bec9c4]">
                      <th className="p-2.5">Month</th>
                      <th className="p-2.5">Gross Rent</th>
                      <th className="p-2.5 text-right">Escrow Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ebefec]">
                    <tr className="hover:bg-[#f7faf7]">
                      <td className="p-2.5 font-bold">Month 1 (June)</td>
                      <td className="p-2.5 font-black">
                        PKR {selectedBooking.pricePerMonth.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right text-[#00875a] font-bold flex items-center justify-end gap-1.5 mt-1">
                        <span className="material-symbols-outlined text-[15px] filled">
                          check_circle
                        </span>
                        Released
                      </td>
                    </tr>
                    <tr className="hover:bg-[#f7faf7]">
                      <td className="p-2.5 font-bold">Month 2 (July)</td>
                      <td className="p-2.5 font-black">
                        PKR {selectedBooking.pricePerMonth.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right text-blue-700 font-bold flex items-center justify-end gap-1.5 mt-1">
                        <span className="material-symbols-outlined text-[15px] filled">
                          lock
                        </span>
                        In Escrow
                      </td>
                    </tr>
                    <tr className="hover:bg-[#f7faf7]">
                      <td className="p-2.5 font-bold">Month 3 (August)</td>
                      <td className="p-2.5 font-black">
                        PKR {selectedBooking.pricePerMonth.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right text-blue-700 font-bold flex items-center justify-end gap-1.5 mt-1">
                        <span className="material-symbols-outlined text-[15px] filled">
                          lock
                        </span>
                        In Escrow
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action-Needed CTAs */}
          {selectedBooking.status === "Accepted" &&
            !selectedBooking.contractSignedByBrand && (
              <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm text-center space-y-3">
                <p className="text-xs font-semibold text-[#3e4945]">
                  Please review and E-sign the retail space agreement to secure
                  this booking.
                </p>
                <button
                  onClick={() => setCurrentView("contract")}
                  className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3.5 rounded-xl text-xs shadow-md active:scale-95 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    draw
                  </span>
                  Review & Sign Contract
                </button>
              </div>
            )}

          {selectedBooking.status === "Accepted" &&
            selectedBooking.contractSignedByBrand &&
            selectedBooking.timelineStep < 4 && (
              <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm text-center space-y-3">
                <p className="text-xs font-semibold text-[#3e4945]">
                  Upfront payment required to secure placement in escrow.
                </p>
                <button
                  onClick={handleSecurePaymentSubmit}
                  className="w-full bg-[#fe6a34] hover:bg-[#e05620] text-white font-bold py-3.5 rounded-xl text-xs shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    payments
                  </span>
                  Secure Upfront Payment
                </button>
              </div>
            )}

          {/* Proof Photos section */}
          {selectedBooking.timelineStep >= 4 && (
            <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase text-[#005344] border-b border-[#ebefec] pb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  photo_camera
                </span>
                Placement Proof Verification
              </h3>

              {selectedBooking.proofs.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {selectedBooking.proofs.map((url, idx) => (
                      <div
                        key={idx}
                        className="h-28 rounded-lg overflow-hidden border border-[#bec9c4] relative bg-gray-50"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#f7faf7] p-2 rounded-lg border text-[9px] text-[#6e7975] flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">
                      location_on
                    </span>
                    <span>
                      GPS Auto-verified: Johar Town outlet, Lahore. Timestamped:
                      Today 10:45 AM
                    </span>
                  </div>

                  {selectedBooking.status !== "Disputed" && (
                    <button
                      onClick={() => setCurrentView("dispute-form")}
                      className="w-full py-2.5 border-2 border-red-500 text-red-500 font-bold rounded-xl text-xs shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        report
                      </span>
                      Raise Placement Dispute
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-6 border border-dashed border-[#bec9c4] rounded-lg text-center bg-[#f7faf7]">
                  <span className="material-symbols-outlined text-[#6e7975] text-[28px] mb-1 animate-pulse">
                    hourglass_empty
                  </span>
                  <p className="text-xs font-bold text-[#6e7975]">
                    Awaiting product placement proof upload from shopkeeper.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cancellation and Contract Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView("contract")}
              className="flex-1 py-3 border border-[#bec9c4] text-[#3e4945] rounded-xl text-xs font-bold shadow-sm"
            >
              View Contract
            </button>
            {selectedBooking.timelineStep < 4 && (
              <button
                onClick={handleCancelBookingClick}
                className="flex-1 py-3 border border-red-500 text-red-500 rounded-xl text-xs font-bold shadow-sm hover:bg-red-50"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // RENDER 2: Contract Viewer / E-Sign Component
  if (currentView === "contract" && selectedBooking) {
    const space = getSpaceInfo(selectedBooking.spaceId);
    return (
      <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
        {/* TopAppBar */}
        <header className="bg-white sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
          <div className="flex items-center justify-between px-4 h-16 w-full mx-auto max-w-[390px]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView("booking-detail")}
                className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full"
              >
                arrow_back
              </button>
              <h1 className="text-[16px] font-black text-[#005344]">
                E-Sign Contract
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-grow pt-4 pb-28 px-4 w-full mx-auto max-w-[390px] space-y-4 overflow-y-auto">
          {/* Key terms */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm text-xs space-y-2">
            <h3 className="font-black text-[#005344] uppercase tracking-wider border-b border-[#ebefec] pb-1.5">
              Agreement Key Terms
            </h3>
            <p>
              • <strong>Brand / Signatory</strong>: Nestlé Pakistan (MILO
              Product)
            </p>
            <p>
              • <strong>Retail Partner</strong>: {space.shop} — {space.nickname}
            </p>
            <p>
              • <strong>Booking Duration</strong>:{" "}
              {selectedBooking.durationLabel}
            </p>
            <p>
              • <strong>Payment Escrow Value</strong>: PKR{" "}
              {selectedBooking.offeredPrice.toLocaleString()} Upfront
            </p>
          </div>

          {/* Contract Content */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm text-[11px] leading-relaxed text-[#3e4945] h-60 overflow-y-auto space-y-3.5 border-t-2 border-t-[#005344]">
            <p className="font-black text-center text-xs text-[#181c1b] uppercase">
              RETAIL SPACE PLACEMENT AGREEMENT
            </p>
            <p>
              This agreement is entered securely on Spacelo marketplace platform
              between the Brand (Nestlé Pakistan) and the retail partner (
              {space.shop}) regarding placement of commercial materials.
            </p>
            <p className="font-bold text-[#181c1b]">1. Placement Space</p>
            <p>
              The partner agrees to reserve {space.nickname} exclusively for the
              brand product. Space dimensions are {space.dimensions.l}x
              {space.dimensions.w}x{space.dimensions.h} {space.dimensions.unit}.
            </p>
            <p className="font-bold text-[#181c1b]">
              2. Upfront Payment & Escrow Release
            </p>
            <p>
              Brand will deposit upfront payment. The platform commission is
              15%. Funds are secured in Spacelo Escrow and released monthly to
              the retail partner after proof verification.
            </p>
            <p className="font-bold text-[#181c1b]">
              3. Cancellation & Refunds
            </p>
            <p>
              Cancellations 5 days receive a full refund. Less than 5 days
              triggers 1 month rent deduction fee. Pro-rated refund applies
              after campaign launch.
            </p>
          </div>

          {/* Signature component */}
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-3 text-center">
            <p className="text-xs font-bold text-[#3e4945]">
              Nestlé Representative E-Signature
            </p>

            {signatureDrawn ? (
              <div className="border border-green-200 bg-green-50/50 rounded-lg p-6 flex flex-col items-center justify-center font-bold text-[#005344] text-xs shadow-inner">
                <span className="material-symbols-outlined text-[28px] mb-1">
                  draw
                </span>
                <span>Nestlé E-Signed ✓</span>
                <button
                  type="button"
                  onClick={() => setSignatureDrawn(false)}
                  className="text-red-500 mt-2 font-bold hover:underline"
                >
                  Clear Signature
                </button>
              </div>
            ) : (
              <div
                onClick={() => setSignatureDrawn(true)}
                className="border-2 border-dashed border-[#bec9c4] hover:border-[#005344] rounded-lg p-8 flex flex-col items-center justify-center text-[#6e7975] cursor-pointer bg-[#f7faf7] transition-all"
              >
                <span className="material-symbols-outlined text-[28px] mb-1">
                  draw
                </span>
                <span className="text-xs font-black">
                  Tap here to E-Sign Agreement
                </span>
              </div>
            )}

            {selectedBooking.contractSignedByBrand ? (
              <div className="p-3 bg-green-50 text-green-700 text-xs font-black rounded-lg border border-green-200">
                You Signed Contract on Today. Awaiting placement setup.
              </div>
            ) : (
              <button
                onClick={handleSignContractSubmit}
                className="w-full bg-[#005344] hover:bg-[#003d32] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all mt-2"
              >
                Confirm Signature & Save
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // RENDER 3: Dispute Submission Form
  if (currentView === "dispute-form" && selectedBooking) {
    const space = getSpaceInfo(selectedBooking.spaceId);
    return (
      <div className="bg-[#f7faf7] min-h-full flex flex-col font-manrope">
        {/* TopAppBar */}
        <header className="bg-white sticky top-0 shadow-sm z-40 w-full border-b border-[#e0e3e0]">
          <div className="flex items-center justify-between px-4 h-16 w-full mx-auto max-w-[390px]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView("booking-detail")}
                className="material-symbols-outlined text-[#005344] cursor-pointer hover:bg-[#e5e9e6] transition-colors p-1 rounded-full"
              >
                arrow_back
              </button>
              <h1 className="text-[17px] font-black text-[#005344]">
                Raise Booking Dispute
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-grow pt-4 pb-28 px-4 w-full mx-auto max-w-[390px] space-y-4 overflow-y-auto">
          <div className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm space-y-4">
            <div className="border-b border-[#ebefec] pb-2 text-xs">
              <p className="font-bold text-[#6e7975]">
                Dispute regarding space:
              </p>
              <p className="font-black text-[#181c1b] text-sm mt-0.5">
                {space.shop}
              </p>
              <p className="text-[#6e7975] mt-0.5">{space.nickname}</p>
            </div>

            <form onSubmit={handleRaiseDisputeSubmit} className="space-y-4">
              {/* Reason dropdown */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-[#3e4945]">
                  Dispute Reason
                </label>
                <select
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full h-11 px-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-1 focus:ring-[#005344] outline-none"
                >
                  <option>Product not placed in agreed space</option>
                  <option>Wrong placement / visibility issue</option>
                  <option>Product damaged during placement</option>
                  <option>Proof photo does not match actual placement</option>
                  <option>Other concerns</option>
                </select>
              </div>

              {/* Detail textarea */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-[#3e4945]">
                  Detailed explanation
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide precise details of your concern. This will be shared with the shopkeeper and admin."
                  value={disputeDetail}
                  onChange={(e) => setDisputeDetail(e.target.value)}
                  className="w-full p-3 bg-[#F3F4F6] border border-[#bec9c4] rounded-lg focus:ring-1 focus:ring-[#005344] outline-none resize-none"
                />
              </div>

              {/* Reference proof preview */}
              {selectedBooking.proofs.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-[#3e4945]">
                    Reference shopkeeper proof photo:
                  </label>
                  <img
                    src={selectedBooking.proofs[0]}
                    alt=""
                    className="w-24 h-24 rounded-lg object-cover border"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#ba1a1a] hover:bg-[#a01616] text-white font-bold py-3 rounded-xl text-xs shadow-md"
              >
                Submit Dispute proposal
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // RENDER 4: Main Bookings Lists
  return (
    <div className="bg-[#f7faf7] h-full flex flex-col font-manrope overflow-hidden">
      {/* Filters header */}
      <section className="bg-white border-b border-[#e0e3e0] shrink-0 p-3">
        <h2 className="text-[18px] font-black text-[#005344] tracking-tight">
          Active Bookings
        </h2>

        {/* Quick filter scroll bar */}
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-none snap-x text-[10px] mt-1.5">
          {[
            "All",
            "Confirmed",
            "Product Pending",
            "Product Placed",
            "Completed",
            "Disputed",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => setBookingFilter(filter)}
              className={`px-3 py-1 rounded-full font-black border shrink-0 snap-start transition-all ${bookingFilter === filter ? "bg-[#005344] border-[#005344] text-white" : "bg-[#ebefec] border-transparent text-[#3e4945]"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Bookings list container */}
      <div className="flex-grow overflow-y-auto p-4 pb-20 space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-[#e0e3e0] rounded-xl p-8 text-center flex flex-col items-center justify-center mt-6">
            <span className="material-symbols-outlined text-[#bec9c4] text-[40px] mb-1">
              bookmark_border
            </span>
            <p className="text-xs font-bold text-[#6e7975]">
              No bookings found for this filter.
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const space = getSpaceInfo(b.spaceId);
            return (
              <div
                key={b.id}
                onClick={() => handleOpenDetail(b.id)}
                className="bg-white border border-[#e0e3e0] p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative"
              >
                {b.isAdvance && (
                  <span className="absolute top-2 right-2 text-[8px] bg-[#0d9488]/10 text-[#0d9488] font-black px-1.5 py-0.5 rounded uppercase">
                    Advance Booking
                  </span>
                )}

                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={space.photos ? space.photos[0] : ""}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-grow text-xs space-y-0.5">
                    <h4 className="font-black text-[#181c1b] truncate pr-16">
                      {space.shop}
                    </h4>
                    <p className="font-bold text-[#6e7975]">{space.nickname}</p>
                    <p className="text-[10px] text-[#6e7975] font-semibold">
                      Product: {b.productName}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#ebefec] flex items-center justify-between text-[10px]">
                  <span className="text-[#3e4945] font-semibold">
                    {b.durationLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-[#005344]">
                      PKR {b.pricePerMonth.toLocaleString()}/mo
                    </span>
                    <span
                      className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${getStatusBadgeClass(b.status)}`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
