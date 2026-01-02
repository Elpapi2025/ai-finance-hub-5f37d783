import { useNavigate } from 'react-router-dom';
import { useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, PieChart, Target } from 'lucide-react'; // Database icon removed
import { cn } from '@/lib/utils'; // Assuming you might use this for styling

export function HomeView() {
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const handleNavigate = (path: string) => {
    startTransition(() => {
      navigate(path);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen-minus-header-footer bg-background p-4 space-y-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Explora tus Finanzas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center text-lg"
            onClick={() => handleNavigate('/transactions')}
          >
            <ArrowUpDown className="w-8 h-8 mb-2" />
            <span>Transacciones</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center text-lg"
            onClick={() => handleNavigate('/reports')}
          >
            <PieChart className="w-8 h-8 mb-2" />
            <span>Reportes</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center text-lg"
            onClick={() => handleNavigate('/goals')}
          >
            <Target className="w-8 h-8 mb-2" />
            <span>Metas</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

