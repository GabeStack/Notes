import { useNavigate } from 'react-router';
import { useLogout, useProfile } from '@/features/auth/hooks';
import { useAuth } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, User } from 'lucide-react';
// ... imports

export function Home() {
  const { user: contextUser } = useAuth();
  const { data: profile, isLoading, error } = useProfile();
  const { mutate: logout, isPending } = useLogout();
  const navigate = useNavigate();

  const displayUser = profile || contextUser;

  const handleLogout = () => {
    logout(); // Hook já cuida do redirect para '/'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src="./logo.svg" alt="Logo Corenotes" className="w-9" />
        <p className="text-muted-foreground">Notes</p>
      </div>

          {/* 👇 Botão só aparece se estiver logado */}
          {displayUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isPending}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              {isPending ? 'Saindo...' : 'Sair'}
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 👇 Hero adaptativo */}
        <section className="text-center py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {displayUser ? (
              <>
                Olá, <span className="text-primary">{displayUser.name?.split(' ')[0]}</span>! 👋
              </>
            ) : (
              'Bem-vindo ao Notes'
            )}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {displayUser
              ? 'Acesse seus dados, gerencie sua conta e explore os recursos da plataforma.'
              : 'Faça login para acessar funcionalidades exclusivas e personalizar sua experiência.'}
          </p>
        </section>

        {/* 👇 Cards: mostra conteúdo diferente se logado ou não */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayUser ? (
            // 👇 Conteúdo para usuário logado
            <>
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Meu Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : error ? (
                    <p className="text-sm text-destructive">
                      Não foi possível carregar seus dados.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {displayUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{displayUser.name}</p>
                          <p className="text-sm text-muted-foreground">{displayUser.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="/profile">Editar perfil</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <a href="/dashboard">📊 Dashboard</a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" asChild>
                    <a href="/settings">⚙️ Configurações</a>
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            // 👇 Conteúdo para visitante (não logado)
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold text-lg mb-2">🚀 Pronto para começar?</h3>
                <p className="text-muted-foreground mb-6">
                  Crie sua conta gratuita ou faça login para acessar todos os recursos.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={() => navigate('/login')}>
                    Entrar
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/signup')}>
                    Cadastrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Gabestack.dev - Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}