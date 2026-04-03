import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import '@xterm/xterm/css/xterm.css';

export default function TerminalPage() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current || termInstance.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#ffffff',
        selectionBackground: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#ffffff',
      },
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    termInstance.current = term;
    fitAddonRef.current = fitAddon;

    term.onData((data) => {
      invoke('write_to_pty', { data }).catch(console.error);
    });

    term.attachCustomKeyEventHandler((event) => {
      if (event.ctrlKey && event.key === 'v') {
        navigator.clipboard.readText().then((text) => {
          term.write(text);
          invoke('write_to_pty', { data: text }).catch(console.error);
        });
        return false;
      }
      if (event.ctrlKey && event.key === 'c') {
        const selection = term.getSelection();
        if (selection) {
          navigator.clipboard.writeText(selection);
          return false;
        }
      }
      return true;
    });

    const unlisten = listen<string>('pty-output', (event) => {
      term.write(event.payload);
    });

    const handleResize = () => {
      if (fitAddonRef.current && termInstance.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      unlisten.then((fn) => fn());
      term.dispose();
      termInstance.current = null;
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
        <h1 className="text-lg font-semibold">Terminal</h1>
        <span className="text-xs text-muted-foreground">PowerShell</span>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 p-2 bg-[#1e1e1e] overflow-hidden"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}
