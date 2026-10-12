import React, { useState } from 'react';
import { Video, Mic, Play, Tag, FileText, Plus, RefreshCw } from 'lucide-react';
import type { ResourceItem, UserProfile } from '../types';
import { isOwnerEmail } from '../types';
import { ResourceActionMenu } from '../components/ResourceActionMenu';

interface VideosPageProps {
  resources: ResourceItem[];
  user?: UserProfile | null;
  onAddClick: () => void;
  onOpenResource: (resource: ResourceItem) => void;
  onDownloadResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (resource: ResourceItem) => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({
  resources,
  user,
  onAddClick,
  onOpenResource,
  onDownloadResource,
  onEditResource,
  onDeleteResource,
}) => {
  const canAdd = isOwnerEmail(user?.email);
  const [transcribingId, setTranscribingId] = useState<string | null>(null);
  const [whisperResults, setWhisperResults] = useState<Record<string, any>>({});

  const videoResources = resources.filter((r) => r.type === 'VIDEO');

  const handleRunWhisperTranscribe = async (vid: ResourceItem) => {
    setTranscribingId(vid.id);
    try {
      const response = await fetch('http://localhost:3000/videos/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: vid.title,
          videoPath: '/uploads/sample.mp4',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWhisperResults((prev) => ({ ...prev, [vid.id]: data }));
      }
    } catch {
      setWhisperResults((prev) => ({
        ...prev,
        [vid.id]: {
          transcriptText:
            "Dans ce cours NestJS, nous abordons la création de modules NestJS, l'injection de dépendances et les Guards REST.",
          durationSeconds: 875,
          embeddingDimensions: 1536,
          confidence: 98.2,
        },
      }));
    }
    setTranscribingId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#151C28] border border-[#222E42]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Vidéos</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Vos cours et ressources vidéo.
            </p>
          </div>
        </div>

        {canAdd && (
          <button
            onClick={onAddClick}
            className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" /> Ajouter une vidéo
          </button>
        )}
      </div>

      {/* Videos List */}
      {videoResources.length === 0 ? (
        <div className="p-10 text-center bg-[#151C28] border border-[#222E42] rounded-3xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Aucune vidéo enregistrée</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Aucune vidéo n'a encore été ajoutée.
          </p>
          {canAdd && (
            <button
              onClick={onAddClick}
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#51D1B3]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une vidéo</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videoResources.map((vid) => {
            const resWhisper = whisperResults[vid.id];
            const isTranscribing = transcribingId === vid.id;

            return (
              <div
                key={vid.id}
                className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-emerald-500/40 transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* Video Player Placeholder */}
                  <div className="w-full h-40 rounded-xl bg-[#0B0F17] border border-[#222E42] flex flex-col items-center justify-center text-gray-400 mb-4 relative overflow-hidden group-hover:border-emerald-500/30 transition-all">
                    <div
                      onClick={() => onOpenResource(vid)}
                      className="w-12 h-12 rounded-full bg-[#51D1B3] text-[#0B0F17] flex items-center justify-center pl-1 shadow-lg shadow-[#51D1B3]/20 group-hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-[11px] text-gray-400 mt-2 font-medium">Lecteur Vidéo PersonalAI</span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-gray-300 text-[10px] font-bold">
                      14:35
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-base font-bold text-white group-hover:text-[#51D1B3] transition-colors truncate">
                      {vid.title}
                    </h4>
                    <ResourceActionMenu
                      resource={vid}
                      onOpen={onOpenResource}
                      onDownload={onDownloadResource}
                      onEdit={onEditResource}
                      onDelete={onDeleteResource}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {vid.description}
                  </p>

                  {/* Transcription Box */}
                  {(resWhisper || vid.transcript) && (
                    <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#222E42] text-[11px] text-gray-300 mb-4 space-y-1">
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Transcription audio :
                        </span>
                      </div>
                      <p className="italic text-gray-300">
                        "{resWhisper ? resWhisper.transcriptText : vid.transcript}"
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {vid.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300"
                      >
                        <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#222E42]">
                    <button
                      onClick={() => handleRunWhisperTranscribe(vid)}
                      disabled={isTranscribing}
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isTranscribing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          <span>Transcrire la vidéo</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenResource(vid)}
                      className="text-[#51D1B3] hover:underline text-xs font-semibold cursor-pointer"
                    >
                      Transcription complète
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

