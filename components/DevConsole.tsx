
import React from 'react';
import { Terminal, X, Wifi, ShieldAlert, Code, Globe, Activity } from 'lucide-react';

interface DevConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  logs: {id: number, msg: string, time: string}[];
  syncUrl: string;
  syncError: boolean;
}

const DevConsole: React.FC<DevConsoleProps> = ({ isOpen, onClose, logs, syncUrl, syncError }) => {
  return (
    <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 z-[100] transition-transform duration-500 ease-in-out flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
            <Code size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Dev Interface</h2>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${syncError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-[9px] text-slate-500 font-mono">{syncError ? 'DISCONNECTED' : 'STREAMING'}</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-500 transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Network Monitor */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Globe size={14} className="text-blue-500" />
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network HUD</h3>
          </div>
          <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
            <div>
              <label className="text-[8px] text-slate-500 uppercase font-bold block mb-1">Target Endpoint</label>
              <div className="text-[10px] font-mono text-blue-400 break-all bg-black/40 p-2 rounded-lg border border-white/5">
                {syncUrl}
              </div>
            </div>
            <div className="flex justify-between items-center bg-black/40 p-2 rounded-lg">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Health</span>
              <span className={`text-[9px] font-mono ${syncError ? 'text-red-500' : 'text-green-500'}`}>
                {syncError ? 'ERR_CONN_REFUSED' : 'HTTP_200_OK'}
              </span>
            </div>
          </div>
        </section>

        {/* Console Terminal */}
        <section className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-green-500" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Command Log</h3>
            </div>
            <Activity size={12} className="text-slate-700 animate-pulse" />
          </div>
          <div className="bg-slate-950 rounded-xl border border-white/10 p-4 font-mono text-[9px] h-64 overflow-y-auto flex flex-col-reverse shadow-inner">
            {logs.length === 0 ? (
              <div className="text-slate-800 italic">Listening for backend inputs...</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="text-green-400/80 mb-2 border-l-2 border-green-900/30 pl-3 py-0.5 animate-in fade-in slide-in-from-right-2">
                  <span className="text-slate-600 mr-2">[{log.time}]</span>
                  <span className="text-slate-200">{log.msg}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Integration Help */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert size={14} className="text-yellow-500" />
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payload Spec</h3>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-yellow-500/10">
            <p className="text-[9px] text-slate-400 leading-relaxed mb-3">
              Your backend must serve a JSON object on <code className="text-blue-400 font-bold">{syncUrl}</code>:
            </p>
            <pre className="bg-black/60 p-3 rounded-lg text-[8px] text-yellow-500 font-mono leading-relaxed overflow-x-auto">
{`{
  "isEngineOn": true,
  "isNight": false,
  "lightsOn": true
}`}
            </pre>
          </div>
        </section>
      </div>

      <div className="p-6 bg-slate-900/80 border-t border-white/10">
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span className="text-[8px] font-bold uppercase tracking-[0.2em]">System Isolated Core 2.0</span>
        </div>
      </div>
    </div>
  );
};

export default DevConsole;
