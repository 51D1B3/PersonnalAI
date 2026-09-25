import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import type { UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const AUTHORIZED_EMAILS = [
  { email: 'sidibe@personalai.dev', name: 'Sidibé', role: 'Propriétaire' },
  { email: 'admin@personalai.dev', name: 'Administrateur', role: 'Co-Propriétaire' }
];

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const matched = AUTHORIZED_EMAILS.find(item => item.email.toLowerCase() === cleanEmail);

      if (matched) {
        onLoginSuccess({
          email: matched.email,
          name: matched.name,
          role: matched.role,
          isAuthorized: true
        });
      } else {
        setError("❌ Accès refusé : Seules 2 adresses email prédéfinies sont autorisées à accéder à PersonalAI.");
        setIsLoading(false);
      }
    }, 600);
  };

  const handleQuickSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword('••••••••••••');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#51D1B3]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#51D1B3] text-[#0B0F17] font-extrabold text-2xl mb-4 shadow-xl shadow-[#51D1B3]/25 animate-pulse">
            PA
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Personal<span className="text-[#51D1B3]">AI</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            « Ma mémoire numérique, intelligente et privée. »
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#151C28]/80 backdrop-blur-xl border border-[#222E42] rounded-3xl p-8 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#51D1B3]/10 border border-[#51D1B3]/20 text-[#51D1B3] text-xs font-semibold w-fit mb-6">
            <ShieldCheck className="w-4 h-4" /> Accès Privé Sécurisé
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-3 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Adresse Email Autorisée
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@personalai.dev"
                  className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl pl-10 pr-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3] focus:ring-1 focus:ring-[#51D1B3] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B0F17] border border-[#222E42] rounded-xl pl-10 pr-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#51D1B3] focus:ring-1 focus:ring-[#51D1B3] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#51D1B3] text-[#0B0F17] font-bold text-sm hover:bg-[#3EB89B] transition-all shadow-lg shadow-[#51D1B3]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0B0F17] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Connexion au coffre-fort</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-8 pt-6 border-t border-[#222E42]">
            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#51D1B3]" />
              Comptes autorisés de test :
            </p>
            <div className="space-y-2">
              {AUTHORIZED_EMAILS.map((auth) => (
                <button
                  key={auth.email}
                  type="button"
                  onClick={() => handleQuickSelect(auth.email)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0B0F17]/70 border border-[#222E42] hover:border-[#51D1B3]/40 text-left transition-all group cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-200 group-hover:text-[#51D1B3] transition-colors">
                      {auth.name} ({auth.role})
                    </p>
                    <p className="text-[11px] text-gray-400">{auth.email}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#51D1B3]/10 text-[#51D1B3] font-medium border border-[#51D1B3]/20">
                    Sélectionner
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
