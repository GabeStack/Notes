import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({ password: '', password_confirmation: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔐 Redireciona se não houver token na URL
  useEffect(() => {
    if (!token) navigate('/login', { replace: true });
  }, [token, navigate]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => navigate('/login?reset=success', { replace: true }),
  });

  const passwordLength = form.password.length;
  const hasMinLength = passwordLength >= 8;
  const hasMaxLength = passwordLength <= 32;
  const passwordsMatch = form.password && form.password_confirmation && form.password === form.password_confirmation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasMinLength || !hasMaxLength || !passwordsMatch) return;
    mutate({ token, password: form.password });
  };

  const getErrorMessage = () => {
    if (!(error as any)?.response?.data) return 'Ocorreu um erro. Tente novamente.';
    const data = (error as any).response.data;
    if (data.errors) return Object.values(data.errors).flat().join(', ');
    return data.message || 'Erro ao redefinir senha.';
  };

  if (!token) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
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
          <CardTitle className="text-xl font-bold">Redefinir senha</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Crie uma nova senha segura para sua conta
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 pb-4">
            {/* Nova Senha */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Nova senha
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
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
              </div>
              {form.password && (
                <div className="flex gap-2 text-[10px] text-muted-foreground">
                  <span className={hasMinLength ? 'text-green-600' : ''}>{hasMinLength ? '✓' : '○'} 8+ chars</span>
                  <span className={hasMaxLength ? 'text-green-600' : ''}>{hasMaxLength ? '✓' : '○'} ≤32 chars</span>
                </div>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Confirmar senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  placeholder="Repita a nova senha"
                  disabled={isPending}
                  required
                  className={`h-9 text-sm pr-8 ${form.password_confirmation && !passwordsMatch ? 'border-destructive/50 focus:ring-destructive/20' : ''}`}
                  autoComplete="new-password"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
              </div>
              {form.password_confirmation && (
                <span className={`text-[10px] ${passwordsMatch ? 'text-green-600' : 'text-destructive'}`}>
                  {passwordsMatch ? '✓ Senhas conferem' : '✗ Não coincidem'}
                </span>
              )}
            </div>

            {error && (
              <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {getErrorMessage()}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0 pb-5">
            <Button type="submit" disabled={isPending || !hasMinLength || !hasMaxLength || !passwordsMatch} className="w-full h-9 text-sm font-medium">
              {isPending ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Redefinindo...</> : 'Redefinir senha'}
            </Button>
            <Link to="/login" className="text-xs text-muted-foreground flex items-center justify-center gap-1 hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3" /> Voltar para o login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}