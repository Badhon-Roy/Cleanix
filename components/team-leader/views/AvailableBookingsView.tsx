"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapPin, Clock, Send, Loader2, FolderOpen } from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  fetchAvailableBookingsAPI,
  requestBookingForTeamAPI,
} from "@/services/teamService";

interface Props {
  teamSlug: string;
}

export default function AvailableBookingsView({ teamSlug }: Props) {
  const [availableBookings, setAvailableBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  const loadAvailableBookings = useCallback(
    async (showLoadingSpinner = false) => {
      try {
        if (showLoadingSpinner) {
          setIsLoading(true);
        }
        const data = await fetchAvailableBookingsAPI();
        if (Array.isArray(data)) {
          setAvailableBookings(data);
        }
      } catch (err) {
        console.error("Failed to load available unassigned bookings:", err);
        if (showLoadingSpinner) {
          toast.error("Failed to load available customer bookings");
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadAvailableBookings(availableBookings.length === 0);

    const socketUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("⚡ AvailableBookings Socket connected:", socket.id);
    });

    const handleSilentRefresh = () => {
      loadAvailableBookings(false);
    };

    socket.on("booking_updated", handleSilentRefresh);
    socket.on("booking_created", handleSilentRefresh);
    socket.on("team_updated", handleSilentRefresh);
    socket.on("cleaner_updated", handleSilentRefresh);
    socket.on("leader_request_updated", handleSilentRefresh);

    return () => {
      socket.off("booking_updated", handleSilentRefresh);
      socket.off("booking_created", handleSilentRefresh);
      socket.off("team_updated", handleSilentRefresh);
      socket.off("cleaner_updated", handleSilentRefresh);
      socket.off("leader_request_updated", handleSilentRefresh);
      socket.disconnect();
    };
  }, [loadAvailableBookings]);

  const handleRequestBooking = async (bookingId: string) => {
    setRequestingId(bookingId);
    try {
      const res = await requestBookingForTeamAPI(bookingId, teamSlug);
      if (res?.success) {
        toast.success("Team request submitted to Admin successfully!");
        await loadAvailableBookings(false);
      } else {
        toast.error(res?.message || "Failed to submit request to admin");
      }
    } catch (err: any) {
      console.error("Request booking error:", err);
      toast.error(err?.message || "An error occurred while requesting booking");
    } finally {
      setRequestingId(null);
    }
  };

  const checkHasRequested = (booking: any) => {
    if (!Array.isArray(booking.teamRequests)) return false;
    const cleanSlug = (teamSlug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    return booking.teamRequests.some((r: any) => {
      const teamObj = r.team;
      if (!teamObj) return false;
      if (r.status !== "PENDING") return false;

      const tName = (teamObj.teamName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const tCode = (teamObj.teamCode || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const tId = (teamObj._id || "").toString();

      return (
        tId === teamSlug ||
        tName.includes(cleanSlug) ||
        cleanSlug.includes(tName) ||
        tCode.includes(cleanSlug)
      );
    });
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-[#007eff] border border-blue-200">
              UNASSIGNED BOOKING MARKETPLACE
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Team Request Flow Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Request Available Customer Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            যেসব কাস্টমার বুকিং এখনো কোনো টিমে অ্যাসাইন হয়নি, সেগুলো নিচে প্রদর্শিত হচ্ছে। টিমের পক্ষ থেকে কাজের আবেদন পাঠান, অ্যাডমিন অনুমোদন দিলে কাজটি আপনার টিমে যুক্ত হয়ে যাবে।
          </p>
        </div>
      </div>

      {/* Main Content List / Loading / Empty */}
      {isLoading && availableBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#007eff] animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-600">Loading unassigned customer bookings...</p>
        </div>
      ) : availableBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#007eff] flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">No Unassigned Customer Bookings Available</h3>
          <p className="text-xs text-slate-500 max-w-md mt-1 font-medium">
            বর্তমানে সমস্ত কাস্টমার বুকিং বিভিন্ন টিমে অ্যাসাইন করা রয়েছে। নতুন বুকিং আসার সাথে সাথে এখানে লাইভ আপডেট দেখতে পাবেন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableBookings.map((b) => {
            const bookingId = b._id || b.id;
            const bookingRef = b.bookingRef || `#CLN-${bookingId.slice(-4)}`;
            const serviceTitle = b.serviceType?.title || "Standard Cleaning Service";
            const address = b.address || b.locationId?.address || "Dhaka Metropolitan Area";
            const timeSlot = b.timeSlot || "Scheduled Slot";
            const scheduledDate = b.scheduledDate || "Upcoming Date";
            const totalAmount = Number(b.totalAmount) || 0;
            const leaderCommissionEst = Math.round(totalAmount * 0.1);
            const isRequestedByMe = checkHasRequested(b);
            const isSubmittingThis = requestingId === bookingId;

            return (
              <div
                key={bookingId}
                className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-black text-[#007eff] uppercase tracking-wider">
                      {bookingRef}
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-[#007eff]">
                      Open Unassigned
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{serviceTitle}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Customer: <span className="font-bold text-slate-800">{b.user?.name || "Registered Client"}</span>
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-slate-800">{address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span>
                        {scheduledDate} • {timeSlot}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px] uppercase">
                        Leader 10% Est. Cut
                      </span>
                      <span className="text-emerald-700 font-black text-base">
                        ৳{leaderCommissionEst}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 font-bold block text-[10px] uppercase">
                        Total Booking Value
                      </span>
                      <span className="text-slate-900 font-extrabold">৳{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  {isRequestedByMe ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-2xl bg-amber-50 text-amber-800 font-extrabold text-xs border border-amber-200 flex items-center justify-center gap-2 cursor-not-allowed opacity-90"
                    >
                      <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                      <span>Request Pending Admin Approval</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmittingThis}
                      onClick={() => handleRequestBooking(bookingId)}
                      className="w-full py-3 rounded-2xl bg-[#007eff] hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50"
                    >
                      {isSubmittingThis ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Team Request to Admin</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
