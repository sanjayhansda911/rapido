import { useState } from 'react';
import type { GroupTrip, Ticket } from '../types/metro';
import { Header } from '../components/Header';
import { FooterDisclaimer } from '../components/FooterDisclaimer';
import { WhatsAppShareModal } from '../components/WhatsAppShareModal';
import { CancelTicketModal } from '../components/CancelTicketModal';
import { 
  ChevronDown, 
  ChevronRight, 
  MessageCircle, 
  QrCode, 
  Train, 
  Users,
  Home
} from 'lucide-react';

interface MyTicketsScreenProps {
  upcomingTrips: GroupTrip[];
  pastTickets: Ticket[];
  onBack: () => void;
  onGoHome: () => void;
  onViewQR: (ticket: Ticket) => void;
  onCancelTicket: (ticketId: string) => void;
}

export function MyTicketsScreen({
  upcomingTrips,
  pastTickets,
  onBack,
  onGoHome,
  onViewQR,
  onCancelTicket,
}: MyTicketsScreenProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [expandedTripId, setExpandedTripId] = useState<string | null>(
    upcomingTrips[0]?.id || null
  );
  const [selectedShareTicket, setSelectedShareTicket] = useState<Ticket | null>(null);
  const [selectedCancelTicket, setSelectedCancelTicket] = useState<Ticket | null>(null);

  const allUpcomingTickets = upcomingTrips.flatMap((t) => t.tickets);

  return (
    <div className="flex-1 flex flex-col bg-[#F6F7F9]">
      <Header
        title="Metro tickets"
        showBack={true}
        onBack={onBack}
        rightType="support"
      />

      {/* Tabs: Upcoming vs Past Rides */}
      <div className="bg-white px-4 pt-2 border-b border-gray-100 flex gap-6 shrink-0">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-bold transition relative ${
            activeTab === 'upcoming'
              ? 'text-gray-950'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span>Upcoming</span>
          <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full font-bold">
            {allUpcomingTickets.length}
          </span>
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-950 rounded-t-full"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-bold transition relative ${
            activeTab === 'past'
              ? 'text-gray-950'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span>Past rides</span>
          <span className="ml-1.5 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full font-bold">
            {pastTickets.length}
          </span>
          {activeTab === 'past' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-950 rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 py-3.5 space-y-3.5 pb-20 overflow-y-auto">
        {/* UPCOMING TAB */}
        {activeTab === 'upcoming' && (
          <div className="space-y-3">
            {upcomingTrips.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-gray-100 text-gray-400 text-xs">
                No upcoming metro tickets.
              </div>
            ) : (
              upcomingTrips.map((trip) => {
                const isExpanded = expandedTripId === trip.id;
                const activeCount = trip.tickets.filter((t) => t.status === 'active').length;

                return (
                  <div
                    key={trip.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden"
                  >
                    {/* Group Trip Header */}
                    <div
                      onClick={() => setExpandedTripId(isExpanded ? null : trip.id)}
                      className="p-4 cursor-pointer hover:bg-gray-50/70 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-gray-900">
                              {trip.origin} &rarr; Multiple Stops
                            </span>
                            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                              {activeCount} Active
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {trip.bookingCode} • {trip.purchaseDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">
                          ₹{trip.totalFare}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expandable Grouped Tickets List */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 divide-y divide-gray-100 bg-gray-50/40">
                        {trip.tickets.map((t, idx) => {
                          const isActive = t.status === 'active';
                          const isCancelled = t.status === 'cancelled';

                          return (
                            <div key={t.id} className="p-3.5 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-700 text-[10px] font-bold flex items-center justify-center">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-gray-900">
                                        {t.travellerName}
                                      </span>
                                      {t.isPrimary && (
                                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded">
                                          You
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-gray-400">
                                      To: {t.destination} ({t.platform})
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  {isActive && (
                                    <span className="text-[11px] font-bold text-blue-600">
                                      Active
                                    </span>
                                  )}
                                  {isCancelled && (
                                    <span className="text-[11px] font-bold text-rose-600">
                                      Cancelled
                                    </span>
                                  )}
                                  <p className="text-xs font-semibold text-gray-800">
                                    ₹{t.fare}
                                  </p>
                                </div>
                              </div>

                              {isActive && (
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    onClick={() => onViewQR(t)}
                                    className="flex-1 py-1.5 px-2 bg-gray-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-black transition active:scale-95"
                                  >
                                    <QrCode className="w-3 h-3 text-[#FFC907]" />
                                    <span>View QR</span>
                                  </button>

                                  <button
                                    onClick={() => setSelectedShareTicket(t)}
                                    className="flex-1 py-1.5 px-2 bg-[#25D366] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#20ba59] transition active:scale-95"
                                  >
                                    <MessageCircle className="w-3 h-3 fill-white" />
                                    <span>WhatsApp</span>
                                  </button>

                                  <button
                                    onClick={() => setSelectedCancelTicket(t)}
                                    className="px-2 py-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-medium rounded-lg transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <button
              onClick={onGoHome}
              className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-full transition flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Rapido Home</span>
            </button>
          </div>
        )}

        {/* PAST RIDES TAB (Matches Screenshot 1 UI) */}
        {activeTab === 'past' && (
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold text-gray-900 px-1">
              Rides you have taken
            </h2>

            {/* Single white rounded container matching Screenshot 1 */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-gray-100">
              {pastTickets.map((ride) => {
                let statusColor = 'text-blue-600';
                if (ride.status === 'cancelled' || ride.status === 'expired') {
                  statusColor = 'text-[#E53E3E]';
                } else if (ride.status === 'processing') {
                  statusColor = 'text-gray-500';
                }

                return (
                  <div
                    key={ride.id}
                    onClick={() => {
                      if (ride.status === 'active' || ride.status === 'completed') {
                        onViewQR(ride);
                      }
                    }}
                    className="p-3.5 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50/70 flex items-center justify-center text-[#1E62C4] shrink-0">
                        <Train className="w-4 h-4 stroke-[1.8]" />
                      </div>

                      <div>
                        <p className="text-[14px] font-bold text-gray-900 leading-snug">
                          {ride.origin} &rarr; {ride.destination}
                        </p>
                        <p className="text-[12px] text-gray-500 mt-0.5">
                          {ride.purchaseDate} •{' '}
                          <span className={`font-semibold capitalize ${statusColor}`}>
                            {ride.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    {(ride.status === 'completed' || ride.status === 'active') && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <FooterDisclaimer />

      {/* WhatsApp Share Sheet Modal */}
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
