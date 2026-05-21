import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => setIsSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email });
  };

  const getErrorMessage = () => {
    if (!(error as any)?.response?.data) return 'Ocorreu um erro. Tente novamente.';
    const data = (error as any).response.data;
    if (data.errors) return Object.values(data.errors).flat().join(', ');
    return data.message || 'Erro ao redefinir senha.';
  };

  // ✅ Tela de sucesso após envio
  if (isSubmitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <Card className="w-full max-w-md shadow-lg border-muted/50">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">Email enviado!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Se uma conta estiver associada a <strong>{email}</strong>, você receberá um link para redefinir sua senha em instantes.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-0">
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
              Voltar para o login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
          <CardTitle className="text-xl font-bold">Esqueceu a senha?</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Informe seu email para receber um link de recuperação
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 pb-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={isPending}
                required
                className="h-9 text-sm"
                autoComplete="email"
              />
            </div>
            {error && (
              <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {getErrorMessage()}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0 pb-5">
            <Button type="submit" disabled={isPending} className="w-full h-9 text-sm font-medium">
              {isPending ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Enviando...</> : 'Enviar link de recuperação'}
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