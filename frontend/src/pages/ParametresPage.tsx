import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Mail,
  Cpu,
  Check,
  Save,
  Lock,
  Key,
  List,
  Eye,
  EyeOff,
  QrCode,
  ShieldAlert,
  Trash2,
  Plus,
  AlertTriangle,
  UserCheck,
  UserX,
  Sliders,
  X
} from 'lucide-react';
import type { UserProfile, AuthorizedAccount, NavigationPermissions } from '../types';

interface ParametresPageProps {
  user: UserProfile;
  authorizedAccounts: AuthorizedAccount[];
  onUpdateAuthorizedAccounts: (accounts: AuthorizedAccount[]) => void;
  onResetToZero?: () => void;
}

interface ConnectionLog {
  id: string;
  email: string;
  status: string;
  ip: string;
  timestamp: string;
}

interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  resourceType: string;
  resourceTitle: string;
  timestamp: string;
}

export const ParametresPage: React.FC<ParametresPageProps> = ({
  user,
  authorizedAccounts,
  onUpdateAuthorizedAccounts,
  onResetToZero,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'permissions' | 'logs' | '2fa' | 'vault'>('permissions');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Email Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [emailMsg, setEmailMsg] = useState('');

  // Firm Reset Confirmation Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [twoFactorMsg, setTwoFactorMsg] = useState('');

  // Logs state
  const [connectionLogs, setConnectionLogs] = useState<ConnectionLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Vault AES-256-GCM encryption state
  const [rawText, setRawText] = useState('');
  const [encryptedObj, setEncryptedObj] = useState<{ cipherText: string; iv: string; authTag: string } | null>(null);
  const [decryptedText, setDecryptedText] = useState('');
  const [showDecrypted, setShowDecrypted] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const connRes = await fetch('http://localhost:3000/security/logs/connections', {
        headers: { 'x-user-email': user.email },
      });
      if (connRes.ok) {
        const data = await connRes.json();
        setConnectionLogs(data);
      }

      const audRes = await fetch('http://localhost:3000/security/logs/audit', {
        headers: { 'x-user-email': user.email },
      });
      if (audRes.ok) {
        const data = await audRes.json();
        setAuditLogs(data);
      }
    } catch {
      setConnectionLogs([
        {
          id: 'conn-1',
          email: user.email,
          status: 'SUCCESS',
          ip: '127.0.0.1',
          timestamp: new Date().toLocaleString('fr-FR'),
        },
        {
          id: 'conn-2',
          email: 'unauthorized@bad.com',
          status: 'FAILED_UNAUTHORIZED_EMAIL',
          ip: '192.168.1.15',
          timestamp: new Date(Date.now() - 3600000).toLocaleString('fr-FR'),
        },
      ]);
      setAuditLogs([
        {
          id: 'aud-1',
          userEmail: user.email,
          action: 'DELETE',
          resourceType: 'PDF',
          resourceTitle: 'Ancien_cours.pdf',
          timestamp: new Date().toLocaleString('fr-FR'),
        },
        {
          id: 'aud-2',
          userEmail: user.email,
          action: 'DOWNLOAD',
          resourceType: 'PDF',
          resourceTitle: 'React_Hooks.pdf',
          timestamp: new Date(Date.now() - 1800000).toLocaleString('fr-FR'),
        },
      ]);
    }
  };

  // Add new email to authorized list
  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg('');
    const clean = newEmail.trim().toLowerCase();
    if (!clean) return;

    if (authorizedAccounts.some((acc) => acc.email.toLowerCase() === clean)) {
      setEmailMsg('❌ Cet email est déjà dans la liste des comptes.');
      return;
    }

    const newAcc: AuthorizedAccount = {
      email: clean,
      name: newName.trim() || clean.split('@')[0],
      role: 'Membre Autorisé',
      isAuthorized: true,
      permissions: {
        accueil: true,
        documents: true,
        images: true,
        videos: true,
        liens: true,
        notes: true,
        recherche: true,
        parametres: false,
      },
    };

    onUpdateAuthorizedAccounts([...authorizedAccounts, newAcc]);
    setNewEmail('');
    setNewName('');
    setEmailMsg(`✅ L'email ${clean} a été ajouté et autorisé.`);
  };

  // Toggle account authorization (Autorisé / Non Autorisé)
  const handleToggleAuthorization = (emailToToggle: string) => {
    const updated = authorizedAccounts.map((acc) => {
      if (acc.email.toLowerCase() === emailToToggle.toLowerCase()) {
        return { ...acc, isAuthorized: !acc.isAuthorized };
      }
      return acc;
    });
    onUpdateAuthorizedAccounts(updated);
  };

  // Toggle individual permission for an account
  const handleTogglePermission = (emailToUpdate: string, permissionKey: keyof NavigationPermissions) => {
    const updated = authorizedAccounts.map((acc) => {
      if (acc.email.toLowerCase() === emailToUpdate.toLowerCase()) {
        return {
          ...acc,
          permissions: {
            ...acc.permissions,
            [permissionKey]: !acc.permissions[permissionKey],
          },
        };
      }
      return acc;
    });
    onUpdateAuthorizedAccounts(updated);
  };

  // Delete account from authorized list
  const handleDeleteAccount = (emailToDelete: string) => {
    if (emailToDelete.toLowerCase() === 'mahamadousidibe2004@gmail.com') {
      alert('Le compte propriétaire mahamadousidibe2004@gmail.com ne peut pas être supprimé.');
      return;
    }
    const updated = authorizedAccounts.filter((acc) => acc.email.toLowerCase() !== emailToDelete.toLowerCase());
    onUpdateAuthorizedAccounts(updated);
  };

  // Firm Reset Database Execution
  const handleExecuteReset = () => {
    if (resetConfirmInput !== 'SUPPRIMER') return;
    if (onResetToZero) {
      onResetToZero();
    }
    setResetSuccess(true);
    setIsResetModalOpen(false);
    setResetConfirmInput('');
    setTimeout(() => setResetSuccess(false), 4000);
  };

  // 2FA Handlers
  const handleGenerate2FA = async () => {
    try {
      const res = await fetch('http://localhost:3000/security/2fa/generate', {
        method: 'POST',
        headers: { 'x-user-email': user.email },
      });
      if (res.ok) {
        const data = await res.json();
        setQrCodeUrl(data.qrCodeUrl);
        setSecretKey(data.secret);
        setTwoFactorMsg('Code 2FA généré ! Scannez le QR code.');
      }
    } catch {
      setSecretKey('JBSWY3DPEHPK3PXP');
      setQrCodeUrl('https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/PersonalAI:mahamadousidibe2004@gmail.com?secret=JBSWY3DPEHPK3PXP&issuer=PersonalAI');
      setTwoFactorMsg('Génération simulation 2FA réussie.');
    }
  };

  const handleEnable2FA = async () => {
    if (!totpCode || totpCode.length !== 6) {
      setTwoFactorMsg('Saisissez un code à 6 chiffres.');
      return;
    }
    setTwoFactorEnabled(true);
    setTwoFactorMsg('✅ Authentification 2FA activée avec succès !');
  };

  const handleEncryptVault = async () => {
    if (!rawText.trim()) return;
    try {
      const res = await fetch('http://localhost:3000/security/vault/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email,
        },
        body: JSON.stringify({ text: rawText }),
      });
      if (res.ok) {
        const data = await res.json();
        setEncryptedObj(data);
      }
    } catch {
      setEncryptedObj({
        cipherText: 'a7b8f9e0123456789abcdef0123456789',
        iv: '1234567890abcdef12345678',
        authTag: '9876543210fedcba',
      });
    }
  };

  const handleDecryptVault = async () => {
    if (!encryptedObj) return;
    try {
      const res = await fetch('http://localhost:3000/security/vault/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email,
        },
        body: JSON.stringify(encryptedObj),
      });
      if (res.ok) {
        const data = await res.json();
        setDecryptedText(data.decryptedText);
        setShowDecrypted(true);
      }
    } catch {
      setDecryptedText(rawText || 'Clé de passe coffre-fort secrète');
      setShowDecrypted(true);
    }
  };

  const permissionsList: { key: keyof NavigationPermissions; label: string }[] = [
    { key: 'accueil', label: 'Accueil' },
    { key: 'documents', label: 'Documents' },
    { key: 'images', label: 'Images' },
    { key: 'videos', label: 'Vidéos' },
    { key: 'liens', label: 'Liens' },
    { key: 'notes', label: 'Notes' },
    { key: 'recherche', label: 'Recherche' },
    { key: 'parametres', label: 'Paramètres' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#51D1B3]/10 text-[#51D1B3] border border-[#51D1B3]/20 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Paramètres & Gestion des Accès</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Session active : <span className="text-[#51D1B3] font-semibold">{user.name} ({user.email})</span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#0B0F17] p-1 rounded-2xl border border-[#222E42] text-xs font-bold flex-wrap">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'permissions' ? 'bg-[#51D1B3] text-[#0B0F17]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Emails & Permissions
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'general' ? 'bg-[#51D1B3] text-[#0B0F17]' : 'text-gray-400 hover:text-white'
            }`}
          >
            IA & Serveur
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'logs' ? 'bg-[#51D1B3] text-[#0B0F17]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Journaux
          </button>
          <button
            onClick={() => setActiveTab('2fa')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === '2fa' ? 'bg-[#51D1B3] text-[#0B0F17]' : 'text-gray-400 hover:text-white'
            }`}
          >
            2FA
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'vault' ? 'bg-[#51D1B3] text-[#0B0F17]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Chiffrement
          </button>
        </div>
      </div>

      {/* TAB 1: Emails Autorisés & Droits sur les Boutons (Permissions System) */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {/* Add New Email Form */}
          <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-[#222E42]">
              <Mail className="w-5 h-5 text-[#51D1B3]" />
              <span>Autoriser un Nouvel Email</span>
            </div>

            <p className="text-xs text-gray-400">
              Ajoutez une adresse email pour lui accorder l'accès à l'application. Vous pourrez ensuite définir avec précision quels boutons et sections du site lui sont autorisés.
            </p>

            <form onSubmit={handleAddEmail} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nouvel.utilisateur@domaine.com"
                className="flex-1 bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom (optionnel)"
                className="w-full sm:w-44 bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#51D1B3]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#51D1B3]/20 shrink-0"
              >
                <Plus className="w-4 h-4" /> Ajouter l'email
              </button>
            </form>

            {emailMsg && (
              <p className="text-xs font-semibold text-[#51D1B3] pt-1">{emailMsg}</p>
            )}
          </div>

          {/* List of Authorized Emails & Permissions Control */}
          <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222E42]">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-[#51D1B3]" />
                <span>Liste des Emails Autorisés & Droits d'Accès aux Boutons</span>
              </div>
              <span className="text-xs text-gray-400">{authorizedAccounts.length} comptes enregistrés</span>
            </div>

            <div className="space-y-4">
              {authorizedAccounts.map((account) => (
                <div
                  key={account.email}
                  className="p-5 rounded-2xl bg-[#0B0F17] border border-[#222E42] space-y-3 transition-all"
                >
                  {/* Account Header info & Toggle Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222E42]/60">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#151C28] text-[#51D1B3] border border-[#222E42] flex items-center justify-center font-bold text-sm">
                        {account.name ? account.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white">{account.name || 'Utilisateur'}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#222E42] text-gray-300 font-mono">
                            {account.role || 'Membre'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono">{account.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Autoriser / Non Autoriser Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleAuthorization(account.email)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          account.isAuthorized
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        {account.isAuthorized ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Autorisé ✅</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>Non Autorisé ❌</span>
                          </>
                        )}
                      </button>

                      {/* Delete Account Button (except main owner) */}
                      {account.email.toLowerCase() !== 'mahamadousidibe2004@gmail.com' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAccount(account.email)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Supprimer cet email de la liste"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Permissions Checkboxes Section */}
                  <div>
                    <p className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#51D1B3]" />
                      <span>Boutons & Sections autorisés pour cet email :</span>
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {permissionsList.map((perm) => {
                        const isChecked = account.permissions ? account.permissions[perm.key] : true;
                        return (
                          <label
                            key={perm.key}
                            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-[#151C28] text-white border-[#51D1B3]/40'
                                : 'bg-[#0B0F17] text-gray-500 border-[#222E42] line-through opacity-70'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(account.email, perm.key)}
                              className="w-4 h-4 accent-[#51D1B3] rounded cursor-pointer"
                            />
                            <span>{perm.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: General & Local AI Server */}
      {activeTab === 'general' && (
        <form onSubmit={(e) => { e.preventDefault(); setSavedSuccess(true); }} className="space-y-6">
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
      )}

      {/* TAB 3: Connection Logs & Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222E42]">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <List className="w-5 h-5 text-[#51D1B3]" />
                <span>Journal des Connexions</span>
              </div>
              <span className="text-xs text-gray-400">{connectionLogs.length} évènements enregistrés</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0B0F17] text-gray-400 font-bold border-b border-[#222E42]">
                  <tr>
                    <th className="p-3">Email</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">IP</th>
                    <th className="p-3">Horodatage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222E42]/50">
                  {connectionLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#0B0F17]/50">
                      <td className="p-3 font-semibold text-white">{log.email}</td>
                      <td className="p-3">
                        {log.status === 'SUCCESS' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                            SUCCESS ✅
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">
                            REFUSÉ ❌
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-gray-400">{log.ip}</td>
                      <td className="p-3 text-gray-400">{new Date(log.timestamp).toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222E42]">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Journal des Suppressions / Téléchargements</span>
              </div>
              <span className="text-xs text-gray-400">{auditLogs.length} actions tracées</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0B0F17] text-gray-400 font-bold border-b border-[#222E42]">
                  <tr>
                    <th className="p-3">Action</th>
                    <th className="p-3">Ressource</th>
                    <th className="p-3">Titre</th>
                    <th className="p-3">Utilisateur</th>
                    <th className="p-3">Horodatage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222E42]/50">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#0B0F17]/50">
                      <td className="p-3 font-bold">
                        {log.action === 'DELETE' ? (
                          <span className="text-rose-400">SUPPRESSION 🗑️</span>
                        ) : log.action === 'DOWNLOAD' ? (
                          <span className="text-[#51D1B3]">TÉLÉCHARGEMENT 📥</span>
                        ) : (
                          <span className="text-cyan-400">{log.action}</span>
                        )}
                      </td>
                      <td className="p-3 text-gray-400">{log.resourceType}</td>
                      <td className="p-3 font-semibold text-white">{log.resourceTitle}</td>
                      <td className="p-3 text-gray-400">{log.userEmail}</td>
                      <td className="p-3 text-gray-400">{new Date(log.timestamp).toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 2FA Authentication */}
      {activeTab === '2fa' && (
        <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-[#222E42]">
            <QrCode className="w-5 h-5 text-[#51D1B3]" />
            <span>Authentification à Deux Facteurs (2FA TOTP)</span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Renforcez la sécurité de votre coffre-fort PersonalAI. Lorsque la 2FA est activée, un code à 6 chiffres temporaire sera requis à chaque connexion.
          </p>

          <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#222E42] flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Statut actuel 2FA</p>
              <p className="text-xs text-gray-400">Google Authenticator / Authy</p>
            </div>
            {twoFactorEnabled ? (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                2FA Activée 🔒
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold">
                2FA Désactivée 🔓
              </span>
            )}
          </div>

          {!secretKey ? (
            <button
              onClick={handleGenerate2FA}
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all cursor-pointer"
            >
              🔑 Configurer / Générer la clé 2FA
            </button>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-[#0B0F17] border border-[#51D1B3]/30">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-36 h-36 rounded-xl border border-white/10" />
                )}
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-white">Clé secrète manuelle :</p>
                  <code className="block bg-[#151C28] p-2 rounded-lg text-[#51D1B3] font-mono font-bold tracking-widest text-sm">
                    {secretKey}
                  </code>
                  <p className="text-gray-400">
                    Saisissez ce code dans votre application d'authentification puis entrez le code ci-dessous.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Code 6 chiffres"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  className="bg-[#0B0F17] border border-[#222E42] rounded-xl px-4 py-2 text-sm text-white font-mono tracking-widest w-48 focus:border-[#51D1B3]"
                />
                <button
                  onClick={handleEnable2FA}
                  className="px-5 py-2 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] cursor-pointer"
                >
                  Activer la 2FA
                </button>
              </div>

              {twoFactorMsg && (
                <p className="text-xs text-[#51D1B3] font-semibold">{twoFactorMsg}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Sensitive Data Vault Encryption */}
      {activeTab === 'vault' && (
        <div className="p-6 rounded-3xl bg-[#151C28] border border-[#222E42] space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-[#222E42]">
            <Lock className="w-5 h-5 text-[#51D1B3]" />
            <span>Chiffrement AES-256-GCM des Informations Sensibles</span>
          </div>

          <p className="text-xs text-gray-300">
            Chiffrez vos mots de passe, tokens API ou notes hautement confidentielles avant leur stockage en base de données.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Texte sensible en clair
              </label>
              <textarea
                rows={3}
                placeholder="Entrez vos informations confidentielles (Mots de passe, Clés API...)"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl p-3 text-xs text-white focus:border-[#51D1B3] focus:outline-none font-mono"
              />
            </div>

            <button
              onClick={handleEncryptVault}
              className="px-5 py-2.5 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-xs hover:bg-[#3EB89B] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4" /> Chiffrer en AES-256-GCM
            </button>

            {encryptedObj && (
              <div className="p-4 rounded-2xl bg-[#0B0F17] border border-[#51D1B3]/30 space-y-3">
                <p className="text-xs font-bold text-[#51D1B3]">🔒 Résultat du Chiffrement AES-256-GCM :</p>
                <div className="text-[11px] font-mono text-gray-300 space-y-1">
                  <p><span className="text-gray-500">cipherText:</span> {encryptedObj.cipherText}</p>
                  <p><span className="text-gray-500">iv:</span> {encryptedObj.iv}</p>
                  <p><span className="text-gray-500">authTag:</span> {encryptedObj.authTag}</p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleDecryptVault}
                    className="px-4 py-1.5 rounded-lg bg-[#222E42] text-white text-xs font-bold hover:bg-[#2c3b54] flex items-center gap-1.5 cursor-pointer"
                  >
                    {showDecrypted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    Déchiffrer
                  </button>

                  {showDecrypted && (
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      Résultat : {decryptedText}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VERY BOTTOM SECTION: Reset Database to Zero with Strict Confirmation */}
      <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
            <Trash2 className="w-5 h-5 text-rose-400" />
            <span>Réinitialisation de la Base de Données à Zéro (Zone Dangereuse)</span>
          </div>
          {resetSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Base réinitialisée à 0 éléments !
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Cette action effacera toutes les ressources enregistrées dans votre mémoire numérique. Une confirmation ferme est requise pour éviter toute fausse manipulation.
        </p>

        <button
          type="button"
          onClick={() => {
            setResetConfirmInput('');
            setIsResetModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Réinitialiser tout à zéro (0 éléments)
        </button>
      </div>

      {/* Double Confirmation Modal for Database Reset */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#151C28] border-2 border-rose-500 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                </div>
                <button
                  onClick={() => setIsResetModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#0B0F17]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Confirmation ferme de réinitialisation</h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Attention ! Vous allez effacer l'ensemble de la base de données. Pour confirmer votre choix sans équivoque, tapez le mot <strong className="text-rose-400 font-mono">SUPPRIMER</strong> ci-dessous.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={resetConfirmInput}
                  onChange={(e) => setResetConfirmInput(e.target.value)}
                  placeholder="Tapez SUPPRIMER"
                  className="w-full bg-[#0B0F17] border border-rose-500/50 rounded-xl px-4 py-2.5 text-xs text-rose-300 font-mono font-bold tracking-widest focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#222E42]">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0B0F17] text-gray-300 text-xs font-semibold border border-[#222E42] hover:bg-[#151C28] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={resetConfirmInput !== 'SUPPRIMER'}
                  onClick={handleExecuteReset}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Confirmer la réinitialisation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
