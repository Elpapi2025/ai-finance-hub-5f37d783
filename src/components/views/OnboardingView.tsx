import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type OnboardingStep = 'welcome' | 'terms' | 'tutorial';

interface OnboardingViewProps {
  onComplete: () => void;
}

export function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const animationKey = `step-${step}`;

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <Card key={animationKey} className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <CardHeader>
              <CardTitle>Bienvenido a AI Finance Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tu asistente financiero personal. Te ayudaremos a tomar el control de tus finanzas.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setStep('terms')}>Siguiente</Button>
            </CardFooter>
          </Card>
        );
      case 'terms':
        return (
          <Card key={animationKey} className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <CardHeader>
              <CardTitle>Términos y Condiciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-40 overflow-y-auto p-2 border rounded-md">
                <p>Aquí va el texto completo de los términos y condiciones. Es importante que los leas detenidamente. Al usar esta app, aceptas que tus datos de transacciones se almacenen de forma segura en tu dispositivo. Si decides crear una cuenta, tus datos se sincronizarán con nuestros servidores en la nube.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(!!checked)} />
                <Label htmlFor="terms">Acepto los términos y condiciones</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('welcome')}>Anterior</Button>
              <Button onClick={() => setStep('tutorial')} disabled={!termsAccepted}>Siguiente</Button>
            </CardFooter>
          </Card>
        );
      case 'tutorial':
        return (
          <Card key={animationKey} className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <CardHeader>
              <CardTitle>¿Cómo funciona?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>1. Agrega tus ingresos y gastos diarios.</p>
              <p>2. Visualiza reportes y analiza tus hábitos.</p>
              <p>3. Recibe consejos de nuestra IA para mejorar tus finanzas.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
               <Button variant="outline" onClick={() => setStep('terms')}>Anterior</Button>
              <Button onClick={onComplete}>Comenzar</Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        {renderStep()}
      </div>
    </div>
  );
}
