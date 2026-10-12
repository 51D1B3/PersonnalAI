import React from 'react';
import { Link as LinkIcon, ExternalLink, Globe, Tag, Plus, Copy } from 'lucide-react';
import type { ResourceItem, UserProfile } from '../types';
import { isOwnerEmail } from '../types';
import { ResourceActionMenu } from '../components/ResourceActionMenu';

interface LiensPageProps {
  resources: ResourceItem[];
  user?: UserProfile | null;
  onAddClick: () => void;
  onOpenResource: (resource: ResourceItem) => void;
  onDownloadResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (resource: ResourceItem) => void;
}

export const LiensPage: React.FC<LiensPageProps> = ({
  resources,
  user,
  onAddClick,
  onOpenResource,
  onDownloadResource,
  onEditResource,
  onDeleteResource,
}) => {
  const canAdd = isOwnerEmail(user?.email);
  const linkResources = resources.filter((r) => r.type === 'LINK');

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#151C28] border border-[#222E42]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <LinkIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Liens & Marques-pages</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Centralisez vos documentations, outils et ressources web incontournables.
            </p>
          </div>
        </div>

        {canAdd && (
          <button
            onClick={onAddClick}
            className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" /> Enregistrer un lien
          </button>
        )}
      </div>

      {/* Links Grid */}
      {linkResources.length === 0 ? (
        <div className="p-10 text-center bg-[#151C28] border border-[#222E42] rounded-3xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <LinkIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Aucun lien enregistré</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Aucun lien web n'a encore été ajouté. Enregistrez vos documentations, tutoriels ou outils web préférés.
          </p>
          {canAdd && (
            <button
              onClick={onAddClick}
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#51D1B3]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer un lien</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {linkResources.map((link) => (
            <div
              key={link.id}
              className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/40 transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Lien
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">{link.date}</span>
                    <ResourceActionMenu
                      resource={link}
                      onOpen={onOpenResource}
                      onDownload={onDownloadResource}
                      onEdit={onEditResource}
                      onDelete={onDeleteResource}
                    />
                  </div>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-[#51D1B3] transition-colors mb-1">
                  {link.title}
                </h4>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  {link.description}
                </p>

                {link.url && (
                  <div className="p-2.5 rounded-xl bg-[#0B0F17] border border-[#222E42] text-xs text-blue-400 flex items-center justify-between gap-2 mb-4 truncate font-mono">
                    <span className="truncate">{link.url}</span>
                    <button
                      onClick={() => navigator.clipboard?.writeText(link.url || '')}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Copier le lien"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  {link.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300">
                      <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#222E42] flex items-center justify-end">
                  <a
                    href={link.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#51D1B3] text-[#0B0F17] text-xs font-bold hover:bg-[#3EB89B] transition-all flex items-center gap-1.5 shadow-sm shadow-[#51D1B3]/20"
                  >
                    <span>Visiter le site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

