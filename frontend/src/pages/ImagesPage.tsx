import React, { useState } from 'react';
import { Image as ImageIcon, Scan, Tag, Eye, Plus, RefreshCw, FileText } from 'lucide-react';
import type { ResourceItem, UserProfile } from '../types';
import { isOwnerEmail } from '../types';
import { ResourceActionMenu } from '../components/ResourceActionMenu';

interface ImagesPageProps {
  resources: ResourceItem[];
  user?: UserProfile | null;
  onAddClick: () => void;
  onOpenResource: (resource: ResourceItem) => void;
  onDownloadResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (resource: ResourceItem) => void;
}

export const ImagesPage: React.FC<ImagesPageProps> = ({
  resources,
  user,
  onAddClick,
  onOpenResource,
  onDownloadResource,
  onEditResource,
  onDeleteResource,
}) => {
  const canAdd = isOwnerEmail(user?.email);
  const imageResources = resources.filter((r) => r.type === 'IMAGE');

  const [scanningId, setScanningId] = useState<string | null>(null);
  const [ocrResults, setOcrResults] = useState<Record<string, any>>({});

  const handleRunOcrScan = async (img: ResourceItem) => {
    setScanningId(img.id);
    try {
      const response = await fetch('http://localhost:3000/images/scan-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: img.title,
          imagePath: '/uploads/sample.png',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOcrResults((prev) => ({ ...prev, [img.id]: data }));
      }
    } catch {
      setOcrResults((prev) => ({
        ...prev,
        [img.id]: {
          ocrText: "Prisma P1001: Can't reach database server at localhost:5432. Check database status.",
          embeddingDimensions: 1536,
          confidence: 97.4,
          extractedKeywords: ['Prisma', 'Database', 'Error', 'P1001'],
        },
      }));
    }
    setScanningId(null);
  };

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
              Indexation et consultation de vos captures et images.
            </p>
          </div>
        </div>

        {canAdd && (
          <button
            onClick={onAddClick}
            className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" /> Ajouter une capture
          </button>
        )}
      </div>

      {/* Images Grid */}
      {imageResources.length === 0 ? (
        <div className="p-10 text-center bg-[#151C28] border border-[#222E42] rounded-3xl space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Aucune image / capture d'écran</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Aucune image n'a encore été ajoutée.
          </p>
          {canAdd && (
            <button
              onClick={onAddClick}
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#51D1B3]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une capture</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {imageResources.map((img) => {
            const resOcr = ocrResults[img.id];
            const isScanning = scanningId === img.id;

            return (
              <div
                key={img.id}
                className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-purple-500/40 transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* Image Thumbnail Placeholder + 3-Dots Menu at Top Right */}
                  <div className="w-full h-36 rounded-xl bg-[#0B0F17] border border-[#222E42] flex flex-col items-center justify-center text-gray-500 mb-4 group-hover:border-purple-500/30 transition-all relative overflow-hidden">
                    <ImageIcon className="w-8 h-8 text-purple-400 mb-1" />
                    <span className="text-[11px] text-gray-400">Capture PNG/JPEG</span>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-base font-bold text-white group-hover:text-[#51D1B3] transition-colors truncate">
                      {img.title}
                    </h4>
                    <ResourceActionMenu
                      resource={img}
                      onOpen={onOpenResource}
                      onDownload={onDownloadResource}
                      onEdit={onEditResource}
                      onDelete={onDeleteResource}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {img.description}
                  </p>

                  {/* Detected OCR text preview box */}
                  {(resOcr || img.ocrText) && (
                    <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#222E42] text-[11px] text-gray-300 mb-4 font-mono space-y-1">
                      <div className="flex items-center justify-between text-[#51D1B3] font-bold">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-purple-400" /> Texte extrait :
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px]">
                        "{resOcr ? resOcr.ocrText : img.ocrText}"
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {img.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300"
                      >
                        <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRunOcrScan(img)}
                      disabled={isScanning}
                      className="flex-1 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isScanning ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Scan className="w-3.5 h-3.5" />
                          <span>Scanner OCR</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenResource(img)}
                      className="px-3 py-2 rounded-xl bg-[#0B0F17] hover:bg-[#51D1B3]/10 hover:text-[#51D1B3] border border-[#222E42] text-xs font-semibold text-gray-300 transition-all flex items-center justify-center cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
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

