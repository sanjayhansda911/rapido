import { useState } from 'react';
import { 
  Clock, 
  Heart, 
  MapPin, 
  Navigation, 
  Package, 
  Search, 
  Train, 
  User, 
  Bike, 
  LayoutGrid, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { FooterDisclaimer } from '../components/FooterDisclaimer';

interface HomeScreenProps {
  onOpenMetro: () => void;
  onOpenMyTickets: () => void;
}

export function HomeScreen({ onOpenMetro, onOpenMyTickets }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'ride' | 'metro'>('metro');

  return (
    <div className="flex-1 flex flex-col bg-[#F7F8FA]">
      {/* Top Map Snippet with Pickup Location (Screenshot 4) */}
      <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0 border-b border-gray-200">
        {/* Stylized Map Vector Graphics */}
        <div className="absolute inset-0 bg-[#eef2f6]">
          {/* Street grid simulation */}
          <div className="absolute top-8 left-0 right-0 h-4 bg-white/80 rotate-1"></div>
          <div className="absolute top-24 left-0 right-0 h-6 bg-white/90 -rotate-2"></div>
          <div className="absolute top-0 bottom-0 left-20 w-5 bg-white/80 rotate-6"></div>
          <div className="absolute top-0 bottom-0 right-28 w-4 bg-white/70 -rotate-12"></div>
          
          {/* Metro Blue Line Route track on map */}
          <div className="absolute top-16 left-0 right-0 h-2 bg-[#0066CC]/30 border-y border-dashed border-[#0066CC]/60 rotate-3"></div>

          {/* Vehicle pins */}
          <div className="absolute top-10 left-36 w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-sm flex items-center justify-center">
            <Bike className="w-3 h-3 text-slate-900" />
          </div>
          <div className="absolute top-24 right-20 w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-sm flex items-center justify-center">
            <Train className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Floating Pickup Location Pill (Matches Screenshot 4) */}
        <div className="absolute top-3 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl py-2 px-3 shadow-md border border-gray-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0"></span>
          <p className="text-[11px] font-bold text-gray-800 truncate">
            80, Chilka Nagar Main Rd, Sneha Residency, Dharmap...
          </p>
        </div>

        {/* Tab switch between Ride and Metro (Matches Screenshot 4) */}
        <div className="absolute bottom-0 left-4 right-4 flex gap-2">
          <button
            onClick={() => setActiveTab('ride')}
            className={`flex-1 py-2.5 px-3 rounded-t-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
              activeTab === 'ride'
                ? 'bg-white text-gray-900 shadow-md border-t border-x border-gray-100'
                : 'bg-white/70 text-gray-500 hover:bg-white/90'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Ride</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('metro');
              onOpenMetro();
            }}
            className={`flex-1 py-2.5 px-3 rounded-t-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
              activeTab === 'metro'
                ? 'bg-white text-gray-900 shadow-md border-t border-x border-gray-100'
                : 'bg-white/70 text-gray-500 hover:bg-white/90'
            }`}
          >
            <Train className="w-3.5 h-3.5 text-[#1E62C4]" />
            <span>Metro</span>
            <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-bold">
              NEW
            </span>
          </button>
        </div>
      </div>

      {/* Main Home Screen Content */}
      <div className="flex-1 bg-white px-4 py-3 space-y-4 overflow-y-auto">
        {/* Where do you want to go Search Bar (Screenshot 4) */}
        <button
          onClick={onOpenMetro}
          className="w-full bg-gray-50 hover:bg-gray-100/80 border border-gray-200/90 rounded-full py-3 px-4 flex items-center gap-3 text-left transition shadow-xs group"
        >
          <Search className="w-4 h-4 text-gray-500 group-hover:text-gray-800" />
          <span className="text-sm font-semibold text-gray-500">
            Where do you want to go?
          </span>
        </button>

        {/* Recent Destinations List (Screenshot 4) */}
        <div className="divide-y divide-gray-100">
          {/* Chutneys */}
          <div className="py-2.5 flex items-center justify-between hover:bg-gray-50/50 rounded-xl px-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900 leading-tight">Chutneys</p>
                <p className="text-[11px] text-gray-400 truncate max-w-[240px]">
                  Sardar Patel Road, Rasoolpura, Sindhi Colony, Begumpet...
                </p>
              </div>
            </div>
            <Heart className="w-3.5 h-3.5 text-gray-300 hover:text-rose-500" />
          </div>

          {/* Uppal Metro Station */}
          <div 
            onClick={onOpenMetro}
            className="py-2.5 flex items-center justify-between hover:bg-gray-50/50 rounded-xl px-1 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#1E62C4] shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900 leading-tight flex items-center gap-1.5">
                  <span>Uppal Metro Station</span>
                  <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                    Blue Line
                  </span>
                </p>
                <p className="text-[11px] text-gray-400 truncate max-w-[240px]">
                  near Uppal Metro Station, Venkateswara Colony, Vijayapuri...
                </p>
              </div>
            </div>
            <Heart className="w-3.5 h-3.5 text-gray-300 hover:text-rose-500" />
          </div>

          {/* Kathiawar Stores Secunderabad */}
          <div className="py-2.5 flex items-center justify-between hover:bg-gray-50/50 rounded-xl px-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900 leading-tight">
                  Kathiawar Stores Secunderabad
                </p>
                <p className="text-[11px] text-gray-400 truncate max-w-[240px]">
                  Mahatma Gandhi Statue, Mahatma Gandhi Road, Kandoji B...
                </p>
              </div>
            </div>
            <Heart className="w-3.5 h-3.5 text-gray-300 hover:text-rose-500" />
          </div>
        </div>

        {/* Section: Everything In Minutes (Screenshot 4) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900">
              Everything In Minutes
            </h2>
            <button 
              onClick={onOpenMyTickets}
              className="text-xs text-blue-600 font-bold flex items-center gap-0.5"
            >
              <span>My Tickets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* HERO CARD: Metro Tickets with % Offers badge */}
            <div
              onClick={onOpenMetro}
              className="col-span-1 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-100/90 rounded-2xl p-3 cursor-pointer hover:shadow-md transition active:scale-[0.98] relative overflow-hidden flex flex-col justify-between h-36 group"
            >
              <div>
                <div className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full mb-1 shadow-2xs">
                  <span>%</span>
                  <span>Offers</span>
                </div>
                <h3 className="text-sm font-black text-gray-900 leading-snug">
                  Metro tickets
                </h3>
                <p className="text-[10px] text-blue-700 font-bold mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  <span>Group Booking Available</span>
                </p>
              </div>

              {/* Metro Train 3D Graphic */}
              <div className="self-end mt-1 flex items-center justify-end">
                <div className="w-16 h-12 rounded-xl bg-white/80 border border-blue-200/60 shadow-xs flex items-center justify-center group-hover:scale-105 transition">
                  <Train className="w-8 h-8 text-[#1E62C4]" />
                </div>
              </div>
            </div>

            {/* Parcel Card */}
            <div className="col-span-1 bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-100 rounded-2xl p-3 flex flex-col justify-between h-36">
              <div>
                <p className="text-[10px] text-gray-500 font-medium">Send anything</p>
                <h3 className="text-sm font-black text-gray-900 leading-snug">Parcel</h3>
              </div>
              <div className="self-end">
                <div className="w-14 h-12 rounded-xl bg-white/80 border border-amber-200/60 shadow-xs flex items-center justify-center">
                  <Package className="w-7 h-7 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Scooty Card */}
            <div className="col-span-1 bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col justify-between h-28">
              <div>
                <p className="text-[10px] text-gray-500 font-medium">Spacious & quick</p>
                <h3 className="text-xs font-black text-gray-900">Scooty</h3>
              </div>
              <div className="self-end">
                <Bike className="w-6 h-6 text-gray-700" />
              </div>
            </div>

            {/* All Services Card */}
            <div className="col-span-1 bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col justify-between h-28">
              <div>
                <p className="text-[10px] text-gray-500 font-medium">Explore all</p>
                <h3 className="text-xs font-black text-gray-900">All Services</h3>
              </div>
              <div className="self-end">
                <LayoutGrid className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentic Rapido Bottom Navigation Bar */}
      <div className="bg-white border-t border-gray-100 px-3 py-2 flex items-center justify-around select-none shrink-0 shadow-xs">
        <button className="flex flex-col items-center gap-0.5 text-gray-900">
          <Navigation className="w-4 h-4 stroke-[2.2] fill-gray-900" />
          <span className="text-[10px] font-bold">Ride</span>
        </button>

        <button className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gray-700">
          <Bike className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Ownly</span>
        </button>

        <button className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gray-700">
          <Package className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Parcel</span>
        </button>

        <button 
          onClick={onOpenMetro}
          className="flex flex-col items-center gap-0.5 text-[#1E62C4] font-bold"
        >
          <Train className="w-4 h-4 stroke-[2.2]" />
          <span className="text-[10px]">Metro</span>
        </button>

        <button 
          onClick={onOpenMyTickets}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gray-700"
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
      </div>

      <FooterDisclaimer />
    </div>
  );
}
