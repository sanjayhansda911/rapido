import { ArrowLeft, Headphones, HelpCircle, Ticket as TicketIcon } from 'lucide-react';
import type { ScreenType } from '../types/metro';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  rightType?: 'support' | 'help' | 'my_tickets' | 'none';
  onRightAction?: () => void;
  currentScreen?: ScreenType;
}

export function Header({
  title,
  onBack,
  showBack = true,
  rightType = 'support',
  onRightAction,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-gray-800 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
          </button>
        )}
        <h1 className="text-[19px] font-bold text-gray-900 tracking-tight leading-tight">
          {title}
        </h1>
      </div>

      <div>
        {rightType === 'support' && (
          <button
            onClick={onRightAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-[13px] font-semibold transition-all active:scale-95 shadow-sm"
          >
            <Headphones className="w-3.5 h-3.5 text-gray-700" />
            <span>Support</span>
          </button>
        )}

        {rightType === 'help' && (
          <button
            onClick={onRightAction}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4 text-gray-700" />
          </button>
        )}

        {rightType === 'my_tickets' && (
          <button
            onClick={onRightAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 text-[13px] font-semibold transition-all active:scale-95 shadow-sm"
          >
            <TicketIcon className="w-3.5 h-3.5 text-gray-700" />
            <span>My tickets</span>
          </button>
        )}
      </div>
    </header>
  );
}
