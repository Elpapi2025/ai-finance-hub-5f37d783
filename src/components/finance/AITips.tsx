import { useState } from 'react';
import { Sparkles, RefreshCw, Lightbulb, TrendingUp, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FinanceSummary } from '@/types/finance';
import { cn } from '@/lib/utils';

interface AITipsProps {
  summary: FinanceSummary;
}

const tipIcons = [Lightbulb, TrendingUp, PiggyBank];

export function AITips({ summary }: AITipsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<string[]>([
    'Tu tasa de ahorro del ' + summary.savingsRate.toFixed(0) + '% está por encima del promedio. ¡Sigue así!',
    'Considera automatizar tus ahorros al inicio de cada mes para mantener la consistencia.',
    'Revisa tus gastos de entretenimiento - podrían optimizarse un 15% sin afectar tu calidad de vida.',
  ]);

  const generateNewTips = () => {
    setIsLoading(true);
    // Simulating AI generation
    setTimeout(() => {
      const newTips = [
        summary.savingsRate > 20
          ? '¡Excelente! Mantén tu tasa de ahorro. Considera invertir el excedente.'
          : 'Intenta incrementar tu tasa de ahorro al 20% de tus ingresos.',
        summary.balance > 0
          ? 'Tu balance positivo te permite crear un fondo de emergencia de 3-6 meses.'
          : 'Prioriza reducir gastos no esenciales para mejorar tu balance.',
        'Establece metas financieras SMART: específicas, medibles y con plazos definidos.',
      ];
      setTips(newTips);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Tips con IA</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateNewTips}
          disabled={isLoading}
          className="text-muted-foreground hover:text-primary"
        >
          <RefreshCw className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
          Actualizar
        </Button>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tipIcons[index % tipIcons.length];
          return (
            <div
              key={index}
              className={cn(
                'flex gap-3 p-4 rounded-xl bg-secondary/50',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-2 rounded-lg bg-primary/10 h-fit">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Consejos generados basados en tus patrones de gastos
      </p>
    </div>
  );
}
