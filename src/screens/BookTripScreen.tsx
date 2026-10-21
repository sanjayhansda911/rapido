import { useState, useEffect } from 'react';
import type { TravellerDraft } from '../types/metro';
import { calculateFare } from '../data/mockStations';
import { Header } from '../components/Header';
import { FooterDisclaimer } from '../components/FooterDisclaimer';
import { StationPickerModal } from '../components/StationPickerModal';
import { 
  Plus, 
  Minus, 
  Tag, 
  Trash2, 
  Users, 
  ChevronRight, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface BookTripScreenProps {
  originStation: string;
  setOriginStation: (st: string) => void;
  primaryDestination: string;
  setPrimaryDestination: (st: string) => void;
  setTravellers: React.Dispatch<React.SetStateAction<TravellerDraft[]>>;
  onProceedToPay: () => void;
  onBack: () => void;
  onOpenMyTickets: () => void;
}

interface CoPassengerDraft {
  id: string;
  name: string;
  destination: string;
  fare: number;
}

export function BookTripScreen({
  originStation,
  setOriginStation,
  primaryDestination,
  setPrimaryDestination,
  setTravellers,
  onProceedToPay,
  onBack,
  onOpenMyTickets,
}: BookTripScreenProps) {
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  
  // Same destination passenger count (default 1 = just "You")
  const [sameStopCount, setSameStopCount] = useState<number>(1);
  
  // Independent co-passengers with different destinations (empty by default! No prefill!)
  const [coPassengers, setCoPassengers] = useState<CoPassengerDraft[]>([]);
  
  const [activePickerTarget, setActivePickerTarget] = useState<'origin' | 'primary_dest' | string | null>(null);
  const [showFareBreakdown, setShowFareBreakdown] = useState(false);

  // Maximum 6 travellers allowed per Hyderabad Metro guidelines
  const maxTravellers = 6;
  const totalPassengerCount = sameStopCount + coPassengers.length;
  const canAddMore = totalPassengerCount < maxTravellers;

  // Primary fare for Uppal -> primaryDestination
  const primaryFare = calculateFare(originStation, primaryDestination);

  // Re-calculate fares if origin changes
  useEffect(() => {
    if (coPassengers.length > 0) {
      setCoPassengers((prev) =>
        prev.map((cp) => ({
          ...cp,
          fare: cp.destination ? calculateFare(originStation, cp.destination) : 0,
        }))
      );
    }
  }, [originStation]);

  // Handle Stepper for same destination passengers
  const handleIncreaseSameStop = () => {
    if (canAddMore) {
      setSameStopCount((prev) => prev + 1);
    }
  };

  const handleDecreaseSameStop = () => {
    if (sameStopCount > 1) {
      setSameStopCount((prev) => prev - 1);
    }
  };

  // Add a blank co-passenger with different destination (NOT prefilled!)
  const handleAddCoPassenger = () => {
    if (!canAddMore) return;
    const newCoPassenger: CoPassengerDraft = {
      id: `copassenger-${Date.now()}-${coPassengers.length + 1}`,
      name: '', // Empty name input!
      destination: '', // Empty destination! User selects it.
      fare: 0,
    };
    setCoPassengers([...coPassengers, newCoPassenger]);
  };

  // Remove co-passenger
  const handleRemoveCoPassenger = (id: string) => {
    setCoPassengers(coPassengers.filter((cp) => cp.id !== id));
  };

  // Update co-passenger name
  const handleUpdateCoPassengerName = (id: string, name: string) => {
    setCoPassengers(
      coPassengers.map((cp) => (cp.id === id ? { ...cp, name } : cp))
    );
  };

  // Update co-passenger destination
  const handleUpdateCoPassengerDestination = (id: string, destination: string) => {
    setCoPassengers(
      coPassengers.map((cp) => {
        if (cp.id === id) {
          return {
            ...cp,
            destination,
            fare: calculateFare(originStation, destination),
          };
        }
        return cp;
      })
    );
  };

  // Total Fare computation
  const sameStopTotalFare = sameStopCount * primaryFare;
  const coPassengersTotalFare = coPassengers.reduce((sum, cp) => sum + (cp.fare || 0), 0);
  const totalFare = sameStopTotalFare + coPassengersTotalFare;

  // Synthesize final list of travellers before payment
  const handleProceed = () => {
    const finalList: TravellerDraft[] = [];

    // 1. Primary Traveller ("You")
    finalList.push({
      id: 'traveller-1',
      name: 'You',
      isPrimary: true,
      destination: primaryDestination,
      fare: primaryFare,
    });

    // 2. Additional same-stop passengers (if count > 1)
    for (let i = 2; i <= sameStopCount; i++) {
      finalList.push({
        id: `traveller-same-${i}`,
        name: `Passenger ${i}`,
        isPrimary: false,
        destination: primaryDestination,
        fare: primaryFare,
      });
    }

    // 3. Different-stop co-passengers
    coPassengers.forEach((cp, idx) => {
      const fallbackName = `Passenger ${sameStopCount + idx + 1}`;
      const dest = cp.destination || primaryDestination;
      finalList.push({
        id: cp.id,
        name: cp.name.trim() ? cp.name.trim() : fallbackName,
        isPrimary: false,
        destination: dest,
        fare: cp.fare > 0 ? cp.fare : calculateFare(originStation, dest),
      });
    });

    setTravellers(finalList);
    onProceedToPay();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F6F7F9]">
      <Header
        title="Group Metro Booking"
        showBack={true}
        onBack={onBack}
        rightType="my_tickets"
        onRightAction={onOpenMyTickets}
      />

      {/* Main Scrollable Body */}
      <div className="flex-1 px-4 py-3 space-y-3 pb-24 overflow-y-auto">
        {/* One Way / Round Trip Tabs (Screenshot 2) */}
        <div className="bg-white p-1 rounded-2xl border border-gray-200/80 shadow-xs flex">
          <button
            type="button"
            onClick={() => setTripType('oneWay')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition ${
              tripType === 'oneWay'
                ? 'bg-blue-50 text-[#1E62C4] border border-blue-200 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            One Way
          </button>
          <button
            type="button"
            onClick={() => setTripType('roundTrip')}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition ${
              tripType === 'roundTrip'
                ? 'bg-blue-50 text-[#1E62C4] border border-blue-200 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Round Trip
          </button>
        </div>

        {/* Boarding and Destination Route Card (Screenshot 2) */}
        <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Your Metro Route
            </span>
            <span className="text-xs font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
              ₹{primaryFare} / ticket
            </span>
          </div>

          <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-200/80 space-y-2">
            {/* Origin Row */}
            <div 
              onClick={() => setActivePickerTarget('origin')}
              className="flex items-center justify-between cursor-pointer hover:bg-white/80 p-1 rounded-lg transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0"></span>
                <div>
                  <span className="text-[10px] text-gray-400 font-medium">From:</span>
                  <p className="text-xs font-bold text-gray-900">{originStation}</p>
                </div>
              </div>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Change
              </span>
            </div>

            {/* Dotted Route Connector */}
            <div className="ml-3.5 pl-0.5 border-l-2 border-dashed border-gray-300 h-2"></div>

            {/* Primary Destination Row */}
            <div 
              onClick={() => setActivePickerTarget('primary_dest')}
              className="flex items-center justify-between cursor-pointer hover:bg-white/80 p-1 rounded-lg transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-100 shrink-0"></span>
                <div>
                  <span className="text-[10px] text-gray-400 font-medium">To:</span>
                  <p className="text-xs font-bold text-gray-900">{primaryDestination}</p>
                </div>
              </div>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Change
              </span>
            </div>
          </div>
        </div>

        {/* OPTION 1: Same Source & Same Destination Passenger Counter (Screenshot 2) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-900 leading-tight">
                Passengers to {primaryDestination}
              </h3>
              <p className="text-[11px] text-gray-400">
                Travelling together from {originStation} &rarr; {primaryDestination}
              </p>
            </div>

            {/* Stepper [-]  count  [+] (Recreating Screenshot 2) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecreaseSameStop}
                disabled={sameStopCount <= 1}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition border ${
                  sameStopCount > 1
                    ? 'border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Decrease passengers"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <span className="text-sm font-black text-gray-900 w-4 text-center">
                {sameStopCount}
              </span>

              <button
                type="button"
                onClick={handleIncreaseSameStop}
                disabled={!canAddMore}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition border ${
                  canAddMore
                    ? 'border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Increase passengers"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>
              {sameStopCount === 1 ? '1 ticket for You' : `${sameStopCount} tickets to ${primaryDestination}`}
            </span>
            <span className="font-bold text-gray-900">
              ₹{sameStopTotalFare}
            </span>
          </div>
        </div>

        {/* OPTION 2: Add Co-Passengers with Different Destination */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-700" />
              <h3 className="text-xs font-bold text-gray-900">
                Co-passengers (Different Destinations)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              <span>Independent Stops</span>
            </span>
          </div>

          {coPassengers.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-dashed border-gray-200 space-y-1">
              <p className="text-xs font-semibold text-gray-600">
                Travelling with friends getting off at different stops?
              </p>
              <p className="text-[11px] text-gray-400">
                Add them below to book as one trip with individual QRs.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {coPassengers.map((cp, idx) => (
                <div
                  key={cp.id}
                  className="bg-gray-50/90 rounded-2xl p-3 border border-gray-200/80 relative transition hover:border-gray-300 space-y-2"
                >
                  {/* Top row: Empty Name input and Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {sameStopCount + idx + 1}
                      </div>
                      <input
                        type="text"
                        value={cp.name}
                        onChange={(e) => handleUpdateCoPassengerName(cp.id, e.target.value)}
                        placeholder={`Co-passenger name (optional)`}
                        className="text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-2 py-1 w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {cp.fare > 0 && (
                        <span className="text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                          ₹{cp.fare}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveCoPassenger(cp.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 transition rounded-md"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Destination picker for this co-passenger (Prompt to choose!) */}
                  <div className="bg-white rounded-xl p-2 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100 shrink-0"></span>
                      <span className="text-[11px] text-gray-400 font-medium">To:</span>
                      <button
                        type="button"
                        onClick={() => setActivePickerTarget(cp.id)}
                        className="text-xs font-bold text-left flex-1 flex items-center justify-between text-gray-900 hover:text-blue-600"
                      >
                        <span className={cp.destination ? 'text-gray-900' : 'text-blue-600 font-semibold'}>
                          {cp.destination ? cp.destination : 'Select destination stop ▾'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Co-Passenger Button */}
          {canAddMore ? (
            <button
              type="button"
              onClick={handleAddCoPassenger}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50/50 text-xs font-extrabold text-blue-700 flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add co-passenger (different stop)</span>
              <span className="text-[11px] font-normal text-gray-400">
                ({maxTravellers - totalPassengerCount} slots left)
              </span>
            </button>
          ) : (
            <div className="text-center py-1.5 text-[11px] text-amber-700 bg-amber-50 rounded-xl font-bold">
              Maximum 6 passengers reached (Hyderabad Metro limit)
            </div>
          )}

          <p className="text-[11px] text-gray-400 leading-normal pt-1 border-t border-dashed border-gray-200">
            Hyderabad metro allows to purchase up to 6 QR tickets per user at a time.
          </p>
        </div>

        {/* Apply Coupon Card (Screenshot 2) */}
        <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Apply Coupon</p>
              <p className="text-[10px] text-emerald-600 font-bold">METRO20 applied</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Sticky Bottom Bar (Can Proceed to Pay immediately with or without co-passengers!) */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200/80 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-medium">Total fare</span>
            <button
              onClick={() => setShowFareBreakdown(!showFareBreakdown)}
              className="text-[11px] text-blue-600 font-bold flex items-center gap-0.5"
            >
              <span>({totalPassengerCount} {totalPassengerCount === 1 ? 'ticket' : 'tickets'})</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  showFareBreakdown ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">
            ₹{totalFare}
          </span>
        </div>

        {/* Collapsible Per-Person Breakdown */}
        {showFareBreakdown && (
          <div className="mb-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-gray-700 font-medium">
              <span>
                {sameStopCount} &times; {originStation} &rarr; {primaryDestination}
              </span>
              <span className="font-bold text-gray-900">₹{sameStopTotalFare}</span>
            </div>
            {coPassengers.map((cp, idx) => (
              <div key={cp.id} className="flex items-center justify-between text-gray-600">
                <span>
                  {cp.name || `Co-passenger ${sameStopCount + idx + 1}`} ({originStation} &rarr; {cp.destination || 'Selected stop'})
                </span>
                <span className="font-bold text-gray-900">₹{cp.fare}</span>
              </div>
            ))}
          </div>
        )}

        {/* Yellow Button: Proceed to Pay (Enabled for 1 solo user or group!) */}
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-3.5 px-6 bg-[#FFC907] hover:bg-[#ffbf00] active:scale-[0.98] text-gray-950 font-extrabold text-base rounded-full shadow-[0_4px_12px_rgba(255,201,7,0.35)] transition-all flex items-center justify-center gap-2"
        >
          <span>Proceed to pay</span>
          <span className="text-sm font-semibold opacity-80">• ₹{totalFare}</span>
        </button>
      </div>

      <FooterDisclaimer />

      {/* Station Picker Modal */}
      <StationPickerModal
        isOpen={activePickerTarget !== null}
        onClose={() => setActivePickerTarget(null)}
        currentSelected={
          activePickerTarget === 'origin'
            ? originStation
            : activePickerTarget === 'primary_dest'
            ? primaryDestination
            : coPassengers.find((cp) => cp.id === activePickerTarget)?.destination
        }
        title={
          activePickerTarget === 'origin'
            ? 'Select Boarding Station'
            : activePickerTarget === 'primary_dest'
            ? 'Select Your Destination Stop'
            : 'Select Co-passenger Destination Stop'
        }
        onSelect={(station) => {
          if (activePickerTarget === 'origin') {
            setOriginStation(station);
          } else if (activePickerTarget === 'primary_dest') {
            setPrimaryDestination(station);
          } else if (activePickerTarget) {
            handleUpdateCoPassengerDestination(activePickerTarget, station);
          }
        }}
      />
    </div>
  );
}
