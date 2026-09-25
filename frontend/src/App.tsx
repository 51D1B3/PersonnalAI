import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { AddResourceModal } from './components/AddResourceModal';

import { AccueilPage } from './pages/AccueilPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ImagesPage } from './pages/ImagesPage';
import { VideosPage } from './pages/VideosPage';
import { LiensPage } from './pages/LiensPage';
import { NotesPage } from './pages/NotesPage';
import { RecherchePage } from './pages/RecherchePage';
import { ParametresPage } from './pages/ParametresPage';

import type { ResourceItem, UserProfile } from './types';

const INITIAL_RESOURCES: ResourceItem[] = [];

export function App() {
  const [user, setUser] = useState<UserProfile | null>({
    email: 'sidibe@personalai.dev',
    name: 'Sidibé',
    role: 'Propriétaire',
    isAuthorized: true
  });

  const [activeTab, setActiveTab] = useState('accueil');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);

  const handleAddResource = (newResource: ResourceItem) => {
    setResources(prev => [newResource, ...prev]);
  };

  if (!user) {
    return <Login onLoginSuccess={(loggedUser) => setUser(loggedUser)} />;
  }

  // Render active page based on activeTab
  const renderActivePage = () => {
    switch (activeTab) {
      case 'documents':
        return <DocumentsPage resources={resources} onAddClick={() => setIsAddModalOpen(true)} />;
      case 'images':
        return <ImagesPage resources={resources} onAddClick={() => setIsAddModalOpen(true)} />;
      case 'videos':
        return <VideosPage resources={resources} onAddClick={() => setIsAddModalOpen(true)} />;
      case 'liens':
        return <LiensPage resources={resources} onAddClick={() => setIsAddModalOpen(true)} />;
      case 'notes':
        return <NotesPage resources={resources} onAddClick={() => setIsAddModalOpen(true)} />;
      case 'recherche':
        return <RecherchePage resources={resources} />;
      case 'parametres':
        return <ParametresPage user={user} />;
      case 'accueil':
      default:
        return (
          <AccueilPage 
            user={user}
            resources={resources}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0F17] text-gray-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab)} 
        user={user}
        onLogout={() => setUser(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0B0F17]">
        {/* Top Header */}
        <Header 
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q && activeTab !== 'accueil' && activeTab !== 'recherche') {
              // auto switch to search view if user types in search bar
              setActiveTab('recherche');
            }
          }}
          isAiMode={isAiMode}
          onToggleAiMode={() => {
            setIsAiMode(!isAiMode);
            setActiveTab('recherche');
          }}
          onAddResource={() => setIsAddModalOpen(true)}
          user={user}
        />

        {/* Dynamic Page Component */}
        {renderActivePage()}
      </main>

      {/* Add Resource Modal */}
      <AddResourceModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddResource={handleAddResource}
      />
    </div>
  );
}

export default App;
