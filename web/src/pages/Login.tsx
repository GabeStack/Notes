import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useLogin } from '@/features/auth/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/authContext';
import { Mail, Lock, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { mutate, isPending, error } = useLogin();
  const navigate = useNavigate();
  const { token } = useAuth();

  // 🔐 Redireciona se já estiver autenticado
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ email, password }, {
      onSuccess: () => {
        navigate('/', { replace: true });
      },
    });
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      {/* Elemento decorativo de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-xl border-muted/50">
        <CardHeader className="space-y-1 text-center pb-2">
          {/* Logo / Brand */}
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-muted-foreground">
            Entre com sua conta para acessar o Notes
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={isPending}
                required
                className="transition-all focus:ring-2 focus:ring-primary/20"
                autoComplete="email"
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Senha
                </Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isPending}
                required
                className="transition-all focus:ring-2 focus:ring-primary/20"
                autoComplete="current-password"
              />
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-2">
                {(error as any)?.response?.data?.message || 'Credenciais inválidas. Verifique e tente novamente.'}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            {/* Botão de Login */}
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full h-11 font-medium transition-all hover:shadow-lg hover:shadow-primary/10"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Link para Signup */}
            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link 
                to="/signup" 
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Criar conta gratuita
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Footer discreto */}
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground z-10">
        <p>© {new Date().getFullYear()} Gabestack.dev - Todos os direitos reservados.</p>
      </div>
    </div>
  );
}