import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useSignup } from '@/features/auth/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/authContext';
import { User, Mail, Lock, Loader2, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function Signup() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { mutate, isPending, error } = useSignup();
  const navigate = useNavigate();
  const { token } = useAuth();

  // 🔐 Redireciona se já estiver autenticado
  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  // Validações em tempo real
  const passwordLength = form.password.length;
  const hasMinLength = passwordLength >= 8;
  const hasMaxLength = passwordLength <= 32;
  const passwordsMatch = form.password && form.password_confirmation && form.password === form.password_confirmation;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasMinLength || !hasMaxLength || !passwordsMatch) return;
    
    mutate(form, {
      onSuccess: (response) => {
        const authData = response.data.data || response.data;
        if (authData?.token) navigate('/', { replace: true });
      },
    });
  }

  const getErrorMessage = () => {
    if (!error?.response?.data) return null;
    const data = error.response.data;
    if (data.errors && typeof data.errors === 'object') {
      return Object.values(data.errors).flat().join(', ');
    }
    return data.message || 'Erro ao criar conta';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      {/* Background decorativo sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-lg border-muted/50">
        <CardHeader className="space-y-1 text-center pb-3">
          <div className="flex justify-center mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold">Criar conta</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Preencha seus dados para começar
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 pb-4">
            {/* Nome */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" /> Nome completo
              </Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Seu nome"
                disabled={isPending}
                required
                className="h-9 text-sm"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                disabled={isPending}
                required
                className="h-9 text-sm"
                autoComplete="email"
              />
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mín. 8 caracteres"
                  disabled={isPending}
                  required
                  minLength={8}
                  maxLength={32}
                  className="h-9 text-sm pr-8"
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
              </div>
              {/* Validação compacta inline */}
              {form.password && (
                <div className="flex gap-2 text-[10px] text-muted-foreground">
                  <span className={hasMinLength ? 'text-green-600' : ''}>
                    {hasMinLength ? '✓' : '○'} 8+ chars
                  </span>
                  <span className={hasMaxLength ? 'text-green-600' : ''}>
                    {hasMaxLength ? '✓' : '○'} ≤32 chars
                  </span>
                </div>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Confirmar
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  placeholder="Repita a senha"
                  disabled={isPending}
                  required
                  className={`h-9 text-sm pr-8 ${form.password_confirmation && !passwordsMatch ? 'border-destructive/50 focus:ring-destructive/20' : ''}`}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
              </div>
              {/* Match validation compacta */}
              {form.password_confirmation && (
                <span className={`text-[10px] ${passwordsMatch ? 'text-green-600' : 'text-destructive'}`}>
                  {passwordsMatch ? '✓ Senhas conferem' : '✗ Não coincidem'}
                </span>
              )}
            </div>

            {/* Erro do backend */}
            {getErrorMessage() && (
              <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {getErrorMessage()}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0 pb-5">
            <Button 
              type="submit" 
              disabled={isPending || !hasMinLength || !hasMaxLength || !passwordsMatch}
              className="w-full h-9 text-sm font-medium"
            >
              {isPending ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Criando...</>
              ) : (
                <><ArrowRight className="w-3.5 h-3.5 mr-1.5" /> Cadastrar</>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Já tem conta?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}