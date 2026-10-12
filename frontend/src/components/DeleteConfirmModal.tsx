import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import type { ResourceItem } from '../types';

interface DeleteConfirmModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
  onConfirm: (resource: ResourceItem) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  resource,
  onClose,
  onConfirm,
}) => {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151C28] border border-rose-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#0B0F17]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Confirmer la suppression</h3>
            <p className="text-xs text-gray-400 mt-1">
              Êtes-vous sûr de vouloir supprimer définitivement la ressource <strong className="text-white">"{resource.title}"</strong> ? Cette action est irréversible.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#222E42]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#0B0F17] text-gray-300 text-xs font-semibold border border-[#222E42] hover:bg-[#151C28] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(resource);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
