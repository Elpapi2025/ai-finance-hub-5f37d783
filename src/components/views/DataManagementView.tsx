import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFinance } from '@/hooks/useFinance';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export function DataManagementView() {
  const { clearAllFinanceData, exportFinanceData, importFinanceData, isLoading } = useFinance();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedJson, setImportedJson] = useState<string>('');

  const handleClearAllData = async () => {
    if (confirm('¿Estás seguro de que quieres borrar TODOS los datos financieros? Esta acción no se puede deshacer.')) {
      await clearAllFinanceData();
    }
  };

  const handleExportData = async () => {
    const jsonData = await exportFinanceData();
    if (jsonData) {
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance_data_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          // Validate JSON structure to some extent
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.every(item => typeof item === 'object' && item !== null && 'id' in item && 'amount' in item)) {
            setImportedJson(content);
            toast.success('Archivo JSON cargado y validado.');
          } else {
            toast.error('El archivo JSON no parece contener datos de transacciones válidos.');
            setImportedJson('');
            if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
          }
        } catch (error) {
          toast.error('Error al parsear el archivo JSON. Asegúrate de que sea un JSON válido.');
          setImportedJson('');
          if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportData = async () => {
    if (!importedJson) {
      toast.error('Por favor, carga un archivo JSON primero.');
      return;
    }
    if (confirm('¿Estás seguro de que quieres importar estos datos? Se borrarán todos los datos existentes y se reemplazarán con los importados.')) {
      await importFinanceData(importedJson);
      setImportedJson(''); // Clear input after successful import
      if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold">Gestión de Datos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Borrar Todos los Datos</CardTitle>
          <CardDescription>Elimina permanentemente todas las transacciones de la aplicación.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClearAllData} disabled={isLoading} variant="destructive">
            {isLoading ? 'Borrando...' : 'Borrar Todos los Datos'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exportar Datos</CardTitle>
          <CardDescription>Guarda todas tus transacciones actuales en un archivo JSON.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportData} disabled={isLoading}>
            {isLoading ? 'Exportando...' : 'Exportar Datos a JSON'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Importar Datos</CardTitle>
          <CardDescription>Carga un archivo JSON de transacciones para reemplazar los datos existentes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="data-file">Archivo JSON de Transacciones</Label>
            <Input 
              id="data-file" 
              type="file" 
              accept=".json" 
              onChange={handleFileChange} 
              ref={fileInputRef} 
              disabled={isLoading} 
            />
          </div>
          <Button onClick={handleImportData} disabled={isLoading || !importedJson}>
            {isLoading ? 'Importando...' : 'Importar Datos desde JSON'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
