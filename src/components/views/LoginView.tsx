
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, user } = useAuthContext();
  const navigate = useNavigate();

  // This effect will run when the user state changes.
  // If a user object becomes available, it means login was successful,
  // and we can safely navigate to the home page.
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleResponse = (error: any, successMessage?: string) => {
    setIsSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else if (successMessage) {
      toast.success(successMessage);
      // We no longer navigate here. The useEffect will handle it.
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await login(email, password);
    // On success, the onAuthStateChange listener will update the 'user' context,
    // which will trigger the useEffect hook to navigate.
    if (error) {
      handleResponse(error);
    } else {
        // We don't pass a success message here, to avoid a toast before navigation.
        // The UI will show a loading state until navigation happens.
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await register(email, password);
    handleResponse(error, '¡Te has registrado con éxito! Revisa tu correo para la confirmación.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>Inicia sesión para guardar tus datos en la nube o regístrate.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleRegister} disabled={isSubmitting}>
            Registrarse
          </Button>
          <Button onClick={handleLogin} disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
