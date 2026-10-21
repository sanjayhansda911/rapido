import { useState } from 'react';
import type { Ticket } from '../types/metro';
import { AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, X } from 'lucide-react';

interface CancelTicketModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onConfirmCancel: (ticketId: string) => void;
}

export function CancelTicketModal({
  isOpen,
  ticket,
  onClose,
  onConfirmCancel,
}: CancelTicketModalProps) {
  const [reason, setReason] = useState('Change of travel plans');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !ticket) return null;

  const cancellationFee = 0; // Free cancellation before entry
  const refundAmount = ticket.fare - cancellationFee;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmCancel(ticket.id);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-[370px] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                Cancel Ticket
              </h3>
              <p className="text-[11px] text-gray-500">
                Independent ticket cancellation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Passenger & Journey Card */}
          <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-900">
                {ticket.travellerName}
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                {ticket.bookingId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <span>{ticket.origin}</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              <span>{ticket.destination}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Note: Cancelling this will NOT affect other co-travellers in this group!
            </p>
          </div>

          {/* Refund Breakdown */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Refund Breakdown
            </p>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Ticket Fare</span>
              <span className="font-semibold text-gray-900">₹{ticket.fare}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Cancellation Fee</span>
              <span className="font-semibold text-emerald-600">₹0 (Free)</span>
            </div>
            <div className="border-t border-emerald-200/60 pt-2 flex items-center justify-between text-sm font-bold text-gray-900">
              <span>Total Refund Amount</span>
              <span className="text-emerald-700 text-base">₹{refundAmount}</span>
            </div>

            <div className="pt-1 text-[11px] text-emerald-900 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Amount will be credited back to your original payment method (UPI/Card) in 2-3 business days.
              </span>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Reason for cancellation
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFC907]"
            >
              <option value="Change of travel plans">Change of travel plans</option>
              <option value="Friend arranged alternate ride">Co-traveller arranged alternate ride</option>
              <option value="Booked wrong station destination">Booked wrong station destination</option>
              <option value="Trip rescheduled">Trip rescheduled</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-white transition"
          >
            Keep Ticket
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Confirm & Refund ₹{refundAmount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
