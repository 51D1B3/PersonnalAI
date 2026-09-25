import React from 'react';
import { Image as ImageIcon, Scan, Tag, Eye, Upload } from 'lucide-react';
import type { ResourceItem } from '../types';

interface ImagesPageProps {
  resources: ResourceItem[];
  onAddClick: () => void;
}

export const ImagesPage: React.FC<ImagesPageProps> = ({ resources, onAddClick }) => {
  const imageResources = resources.filter(r => r.type === 'IMAGE');

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#151C28] border border-[#222E42]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Images & Captures d'écran</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Recherche textuelle dans vos captures grâce au système OCR (Tesseract).
            </p>
          </div>
        </div>

        <button
          onClick={onAddClick}
          className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-2 cursor-pointer w-fit"
        >
          <Upload className="w-4 h-4" /> Ajouter une capture
        </button>
      </div>

      {/* OCR Pipeline Notice */}
      <div className="p-4 rounded-2xl bg-[#0B0F17]/80 border border-[#222E42] flex items-center gap-3">
        <Scan className="w-5 h-5 text-purple-400 shrink-0" />
        <p className="text-xs text-gray-300">
          <strong className="text-white">Traitement OCR automatique :</strong> Toutes les images importées sont analysées pour en extraire le texte lisible et permettre leur recherche par mots-clés.
        </p>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageResources.map((img) => (
          <div 
            key={img.id}
            className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image Thumbnail Placeholder */}
              <div className="w-full h-36 rounded-xl bg-[#0B0F17] border border-[#222E42] flex flex-col items-center justify-center text-gray-500 mb-4 group-hover:border-[#51D1B3]/30 transition-all relative overflow-hidden">
                <ImageIcon className="w-8 h-8 text-purple-400 mb-1" />
                <span className="text-[11px] text-gray-400">Capture PNG/JPEG</span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 flex items-center gap-1">
                  <Scan className="w-3 h-3" /> OCR Scanné
                </span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-[#51D1B3] transition-colors mb-1">
                {img.title}
              </h4>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                {img.description}
              </p>

              {/* Detected OCR text preview box */}
              <div className="p-2.5 rounded-lg bg-[#0B0F17] border border-[#222E42] text-[11px] text-gray-300 mb-4 font-mono">
                <span className="text-[#51D1B3] font-bold block mb-0.5">🔍 Texte OCR Détecté :</span>
                "{img.ocrText || 'Prisma P1001: Database server unreachable on localhost:5432'}"
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {img.tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300">
                    <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                    {tag}
                  </span>
                ))}
              </div>

              <button className="w-full py-2 rounded-xl bg-[#0B0F17] hover:bg-[#51D1B3]/10 hover:text-[#51D1B3] border border-[#222E42] hover:border-[#51D1B3]/30 text-xs font-semibold text-gray-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <Eye className="w-3.5 h-3.5" /> Aperçu grand format
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
