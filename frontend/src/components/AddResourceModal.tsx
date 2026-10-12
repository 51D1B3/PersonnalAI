import React, { useState } from 'react';
import { X, Plus, Upload, CheckCircle2, Globe, FileText, Image as ImageIcon, Video, StickyNote } from 'lucide-react';
import type { ResourceItem, ResourceType } from '../types';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: ResourceItem) => void;
  userEmail?: string;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAddResource,
  userEmail = 'mahamadousidibe2004@gmail.com',
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('PDF');
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
    const finalCategory = type === 'PDF' ? 'Document' : type === 'IMAGE' ? 'Image' : type === 'VIDEO' ? 'Vidéo' : type === 'LINK' ? 'Lien' : 'Note';

    let backendId: string | null = null;
    let backendUrl: string | null = null;

    // 1. Send file to backend upload endpoint if file attached
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', finalTitle);
        formData.append('description', finalDescription);
        formData.append('category', finalCategory);
        formData.append('tags', type);

        const res = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          headers: { 'x-user-email': userEmail },
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          backendId = result.id;
          backendUrl = result.filePath;
        }
      } catch {
        // Fallback local persistence
      }
    }

    // 2. Send link to backend
    if (type === 'LINK') {
      try {
        const res = await fetch('http://localhost:3000/links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail,
          },
          body: JSON.stringify({
            name: finalTitle,
            url: urlInput.trim() || 'https://supabase.com',
            description: finalDescription,
            category: finalCategory,
            tags: [type],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          backendId = data.id;
        }
      } catch {
        // Fallback
      }
    }

    // 3. Send note to backend
    if (type === 'NOTE') {
      try {
        const res = await fetch('http://localhost:3000/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail,
          },
          body: JSON.stringify({
            title: finalTitle,
            content: noteContent.trim() || finalDescription,
            category: finalCategory,
            tags: [type],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          backendId = data.id;
        }
      } catch {
        // Fallback
      }
    }

    // 4. Construct persistent ResourceItem object
    const createdResource: ResourceItem = {
      id: backendId || `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: finalTitle,
      type,
      category: finalCategory,
      tags: [type],
      description: finalDescription,
      url: backendUrl || (type === 'LINK' ? (urlInput.trim() || 'https://') : (selectedFile ? `/uploads/${selectedFile.name}` : undefined)),
      ocrText: type === 'IMAGE' ? 'Texte de la capture' : undefined,
      transcript: type === 'VIDEO' ? 'Transcription vidéo' : undefined,
      noteContent: type === 'NOTE' ? (noteContent.trim() || finalDescription) : undefined,
      date: new Date().toLocaleDateString('fr-FR'),
      fileSize: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : undefined,
    };

    onAddResource(createdResource);
    setIsUploading(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setTitle('');
    setType('PDF');
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
                Sélectionner le fichier ({type === 'PDF' ? 'PDF' : type === 'IMAGE' ? 'Image' : 'Vidéo'})
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
                placeholder="https://example.com"
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
              placeholder="Saisissez le titre de la ressource..."
              className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
            />
          </div>

          {/* Conditional Note Content Text Area for NOTE */}
          {type === 'NOTE' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Contenu de la note
              </label>
              <textarea
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Saisissez votre note..."
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
              placeholder="Description courte du contenu..."
              className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3] resize-none"
            />
          </div>

          {/* Modal Submit Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#222E42]">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-4 py-2.5 rounded-xl bg-[#0B0F17] text-[#51D1B3] text-xs font-semibold border border-[#222E42] transition-colors cursor-pointer"
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
                  <Plus className="w-4 h-4" /> Enregistrer & Persister
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

