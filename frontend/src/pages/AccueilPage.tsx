import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  StickyNote, 
  Tag, 
  ExternalLink,
  Sparkles,
  Clock,
  ArrowRight
} from 'lucide-react';
import type { ResourceItem, UserProfile } from '../types';

interface AccueilPageProps {
  user: UserProfile;
  resources: ResourceItem[];
  onNavigateToTab: (tabId: string) => void;
  onAddClick: () => void;
}

export const AccueilPage: React.FC<AccueilPageProps> = ({
  user,
  resources,
  onNavigateToTab,
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

  const countPdf = resources.filter(r => r.type === 'PDF').length;
  const countImg = resources.filter(r => r.type === 'IMAGE').length;
  const countLink = resources.filter(r => r.type === 'LINK').length;
  const countNote = resources.filter(r => r.type === 'NOTE').length;
  const countVideo = resources.filter(r => r.type === 'VIDEO').length;

  const recentResources = resources.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-[#151C28] via-[#101622] to-[#151C28] border border-[#222E42] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#51D1B3]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#51D1B3] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> PersonalAI • Ma Mémoire Numérique
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Bonjour {user.name} 👋
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mt-2 leading-relaxed">
            Votre espace sécurisé centralise <span className="text-white font-medium">{resources.length} ressources</span> privées. Posez une question naturelle ou parcourez vos documents.
          </p>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            <button
              onClick={() => onNavigateToTab('documents')}
              className="p-3.5 rounded-2xl bg-[#0B0F17]/80 border border-[#222E42] hover:border-[#51D1B3]/40 text-left transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 w-fit mb-2 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 font-medium">PDF & Docs</p>
              <p className="text-lg font-bold text-white">{countPdf}</p>
            </button>

            <button
              onClick={() => onNavigateToTab('images')}
              className="p-3.5 rounded-2xl bg-[#0B0F17]/80 border border-[#222E42] hover:border-[#51D1B3]/40 text-left transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-2 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Images / OCR</p>
              <p className="text-lg font-bold text-white">{countImg}</p>
            </button>

            <button
              onClick={() => onNavigateToTab('videos')}
              className="p-3.5 rounded-2xl bg-[#0B0F17]/80 border border-[#222E42] hover:border-[#51D1B3]/40 text-left transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-2 group-hover:scale-105 transition-transform">
                <Video className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Vidéos</p>
              <p className="text-lg font-bold text-white">{countVideo}</p>
            </button>

            <button
              onClick={() => onNavigateToTab('liens')}
              className="p-3.5 rounded-2xl bg-[#0B0F17]/80 border border-[#222E42] hover:border-[#51D1B3]/40 text-left transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit mb-2 group-hover:scale-105 transition-transform">
                <LinkIcon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Liens Web</p>
              <p className="text-lg font-bold text-white">{countLink}</p>
            </button>

            <button
              onClick={() => onNavigateToTab('notes')}
              className="p-3.5 rounded-2xl bg-[#0B0F17]/80 border border-[#222E42] hover:border-[#51D1B3]/40 text-left transition-all group col-span-2 sm:col-span-1"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-2 group-hover:scale-105 transition-transform">
                <StickyNote className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Notes Vault</p>
              <p className="text-lg font-bold text-white">{countNote}</p>
            </button>
          </div>
        </div>
      </div>

      {/* AI Quick Search Prompt Feature */}
      <div className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#51D1B3]/15 text-[#51D1B3] flex items-center justify-center shrink-0 border border-[#51D1B3]/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Recherche Intelligente Ollama / pgvector</h4>
            <p className="text-xs text-gray-400">Posez des questions directes dans votre base documentaire chiffrée.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('recherche')}
          className="px-4 py-2 rounded-xl bg-[#51D1B3]/10 text-[#51D1B3] hover:bg-[#51D1B3]/20 border border-[#51D1B3]/30 text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Essayer la recherche IA</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recent Resources Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#51D1B3]" />
          <h3 className="text-lg font-bold text-white">Ressources récemment ajoutées</h3>
        </div>
        <button
          onClick={onAddClick}
          className="text-xs text-[#51D1B3] hover:underline font-semibold flex items-center gap-1"
        >
          + Ajouter une ressource
        </button>
      </div>

      {/* Resources Cards */}
      {recentResources.length === 0 ? (
        <div className="p-10 text-center bg-[#151C28] border border-[#222E42] rounded-3xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#51D1B3]/10 text-[#51D1B3] flex items-center justify-center border border-[#51D1B3]/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Aucune ressource enregistrée</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Votre mémoire numérique PersonalAI est prête et réinitialisée. Cliquez ci-dessous pour ajouter votre premier document, image, lien ou note.
          </p>
          <button
            onClick={onAddClick}
            className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#51D1B3]/20"
          >
            <span>+ Ajouter une ressource</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentResources.map((item) => (
            <div 
              key={item.id} 
              className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getTypeBadgeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <span className="text-[11px] text-gray-400">{item.date}</span>
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
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300">
                      <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#222E42]/80 flex items-center justify-between text-xs text-gray-400">
                  <span className="text-[11px] text-gray-400">Catégorie: <strong className="text-gray-200 font-normal">{item.category}</strong></span>
                  <button className="text-[#51D1B3] hover:underline flex items-center gap-1 font-semibold text-xs cursor-pointer">
                    Ouvrir <ExternalLink className="w-3 h-3" />
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
