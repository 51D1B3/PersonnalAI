import React, { useState } from 'react';
import { FileText, Upload, Download, Tag, Search, CheckCircle2, FileCode, ExternalLink } from 'lucide-react';
import type { ResourceItem } from '../types';

interface DocumentsPageProps {
  resources: ResourceItem[];
  onAddClick: () => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({ resources, onAddClick }) => {
  const [docSearch, setDocSearch] = useState('');
  const pdfResources = resources.filter(r => r.type === 'PDF');

  const filteredDocs = pdfResources.filter(doc => 
    doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
    doc.description.toLowerCase().includes(docSearch.toLowerCase()) ||
    doc.tags.some(t => t.toLowerCase().includes(docSearch.toLowerCase()))
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
              Indexation et recherche textuelle automatique dans les PDF.
            </p>
          </div>
        </div>

        <button
          onClick={onAddClick}
          className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-2 cursor-pointer w-fit"
        >
          <Upload className="w-4 h-4" /> Importer un PDF
        </button>
      </div>

      {/* PDF Processing Pipeline Workflow Indicator */}
      <div className="p-4 rounded-2xl bg-[#0B0F17]/80 border border-[#222E42]">
        <p className="text-xs font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#51D1B3]" /> Pipeline d'indexation des PDF :
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-[#151C28] border border-[#222E42] text-center text-gray-300">
            1. Upload PDF
          </div>
          <div className="p-2 rounded-lg bg-[#151C28] border border-[#222E42] text-center text-gray-300">
            2. Extraction Texte
          </div>
          <div className="p-2 rounded-lg bg-[#151C28] border border-[#222E42] text-center text-gray-300">
            3. Découpage
          </div>
          <div className="p-2 rounded-lg bg-[#151C28] border border-[#222E42] text-center text-[#51D1B3] font-semibold">
            4. Embedding Vectoriel
          </div>
          <div className="p-2 rounded-lg bg-[#51D1B3]/10 border border-[#51D1B3]/30 text-center text-[#51D1B3] font-bold col-span-2 md:col-span-1">
            5. Stockage pgvector
          </div>
        </div>
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
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id}
            className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white hover:text-[#51D1B3] transition-colors">
                    {doc.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Indexé
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-2xl">
                  {doc.description}
                </p>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {doc.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-300">
                      <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                      {tag}
                    </span>
                  ))}
                  <span className="text-[11px] text-gray-400 ml-2">Ajouté le {doc.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button className="p-2.5 rounded-xl bg-[#0B0F17] border border-[#222E42] text-gray-300 hover:text-[#51D1B3] hover:border-[#51D1B3]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                <Download className="w-4 h-4" /> Télécharger
              </button>
              <button className="p-2.5 rounded-xl bg-[#51D1B3]/10 text-[#51D1B3] border border-[#51D1B3]/30 text-xs font-semibold hover:bg-[#51D1B3]/20 flex items-center gap-1.5 transition-colors cursor-pointer">
                Consulter <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
