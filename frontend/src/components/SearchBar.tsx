import React from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAiMode?: boolean;
  onToggleAiMode?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  isAiMode = false,
  onToggleAiMode,
  placeholder = "🔎 Que recherches-tu ? (Ex: React hooks, Capture erreur...)"
}) => {
  return (
    <div className="relative w-full max-w-2xl flex items-center gap-2">
      <div className="relative flex-1">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
          {isAiMode ? (
            <Sparkles className="w-4 h-4 text-[#51D1B3] animate-pulse" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={isAiMode ? "🤖 Posez une question naturelle à votre IA (ex: Retrouve le cours React)..." : placeholder}
          className={`w-full bg-[#151C28] border ${
            isAiMode ? 'border-[#51D1B3]/60 focus:ring-[#51D1B3]' : 'border-[#222E42] focus:border-[#51D1B3]'
          } rounded-xl pl-10 pr-9 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#51D1B3] transition-all shadow-inner`}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            title="Effacer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {onToggleAiMode && (
        <button
          onClick={onToggleAiMode}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            isAiMode
              ? 'bg-[#51D1B3]/20 text-[#51D1B3] border-[#51D1B3]/40 shadow-sm shadow-[#51D1B3]/20'
              : 'bg-[#151C28] text-gray-400 border-[#222E42] hover:text-gray-200 hover:border-gray-600'
          }`}
          title="Basculez vers la recherche intelligente IA"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">IA Mode</span>
        </button>
      )}
    </div>
  );
};
