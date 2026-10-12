import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

interface AuthCallbackProps {
  onSuccess?: (user: any) => void;
}

export default function AuthCallback({ onSuccess }: AuthCallbackProps) {
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>('Vérification de votre compte...');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isRejected, setIsRejected] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const verifyWithBackend = async (accessToken: string) => {
      try {
        setMessage('Vérification des autorisations auprès du serveur NestJS...');

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          // Déconnexion immédiate de Supabase si non autorisé
          await supabase.auth.signOut();
          localStorage.removeItem('personalai_session');

          if (isMounted) {
            setIsVerifying(false);
            setIsRejected(true);
            setMessage("❌ Cet email n'est pas autorisé à accéder à PersonalAI.");
            setErrorDetails(
              result.message ||
                "Seules les 2 adresses email configurées sur le serveur ont accès à cette mémoire numérique."
            );
          }
          return;
        }

        // Authentification réussie et vérifiée
        if (isMounted) {
          setMessage('✅ Accès autorisé ! Redirection en cours...');
          setIsVerifying(false);

          const userPayload = {
            id: result.user?.id || 'verified_user',
            email: result.user?.email,
            name: result.user?.name || result.user?.email?.split('@')[0],
            role: result.user?.role || 'Propriétaire',
            isAuthorized: true,
          };

          localStorage.setItem(
            'personalai_session',
            JSON.stringify({ user: userPayload, token: accessToken })
          );

          if (onSuccess) {
            onSuccess(userPayload);
          }

          setTimeout(() => {
            navigate('/dashboard');
          }, 600);
        }
      } catch (err: any) {
        if (isMounted) {
          setIsVerifying(false);
          setIsRejected(true);
          setMessage('⚠️ Erreur de communication avec le serveur NestJS.');
          setErrorDetails(
            "Assurez-vous que le backend NestJS est bien démarré sur le port 3000 (" +
              (err.message || 'Connexion refusée') +
              ")."
          );
        }
      }
    };

    const verifyUser = async () => {
      // 1. Tenter d'obtenir la session actuelle
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        await verifyWithBackend(session.access_token);
        return;
      }

      // 2. Si la session n'est pas encore prête, écouter onAuthStateChange
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (currentSession?.access_token) {
          subscription.unsubscribe();
          await verifyWithBackend(currentSession.access_token);
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setIsVerifying(false);
            setMessage('Connexion impossible.');
          }
        }
      });

      // Timeout de sécurité au bout de 8 secondes si aucune session détectée
      const timeoutId = setTimeout(() => {
        if (isMounted && isVerifying) {
          subscription.unsubscribe();
          setIsVerifying(false);
          setIsRejected(true);
          setMessage('Connexion impossible ou session expirée.');
          setErrorDetails(
            "Aucun jeton de session n'a été retourné par Google et Supabase. Veuillez réessayer."
          );
        }
      }, 8000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timeoutId);
      };
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [navigate, onSuccess]);

  return (
    <div className="min-h-screen w-full bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#51D1B3]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 text-center">
        {/* Verification Card */}
        <div className="bg-[#151C28]/90 backdrop-blur-xl border border-[#222E42] rounded-3xl p-8 shadow-2xl shadow-black/60">
          {isVerifying ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#51D1B3]/10 border border-[#51D1B3]/30 flex items-center justify-center text-[#51D1B3]">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">{message}</h2>
              <p className="text-xs text-gray-400">
                Supabase Auth → Récupération du JWT → NestJS Guardian (/auth/verify)
              </p>
            </div>
          ) : isRejected ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-base font-bold text-rose-300 leading-snug">{message}</h2>
              {errorDetails && (
                <p className="text-xs text-gray-400 bg-black/40 p-3 rounded-xl border border-[#222E42] text-left leading-relaxed">
                  {errorDetails}
                </p>
              )}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-4 w-full py-3 px-4 rounded-xl bg-[#222E42] hover:bg-[#2b3b55] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retourner à la page de connexion</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-emerald-300">{message}</h2>
              <p className="text-xs text-gray-400">Accès au coffre-fort accordé.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { AuthCallback };
