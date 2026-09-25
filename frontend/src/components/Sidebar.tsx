import React from 'react';
import { 
  Home, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  StickyNote, 
  Sparkles, 
  Settings, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import type { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  user?: UserProfile | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  user,
  onLogout
}) => {
  const navItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'videos', label: 'Vidéos', icon: Video },
    { id: 'liens', label: 'Liens', icon: LinkIcon },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'recherche', label: 'Recherche IA', icon: Sparkles, highlight: true },
    { id: 'parametres', label: 'Paramètres', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#101622] border-r border-[#222E42] flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#222E42] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="PersonalAI Logo" 
            className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-[#51D1B3]/20 shrink-0" 
          />
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-wide leading-tight">
              Personal<span className="text-[#51D1B3]">AI</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">Mémoire Privée</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-[#51D1B3]/15 text-[#51D1B3] border border-[#51D1B3]/30 shadow-sm shadow-[#51D1B3]/10 font-semibold' 
                  : item.highlight
                  ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200'
                  : 'text-gray-400 hover:bg-[#151C28] hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#51D1B3]' : item.highlight ? 'text-amber-400' : 'text-gray-400'}`} />
              <span>{item.label}</span>
              {item.highlight && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  IA
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Account / Security Status */}
      <div className="p-4 border-t border-[#222E42] bg-[#0B0F17]/40">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#151C28] border border-[#222E42]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#51D1B3] to-cyan-500 flex items-center justify-center text-[#0B0F17] font-bold text-xs shadow-md">
            {user ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-200 truncate">{user ? user.name : 'Utilisateur'}</p>
            <p className="text-[10px] text-[#51D1B3] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Accès Autorisé
            </p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-[#0B0F17] transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
