
import { useState, useEffect, useTransition } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react'; // Importar el icono

export function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterView, setIsRegisterView] = useState(false);
  const { login, register, user } = useAuthContext();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (user) {
      startTransition(() => {
        navigate('/');
      });
    }
  }, [user, navigate]);

  const handleResponse = (error: any, successMessage?: string) => {
    setIsSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else if (successMessage) {
      toast.success(successMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isRegisterView) {
      const { error } = await register(email, password);
      handleResponse(error, '¡Te has registrado con éxito! Revisa tu correo para la confirmación.');
    } else {
      const { error } = await login(email, password);
      if (error) {
        handleResponse(error);
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center relative"> {/* Añadir 'relative' para posicionamiento absoluto */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="absolute left-4 top-4" // Posicionar arriba a la izquierda
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl">{isRegisterView ? 'Crear Cuenta' : 'Iniciar Sesión'}</CardTitle>
          <CardDescription>
            {isRegisterView ? 'Ingresa tus datos para registrarte.' : 'Bienvenido de nuevo.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? 'Procesando...'
                : isRegisterView
                ? 'Registrarse'
                : 'Iniciar Sesión'}
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-muted-foreground"
              onClick={() => setIsRegisterView(!isRegisterView)}
            >
              {isRegisterView
                ? '¿Ya tienes una cuenta? Inicia sesión'
                : '¿No tienes una cuenta? Regístrate'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
