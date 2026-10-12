import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ExternalLink, Download, FileEdit, Trash2 } from 'lucide-react';
import type { ResourceItem } from '../types';

interface ResourceActionMenuProps {
  resource: ResourceItem;
  onOpen: (resource: ResourceItem) => void;
  onDownload: (resource: ResourceItem) => void;
  onEdit: (resource: ResourceItem) => void;
  onDelete: (resource: ResourceItem) => void;
}

export const ResourceActionMenu: React.FC<ResourceActionMenuProps> = ({
  resource,
  onOpen,
  onDownload,
  onEdit,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left z-20" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#0B0F17] transition-colors cursor-pointer border border-transparent hover:border-[#222E42]"
        title="Options de la ressource"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[#151C28] border border-[#222E42] shadow-2xl z-50 py-1.5 animate-fadeIn backdrop-blur-md">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onOpen(resource);
            }}
            className="w-full px-3.5 py-2 text-xs text-gray-200 hover:text-[#51D1B3] hover:bg-[#0B0F17] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#51D1B3]" />
            <span>Ouvrir</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDownload(resource);
            }}
            className="w-full px-3.5 py-2 text-xs text-gray-200 hover:text-cyan-400 hover:bg-[#0B0F17] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Télécharger</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onEdit(resource);
            }}
            className="w-full px-3.5 py-2 text-xs text-gray-200 hover:text-amber-400 hover:bg-[#0B0F17] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <FileEdit className="w-3.5 h-3.5 text-amber-400" />
            <span>Modifier</span>
          </button>

          <div className="my-1 border-t border-[#222E42]" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete(resource);
            }}
            className="w-full px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Supprimer</span>
          </button>
        </div>
      )}
    </div>
  );
};
