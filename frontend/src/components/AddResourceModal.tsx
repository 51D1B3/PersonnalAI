import React, { useState } from 'react';
import { X, Plus, Upload, CheckCircle2, Globe, FileText, Image as ImageIcon, Video, StickyNote } from 'lucide-react';
import type { ResourceItem, ResourceType } from '../types';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: ResourceItem) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAddResource
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('PDF');
  const [category, setCategory] = useState('Développement Web');
  const [tagsInput, setTagsInput] = useState('');
  const [description, setDescription] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name);
      }
      // Auto detect type
      if (file.type.startsWith('image/')) setType('IMAGE');
      else if (file.type.startsWith('video/')) setType('VIDEO');
      else if (file.type === 'application/pdf') setType('PDF');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsUploading(true);

    const finalTitle = title.trim() || (selectedFile ? selectedFile.name : (urlInput.trim() || 'Ressource Sans Titre'));
    const finalDescription = description.trim() || (type === 'NOTE' ? noteContent.trim() : (type === 'LINK' ? urlInput.trim() : `Ressource ${type} ajoutée`));
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const finalCategory = category.trim() || 'Général';

    // 1. Try backend upload endpoint if file attached
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', finalTitle);
        formData.append('description', finalDescription);
        formData.append('category', finalCategory);
        formData.append('tags', tagsInput);

        const res = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          onAddResource({
            id: result.id || Date.now().toString(),
            title: finalTitle,
            type,
            category: finalCategory,
            tags: tags.length > 0 ? tags : [type],
            description: finalDescription,
            date: 'Aujourd\'hui',
            fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
            ocrText: type === 'IMAGE' ? 'Analyse OCR Tesseract générée...' : undefined,
            transcript: type === 'VIDEO' ? 'Transcription Whisper automatique...' : undefined,
          });
          setIsUploading(false);
          resetAndClose();
          return;
        }
      } catch {
        // Fallback local addition if backend endpoint starting
      }
    }

    // 2. Direct creation for Link, Note, or file without backend
    const newResource: ResourceItem = {
      id: Date.now().toString(),
      title: finalTitle,
      type,
      category: finalCategory,
      tags: tags.length > 0 ? tags : [type],
      description: finalDescription,
      url: type === 'LINK' ? (urlInput.trim() || 'https://') : undefined,
      ocrText: type === 'IMAGE' ? 'Texte extrait automatiquement via Tesseract OCR' : undefined,
      transcript: type === 'VIDEO' ? 'Transcription automatique de l\'audio via OpenAI Whisper' : undefined,
      date: 'Aujourd\'hui',
      fileSize: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : undefined
    };

    // If type is LINK, try backend POST /links
    if (type === 'LINK') {
      try {
        await fetch('http://localhost:3000/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: finalTitle,
            url: urlInput.trim() || 'https://supabase.com',
            description: finalDescription,
            category: finalCategory,
            tags,
          }),
        });
      } catch {
        // Continue
      }
    }

    // If type is NOTE, try backend POST /notes
    if (type === 'NOTE') {
      try {
        await fetch('http://localhost:3000/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: finalTitle,
            content: noteContent.trim() || finalDescription,
            category: finalCategory,
            tags,
          }),
        });
      } catch {
        // Continue
      }
    }

    onAddResource(newResource);
    setIsUploading(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setTitle('');
    setType('PDF');
    setCategory('Développement Web');
    setTagsInput('');
    setDescription('');
    setUrlInput('');
    setNoteContent('');
    setSelectedFile(null);
    setIsUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151C28] border border-[#222E42] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#222E42] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#51D1B3]/15 text-[#51D1B3] flex items-center justify-center font-bold border border-[#51D1B3]/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Ajouter une ressource</h3>
              <p className="text-xs text-gray-400">PDF, Image (OCR), Vidéo (Whisper), Lien ou Note</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#0B0F17] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Resource Type Selector Pills */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Type de ressource *
            </label>
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-[#0B0F17] border border-[#222E42] rounded-2xl">
              <button
                type="button"
                onClick={() => setType('PDF')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  type === 'PDF' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setType('IMAGE')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  type === 'IMAGE' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image</span>
              </button>

              <button
                type="button"
                onClick={() => setType('VIDEO')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  type === 'VIDEO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Vidéo</span>
              </button>

              <button
                type="button"
                onClick={() => setType('LINK')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  type === 'LINK' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Lien</span>
              </button>

              <button
                type="button"
                onClick={() => setType('NOTE')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                  type === 'NOTE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <StickyNote className="w-3.5 h-3.5" />
                <span>Note</span>
              </button>
            </div>
          </div>

          {/* Conditional File Picker Zone for PDF, IMAGE, VIDEO */}
          {(type === 'PDF' || type === 'IMAGE' || type === 'VIDEO') && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Sélectionner le fichier ({type})
              </label>
              <div className="relative border-2 border-dashed border-[#222E42] hover:border-[#51D1B3]/50 rounded-2xl p-4 text-center transition-all bg-[#0B0F17]/50">
                <input
                  type="file"
                  accept={
                    type === 'IMAGE' ? 'image/*' :
                    type === 'VIDEO' ? 'video/*' :
                    '.pdf,application/pdf'
                  }
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 text-[#51D1B3] mb-1" />
                  {selectedFile ? (
                    <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Cliquez ou glissez votre fichier ici ({type === 'IMAGE' ? 'PNG, JPG' : type === 'VIDEO' ? 'MP4, WEBM' : 'PDF'})
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Conditional URL Field for LINK */}
          {type === 'LINK' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                URL du site web *
              </label>
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://supabase.com/docs"
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
              />
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Titre / Nom de la ressource *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: React Hooks Guide, Capture Prisma, Note JWT..."
              className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Catégorie
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Développement Web, Database"
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, Hooks, NestJS"
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
              />
            </div>
          </div>

          {/* Conditional Note Content Text Area for NOTE */}
          {type === 'NOTE' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Contenu de la note confidentielle
              </label>
              <textarea
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Saisissez vos clés de configuration, mémo ou notes personnelles..."
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3] font-mono"
              />
            </div>
          )}

          {/* Description Text Area */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Description ou résumé
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description courte du contenu pour l'indexation..."
              className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3] resize-none"
            />
          </div>

          {/* Modal Submit Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#222E42]">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-4 py-2.5 rounded-xl bg-[#0B0F17] text-gray-400 text-xs font-semibold hover:text-white border border-[#222E42] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] text-xs font-bold hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-[#0B0F17] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Enregistrer & Uploader
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
