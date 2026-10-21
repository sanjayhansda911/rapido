import { useState, useEffect } from 'react';
import type { Ticket } from '../types/metro';
import { QRCodeSVG } from 'qrcode.react';
import { FooterDisclaimer } from '../components/FooterDisclaimer';
import { WhatsAppShareModal } from '../components/WhatsAppShareModal';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Download, 
  Info, 
  ShieldCheck, 
  Train, 
  UserCheck,
  MessageCircle,
  Users
} from 'lucide-react';

interface FriendQRScreenProps {
  ticket: Ticket;
  allTripTickets?: Ticket[];
  onSelectTicket?: (ticket: Ticket) => void;
  onBack: () => void;
}

export function FriendQRScreen({ 
  ticket, 
  allTripTickets = [], 
  onSelectTicket, 
  onBack 
}: FriendQRScreenProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState('14h 38m remaining');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Validity countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diffMs = endOfDay.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeLeft('Expired');
        return;
      }
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${mins}m remaining`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F3F4F6]">
      {/* View-Only Header with HMRL Badge */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-xs">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-gray-800 hover:bg-gray-100 rounded-full transition active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-extrabold text-gray-900 leading-tight">
            Hyderabad Metro E-Ticket
          </h1>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
            <UserCheck className="w-3 h-3" />
            <span>Ready for Turnstile Gate Scan</span>
          </p>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Passenger Switcher (If multiple passengers in group) */}
      {allTripTickets.length > 1 && (
        <div className="bg-white px-4 py-2 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0 flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-600" />
            <span>QRs:</span>
          </span>
          {allTripTickets.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => onSelectTicket && onSelectTicket(t)}
              className={`py-1 px-2.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                t.id === ticket.id
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold ${
                t.id === ticket.id ? 'bg-[#FFC907] text-gray-950' : 'bg-gray-300 text-gray-800'
              }`}>
                {idx + 1}
              </span>
              <span>{t.travellerName}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Ticket Container */}
      <div className="flex-1 px-4 py-4 space-y-3.5 pb-20 overflow-y-auto">
        {/* Ticket Container */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-md overflow-hidden relative">
          {/* Top Brand Banner */}
          <div className="bg-[#1E62C4] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Train className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-black tracking-tight">HMRL METRO RAIL</p>
                <p className="text-[10px] text-blue-100">{ticket.line === 'blue' ? 'Blue Line' : 'Red Line'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold bg-white text-[#1E62C4] px-2 py-0.5 rounded-full uppercase">
                Single Journey
              </span>
            </div>
          </div>

          {/* Passenger & Route Card */}
          <div className="p-4 bg-gray-50/70 border-b border-dashed border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Passenger
                </span>
                <p className="text-sm font-black text-gray-900">
                  {ticket.travellerName}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Ticket Fare
                </span>
                <p className="text-sm font-black text-emerald-600">
                  ₹{ticket.fare} <span className="text-[10px] font-bold text-gray-500">• PAID</span>
                </p>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-gray-200/80 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Origin</p>
                  <p className="text-xs font-bold text-gray-900">{ticket.origin}</p>
                </div>
              </div>

              <div className="flex flex-col items-center px-2">
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="text-[9px] text-gray-400">{ticket.platform}</span>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Destination</p>
                  <p className="text-xs font-bold text-gray-900">{ticket.destination}</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100"></span>
              </div>
            </div>
          </div>

          {/* Large Mocked QR Code Section with Laser Animation */}
          <div className="p-6 flex flex-col items-center justify-center bg-white text-center">
            <div className="relative p-3 bg-white rounded-2xl border-2 border-gray-900 shadow-md">
              {/* Laser scanner animation line */}
              <div className="animate-scan-line"></div>

              {/* High resolution QR Code */}
              <QRCodeSVG
                value={ticket.qrToken}
                size={190}
                level="H"
                includeMargin={true}
                fgColor="#0f172a"
              />
            </div>

            <p className="text-[11px] font-mono font-semibold text-gray-600 mt-3">
              {ticket.bookingId}
            </p>

            {/* Validity Badge */}
            <div className="mt-2.5 flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-full text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Valid till 11:59 pm today ({timeLeft})</span>
            </div>
          </div>

          {/* Ticket Instructions Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Gate Entry:</strong> Hold this QR code 4-6 inches above the scanner at the automated AFC turnstiles.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <span>
                Valid for single entry and exit at designated destination station today.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: WhatsApp Share & Download */}
        <div className="space-y-2">
          {/* Share on WhatsApp */}
          <button
            type="button"
            onClick={() => setShowWhatsAppModal(true)}
            className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs rounded-2xl shadow-xs transition flex items-center justify-center gap-2 active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Share Ticket with {ticket.travellerName} via WhatsApp</span>
          </button>

          {/* Download Ticket Image */}
          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-2xl shadow-xs transition flex items-center justify-center gap-2 active:scale-98"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Saved to Device Photos!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-gray-700" />
                <span>Save Offline QR Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      <FooterDisclaimer />

      {/* WhatsApp Share Sheet Modal */}
      <WhatsAppShareModal
        isOpen={showWhatsAppModal}
        ticket={ticket}
        onClose={() => setShowWhatsAppModal(false)}
        onOpenFriendView={() => setShowWhatsAppModal(false)}
      />
    </div>
  );
}
