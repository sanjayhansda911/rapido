import { useEffect, useState } from 'react';
import type { GroupTrip, Ticket } from '../types/metro';
import { Header } from '../components/Header';
import { FooterDisclaimer } from '../components/FooterDisclaimer';
import { WhatsAppShareModal } from '../components/WhatsAppShareModal';
import { CancelTicketModal } from '../components/CancelTicketModal';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  QrCode, 
  Train, 
  Home,
  MessageCircle,
  Users
} from 'lucide-react';

interface TripConfirmedScreenProps {
  trip: GroupTrip;
  onViewQR: (ticket: Ticket) => void;
  onOpenMyTickets: () => void;
  onGoHome: () => void;
  onCancelTicket: (ticketId: string) => void;
}

export function TripConfirmedScreen({
  trip,
  onViewQR,
  onOpenMyTickets,
  onGoHome,
  onCancelTicket,
}: TripConfirmedScreenProps) {
  const [selectedShareTicket, setSelectedShareTicket] = useState<Ticket | null>(null);
  const [selectedCancelTicket, setSelectedCancelTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.55 },
        colors: ['#FFC907', '#1E62C4', '#10B981', '#3B82F6'],
      });
    } catch {
      // Safe fallback
    }
  }, []);

  // Group unique destinations for header overview
  const uniqueDestinations = Array.from(new Set(trip.tickets.map((t) => t.destination)));

  return (
    <div className="flex-1 flex flex-col bg-[#F6F7F9]">
      <Header
        title="Trip Confirmed"
        showBack={true}
        onBack={onGoHome}
        rightType="support"
      />

      <div className="flex-1 px-4 py-3.5 space-y-3.5 pb-24 overflow-y-auto">
        {/* Celebration Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-emerald-950 leading-tight">
              Group Trip Confirmed!
            </h3>
            <p className="text-xs text-emerald-800 mt-0.5">
              All {trip.tickets.length} tickets generated & ready for AFC turnstiles
            </p>
          </div>
        </div>

        {/* Quick QR Passenger Switcher / Selector */}
        <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span>Instant QR Viewer ({trip.tickets.length} Passengers)</span>
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {trip.tickets.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => onViewQR(t)}
                className="py-1.5 px-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-800 flex items-center gap-1.5 shrink-0 transition active:scale-95"
              >
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{t.travellerName}</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  ({t.destination})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ONE GROUPED TRIP CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Group Card Header */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Train className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">
                  Group Metro Pass
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-gray-500">
                {trip.bookingCode}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-base font-black text-gray-900">
                {trip.origin}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-700">
                {uniqueDestinations.join(' • ')}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
              <span className="flex items-center gap-1 font-semibold text-gray-700">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                <span>{trip.tickets.length} Passengers</span>
              </span>
              <span className="font-black text-gray-900 text-sm">
                Total ₹{trip.totalFare}
              </span>
            </div>
          </div>

          {/* Underneath: List every traveller's ticket */}
          <div className="divide-y divide-gray-100">
            {trip.tickets.map((ticket, index) => {
              const isCancelled = ticket.status === 'cancelled';
              const isActive = ticket.status === 'active';

              return (
                <div key={ticket.id} className="p-3.5 space-y-2.5">
                  {/* Traveller Details Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          ticket.isPrimary
                            ? 'bg-[#FFC907] text-gray-950'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900">
                            {ticket.travellerName}
                          </span>
                          {ticket.isPrimary && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                              Primary User
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono">
                          {ticket.bookingId}
                        </p>
                      </div>
                    </div>

                    {/* Status & Fare */}
                    <div className="text-right">
                      {isActive && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          Active
                        </span>
                      )}
                      {isCancelled && (
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                          Cancelled
                        </span>
                      )}
                      <p className="text-xs font-bold text-gray-900 mt-0.5">
                        ₹{ticket.fare}
                      </p>
                    </div>
                  </div>

                  {/* Route & Platform badge */}
                  <div className="flex items-center justify-between bg-gray-50/80 px-2.5 py-1.5 rounded-xl text-xs text-gray-700">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span>{ticket.origin}</span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-900">{ticket.destination}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {ticket.platform}
                    </span>
                  </div>

                  {/* Active Ticket Actions: View QR, Share on WhatsApp */}
                  {isActive && (
                    <div className="flex items-center gap-2 pt-1">
                      {/* View QR Button */}
                      <button
                        type="button"
                        onClick={() => onViewQR(ticket)}
                        className="flex-1 py-2 px-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#FFC907]" />
                        <span>View QR</span>
                      </button>

                      {/* Share on WhatsApp Button (Co-passengers or Self) */}
                      <button
                        type="button"
                        onClick={() => setSelectedShareTicket(ticket)}
                        className="flex-1 py-2 px-2.5 bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Share on WhatsApp</span>
                      </button>

                      {/* Cancel Single Ticket */}
                      <button
                        type="button"
                        onClick={() => setSelectedCancelTicket(ticket)}
                        className="py-2 px-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-semibold rounded-xl transition"
                        title="Cancel this ticket"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                      <span>Refund of ₹{ticket.refundAmount || ticket.fare} initiated</span>
                      <span className="font-semibold text-emerald-600">Refunded</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Navigation Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onOpenMyTickets}
            className="w-full py-3.5 px-4 bg-[#FFC907] hover:bg-[#ffbe05] text-gray-950 font-extrabold text-sm rounded-full shadow-md transition active:scale-98 flex items-center justify-center gap-2"
          >
            <span>View in My Tickets</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-full transition active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Rapido Home</span>
          </button>
        </div>
      </div>

      <FooterDisclaimer />

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={selectedShareTicket !== null}
        ticket={selectedShareTicket}
        onClose={() => setSelectedShareTicket(null)}
        onOpenFriendView={(ticket) => onViewQR(ticket)}
      />

      {/* Cancel Ticket Modal */}
      <CancelTicketModal
        isOpen={selectedCancelTicket !== null}
        ticket={selectedCancelTicket}
        onClose={() => setSelectedCancelTicket(null)}
        onConfirmCancel={(ticketId) => onCancelTicket(ticketId)}
      />
    </div>
  );
}
