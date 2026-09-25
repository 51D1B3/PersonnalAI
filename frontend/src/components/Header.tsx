import React from 'react';
import { Plus, Bell, ShieldCheck } from 'lucide-react';
import { SearchBar } from './SearchBar';
import type { UserProfile } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAiMode?: boolean;
  onToggleAiMode?: () => void;
  onAddResource?: () => void;
  user?: UserProfile | null;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  isAiMode,
  onToggleAiMode,
  onAddResource,
  user
}) => {
  return (
    <header className="h-16 border-b border-[#222E42] bg-[#101622]/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isAiMode={isAiMode}
          onToggleAiMode={onToggleAiMode}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onAddResource}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-semibold text-xs sm:text-sm hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Ajouter une ressource</span>
          <span className="sm:hidden">Ajouter</span>
        </button>

        <div className="h-6 w-px bg-[#222E42] mx-1 hidden sm:block" />

        <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#151C28] transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#51D1B3]" />
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-[#222E42]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#51D1B3] to-cyan-500 flex items-center justify-center text-[#0B0F17] font-bold text-xs shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-gray-200 leading-tight">{user.name}</p>
              <span className="text-[10px] text-[#51D1B3] flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" /> Privé
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
