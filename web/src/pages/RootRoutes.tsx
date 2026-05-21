// src/pages/RootRoutes.tsx
import { useAuth } from '@/context/authContext'; // 👈 Importa o contexto
import { Home } from './Home';
import Notes from './Notes';

export function RootRoute() {
  // 👇 Usa o estado REATIVO do contexto (não localStorage direto!)
  const { token, isLoading } = useAuth();

  // 🔐 Enquanto carrega inicialização, evita flicker
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 🔐 Se tiver token → mostra Notes (área logada)
  if (token) {
    return <Notes />;
  }

  // 🔓 Se NÃO tiver token → mostra Home (página pública)
  return <Home />;
}