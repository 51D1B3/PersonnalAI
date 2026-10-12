import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { AuthCallback } from './pages/AuthCallback';
import { AddResourceModal } from './components/AddResourceModal';
import { OpenResourceModal } from './components/OpenResourceModal';
import { EditResourceModal } from './components/EditResourceModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

import { AccueilPage } from './pages/AccueilPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ImagesPage } from './pages/ImagesPage';
import { VideosPage } from './pages/VideosPage';
import { LiensPage } from './pages/LiensPage';
import { NotesPage } from './pages/NotesPage';
import { RecherchePage } from './pages/RecherchePage';
import { ParametresPage } from './pages/ParametresPage';

import type { ResourceItem, UserProfile, AuthorizedAccount, NavigationPermissions } from './types';
import { DEFAULT_AUTHORIZED_ACCOUNTS } from './types';
import { supabase } from './lib/supabase';
import { Lock } from 'lucide-react';

const LOCAL_STORAGE_RESOURCES_KEY = 'personalai_resources_db_v2';
const LOCAL_STORAGE_SESSION_KEY = 'personalai_session';
const LOCAL_STORAGE_AUTHORIZED_ACCOUNTS_KEY = 'personalai_authorized_accounts_v2';

const getStoredResources = (): ResourceItem[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_RESOURCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore
  }
  return [];
};

const getStoredUser = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.user && !parsed.user.email?.toLowerCase().includes('personalai.dev')) {
        return parsed.user;
      }
    }
  } catch {
    // Ignore
  }
  return null;
};

const getStoredAuthorizedAccounts = (): AuthorizedAccount[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_AUTHORIZED_ACCOUNTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.filter(
          (acc: any) => !acc.email.toLowerCase().includes('personalai.dev')
        );
        if (cleaned.length > 0) {
          if (!cleaned.some((acc) => acc.email.toLowerCase() === 'mahamadousidibe2004@gmail.com')) {
            cleaned.unshift(DEFAULT_AUTHORIZED_ACCOUNTS[0]);
          }
          return cleaned;
        }
      }
    }
  } catch {
    // Ignore
  }
  return DEFAULT_AUTHORIZED_ACCOUNTS;
};

export function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(getStoredUser());
  const [activeTab, setActiveTab] = useState('accueil');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Resource Action Modals State
  const [openModalResource, setOpenModalResource] = useState<ResourceItem | null>(null);
  const [editModalResource, setEditModalResource] = useState<ResourceItem | null>(null);
  const [deleteModalResource, setDeleteModalResource] = useState<ResourceItem | null>(null);

  const [resources, setResources] = useState<ResourceItem[]>(getStoredResources());
  const [authorizedAccounts, setAuthorizedAccounts] = useState<AuthorizedAccount[]>(
    getStoredAuthorizedAccounts()
  );

  // Clear legacy localStorage keys on mount
  useEffect(() => {
    try {
      localStorage.removeItem('personalai_authorized_accounts');
      localStorage.removeItem('personalai_authorized_accounts_v1');
    } catch {
      // Ignore
    }
  }, []);

  // Auto-save resources to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_RESOURCES_KEY, JSON.stringify(resources));
  }, [resources]);

  // Auto-save authorized accounts to localStorage
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_AUTHORIZED_ACCOUNTS_KEY,
      JSON.stringify(authorizedAccounts)
    );
  }, [authorizedAccounts]);

  // Synchronisation avec la base de données Backend API
  const syncWithDatabase = async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3000/search/classic', {
        headers: { 'x-user-email': user.email || 'mahamadousidibe2004@gmail.com' },
      });
      if (response.ok) {
        const backendItems: ResourceItem[] = await response.json();
        if (Array.isArray(backendItems)) {
          setResources((prev) => {
            const map = new Map<string, ResourceItem>();
            prev.forEach((item) => map.set(item.id, item));
            backendItems.forEach((item) => map.set(item.id, item));
            const merged = Array.from(map.values());
            localStorage.setItem(LOCAL_STORAGE_RESOURCES_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      }
    } catch {
      // Fallback local
    }
  };

  useEffect(() => {
    if (user) {
      syncWithDatabase();
    }
  }, [user]);

  const handleAddResource = (newResource: ResourceItem) => {
    setResources((prev) => {
      const updated = [newResource, ...prev];
      localStorage.setItem(LOCAL_STORAGE_RESOURCES_KEY, JSON.stringify(updated));
      return updated;
    });
    setTimeout(() => syncWithDatabase(), 300);
  };

  const handleOpenResource = (res: ResourceItem) => {
    setOpenModalResource(res);
  };

  const handleEditResource = (res: ResourceItem) => {
    setEditModalResource(res);
  };

  const handleSaveEditedResource = (updated: ResourceItem) => {
    setResources((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteResource = (res: ResourceItem) => {
    setDeleteModalResource(res);
  };

  const handleConfirmDeleteResource = async (res: ResourceItem) => {
    setResources((prev) => prev.filter((item) => item.id !== res.id));

    let endpoint = 'documents';
    if (res.type === 'IMAGE') endpoint = 'images';
    else if (res.type === 'VIDEO') endpoint = 'videos';
    else if (res.type === 'LINK') endpoint = 'links';
    else if (res.type === 'NOTE') endpoint = 'notes';

    try {
      await fetch(`http://localhost:3000/${endpoint}/${res.id}`, {
        method: 'DELETE',
        headers: { 'x-user-email': user?.email || 'mahamadousidibe2004@gmail.com' },
      });
    } catch {
      // Local removal completed
    }
  };

  const handleDownloadResource = async (res: ResourceItem) => {
    try {
      await fetch(`http://localhost:3000/documents/download/${res.id}`, {
        headers: { 'x-user-email': user?.email || 'mahamadousidibe2004@gmail.com' },
      });
    } catch {
      // Ignore
    }

    if (res.url && (res.url.startsWith('http') || res.url.startsWith('/') || res.url.startsWith('blob:'))) {
      const link = document.createElement('a');
      link.href = res.url;
      const ext = res.type === 'PDF' ? '.pdf' : res.type === 'IMAGE' ? '.png' : res.type === 'VIDEO' ? '.mp4' : '.txt';
      const filename = res.title.endsWith(ext) ? res.title : `${res.title.replace(/\s+/g, '_')}${ext}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const content = res.noteContent || res.description || res.title;
    const ext = res.type === 'PDF' ? 'pdf' : res.type === 'IMAGE' ? 'png' : res.type === 'VIDEO' ? 'mp4' : 'txt';
    const mime = res.type === 'PDF' ? 'application/pdf' : 'text/plain;charset=utf-8';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${res.title.replace(/\s+/g, '_')}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    setUser(null);
    navigate('/login');
  };

  const handleResetToZero = () => {
    setResources([]);
    localStorage.removeItem(LOCAL_STORAGE_RESOURCES_KEY);
  };

  // Permissions et autorisation
  const currentUserAccount = authorizedAccounts.find(
    (acc) => acc.email.toLowerCase() === user?.email.toLowerCase()
  );

  const isUserAuthorized = Boolean(
    user && (currentUserAccount ? currentUserAccount.isAuthorized : user.isAuthorized)
  );

  const permissions: NavigationPermissions = currentUserAccount?.permissions || {
    accueil: true,
    documents: true,
    images: true,
    videos: true,
    liens: true,
    notes: true,
    recherche: true,
    parametres: true,
  };

  const isTabAllowed = permissions[activeTab as keyof NavigationPermissions] !== false;

  const renderActivePage = () => {
    if (!user) return null;

    if (!isTabAllowed) {
      return (
        <div className="flex-1 p-8 text-center bg-[#0B0F17] flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Accès Refusé (Permission Décochée)</h2>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            Votre adresse email (<strong className="text-white">{user.email}</strong>) ne possède pas la permission d'ouvrir cette rubrique. Demandez à l'administrateur de recocher ce bouton dans la section Paramètres.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'documents':
        return (
          <DocumentsPage
            resources={resources}
            user={user}
            onAddClick={() => setIsAddModalOpen(true)}
            onOpenResource={handleOpenResource}
            onDownloadResource={handleDownloadResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
          />
        );
      case 'images':
        return (
          <ImagesPage
            resources={resources}
            user={user}
            onAddClick={() => setIsAddModalOpen(true)}
            onOpenResource={handleOpenResource}
            onDownloadResource={handleDownloadResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
          />
        );
      case 'videos':
        return (
          <VideosPage
            resources={resources}
            user={user}
            onAddClick={() => setIsAddModalOpen(true)}
            onOpenResource={handleOpenResource}
            onDownloadResource={handleDownloadResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
          />
        );
      case 'liens':
        return (
          <LiensPage
            resources={resources}
            user={user}
            onAddClick={() => setIsAddModalOpen(true)}
            onOpenResource={handleOpenResource}
            onDownloadResource={handleDownloadResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
          />
        );
      case 'notes':
        return (
          <NotesPage
            resources={resources}
            user={user}
            onAddClick={() => setIsAddModalOpen(true)}
            onOpenResource={handleOpenResource}
            onDownloadResource={handleDownloadResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
          />
        );
      case 'recherche':
        return (
          <RecherchePage
            resources={resources}
            onOpenResource={handleOpenResource}
            onDownloadResource={handleDownloadResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
          />
        );
      case 'parametres':
        return (
          <ParametresPage
            user={user}
            authorizedAccounts={authorizedAccounts}
            onUpdateAuthorizedAccounts={setAuthorizedAccounts}
            onResetToZero={handleResetToZero}
          />
        );
      case 'accueil':
      default:
        return (
          <AccueilPage
            user={user}
            resources={resources}
            permissions={permissions}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            onAddClick={() => setIsAddModalOpen(true)}
            onOpenResource={handleOpenResource}
            onDownloadResource={handleDownloadResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
          />
        );
    }
  };

  // Composant Vue Tableau de Bord
  const DashboardView = () => {
    if (!user || !isUserAuthorized) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="flex h-screen bg-[#0B0F17] text-gray-100 font-sans overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          user={user}
          permissions={permissions}
          onLogout={handleLogout}
          onAddResource={() => setIsAddModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0B0F17]">
          {/* Top Header */}
          <Header
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (q && activeTab !== 'accueil' && activeTab !== 'recherche') {
                setActiveTab('recherche');
              }
            }}
            isAiMode={isAiMode}
            onAddResource={() => setIsAddModalOpen(true)}
            user={user}
          />

          {/* Dynamic Page Component */}
          {renderActivePage()}
        </main>

        {/* Modals */}
        <AddResourceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddResource={handleAddResource}
          userEmail={user.email}
        />

        <OpenResourceModal
          resource={openModalResource}
          onClose={() => setOpenModalResource(null)}
          onDownload={handleDownloadResource}
        />

        <EditResourceModal
          resource={editModalResource}
          onClose={() => setEditModalResource(null)}
          onSave={handleSaveEditedResource}
        />

        <DeleteConfirmModal
          resource={deleteModalResource}
          onClose={() => setDeleteModalResource(null)}
          onConfirm={handleConfirmDeleteResource}
        />
      </div>
    );
  };

  return (
    <Routes>
      {/* Étape 6 : Page de retour OAuth Supabase */}
      <Route
        path="/auth/callback"
        element={
          <AuthCallback
            onSuccess={(verifiedUser) => {
              setUser(verifiedUser);
            }}
          />
        }
      />

      {/* Étape 5 : Page de Connexion avec bouton Google */}
      <Route
        path="/login"
        element={
          user && isUserAuthorized ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login
              authorizedAccounts={authorizedAccounts}
              onLoginSuccess={(loggedUser) => {
                localStorage.setItem(
                  LOCAL_STORAGE_SESSION_KEY,
                  JSON.stringify({ user: loggedUser })
                );
                setUser(loggedUser);
                navigate('/dashboard');
              }}
            />
          )
        }
      />

      {/* Tableau de bord principal */}
      <Route path="/dashboard" element={<DashboardView />} />

      {/* Racine / Redirection */}
      <Route
        path="/"
        element={<Navigate to={user && isUserAuthorized ? '/dashboard' : '/login'} replace />}
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
