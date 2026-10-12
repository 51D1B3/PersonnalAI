import React, { useState, useEffect } from 'react';
import { X, Save, FileEdit } from 'lucide-react';
import type { ResourceItem } from '../types';

interface EditResourceModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
  onSave: (updated: ResourceItem) => void;
}

export const EditResourceModal: React.FC<EditResourceModalProps> = ({
  resource,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setDescription(resource.description);
      setContent(resource.noteContent || resource.ocrText || resource.transcript || resource.url || '');
    }
  }, [resource]);

  if (!resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedResource: ResourceItem = {
      ...resource,
      title: title.trim() || resource.title,
      description: description.trim() || resource.description,
      noteContent: resource.type === 'NOTE' ? content : resource.noteContent,
      ocrText: resource.type === 'IMAGE' ? content : resource.ocrText,
      transcript: resource.type === 'VIDEO' ? content : resource.transcript,
      url: resource.type === 'LINK' ? content : resource.url,
    };

    onSave(updatedResource);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151C28] border border-[#222E42] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#222E42] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Modifier la ressource</h3>
              <p className="text-xs text-gray-400">{resource.type} • {resource.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#0B0F17] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Titre / Nom *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#51D1B3]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#51D1B3]"
            />
          </div>

          {(resource.type === 'NOTE' || resource.type === 'LINK' || resource.type === 'IMAGE' || resource.type === 'VIDEO') && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                {resource.type === 'NOTE' ? 'Contenu de la note' : resource.type === 'LINK' ? 'URL du lien' : resource.type === 'IMAGE' ? 'Texte OCR' : 'Transcription'}
              </label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#51D1B3] font-mono text-xs"
              />
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#222E42]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0B0F17] text-gray-300 text-xs font-semibold border border-[#222E42] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-[#0B0F17] text-xs font-bold hover:bg-amber-400 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

