import React from 'react';
import { Video, Mic, Play, Tag, FileText, Upload } from 'lucide-react';
import type { ResourceItem } from '../types';

interface VideosPageProps {
  resources: ResourceItem[];
  onAddClick: () => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({ resources, onAddClick }) => {
  const videoResources = resources.filter(r => r.type === 'VIDEO');

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#151C28] border border-[#222E42]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Vidéos & Transcriptions</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Transcription automatique de l'audio via OpenAI Whisper pour la recherche sémantique.
            </p>
          </div>
        </div>

        <button
          onClick={onAddClick}
          className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-2 cursor-pointer w-fit"
        >
          <Upload className="w-4 h-4" /> Ajouter une vidéo
        </button>
      </div>

      {/* Whisper Architecture Notice */}
      <div className="p-4 rounded-2xl bg-[#0B0F17]/80 border border-[#222E42] flex items-center gap-3">
        <Mic className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-xs text-gray-300">
          <strong className="text-white">Transcription IA (Whisper) :</strong> L’audio des cours et mémos vidéo est automatiquement extrait et converti en texte interrogeable par l'IA.
        </p>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoResources.map((vid) => (
          <div 
            key={vid.id}
            className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Video Player Placeholder */}
              <div className="w-full h-40 rounded-xl bg-[#0B0F17] border border-[#222E42] flex flex-col items-center justify-center text-gray-400 mb-4 relative overflow-hidden group-hover:border-[#51D1B3]/30 transition-all">
                <div className="w-12 h-12 rounded-full bg-[#51D1B3] text-[#0B0F17] flex items-center justify-center pl-1 shadow-lg shadow-[#51D1B3]/20 group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-6 h-6 fill-current" />
                </div>
                <span className="text-[11px] text-gray-400 mt-2 font-medium">Lecteur Vidéo PersonalAI</span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-gray-300 text-[10px] font-bold">
                  14:35
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-[#51D1B3] transition-colors mb-1">
                {vid.title}
              </h4>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                {vid.description}
              </p>

              {/* Whisper Transcription Box */}
              <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#222E42] text-[11px] text-gray-300 mb-4">
                <span className="text-emerald-400 font-bold flex items-center gap-1 mb-1">
                  <FileText className="w-3 h-3" /> Transcription Whisper :
                </span>
                <p className="italic text-gray-400">
                  "{vid.transcript || 'Dans cette session, nous abordons la création de modules NestJS, l\'injection de dépendances et les Guards REST...'}"
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {vid.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300">
                    <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#222E42]">
                <span>Ajouté le {vid.date}</span>
                <button className="text-[#51D1B3] hover:underline font-semibold cursor-pointer">
                  Lire la transcription complète
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
