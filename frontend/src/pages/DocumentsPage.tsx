import React, { useState } from 'react';
import { FileText, Plus, Tag, Search } from 'lucide-react';
import type { ResourceItem, UserProfile } from '../types';
import { isOwnerEmail } from '../types';
import { ResourceActionMenu } from '../components/ResourceActionMenu';

interface DocumentsPageProps {
  resources: ResourceItem[];
  user?: UserProfile | null;
  onAddClick: () => void;
  onOpenResource: (resource: ResourceItem) => void;
  onDownloadResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (resource: ResourceItem) => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  resources,
  user,
  onAddClick,
  onOpenResource,
  onDownloadResource,
  onEditResource,
  onDeleteResource,
}) => {
  const canAdd = isOwnerEmail(user?.email);
  const [docSearch, setDocSearch] = useState('');
  const pdfResources = resources.filter((r) => r.type === 'PDF');

  const filteredDocs = pdfResources.filter(
    (doc) =>
      doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.description.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(docSearch.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#151C28] border border-[#222E42]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Documents & Fichiers PDF</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Vos documents et fichiers PDF personnels.
            </p>
          </div>
        </div>

        {canAdd && (
          <button
            onClick={onAddClick}
            className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" /> Ajouter un PDF
          </button>
        )}
      </div>

      {/* Filter & Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={docSearch}
          onChange={(e) => setDocSearch(e.target.value)}
          placeholder="Filtrer les PDF..."
          className="w-full bg-[#151C28] border border-[#222E42] rounded-xl pl-10 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
        />
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="p-10 text-center bg-[#151C28] border border-[#222E42] rounded-3xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Aucun document PDF</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Aucun document n'a encore été importé.
          </p>
          {canAdd && (
            <button
              onClick={onAddClick}
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#51D1B3]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un PDF</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative group"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white hover:text-[#51D1B3] transition-colors truncate">
                      {doc.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-2xl">
                    {doc.description}
                  </p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {doc.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300"
                      >
                        <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                        {tag}
                      </span>
                    ))}
                    <span className="text-[11px] text-gray-400 ml-2">Ajouté le {doc.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {/* 3-Dots Vertical Action Menu */}
                <ResourceActionMenu
                  resource={doc}
                  onOpen={onOpenResource}
                  onDownload={onDownloadResource}
                  onEdit={onEditResource}
                  onDelete={onDeleteResource}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

