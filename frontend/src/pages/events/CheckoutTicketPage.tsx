import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Ticket, QrCode, CreditCard, ShieldCheck, CheckCircle2, 
  ArrowLeft, Download, Sparkles, User, Calendar, MapPin 
} from "lucide-react";
import { getDemoUser } from "@/lib/auth-demo";
import { getStoredEvents, saveStoredEvents, PublicEvent } from "@/lib/events-store";

export default function CheckoutTicketPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<PublicEvent | null>(null);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketIssued, setTicketIssued] = useState<any | null>(null);

  useEffect(() => {
    const events = getStoredEvents();
    const ev = events.find((e) => e.id === id) || events[0];
    setCurrentEvent(ev || null);

    getDemoUser().then((u) => {
      if (u) {
        setCurrentUser(u);
        setAttendeeName(u.name);
        setAttendeeEmail(u.email);
        setIsMember(u.role === "MEMBER" || u.role === "PRESIDENT" || u.role === "TREASURER" || u.role === "VOLUNTEER");
      } else {
        setAttendeeName("Guest Attendee");
        setAttendeeEmail("guest@skyline.edu");
      }
    });
  }, [id]);

  const eventTitle = currentEvent?.title || "Skyline Campus Event";
  const standardPrice = currentEvent?.guestPrice !== undefined ? currentEvent.guestPrice : (currentEvent?.price ?? 250);
  const mPrice = currentEvent?.memberPrice !== undefined ? currentEvent.memberPrice : 0;
  const finalPrice = isMember ? mPrice : standardPrice;
  const memberDiscount = isMember ? Math.max(0, standardPrice - mPrice) : 0;

  const handlePayAndIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      // Increment booked seats in stored events
      const events = getStoredEvents();
      const updatedEvents = events.map((ev) => {
        if (ev.id === id) {
          const cap = ev.capacity || ev.totalSeats || 100;
          const currentBooked = ev.tickets || ev.seatsSold || 0;
          return {
            ...ev,
            tickets: Math.min(cap, currentBooked + 1),
            seatsSold: Math.min(cap, currentBooked + 1),
          };
        }
        return ev;
      });
      saveStoredEvents(updatedEvents);

      const generatedTicket = {
        id: `TCK-${Math.floor(100000 + Math.random() * 900000)}`,
        eventId: id || "EVT-001",
        eventTitle,
        venue: currentEvent?.venue || "Central Campus Auditorium",
        date: currentEvent?.date || "October 24, 2026",
        attendee: attendeeName,
        email: attendeeEmail,
        status: "VALID",
        tier: isMember ? "Verified Member" : "Standard Guest",
        pricePaid: finalPrice,
        issuedAt: new Date().toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" }),
        qrToken: `SKYLINE-PASS-${id}-${Date.now()}`
      };
      try {
        const prev = JSON.parse(localStorage.getItem("user_tickets") || "[]");
        localStorage.setItem("user_tickets", JSON.stringify([generatedTicket, ...prev]));
      } catch {}
      setTicketIssued(generatedTicket);
      setIsProcessing(false);
    }, 1000);
  };


  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#4A1942] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Link>

      {!ticketIssued ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-[#017E84] uppercase tracking-wider">Fast Checkout</span>
            <h1 className="text-2xl font-black text-gray-900 mt-1">Book Your Event Pass</h1>
            <p className="text-xs text-gray-500 mt-0.5">{eventTitle} (ID: {id})</p>
          </div>

          {/* Member Banner */}
          {isMember ? (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-[#017E84]" />
                Member Privilege Detected! {memberDiscount > 0 ? `₹${memberDiscount} Discount Applied` : "Free Pass"}
              </span>
              <span className="px-2 py-0.5 rounded bg-teal-200 text-teal-900 font-bold uppercase text-[10px]">Active Member</span>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
              <span>Non-member rate applied.</span>
              <Link to="/signup" className="font-bold underline text-[#4A1942]">Join club for free tickets &rarr;</Link>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handlePayAndIssue} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Attendee Name</label>
              <input
                type="text"
                required
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#017E84]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email for QR Badge Delivery</label>
              <input
                type="email"
                required
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#017E84]"
              />
            </div>

            {/* Price Summary */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Standard Ticket:</span>
                <span className="font-mono">₹{standardPrice}</span>
              </div>
              {memberDiscount > 0 && (
                <div className="flex justify-between text-[#017E84] font-bold">
                  <span>Member Benefit:</span>
                  <span className="font-mono">-₹{memberDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-900 font-black text-sm pt-2 border-t border-gray-200">
                <span>Total Amount Due:</span>
                <span className="font-mono text-base text-[#4A1942]">
                  {finalPrice === 0 ? "FREE" : `₹${finalPrice}`}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Razorpay Settlement...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>{finalPrice === 0 ? "Generate Free Pass" : `Pay ₹${finalPrice} via Razorpay`}</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Issued Ticket with QR Code */
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Payment Verified</span>
            <h2 className="text-xl font-black text-gray-900 mt-0.5">Ticket Confirmed!</h2>
            <p className="text-xs text-gray-500">Present this QR code at the gate check-in line.</p>
          </div>

          {/* Ticket Card Component */}
          <div className="max-w-md mx-auto rounded-2xl border-2 border-dashed border-[#4A1942]/30 bg-[#FAF7F9] p-6 text-left space-y-4 shadow-inner">
            <div className="flex justify-between items-start border-b border-gray-200 pb-3">
              <div>
                <span className="font-black text-xs text-[#4A1942] uppercase tracking-wide">Skyline SSA Pass</span>
                <h4 className="font-bold text-sm text-gray-900">{ticketIssued.eventTitle}</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                {ticketIssued.status}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="space-y-1 text-xs">
                <div><span className="text-gray-400">Attendee:</span> <strong>{ticketIssued.attendee}</strong></div>
                <div><span className="text-gray-400">Pass Code:</span> <code className="font-mono text-purple-900">{ticketIssued.id}</code></div>
                <div><span className="text-gray-400">Date:</span> <span>{ticketIssued.date}</span></div>
                <div><span className="text-gray-400">Paid:</span> <span className="font-mono">₹{ticketIssued.pricePaid}</span></div>
              </div>

              {/* QR Mock */}
              <div className="w-24 h-24 bg-white p-2 rounded-xl border border-gray-200 flex flex-col items-center justify-center shadow-xs">
                <QrCode className="w-16 h-16 text-gray-800" />
                <span className="text-[8px] font-mono text-gray-400 mt-0.5">Gate Token</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/me/tickets"
              className="px-6 py-2.5 rounded-xl bg-[#4A1942] text-white font-bold text-xs hover:bg-[#3a1232] transition-colors"
            >
              View In My Tickets
            </Link>
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download / Print
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
