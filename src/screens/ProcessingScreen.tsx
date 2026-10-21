import { useEffect, useState } from 'react';
import type { TravellerDraft, GroupTrip, Ticket, MetroLine } from '../types/metro';
import { STATIONS } from '../data/mockStations';
import { Header } from '../components/Header';
import { FooterDisclaimer } from '../components/FooterDisclaimer';
import { 
  CheckCircle2, 
  Loader2, 
  Train, 
  Zap
} from 'lucide-react';

interface ProcessingScreenProps {
  originStation: string;
  travellers: TravellerDraft[];
  onComplete: (trip: GroupTrip) => void;
}

type StepStatus = 'pending' | 'active' | 'success';

interface TravellerProgress {
  travellerId: string;
  step1: StepStatus; // Payment initiated
  step2: StepStatus; // Request sent to Hyderabad Metro
  step3: StepStatus; // Ticket confirmed & QR generated
}

export function ProcessingScreen({
  originStation,
  travellers,
  onComplete,
}: ProcessingScreenProps) {
  const [progress, setProgress] = useState<TravellerProgress[]>(() =>
    travellers.map((t) => ({
      travellerId: t.id,
      step1: 'active',
      step2: 'pending',
      step3: 'pending',
    }))
  );

  useEffect(() => {
    // Step 1 -> Step 2 after 750ms
    const timer1 = setTimeout(() => {
      setProgress((prev) =>
        prev.map((p) => ({
          ...p,
          step1: 'success',
          step2: 'active',
        }))
      );
    }, 750);

    // Step 2 -> Step 3 after 1750ms
    const timer2 = setTimeout(() => {
      setProgress((prev) =>
        prev.map((p) => ({
          ...p,
          step2: 'success',
          step3: 'active',
        }))
      );
    }, 1750);

    // Step 3 -> Completion after 2750ms
    const timer3 = setTimeout(() => {
      setProgress((prev) =>
        prev.map((p) => ({
          ...p,
          step3: 'success',
        }))
      );
    }, 2750);

    // Finalize trip object and transition
    const timerFinal = setTimeout(() => {
      finishProcessing();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerFinal);
    };
  }, []);

  const finishProcessing = () => {
    const bookingCode = `HYD-GRP-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdTickets: Ticket[] = travellers.map((t, idx) => {
      const stationInfo = STATIONS.find((s) => s.name === t.destination);
      const line: MetroLine = stationInfo ? stationInfo.line : 'blue';

      return {
        id: `TKT-${Date.now()}-${idx}`,
        bookingId: `${bookingCode}-${String.fromCharCode(65 + idx)}`,
        travellerName: t.name,
        isPrimary: t.isPrimary,
        origin: originStation,
        destination: t.destination,
        fare: t.fare,
        status: 'active',
        qrToken: `HMRL-SECURE-QR-${bookingCode}-${t.name.toUpperCase()}-${t.destination.toUpperCase()}`,
        platform: stationInfo?.platform || 'Platform 1',
        line: line,
        purchaseDate: 'Purchased today, just now',
        validUntil: '11:59 PM today',
      };
    });

    const newTrip: GroupTrip = {
      id: `GRP-${Date.now()}`,
      bookingCode,
      origin: originStation,
      purchaseDate: 'Purchased today, just now',
      tickets: createdTickets,
      totalFare: travellers.reduce((sum, t) => sum + t.fare, 0),
      status: 'active',
    };

    onComplete(newTrip);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <Header
        title="Processing Tickets"
        showBack={false}
        rightType="none"
      />

      <div className="flex-1 px-4 py-5 flex flex-col items-center justify-between overflow-y-auto">
        {/* Animated Graphic / Status Badge */}
        <div className="w-full flex flex-col items-center text-center space-y-2 mt-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-md animate-pulse">
              <Train className="w-8 h-8 text-amber-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
          </div>

          <h2 className="text-lg font-black text-gray-900 tracking-tight pt-1">
            Issuing {travellers.length} Metro QR Tickets
          </h2>
          <p className="text-xs text-gray-500 max-w-[280px]">
            Booking tickets concurrently on Hyderabad Metro AFC gate network...
          </p>
        </div>

        {/* Stepper Per Traveller Card */}
        <div className="w-full space-y-3 my-4">
          {travellers.map((traveller, idx) => {
            const p = progress.find((item) => item.travellerId === traveller.id);

            return (
              <div
                key={traveller.id}
                className="bg-gray-50/90 rounded-2xl p-3.5 border border-gray-200/80 shadow-2xs"
              >
                {/* Header of Traveller Sub-card */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {traveller.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600">
                    {originStation} &rarr; {traveller.destination} (₹{traveller.fare})
                  </span>
                </div>

                {/* The 3 Stepper Stages */}
                <div className="space-y-2">
                  {/* Step 1: Payment initiated */}
                  <div className="flex items-center gap-2.5 text-xs">
                    {p?.step1 === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                    )}
                    <span
                      className={`font-medium ${
                        p?.step1 === 'success' ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      Payment initiated
                    </span>
                  </div>

                  {/* Step 2: Request sent to Hyderabad Metro */}
                  <div className="flex items-center gap-2.5 text-xs">
                    {p?.step2 === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : p?.step2 === 'active' ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0"></div>
                    )}
                    <span
                      className={`font-medium ${
                        p?.step2 === 'success'
                          ? 'text-gray-900'
                          : p?.step2 === 'active'
                          ? 'text-blue-700 font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      Request sent to Hyderabad Metro
                    </span>
                  </div>

                  {/* Step 3: Waiting for confirmation & QR generation */}
                  <div className="flex items-center gap-2.5 text-xs">
                    {p?.step3 === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : p?.step3 === 'active' ? (
                      <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0"></div>
                    )}
                    <span
                      className={`font-medium ${
                        p?.step3 === 'success'
                          ? 'text-emerald-700 font-bold'
                          : p?.step3 === 'active'
                          ? 'text-amber-700 font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      {p?.step3 === 'success'
                        ? 'Confirmed & QR ticket generated'
                        : 'Waiting for confirmation'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skip Button for Instant Demo testing */}
        <div className="w-full pt-2">
          <button
            type="button"
            onClick={finishProcessing}
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-98"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Fast-Forward Processing</span>
          </button>
        </div>
      </div>

      <FooterDisclaimer />
    </div>
  );
}
