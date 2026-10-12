import React from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from './SearchBar';
import type { UserProfile } from '../types';
import { isOwnerEmail } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAiMode?: boolean;
  onAddResource?: () => void;
  user?: UserProfile | null;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  isAiMode,
  onAddResource,
  user
}) => {
  const canAdd = isOwnerEmail(user?.email);

  return (
    <header className="h-16 border-b border-[#222E42] bg-[#101622]/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isAiMode={isAiMode}
        />
      </div>

      <div className="flex items-center gap-3">
        {canAdd && (
          <button
            onClick={onAddResource}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-semibold text-xs sm:text-sm hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter une ressource</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        )}
      </div>
    </header>
  );
};

