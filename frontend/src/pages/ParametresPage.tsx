import React, { useState } from 'react';
import { Settings, ShieldCheck, Mail, Database, Cpu, Check, Save } from 'lucide-react';
import type { UserProfile } from '../types';

interface ParametresPageProps {
  user: UserProfile;
}

export const ParametresPage: React.FC<ParametresPageProps> = ({ user }) => {
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-500/10 text-gray-300 border border-gray-500/20 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Paramètres & Configuration</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Session active : <span className="text-[#51D1B3] font-semibold">{user.name} ({user.email})</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Security & Allowed Accounts */}
        <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-[#222E42]">
            <ShieldCheck className="w-5 h-5 text-[#51D1B3]" />
            <span>Sécurité & Accès Privé (2 Emails Autorisés)</span>
          </div>

          <p className="text-xs text-gray-400">
            Conformément aux spécifications de PersonalAI, seules deux adresses électroniques prédéfinies sont habilitées à franchir l'authentification.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#0B0F17] border border-[#51D1B3]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#51D1B3]" />
                <div>
                  <p className="text-xs font-bold text-white">Compte 1 (Propriétaire)</p>
                  <p className="text-xs text-gray-400">sidibe@personalai.dev</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#51D1B3]/10 text-[#51D1B3] font-bold">Actif</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B0F17] border border-[#222E42] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-white">Compte 2 (Co-Propriétaire)</p>
                  <p className="text-xs text-gray-400">admin@personalai.dev</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">Actif</span>
            </div>
          </div>
        </div>

        {/* Section 2: AI Local Server (Ollama) */}
        <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-[#222E42]">
            <Cpu className="w-5 h-5 text-[#51D1B3]" />
            <span>Moteur IA Locale (Ollama)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                URL du serveur Ollama
              </label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#51D1B3]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Modèle LLM sélectionné
              </label>
              <select
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl px-3 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#51D1B3]"
              >
                <option value="llama3">🦙 llama3 (Recommandé)</option>
                <option value="mistral">⚡ mistral</option>
                <option value="gemma">💎 gemma</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Database & Supabase Status */}
        <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-[#222E42]">
            <Database className="w-5 h-5 text-[#51D1B3]" />
            <span>Base de données (PostgreSQL + pgvector / Supabase)</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#222E42] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">Statut de la base :</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Connecté à PostgreSQL
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-300">Extension pgvector :</span>
              <span className="text-[#51D1B3] font-bold">Activée (1536 dimensions)</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs text-[#51D1B3] font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Paramètres enregistrés avec succès !
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-3 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-sm hover:bg-[#3EB89B] transition-all shadow-md shadow-[#51D1B3]/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
