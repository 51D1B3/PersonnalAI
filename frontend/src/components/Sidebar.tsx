import React from 'react';
import { 
  Home, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  StickyNote, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Lock,
  Plus
} from 'lucide-react';
import type { UserProfile, NavigationPermissions } from '../types';
import { isOwnerEmail } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  user?: UserProfile | null;
  permissions?: NavigationPermissions;
  onLogout?: () => void;
  onAddResource?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  user,
  permissions,
  onLogout,
  onAddResource
}) => {
  const canAdd = isOwnerEmail(user?.email);

  const navItems: { id: keyof NavigationPermissions; label: string; icon: any }[] = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'videos', label: 'Vidéos', icon: Video },
    { id: 'liens', label: 'Liens', icon: LinkIcon },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'parametres', label: 'Paramètres', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#101622] border-r border-[#222E42] flex flex-col h-screen select-none shrink-0">
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

      {/* Add Resource Button on Panneau (Sidebar) */}
      {canAdd && onAddResource && (
        <div className="p-4 pb-0">
          <button
            onClick={onAddResource}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une ressource</span>
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAllowed = permissions ? permissions[item.id] !== false : true;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isAllowed) {
                  onTabChange(item.id);
                }
              }}
              disabled={!isAllowed}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                !isAllowed
                  ? 'text-gray-600 bg-[#0B0F17]/50 cursor-not-allowed opacity-50'
                  : isActive 
                  ? 'bg-[#51D1B3]/15 text-[#51D1B3] border border-[#51D1B3]/30 shadow-sm shadow-[#51D1B3]/10 font-semibold cursor-pointer' 
                  : 'text-gray-400 hover:bg-[#151C28] hover:text-gray-200 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${!isAllowed ? 'text-gray-600' : isActive ? 'text-[#51D1B3]' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {!isAllowed && <Lock className="w-3.5 h-3.5 text-gray-600" />}
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
              className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-[#0B0F17] transition-colors cursor-pointer"
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

