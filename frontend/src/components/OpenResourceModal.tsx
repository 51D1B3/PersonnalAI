import React from 'react';
import { X, ExternalLink, Download, FileText, Tag, Globe, Image as ImageIcon, Video, StickyNote } from 'lucide-react';
import type { ResourceItem } from '../types';

interface OpenResourceModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
  onDownload: (resource: ResourceItem) => void;
}

export const OpenResourceModal: React.FC<OpenResourceModalProps> = ({
  resource,
  onClose,
  onDownload,
}) => {
  if (!resource) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-red-400" />;
      case 'IMAGE': return <ImageIcon className="w-5 h-5 text-purple-400" />;
      case 'VIDEO': return <Video className="w-5 h-5 text-emerald-400" />;
      case 'LINK': return <Globe className="w-5 h-5 text-blue-400" />;
      case 'NOTE': return <StickyNote className="w-5 h-5 text-amber-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151C28] border border-[#222E42] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#222E42] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B0F17] border border-[#222E42] flex items-center justify-center">
              {getTypeIcon(resource.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#51D1B3]/10 text-[#51D1B3] border border-[#51D1B3]/20">
                  {resource.type}
                </span>
                <span className="text-xs text-gray-400">• {resource.category}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">{resource.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#0B0F17] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</h4>
            <p className="text-sm text-gray-200 leading-relaxed bg-[#0B0F17] p-4 rounded-2xl border border-[#222E42]">
              {resource.description || 'Aucune description fournie.'}
            </p>
          </div>

          {resource.type === 'NOTE' && (resource.noteContent || resource.description) && (
            <div>
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Contenu de la Note</h4>
              <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#222E42] text-xs font-mono text-gray-200 whitespace-pre-wrap leading-relaxed">
                {resource.noteContent || resource.description}
              </div>
            </div>
          )}

          {resource.type === 'IMAGE' && resource.ocrText && (
            <div>
              <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Texte Extrait via OCR</h4>
              <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#222E42] text-xs font-mono text-gray-200 whitespace-pre-wrap leading-relaxed">
                {resource.ocrText}
              </div>
            </div>
          )}

          {resource.type === 'VIDEO' && resource.transcript && (
            <div>
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Transcription Audio Whisper</h4>
              <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#222E42] text-xs font-mono text-gray-200 whitespace-pre-wrap leading-relaxed">
                {resource.transcript}
              </div>
            </div>
          )}

          {resource.url && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Lien / Chemin du fichier</h4>
              <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#222E42] text-xs font-mono text-[#51D1B3] truncate">
                {resource.url}
              </div>
            </div>
          )}

          {/* Tags & Metadata */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#222E42]">
            <div className="flex items-center gap-1.5 flex-wrap">
              {resource.tags.map((t, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300">
                  <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                  {t}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-400">Ajouté le {resource.date}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222E42] bg-[#0B0F17]/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDownload(resource)}
            className="px-4 py-2.5 rounded-xl bg-[#0B0F17] text-cyan-400 border border-[#222E42] hover:border-cyan-400/40 text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Télécharger
          </button>

          <div className="flex items-center gap-2">
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] text-xs font-bold hover:bg-[#3EB89B] transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#51D1B3]/20"
              >
                <span>Accéder / Ouvrir</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#222E42] text-gray-300 text-xs font-semibold hover:bg-[#2c3b54] cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
