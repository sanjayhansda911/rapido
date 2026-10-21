import { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Search, Train, X } from 'lucide-react';
import { STATIONS } from '../data/mockStations';
import type { Station } from '../types/metro';

interface StationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (stationName: string) => void;
  currentSelected?: string;
  title?: string;
  mode?: 'from' | 'to';
}

export function StationPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentSelected,
  title = 'Select metro station',
}: StationPickerModalProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredStations = STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.lineName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[390px] h-full sm:h-[750px] bg-white sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Promotional Top Header Banner - Recreating Screenshot 3 */}
        <div className="bg-[#1E62C4] text-white p-4 pt-5 relative overflow-hidden shrink-0">
          <div className="flex items-center justify-between relative z-10">
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/90 hover:bg-white/20 transition active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold">
                Hyderabad Metro
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between relative z-10">
            <div>
              <p className="text-[11px] font-medium text-blue-100">Special Metro Offer</p>
              <h3 className="text-base font-extrabold tracking-tight">Get discount with</h3>
              <div className="inline-block bg-white text-[#1E62C4] text-xs font-black px-2.5 py-1 rounded-md mt-1 tracking-wider shadow-sm">
                METRO20
              </div>
            </div>
            {/* Illustrated Metro Train Graphic */}
            <div className="w-28 h-16 relative flex items-center justify-center">
              <div className="bg-white/10 rounded-xl p-2 flex items-center gap-1.5 border border-white/20">
                <Train className="w-9 h-9 text-white" />
                <div className="text-[10px] font-bold text-white/90 leading-tight">
                  Blue & Red<br/>Line HMRL
                </div>
              </div>
            </div>
          </div>
          <p className="text-[9px] text-blue-200 text-right mt-1">*T&C Apply</p>

          {/* Decorative curved wave */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Station Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="text-[17px] font-bold text-gray-900 mb-2.5">
            {title}
          </h2>

          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search station or line..."
              autoFocus
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFC907] focus:bg-white transition"
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

        {/* Stations List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-gray-100">
          {!search && (
            <div className="pb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1 py-1.5">
                Recent / Popular
              </p>
              {STATIONS.filter((s) => s.isPopular).map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    onSelect(st.name);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between py-2.5 px-2 rounded-xl text-left hover:bg-gray-50 transition active:scale-[0.99] ${
                    currentSelected === st.name ? 'bg-amber-50/80 font-bold' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[15px] font-semibold text-gray-900">
                        {st.name}
                      </p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            st.line === 'blue' ? 'bg-[#0066CC]' : 'bg-[#E53E3E]'
                          }`}
                        ></span>
                        {st.lineName}
                      </p>
                    </div>
                  </div>
                  {currentSelected === st.name && (
                    <span className="text-[11px] font-bold text-amber-700 bg-[#FFC907]/30 px-2 py-0.5 rounded-full">
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
            {filteredStations.map((st: Station) => (
              <button
                key={st.id}
                onClick={() => {
                  onSelect(st.name);
                  onClose();
                }}
                className={`w-full flex items-center justify-between py-2.5 px-2 rounded-xl text-left hover:bg-gray-50 transition active:scale-[0.99] ${
                  currentSelected === st.name ? 'bg-amber-50 font-bold' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[15px] font-semibold text-gray-900">
                      {st.name}
                    </p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          st.line === 'blue' ? 'bg-[#0066CC]' : 'bg-[#E53E3E]'
                        }`}
                      ></span>
                      {st.lineName} • {st.platform}
                    </p>
                  </div>
                </div>
                {currentSelected === st.name && (
                  <span className="text-[11px] font-bold text-amber-800 bg-[#FFC907]/30 px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </button>
            ))}

            {filteredStations.length === 0 && (
              <div className="py-8 text-center text-gray-400 text-sm">
                No metro stations found matching &ldquo;{search}&rdquo;
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
