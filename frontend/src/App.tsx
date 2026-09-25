import { useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  StickyNote, 
  Search, 
  Home, 
  Settings, 
  Plus, 
  Sparkles,
  ExternalLink,
  Tag,
  ShieldCheck,
  LogOut
} from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  type: 'PDF' | 'IMAGE' | 'LINK' | 'NOTE' | 'VIDEO';
  category: string;
  tags: string[];
  description: string;
  date: string;
  url?: string;
}

const mockResources: ResourceItem[] = [
  {
    id: '1',
    title: 'React Hooks & State Management Guide.pdf',
    type: 'PDF',
    category: 'Développement Web',
    tags: ['React', 'JavaScript', 'Hooks'],
    description: 'Cours complet sur useState, useEffect, et les hooks personnalisés avec exemples pratiques.',
    date: '24 Septembre 2026'
  },
  {
    id: '2',
    title: 'Capture Erreur Prisma P1001.png',
    type: 'IMAGE',
    category: 'Backend / Database',
    tags: ['Prisma', 'Bug', 'PostgreSQL'],
    description: 'Capture d\'écran de l\'erreur de connexion à la base de données avec solution alternative.',
    date: '22 Septembre 2026'
  },
  {
    id: '3',
    title: 'Supabase Official Documentation',
    type: 'LINK',
    category: 'Backend',
    tags: ['Supabase', 'Cloud', 'Auth', 'pgvector'],
    description: 'Guide officiel Supabase pour la configuration de pgvector et RLS policies.',
    url: 'https://supabase.com/docs',
    date: '20 Septembre 2026'
  },
  {
    id: '4',
    title: 'Notes de Configuration Supabase & JWT',
    type: 'NOTE',
    category: 'Sécurité',
    tags: ['Config', 'Env', 'Tokens'],
    description: 'Mémo pour la gestion des variables d\'environnement et des clés de rôles de service.',
    date: '18 Septembre 2026'
  }
];

export function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const navItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'videos', label: 'Vidéos', icon: Video },
    { id: 'liens', label: 'Liens', icon: LinkIcon },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'recherche', label: 'Recherche IA', icon: Sparkles, highlight: true },
    { id: 'parametres', label: 'Paramètres', icon: Settings }
  ];

  const filteredResources = mockResources.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesTab = activeTab === 'accueil' || activeTab === 'recherche' || 
      (activeTab === 'documents' && item.type === 'PDF') ||
      (activeTab === 'images' && item.type === 'IMAGE') ||
      (activeTab === 'videos' && item.type === 'VIDEO') ||
      (activeTab === 'liens' && item.type === 'LINK') ||
      (activeTab === 'notes' && item.type === 'NOTE');

    return matchesSearch && matchesType && matchesTab;
  });

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'IMAGE': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'LINK': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'NOTE': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'VIDEO': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0F17] text-gray-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#101622] border-r border-[#222E42] flex flex-col">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#222E42] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#51D1B3] flex items-center justify-center text-[#0B0F17] font-bold shadow-lg shadow-[#51D1B3]/20">
              PA
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide">Personal<span className="text-[#51D1B3]">AI</span></h1>
              <p className="text-xs text-gray-400">Mémoire Privée</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#51D1B3]/15 text-[#51D1B3] border border-[#51D1B3]/30 shadow-md shadow-[#51D1B3]/5' 
                    : item.highlight
                    ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200'
                    : 'text-gray-400 hover:bg-[#151C28] hover:text-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#51D1B3]' : item.highlight ? 'text-amber-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    V2
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account / Security Status */}
        <div className="p-4 border-t border-[#222E42] bg-[#0B0F17]/50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#151C28] border border-[#222E42]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#51D1B3] to-cyan-500 flex items-center justify-center text-[#0B0F17] font-bold text-xs">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200 truncate">Sidibé</p>
              <p className="text-[10px] text-[#51D1B3] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Accès Autorisé
              </p>
            </div>
            <button className="text-gray-400 hover:text-red-400 p-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0B0F17]">
        {/* Top Header */}
        <header className="h-16 border-b border-[#222E42] bg-[#101622]/80 backdrop-blur-md px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔎 Que recherches-tu ? (Ex: React hooks, Capture erreur...)"
                className="w-full bg-[#151C28] border border-[#222E42] rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3] focus:ring-1 focus:ring-[#51D1B3] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-semibold text-sm hover:bg-[#3EB89B] transition-all shadow-lg shadow-[#51D1B3]/20">
              <Plus className="w-4 h-4" />
              <span>Ajouter une ressource</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Welcome Banner */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#151C28] via-[#101622] to-[#151C28] border border-[#222E42] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#51D1B3]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <h2 className="text-2xl font-bold text-white mb-2">Bonjour Sidibé 👋</h2>
            <p className="text-gray-400 text-sm max-w-2xl">
              Bienvenue sur votre coffre-fort numérique **PersonalAI**. Vos ressources sont centralisées, sécurisées et prêtes à être retrouvées instantanément.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-[#0B0F17]/60 border border-[#222E42] flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">PDF & Docs</p>
                  <p className="text-lg font-bold text-white">12</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F17]/60 border border-[#222E42] flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Images & Captures</p>
                  <p className="text-lg font-bold text-white">8</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F17]/60 border border-[#222E42] flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Liens Enregistrés</p>
                  <p className="text-lg font-bold text-white">24</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0F17]/60 border border-[#222E42] flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <StickyNote className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Notes & Vault</p>
                  <p className="text-lg font-bold text-white">15</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resource Filter Pills */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {['ALL', 'PDF', 'IMAGE', 'LINK', 'NOTE'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterType === type 
                      ? 'bg-[#51D1B3] text-[#0B0F17]' 
                      : 'bg-[#151C28] text-gray-400 border border-[#222E42] hover:text-gray-200'
                  }`}
                >
                  {type === 'ALL' ? 'Tous' : type}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Affichage de <span className="text-[#51D1B3] font-semibold">{filteredResources.length}</span> élément(s)
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((item) => (
              <div 
                key={item.id} 
                className="p-5 rounded-2xl bg-[#151C28] border border-[#222E42] hover:border-[#51D1B3]/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getTypeBadgeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <span className="text-[11px] text-gray-400">{item.date}</span>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-[#51D1B3] transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B0F17] border border-[#222E42] text-[10px] text-gray-400">
                        <Tag className="w-2.5 h-2.5 text-[#51D1B3]" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#222E42]/60 flex items-center justify-between text-xs text-gray-400">
                    <span className="text-[11px] text-gray-400">Catégorie: <strong className="text-gray-300 font-normal">{item.category}</strong></span>
                    <button className="text-[#51D1B3] hover:underline flex items-center gap-1 font-medium">
                      Ouvrir <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
