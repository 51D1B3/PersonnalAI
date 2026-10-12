import React, { useState } from 'react';
import { StickyNote, Plus, ShieldCheck } from 'lucide-react';
import type { ResourceItem, UserProfile } from '../types';
import { isOwnerEmail } from '../types';
import { ResourceActionMenu } from '../components/ResourceActionMenu';

interface NotesPageProps {
  resources: ResourceItem[];
  user?: UserProfile | null;
  onAddClick: () => void;
  onOpenResource: (resource: ResourceItem) => void;
  onDownloadResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (resource: ResourceItem) => void;
}

export const NotesPage: React.FC<NotesPageProps> = ({
  resources,
  user,
  onAddClick,
  onOpenResource,
  onDownloadResource,
  onEditResource,
  onDeleteResource,
}) => {
  const canAdd = isOwnerEmail(user?.email);
  const noteResources = resources.filter((r) => r.type === 'NOTE');
  const [selectedNote, setSelectedNote] = useState<ResourceItem | null>(
    noteResources[0] || null
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#151C28] border border-[#222E42]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <StickyNote className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Notes & Mémos Privés</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Prise de notes sécurisée et coffre-fort pour vos mémos techniques.
            </p>
          </div>
        </div>

        {canAdd && (
          <button
            onClick={onAddClick}
            className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" /> Nouvelle note
          </button>
        )}
      </div>

      {/* Split Pane: Notes List & Note Details */}
      {noteResources.length === 0 ? (
        <div className="p-10 text-center bg-[#151C28] border border-[#222E42] rounded-3xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <StickyNote className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Aucune note privée</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Votre coffre-fort de notes est vide.
          </p>
          {canAdd && (
            <button
              onClick={onAddClick}
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#51D1B3]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle note</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
          {/* Notes List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Vos notes ({noteResources.length})
            </h3>
            {noteResources.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  selectedNote?.id === note.id
                    ? 'bg-[#51D1B3]/15 border-[#51D1B3] shadow-md shadow-[#51D1B3]/10'
                    : 'bg-[#151C28] border-[#222E42] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4
                    className={`text-sm font-bold truncate ${
                      selectedNote?.id === note.id ? 'text-[#51D1B3]' : 'text-white'
                    }`}
                  >
                    {note.title}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-gray-400">{note.date}</span>
                    <ResourceActionMenu
                      resource={note}
                      onOpen={onOpenResource}
                      onDownload={onDownloadResource}
                      onEdit={onEditResource}
                      onDelete={onDeleteResource}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                  {note.description}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {note.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#0B0F17] text-gray-400 border border-[#222E42]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Note Viewer / Editor Panel */}
          <div className="lg:col-span-8 bg-[#151C28] border border-[#222E42] rounded-3xl p-6 flex flex-col justify-between">
            {selectedNote ? (
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#222E42]">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {selectedNote.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="text-[#51D1B3] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Privé
                      </span>
                    </div>
                  </div>

                  <ResourceActionMenu
                    resource={selectedNote}
                    onOpen={onOpenResource}
                    onDownload={onDownloadResource}
                    onEdit={onEditResource}
                    onDelete={onDeleteResource}
                  />
                </div>

                {/* Note Content Display */}
                <div className="prose prose-invert max-w-none text-xs sm:text-sm text-gray-300 space-y-4">
                  <p className="leading-relaxed">{selectedNote.description}</p>

                  <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#222E42] font-mono text-xs text-gray-300 space-y-1">
                    <p className="text-amber-400 font-bold">// Contenu de la note :</p>
                    <p>{selectedNote.noteContent || selectedNote.description}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                Sélectionnez une note à afficher
              </div>
            )}

            {selectedNote && (
              <div className="pt-4 mt-6 border-t border-[#222E42] flex items-center justify-between text-xs text-gray-400">
                <span>Modifié le {selectedNote.date}</span>
                <span className="text-[#51D1B3] font-semibold">Stockage Privé</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

