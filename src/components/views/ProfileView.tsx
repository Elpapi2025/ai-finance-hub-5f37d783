import { useState, useTransition } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import * as LucideIcons from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { FinanceContextType } from '@/types/finance';

export function ProfileView() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const { syncToCloud, downloadBackupFromCloud, isLoading: financeIsLoading } = useOutletContext<FinanceContextType>();

  const handleLogout = async () => {
    await logout();
    startTransition(() => {
      navigate('/login');
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToSettings = () => {
    console.log("Going to settings!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="absolute left-4 top-4"
          >
            <LucideIcons.ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="w-24 h-24 mx-auto border-4 border-primary/50">
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-semibold">
              {user ? (user.email ? user.email.charAt(0).toUpperCase() : <LucideIcons.User size={48} />) : <LucideIcons.WifiOff size={48} />}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">
            {user ? 'Perfil de Usuario' : 'Modo Offline'}
          </CardTitle>
          <CardDescription>
            {user ? user.email : 'No has iniciado sesión. Los datos se guardan localmente.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <LucideIcons.Settings className="w-5 h-5" /> Ajustes
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Modo Oscuro</Label>
              <Switch id="dark-mode" defaultChecked={true} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificaciones</Label>
              <Switch id="notifications" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <LucideIcons.Database className="w-5 h-5" /> Gestión de Datos
            </h3>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => startTransition(() => navigate('/data-management'))}
            >
              Exportar / Importar Datos
            </Button>
            {user && (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={syncToCloud}
                  disabled={financeIsLoading}
                >
                  {financeIsLoading ? <LucideIcons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LucideIcons.Upload className="mr-2 h-4 w-4" />} Sincronizar a la Nube (Subir)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={downloadBackupFromCloud}
                  disabled={financeIsLoading}
                >
                  {financeIsLoading ? <LucideIcons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LucideIcons.Download className="mr-2 h-4 w-4" />} Descargar de la Nube (Restaurar)
                </Button>
              </>
            )}
          </div>
        </CardContent>
        {!user && (
          <CardFooter className="flex justify-center flex-col gap-2">
            <Button onClick={() => startTransition(() => navigate('/login'))} className="w-full max-w-xs">
              Iniciar Sesión
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Inicia sesión para sincronizar tus datos con la nube.
            </p>
          </CardFooter>
        )}
        {user && (
          <CardFooter className="flex justify-center">
            <Button variant="destructive" onClick={handleLogout} className="w-full max-w-xs">
              <LucideIcons.LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
