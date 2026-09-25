import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  StickyNote, 
  Tag, 
  ExternalLink,
  Sparkles,
  Inbox,
  Clock
} from 'lucide-react';
import type { ResourceItem, UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
  resources: ResourceItem[];
  searchQuery: string;
  filterType: string;
  onFilterChange: (type: string) => void;
  activeTab: string;
  onAddClick?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  resources,
  searchQuery,
  filterType,
  onFilterChange,
  activeTab,
  onAddClick
}) => {
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'IMAGE': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'LINK': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'NOTE': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'VIDEO': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'documents': return '📄 Documents & Fichiers PDF';
      case 'images': return '🖼️ Images & Captures d\'écran';
      case 'videos': return '🎥 Vidéos & Multimédia';
      case 'liens': return '🔗 Liens & Marques-pages';
      case 'notes': return '📝 Notes & Mémos Personnels';
      case 'recherche': return '🤖 Recherche Intelligente IA';
      case 'parametres': return '⚙️ Paramètres & Configuration';
      default: return 'Accueil';
    }
  };

  const countPdf = resources.filter(r => r.type === 'PDF').length;
  const countImg = resources.filter(r => r.type === 'IMAGE').length;
  const countLink = resources.filter(r => r.type === 'LINK').length;
  const countNote = resources.filter(r => r.type === 'NOTE').length;

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-[#151C28] via-[#101622] to-[#151C28] border border-[#222E42] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#51D1B3]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#51D1B3] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> PersonalAI • Tableau de bord
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Bonjour {user.name} 👋
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mt-2 leading-relaxed">
            Bienvenue sur votre coffre-fort numérique. Vos connaissances, documents et notes sont centralisés et sécurisés.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-[#0B0F17]/70 border border-[#222E42] flex items-center gap-3.5 hover:border-[#51D1B3]/30 transition-all">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">PDF & Docs</p>
                <p className="text-xl font-bold text-white">{countPdf}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F17]/70 border border-[#222E42] flex items-center gap-3.5 hover:border-[#51D1B3]/30 transition-all">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Images</p>
                <p className="text-xl font-bold text-white">{countImg}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F17]/70 border border-[#222E42] flex items-center gap-3.5 hover:border-[#51D1B3]/30 transition-all">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Liens Web</p>
                <p className="text-xl font-bold text-white">{countLink}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0F17]/70 border border-[#222E42] flex items-center gap-3.5 hover:border-[#51D1B3]/30 transition-all">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <StickyNote className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Notes</p>
                <p className="text-xl font-bold text-white">{countNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Type Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            {getTabTitle(activeTab)}
          </h3>
          {searchQuery && (
            <p className="text-xs text-gray-400 mt-1">
              Résultats de recherche pour <span className="text-[#51D1B3] font-medium">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PDF', 'IMAGE', 'LINK', 'NOTE'].map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterType === type 
                  ? 'bg-[#51D1B3] text-[#0B0F17] shadow-md shadow-[#51D1B3]/20' 
                  : 'bg-[#151C28] text-gray-400 border border-[#222E42] hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              {type === 'ALL' ? 'Tous les types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {resources.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#151C28]/40 border border-[#222E42] flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#222E42]/50 flex items-center justify-center text-gray-400 mb-4">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-gray-200">Aucune ressource trouvée</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            {searchQuery 
              ? `Aucun élément ne correspond à votre recherche "${searchQuery}".` 
              : "Aucune ressource n'a encore été ajoutée dans cette section."}
          </p>
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="mt-4 px-4 py-2 rounded-xl bg-[#51D1B3]/10 text-[#51D1B3] border border-[#51D1B3]/20 text-xs font-semibold hover:bg-[#51D1B3]/20 transition-all"
            >
              + Ajouter une ressource
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((item) => (
            <div 
              key={item.id} 
              className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/50 transition-all duration-200 group flex flex-col justify-between hover:shadow-lg hover:shadow-[#51D1B3]/5"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getTypeBadgeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.date}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-[#51D1B3] transition-colors mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300 font-medium">
                      <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#222E42]/80 flex items-center justify-between text-xs text-gray-400">
                  <span className="text-[11px] text-gray-400">
                    Catégorie: <strong className="text-gray-200 font-normal">{item.category}</strong>
                  </span>
                  <button className="text-[#51D1B3] hover:underline flex items-center gap-1 font-semibold text-xs cursor-pointer">
                    Consulter <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
