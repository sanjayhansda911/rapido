import { useState } from 'react';
import type { Ticket } from '../types/metro';
import { Check, Copy, ExternalLink, MessageCircle, X } from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onOpenFriendView: (ticket: Ticket) => void;
}

export function WhatsAppShareModal({
  isOpen,
  ticket,
  onClose,
  onOpenFriendView,
}: WhatsAppShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !ticket) return null;

  const shareUrl = `https://rapido.metro/t/${ticket.bookingId}`;
  const whatsappMessage = `Hey ${ticket.travellerName}! 🚇 Here's your Hyderabad Metro QR ticket for *${ticket.origin} → ${ticket.destination}* (Platform 1, Blue Line).
• Fare: ₹${ticket.fare}
• Valid till: 11:59 PM today
• No login needed, directly scan at AFC gates:
${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-[370px] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* WhatsApp App Mock Header */}
        <div className="bg-[#075E54] text-white px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Share via WhatsApp</p>
              <p className="text-[11px] text-emerald-200">
                To: {ticket.travellerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Preview Area */}
        <div className="bg-[#EFEAE2] p-4 flex-1 space-y-3 relative overflow-hidden">
          {/* Subtle chat background pattern simulation */}
          <div className="text-[11px] text-gray-500 text-center font-medium my-1">
            <span className="bg-white/80 px-2 py-0.5 rounded-md shadow-xs">
              TODAY • 09:21 AM
            </span>
          </div>

          {/* Outgoing Message Bubble */}
          <div className="bg-[#D9FDD3] text-gray-900 rounded-2xl rounded-tr-xs p-3.5 shadow-sm text-xs leading-relaxed ml-auto max-w-[90%] border border-[#c4e9be]">
            <p className="font-semibold text-gray-800">
              Hey {ticket.travellerName}! 🚇
            </p>
            <p className="mt-1 text-gray-700">
              Here is your Hyderabad Metro ticket:
            </p>
            <div className="my-2 bg-white/90 p-2.5 rounded-xl border border-emerald-200">
              <p className="font-bold text-[13px] text-emerald-900">
                {ticket.origin} &rarr; {ticket.destination}
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                {ticket.line === 'blue' ? 'Blue Line' : 'Red Line'} • ₹{ticket.fare}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">
                Valid till 11:59 PM today
              </p>
            </div>
            <p className="text-emerald-800 underline break-all font-mono text-[11px]">
              {shareUrl}
            </p>
            <div className="text-[9px] text-gray-400 text-right mt-1 font-mono flex items-center justify-end gap-1">
              <span>09:21</span>
              <span className="text-blue-500">✓✓</span>
            </div>
          </div>

          <div className="bg-white/90 p-2 rounded-xl text-[11px] text-gray-600 flex items-center gap-2 border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Link works directly in browser with <strong>zero login</strong>!</span>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="p-4 bg-white border-t border-gray-100 space-y-2">
          {/* Primary Action: Open Friend View directly */}
          <button
            onClick={() => {
              onClose();
              onOpenFriendView(ticket);
            }}
            className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition active:scale-[0.98]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Simulate Friend Opening Shared QR</span>
          </button>

          {/* Copy Message Action */}
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Shareable Link & Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
