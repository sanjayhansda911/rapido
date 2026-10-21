import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative w-full max-w-[390px] h-[852px] max-h-[100dvh] bg-white rounded-[38px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.1),0_0_0_10px_#1e293b] flex flex-col overflow-hidden border-[6px] border-slate-800 transition-all">
      {/* Mobile Status Bar (Matches Screenshot 1 & 2) */}
      <div className="h-10 bg-white px-5 pt-2 pb-1 flex items-center justify-between text-gray-800 text-[12px] font-semibold select-none z-40 border-b border-gray-50/50">
        <div className="flex items-center gap-1.5">
          <span>9:20</span>
          {/* Subtle WhatsApp & notification dot indicators */}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-0.5"></span>
        </div>

        {/* Dynamic Island / Speaker notch simulation */}
        <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto self-start mt-0.5 opacity-90 flex items-center justify-end pr-2">
          <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-700">
          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1 rounded">VoNR</span>
          <span className="text-[10px] font-bold tracking-tight">5G</span>
          <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">83%</span>
            <Battery className="w-4 h-3.5 stroke-[2.2] fill-gray-700" />
          </div>
        </div>
      </div>

      {/* Main Screen Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-[#F7F8FA]">
        {children}
      </div>

      {/* Android 3-Button System Navigation Bar (Matches Screenshot 1, 2, 4) */}
      <div className="h-10 bg-white border-t border-gray-100 flex items-center justify-around px-8 select-none z-30">
        {/* Back button < */}
        <div className="text-gray-400 font-bold text-lg hover:text-gray-600 cursor-pointer">
          &lang;
        </div>
        {/* Home circle O */}
        <div className="w-4 h-4 rounded-full border-2 border-gray-400 hover:border-gray-600 cursor-pointer"></div>
        {/* Recents ||| */}
        <div className="flex gap-1 items-center hover:opacity-75 cursor-pointer">
          <div className="w-[3px] h-3.5 bg-gray-400 rounded-sm"></div>
          <div className="w-[3px] h-3.5 bg-gray-400 rounded-sm"></div>
          <div className="w-[3px] h-3.5 bg-gray-400 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}
