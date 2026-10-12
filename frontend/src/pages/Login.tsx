import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldCheck, AlertCircle, Lock } from 'lucide-react';
import type { UserProfile, AuthorizedAccount } from '../types';

interface LoginProps {
  authorizedAccounts?: AuthorizedAccount[];
  onLoginSuccess?: (user: UserProfile) => void;
}

export default function Login(_props: LoginProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Erreur Supabase OAuth:', error);
        setErrorMessage(error.message || 'Erreur lors de la connexion avec Google');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('Exception connexion Google:', err);
      setErrorMessage(err.message || 'Impossible de joindre le serveur Supabase');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#51D1B3]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-block relative mb-4">
            <img
              src="/logo.png"
              alt="PersonalAI Logo"
              className="w-20 h-20 object-contain mx-auto drop-shadow-2xl shadow-xl shadow-[#51D1B3]/20 rounded-2xl border border-[#222E42]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Personal<span className="text-[#51D1B3]">AI</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            Ma mémoire numérique, intelligente et privée.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#151C28]/85 backdrop-blur-xl border border-[#222E42] rounded-3xl p-8 shadow-2xl shadow-black/60 transition-all">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#51D1B3]/10 border border-[#51D1B3]/25 text-[#51D1B3] text-xs font-semibold w-fit mb-6">
            <ShieldCheck className="w-4 h-4" /> Accès Privé & Vérifié par Backend NestJS
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-xs text-gray-300 leading-relaxed">
              Connectez-vous avec votre compte Google. Votre identité sera validée par Supabase Auth, puis autorisée par le serveur NestJS personnel.
            </p>

            {/* Google OAuth Button */}
            <button
              id="google-login-button"
              type="button"
              onClick={loginWithGoogle}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 active:scale-[0.98] transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group border border-gray-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="font-bold tracking-wide">Continuer avec Google</span>
                </>
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-[#222E42]/80">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-2">
              <Lock className="w-3.5 h-3.5 text-[#51D1B3]" />
              <span>Coffre-fort à accès restreint</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Seules les deux adresses email propriétaires configurées dans le fichier d'environnement du serveur sont autorisées à accéder aux documents, notes et médias.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-gray-400 mt-6 font-mono">
          PersonalAI v2.0 • Architecture Supabase Auth + NestJS Guardian
        </p>
      </div>
    </div>
  );
}

export { Login };
