import { useState, useMemo } from 'react'; // Added useMemo
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FinanceSummary, FinanceContextType } from '@/types/finance'; // Import FinanceContextType
import { useOutletContext } from 'react-router-dom'; // Import useOutletContext

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistantView() { // No props needed here anymore
  const context = useOutletContext<FinanceContextType>();

  if (!context) {
    console.error("AIAssistantView: Finance context is null/undefined!");
    return (
      <div className="glass rounded-2xl p-8 text-center text-red-500">
        Error: No se pudieron cargar los datos del asistente. Por favor, reinicia la aplicación.
      </div>
    );
  }

  const { summary, isLoading } = context;

  const initialAssistantMessage = useMemo(() => {
    if (isLoading || !summary) {
      return "¡Hola! 👋 Soy tu asistente financiero con IA. Cargando tu perfil...";
    }
    return `¡Hola! 👋 Soy tu asistente financiero con IA. Basado en tu perfil, veo que tienes un balance de $${summary.balance.toLocaleString()} y una tasa de ahorro del ${summary.savingsRate.toFixed(0)}%. ¿En qué puedo ayudarte hoy?`;
  }, [summary, isLoading]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialAssistantMessage,
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false); // Renamed to isSending to avoid conflict with isLoading from context

  const suggestions = [
    '¿Cómo puedo ahorrar más?',
    'Analiza mis gastos',
    'Tips para invertir',
    'Crear presupuesto mensual',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    if (isLoading || !summary) { // Don't send if data is not loaded
      toast.error("Datos no cargados. Inténtalo de nuevo cuando el asistente esté listo.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true); // Set local loading for sending

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'ahorrar': `Con tu tasa de ahorro actual del ${summary.savingsRate.toFixed(0)}%, estás en buen camino. Te sugiero:\n\n1. **Automatiza tus ahorros** - Transfiere el 20% de tus ingresos a una cuenta de ahorro automáticamente.\n\n2. **Revisa suscripciones** - Cancela servicios que no uses frecuentemente.\n\n3. **Regla 50/30/20** - 50% necesidades, 30% deseos, 20% ahorro.`,
        'gastos': `Analizando tus gastos, veo que tus principales categorías son alimentación y transporte. Recomiendo:\n\n• Planificar las compras semanalmente\n• Considerar transporte público cuando sea posible\n• Establecer un límite mensual por categoría`,
        'invertir': `Para comenzar a invertir con tu balance actual de $${summary.balance.toLocaleString()}:\n\n1. **Fondo de emergencia** - Asegura 3-6 meses de gastos primero\n\n2. **Inversiones de bajo riesgo** - ETFs diversificados\n\n3. **Educación financiera** - Aprende antes de invertir en activos más complejos`,
        'presupuesto': `Te ayudo a crear un presupuesto basado en tus ingresos de $${summary.totalIncome.toLocaleString()}:\n\n• **Vivienda (30%)**: $${(summary.totalIncome * 0.3).toLocaleString()}\n• **Alimentación (15%)**: $${(summary.totalIncome * 0.15).toLocaleString()}\n• **Transporte (10%)**: $${(summary.totalIncome * 0.1).toLocaleString()}\n• **Ahorro (20%)**: $${(summary.totalIncome * 0.2).toLocaleString()}\n• **Otros (25%)**: $${(summary.totalIncome * 0.25).toLocaleString()}`,
      };

      let response = 'Entiendo tu pregunta. Basándome en tus finanzas actuales, te sugiero enfocarte en mantener un equilibrio entre gastos e ingresos. ¿Te gustaría que profundice en algún tema específico?';

      for (const [key, value] of Object.entries(responses)) {
        if (text.toLowerCase().includes(key)) {
          response = value;
          break;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsSending(false); // Reset local loading
    }, 1500);
  };

  if (isLoading || !summary) { // Render loading state for the whole view
    return (
      <div className="glass rounded-2xl p-8 text-center animate-pulse">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20" />
        <p className="text-muted-foreground">Cargando datos del asistente...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] lg:h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          Asistente IA
        </h1>
        <p className="text-muted-foreground mt-1">
          Tu consejero financiero personal con inteligencia artificial
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 glass rounded-2xl p-4 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 animate-fade-in',
              message.role === 'user' ? 'flex-row-reverse' : ''
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                message.role === 'assistant'
                  ? 'bg-primary/20'
                  : 'bg-secondary'
              )}
            >
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div
              className={cn(
                'max-w-[80%] p-4 rounded-2xl',
                message.role === 'assistant'
                  ? 'bg-secondary/50'
                  : 'bg-primary/20'
              )}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        ))}

        {(isLoading || isSending) && ( // Use both isLoading from context and local isSending
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-secondary/50 p-4 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => handleSend(suggestion)}
            className="whitespace-nowrap"
            disabled={isLoading || isSending}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          className="flex-1"
          disabled={isLoading || isSending}
        />
        <Button onClick={() => handleSend(input)} disabled={isLoading || isSending}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
