import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newResource: ResourceItem = {
      id: Date.now().toString(),
      title: title.trim(),
      type,
      category: category.trim() || 'Général',
      tags: tags.length > 0 ? tags : ['PersonalAI'],
      description: description.trim(),
      date: 'Aujourd\'hui'
    };

    onAddResource(newResource);
    setTitle('');
    setType('PDF');
    setCategory('Développement Web');
    setTagsInput('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151C28] border border-[#222E42] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#222E42] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#51D1B3]/10 text-[#51D1B3] flex items-center justify-center font-bold">
              +
            </div>
            <h3 className="text-lg font-bold text-white">Ajouter une ressource</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#0B0F17] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Titre de la ressource *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: React Hooks Guide PDF, Capture Erreur Prisma..."
              className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3] focus:ring-1 focus:ring-[#51D1B3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Type de ressource
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ResourceType)}
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-3 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#51D1B3]"
              >
                <option value="PDF">📄 PDF / Document</option>
                <option value="IMAGE">🖼️ Image / Capture</option>
                <option value="LINK">🔗 Lien Web</option>
                <option value="NOTE">📝 Note Personnelle</option>
                <option value="VIDEO">🎥 Vidéo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Catégorie
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Développement Web, IA, Base de données"
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, Hooks, JavaScript"
              className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Description détaillée *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courte explication du contenu pour aider la recherche naturelle..."
              className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3] resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#222E42]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0B0F17] text-gray-400 text-xs font-semibold hover:text-white border border-[#222E42] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] text-xs font-bold hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Enregistrer la ressource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
