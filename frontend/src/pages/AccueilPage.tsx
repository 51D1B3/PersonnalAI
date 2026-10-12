import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  StickyNote, 
  Tag, 
  Clock
} from 'lucide-react';
import type { ResourceItem, UserProfile, NavigationPermissions } from '../types';
import { isOwnerEmail } from '../types';
import { ResourceActionMenu } from '../components/ResourceActionMenu';

interface AccueilPageProps {
  user: UserProfile;
  resources: ResourceItem[];
  permissions?: NavigationPermissions;
  onNavigateToTab: (tabId: string) => void;
  onAddClick: () => void;
  onOpenResource: (resource: ResourceItem) => void;
  onDownloadResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (resource: ResourceItem) => void;
}

export const AccueilPage: React.FC<AccueilPageProps> = ({
  user,
  resources,
  permissions,
  onNavigateToTab,
  onAddClick,
  onOpenResource,
  onDownloadResource,
  onEditResource,
  onDeleteResource,
}) => {
  const canAdd = isOwnerEmail(user.email);

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

  const canDoc = permissions ? permissions.documents !== false : true;
  const canImg = permissions ? permissions.images !== false : true;
  const canVideo = permissions ? permissions.videos !== false : true;
  const canLink = permissions ? permissions.liens !== false : true;
  const canNote = permissions ? permissions.notes !== false : true;

  const countPdf = canDoc ? resources.filter(r => r.type === 'PDF').length : '-';
  const countImg = canImg ? resources.filter(r => r.type === 'IMAGE').length : '-';
  const countVideo = canVideo ? resources.filter(r => r.type === 'VIDEO').length : '-';
  const countLink = canLink ? resources.filter(r => r.type === 'LINK').length : '-';
  const countNote = canNote ? resources.filter(r => r.type === 'NOTE').length : '-';

  // Filter recent resources to only include permitted types
  const visibleResources = resources.filter(r => {
    if (r.type === 'PDF' && !canDoc) return false;
    if (r.type === 'IMAGE' && !canImg) return false;
    if (r.type === 'VIDEO' && !canVideo) return false;
    if (r.type === 'LINK' && !canLink) return false;
    if (r.type === 'NOTE' && !canNote) return false;
    return true;
  });

  const totalVisibleCount = visibleResources.length;
  const recentResources = visibleResources.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Hero Welcome Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-[#151C28] via-[#101622] to-[#151C28] border border-[#222E42] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#51D1B3]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            Votre espace sécurisé centralise <span className="text-white font-medium">{totalVisibleCount} ressources</span> privées.
          </p>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            <button
              onClick={() => canDoc && onNavigateToTab('documents')}
              disabled={!canDoc}
              className={`p-3.5 rounded-2xl border text-left transition-all group ${
                canDoc 
                  ? 'bg-[#0B0F17]/80 border-[#222E42] hover:border-[#51D1B3]/40 cursor-pointer' 
                  : 'bg-[#0B0F17]/40 border-[#222E42]/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 w-fit mb-2 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 font-medium">PDF & Docs</p>
              <p className="text-lg font-bold text-white">{countPdf}</p>
            </button>

            <button
              onClick={() => canImg && onNavigateToTab('images')}
              disabled={!canImg}
              className={`p-3.5 rounded-2xl border text-left transition-all group ${
                canImg 
                  ? 'bg-[#0B0F17]/80 border-[#222E42] hover:border-[#51D1B3]/40 cursor-pointer' 
                  : 'bg-[#0B0F17]/40 border-[#222E42]/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-2 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Images / OCR</p>
              <p className="text-lg font-bold text-white">{countImg}</p>
            </button>

            <button
              onClick={() => canVideo && onNavigateToTab('videos')}
              disabled={!canVideo}
              className={`p-3.5 rounded-2xl border text-left transition-all group ${
                canVideo 
                  ? 'bg-[#0B0F17]/80 border-[#222E42] hover:border-[#51D1B3]/40 cursor-pointer' 
                  : 'bg-[#0B0F17]/40 border-[#222E42]/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-2 group-hover:scale-105 transition-transform">
                <Video className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Vidéos</p>
              <p className="text-lg font-bold text-white">{countVideo}</p>
            </button>

            <button
              onClick={() => canLink && onNavigateToTab('liens')}
              disabled={!canLink}
              className={`p-3.5 rounded-2xl border text-left transition-all group ${
                canLink 
                  ? 'bg-[#0B0F17]/80 border-[#222E42] hover:border-[#51D1B3]/40 cursor-pointer' 
                  : 'bg-[#0B0F17]/40 border-[#222E42]/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit mb-2 group-hover:scale-105 transition-transform">
                <LinkIcon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Liens Web</p>
              <p className="text-lg font-bold text-white">{countLink}</p>
            </button>

            <button
              onClick={() => canNote && onNavigateToTab('notes')}
              disabled={!canNote}
              className={`p-3.5 rounded-2xl border text-left transition-all group col-span-2 sm:col-span-1 ${
                canNote 
                  ? 'bg-[#0B0F17]/80 border-[#222E42] hover:border-[#51D1B3]/40 cursor-pointer' 
                  : 'bg-[#0B0F17]/40 border-[#222E42]/50 opacity-60 cursor-not-allowed'
              }`}
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

      {/* Recent Resources Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#51D1B3]" />
          <h3 className="text-lg font-bold text-white">Ressources récemment ajoutées</h3>
        </div>
        {canAdd && (
          <button
            onClick={onAddClick}
            className="text-xs text-[#51D1B3] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            + Ajouter une ressource
          </button>
        )}
      </div>

      {/* Resources Cards */}
      {recentResources.length === 0 ? (
        <div className="p-10 text-center bg-[#151C28] border border-[#222E42] rounded-3xl space-y-3">
          <h3 className="text-base font-bold text-white">Aucune ressource enregistrée</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Votre espace PersonalAI est prêt.
          </p>
          {canAdd && (
            <button
              onClick={onAddClick}
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#51D1B3]/20"
            >
              <span>+ Ajouter une ressource</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentResources.map((item) => (
            <div 
              key={item.id} 
              className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/50 transition-all group flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getTypeBadgeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">{item.date}</span>
                    <ResourceActionMenu
                      resource={item}
                      onOpen={onOpenResource}
                      onDownload={onDownloadResource}
                      onEdit={onEditResource}
                      onDelete={onDeleteResource}
                    />
                  </div>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-[#51D1B3] transition-colors mb-1.5 truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300">
                      <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

