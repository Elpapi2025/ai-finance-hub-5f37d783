import { useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { Settings, LogOut, User as UserIcon, WifiOff } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch'; // Assuming a switch for a setting example

export function ProfileView() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const handleLogout = async () => {
    await logout();
    startTransition(() => {
      navigate('/login');
    });
  };

  const handleGoToSettings = () => {
    // Navigate to a dedicated settings page or open a modal if settings get complex
    // For now, let's just show a toast or expand this view later.
    console.log("Going to settings!");
    // You could also render settings directly here or in a sub-component
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <Avatar className="w-24 h-24 mx-auto border-4 border-primary/50">
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-semibold">
              {user ? (user.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={48} />) : <WifiOff size={48} />}
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
              <Settings className="w-5 h-5" /> Ajustes
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Modo Oscuro</Label>
              <Switch id="dark-mode" defaultChecked={true} /> {/* Example setting */}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificaciones</Label>
              <Switch id="notifications" /> {/* Example setting */}
            </div>
            {/* Add more settings here */}
          </div>
        </CardContent>
        {user && (
          <CardFooter className="flex justify-center">
            <Button variant="destructive" onClick={handleLogout} className="w-full max-w-xs">
              <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
