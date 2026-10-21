import { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  HelpCircle, 
  MapPin, 
  Search, 
  Ticket as TicketIcon, 
  Train, 
  X,
  Users
} from 'lucide-react';
import { STATIONS } from '../data/mockStations';
import { FooterDisclaimer } from '../components/FooterDisclaimer';

interface StationSelectScreenProps {
  originStation: string;
  setOriginStation: (st: string) => void;
  destinationStation: string;
  setDestinationStation: (st: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onOpenMyTickets: () => void;
}

export function StationSelectScreen({
  originStation,
  setOriginStation,
  destinationStation,
  setDestinationStation,
  onContinue,
  onBack,
  onOpenMyTickets,
}: StationSelectScreenProps) {
  const [search, setSearch] = useState('');
  const [activeInput, setActiveInput] = useState<'from' | 'to'>('to');

  const filteredStations = STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.lineName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectStation = (stationName: string) => {
    if (activeInput === 'from') {
      setOriginStation(stationName);
      setActiveInput('to');
    } else {
      setDestinationStation(stationName);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Promotional Top Header Banner - Recreating Screenshot 3 */}
      <div className="bg-[#1E62C4] text-white p-4 pt-4 relative overflow-hidden shrink-0">
        <div className="flex items-center justify-between relative z-10">
          <button
            onClick={onBack}
            className="p-1 -ml-1 rounded-full text-white/90 hover:bg-white/20 transition active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMyTickets}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-gray-900 text-xs font-bold hover:bg-white/90 transition shadow-xs active:scale-95"
            >
              <TicketIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>My tickets</span>
            </button>
            <button
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white"
              aria-label="Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Promo banner graphic (Screenshot 3) */}
        <div className="mt-3 flex items-center justify-between relative z-10">
          <div>
            <p className="text-[11px] font-medium text-blue-100">Get discount with</p>
            <div className="inline-block bg-white text-[#1E62C4] text-xs font-black px-2.5 py-1 rounded-md mt-1 tracking-wider shadow-sm">
              METRO20
            </div>
          </div>

          {/* Illustrated Metro Train Graphic */}
          <div className="w-28 h-14 relative flex items-center justify-center">
            <div className="bg-white/10 rounded-xl p-2 flex items-center gap-1.5 border border-white/20 shadow-xs">
              <Train className="w-8 h-8 text-white" />
              <div className="text-[10px] font-bold text-white/95 leading-tight">
                Hyderabad<br/>Metro Rail
              </div>
            </div>
          </div>
        </div>
        <p className="text-[9px] text-blue-200 text-right mt-1">*T&C Apply</p>

        {/* Curved decorative glow */}
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      </div>

      {/* Select Metro Stations Card (Screenshot 3) */}
      <div className="p-4 border-b border-gray-100 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-gray-900">
            Select metro stations
          </h2>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Group Booking ready</span>
          </span>
        </div>

        {/* Route Card with From & To inputs */}
        <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200 space-y-2">
          {/* From station row */}
          <button
            onClick={() => setActiveInput('from')}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
              activeInput === 'from'
                ? 'bg-white shadow-xs ring-2 ring-emerald-500'
                : 'hover:bg-gray-100/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0"></span>
              <span className="text-xs text-gray-500 font-medium">From:</span>
              <span className="text-sm font-bold text-gray-900">{originStation}</span>
            </div>
            {activeInput === 'from' && (
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                Editing
              </span>
            )}
          </button>

          {/* Dotted route divider */}
          <div className="ml-3 pl-0.5 border-l-2 border-dashed border-gray-300 h-2"></div>

          {/* To station row */}
          <button
            onClick={() => setActiveInput('to')}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
              activeInput === 'to'
                ? 'bg-white shadow-xs ring-2 ring-rose-500'
                : 'hover:bg-gray-100/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100 shrink-0"></span>
              <span className="text-xs text-gray-500 font-medium">To (Your Stop):</span>
              <span className="text-sm font-bold text-gray-900">{destinationStation}</span>
            </div>
            {activeInput === 'to' && (
              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                Editing
              </span>
            )}
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeInput === 'from' ? 'origin' : 'destination'} station...`}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFC907] focus:bg-white transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stations List (Screenshot 3) */}
      <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-gray-100">
        {!search && (
          <div className="pb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1 py-1.5">
              Recent Searches
            </p>
            {STATIONS.filter((s) => s.isPopular).map((st) => (
              <button
                key={st.id}
                onClick={() => handleSelectStation(st.name)}
                className={`w-full flex items-center justify-between py-2.5 px-2 rounded-xl text-left hover:bg-gray-50 transition active:scale-[0.99] ${
                  (activeInput === 'from' ? originStation : destinationStation) === st.name
                    ? 'bg-amber-50 font-bold'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{st.name}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          st.line === 'blue' ? 'bg-[#0066CC]' : 'bg-[#E53E3E]'
                        }`}
                      ></span>
                      {st.lineName}
                    </p>
                  </div>
                </div>
                {(activeInput === 'from' ? originStation : destinationStation) === st.name && (
                  <span className="text-[10px] font-bold text-amber-800 bg-[#FFC907]/40 px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1 py-2">
            {search ? 'Search Results' : 'All Hyderabad Metro Stations'}
          </p>
          {filteredStations.map((st) => (
            <button
              key={st.id}
              onClick={() => handleSelectStation(st.name)}
              className={`w-full flex items-center justify-between py-2.5 px-2 rounded-xl text-left hover:bg-gray-50 transition active:scale-[0.99] ${
                (activeInput === 'from' ? originStation : destinationStation) === st.name
                  ? 'bg-amber-50 font-bold'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{st.name}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        st.line === 'blue' ? 'bg-[#0066CC]' : 'bg-[#E53E3E]'
                      }`}
                    ></span>
                    {st.lineName} • {st.platform}
                  </p>
                </div>
              </div>
              {(activeInput === 'from' ? originStation : destinationStation) === st.name && (
                <span className="text-[10px] font-bold text-amber-800 bg-[#FFC907]/40 px-2 py-0.5 rounded-full">
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <button
          onClick={onContinue}
          className="w-full py-3.5 px-4 bg-[#FFC907] hover:bg-[#ffbf00] active:scale-[0.98] text-gray-950 font-extrabold text-sm rounded-full shadow-md transition flex items-center justify-center gap-2"
        >
          <span>Continue to Add Passengers</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      <FooterDisclaimer />
    </div>
  );
}
