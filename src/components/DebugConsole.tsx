import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronUp, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LogMessage {
  id: number;
  level: 'log' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

const MAX_LOGS = 100;

export function DebugConsole() {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const interceptLog = (level: LogMessage['level']) => (...args: any[]) => {
      const message = args
        .map((arg) => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(' ');

      setLogs((prevLogs) => {
        const newLog = {
          id: Date.now() + Math.random(),
          level,
          message,
          timestamp: new Date().toLocaleTimeString(),
        };
        const updatedLogs = [...prevLogs, newLog];
        return updatedLogs.slice(-MAX_LOGS); // Keep only the last MAX_LOGS messages
      });

      if (level === 'log') originalLog(...args);
      else if (level === 'warn') originalWarn(...args);
      else originalError(...args); // For error level
    };

    console.log = interceptLog('log');
    console.error = interceptLog('error');
    console.warn = interceptLog('warn');

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    if (logsEndRef.current && isOpen && !isMinimized) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen, isMinimized]);

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 z-[100] w-full max-w-sm bg-black bg-opacity-80 text-white rounded-tl-lg shadow-lg transition-all duration-300',
        isMinimized ? 'h-10' : isOpen ? 'h-1/2' : 'h-10',
        isOpen && !isMinimized && 'max-h-[80vh]' // Limit height when open
      )}
    >
      <div className="flex items-center justify-between p-2 bg-gray-800 rounded-tl-lg">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-gray-400" />
          <span className="font-bold">Debug Console</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="p-1 h-auto text-gray-400 hover:bg-gray-700">
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronUp className="w-4 h-4 rotate-180" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="p-1 h-auto text-gray-400 hover:bg-gray-700">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && isOpen && (
        <div className="p-2 overflow-y-auto text-xs font-mono h-[calc(100%-2.5rem)]">
          {logs.length === 0 && <p className="text-gray-400">No logs yet...</p>}
          {logs.map((log) => (
            <p key={log.id} className={cn(
              log.level === 'error' && 'text-red-400',
              log.level === 'warn' && 'text-yellow-400',
              log.level === 'log' && 'text-gray-200'
            )}>
              <span className="text-gray-500 mr-1">{log.timestamp}</span>
              {log.message}
            </p>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}
      
      {!isOpen && (
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="absolute bottom-2 right-2 p-2 h-auto text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-full">
            <Bug className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}