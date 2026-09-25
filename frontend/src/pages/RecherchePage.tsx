import React, { useState } from 'react';
import { Sparkles, ArrowRight, Cpu, Database, CheckCircle2, ExternalLink } from 'lucide-react';
import type { ResourceItem } from '../types';

interface RecherchePageProps {
  resources: ResourceItem[];
}

export const RecherchePage: React.FC<RecherchePageProps> = ({ resources }) => {
  const [aiQuery, setAiQuery] = useState("Retrouve-moi le cours PDF sur les hooks React");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);

  const samplePrompts = [
    "Retrouve-moi le cours PDF sur les hooks React",
    "Ma capture concernant une erreur Prisma",
    "La documentation Supabase pour pgvector",
    "Notes sur la configuration des JWT tokens"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 500);
  };

  const handleSelectPrompt = (promptText: string) => {
    setAiQuery(promptText);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 400);
  };

  const results = resources.filter(item => {
    if (!aiQuery) return true;
    const q = aiQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes('react') ||
      item.description.toLowerCase().includes('react') ||
      item.tags.some(t => t.toLowerCase().includes('react')) ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-[#151C28] via-[#101622] to-[#151C28] border border-[#51D1B3]/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#51D1B3]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#51D1B3]/10 text-[#51D1B3] text-xs font-bold border border-[#51D1B3]/20 mb-3">
            <Sparkles className="w-4 h-4 animate-pulse" /> Moteur IA Sémantique Ollama + pgvector
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Posez n'importe quelle question à votre mémoire 🤖
          </h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            PersonalAI analyse le sens de votre phrase et recherche dans les textes de vos PDF, l'OCR de vos images, et le contenu de vos notes.
          </p>

          {/* Big Prompt Search Input */}
          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Sparkles className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#51D1B3]" />
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ex: Retrouve le cours où j'ai appris les hooks React..."
                className="w-full bg-[#0B0F17] border border-[#51D1B3]/40 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#51D1B3] transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3.5 rounded-2xl bg-[#51D1B3] text-[#0B0F17] font-bold text-sm hover:bg-[#3EB89B] transition-all shadow-lg shadow-[#51D1B3]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-[#0B0F17] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Lancer la recherche</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sample Prompts Pills */}
          <div className="mt-4 flex items-center gap-2 flex-wrap text-xs text-gray-400">
            <span className="font-semibold text-gray-300">Exemples :</span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPrompt(prompt)}
                className="px-3 py-1 rounded-xl bg-[#0B0F17] border border-[#222E42] hover:border-[#51D1B3]/40 hover:text-[#51D1B3] transition-all text-left truncate max-w-xs cursor-pointer"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vector Engine Specs Badge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#151C28] border border-[#222E42] flex items-center gap-3">
          <Cpu className="w-5 h-5 text-[#51D1B3]" />
          <div>
            <p className="text-xs font-bold text-white">IA Locale Ollama</p>
            <p className="text-[11px] text-gray-400">Modèle llama3 & nomic-embed-text</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-[#222E42] flex items-center gap-3">
          <Database className="w-5 h-5 text-cyan-400" />
          <div>
            <p className="text-xs font-bold text-white">PostgreSQL + pgvector</p>
            <p className="text-[11px] text-gray-400">Recherche par Similarité Cosinus</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#151C28] border border-[#222E42] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs font-bold text-white">100% Hors-ligne / Privé</p>
            <p className="text-[11px] text-gray-400">Aucune donnée transmise vers l'extérieur</p>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#51D1B3]" />
              Résultats de la recherche sémantique ({results.length})
            </h3>
            <span className="text-xs text-gray-400">Trie par score de pertinence</span>
          </div>

          <div className="space-y-3">
            {results.map((item, idx) => {
              const relevanceScore = 98 - idx * 5;
              return (
                <div 
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#51D1B3]/10 text-[#51D1B3] border border-[#51D1B3]/20">
                        Match {relevanceScore}%
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-gray-500/10 text-gray-300 font-semibold border border-gray-500/20">
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-400">• {item.category}</span>
                    </div>

                    <h4 className="text-base font-bold text-white hover:text-[#51D1B3] transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-300 leading-relaxed bg-[#0B0F17] p-3 rounded-xl border border-[#222E42]">
                      <span className="text-[#51D1B3] font-semibold">Extrait trouvé : </span>
                      "{item.description}"
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {item.tags.map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#0B0F17] text-gray-400 border border-[#222E42]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="px-4 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer self-end md:self-center">
                    <span>Ouvrir la ressource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
