/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShieldCheck, Compass, Users, LayoutDashboard, HelpCircle, Network, BookOpen, Sparkles, Terminal } from 'lucide-react';

import ForensicDashboard from './components/ForensicDashboard';
import BlockExplorer from './components/BlockExplorer';
import WalletProfiler from './components/WalletProfiler';
import ECDSAParserTool from './components/ECDSAParserTool';
import WalletRelationGraph from './components/WalletRelationGraph';
import AIForensicReport from './components/AIForensicReport';
import ConfigGuide from './components/ConfigGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explorer' | 'profiler' | 'ecdsa' | 'graph' | 'guide' | 'ai'>('dashboard');
  const [selectedAddress, setSelectedAddress] = useState<string>('1933phfhJyA4H3idgALZg9X9r2F6EStE4i');
  const [selectedTxid, setSelectedTxid] = useState<string>('');
  
  // Custom navigation callback handles
  const selectAddress = (addr: string) => {
    setSelectedAddress(addr);
    setActiveTab('profiler');
  };

  const selectTx = (txid: string) => {
    setSelectedTxid(txid);
    setActiveTab('explorer');
  };

  const selectAIReport = (id: string, type: 'address' | 'tx') => {
    setSelectedAddress(id);
    setActiveTab('ai');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-mono selection:bg-emerald-500/30 selection:text-emerald-350">
      
      {/* 1. ARCHITECTURAL HEADER */}
      <header className="p-6 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-md uppercase font-bold text-white tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400 animate-pulse" /> Bitcoin Historical Forensic Explorer
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-tight">
              Análise Criptográfica de Assinaturas e Vazamento de Nonce • Satoshi-Era Indexer (2009-2015)
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 text-right font-mono text-[10px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              ● DECRYPTION NODE ACTIVE (STANDALONE)
            </span>
            <span className="text-zinc-550">UTC: {new Date().toISOString().replace('T', ' ').slice(0, 19)}</span>
          </div>
        </div>
      </header>

      {/* 2. TAB CONTROL NAVIGATION */}
      <nav className="bg-zinc-950 border-b border-zinc-90 w-full overflow-x-auto select-none">
        <div className="max-w-7xl mx-auto px-6 flex">
          {[
            { id: 'dashboard', label: 'Dashboard Forense', icon: LayoutDashboard },
            { id: 'explorer', label: 'Busca de Blocos & TX', icon: Compass },
            { id: 'profiler', label: 'Perfil de Carteiras', icon: Users },
            { id: 'ecdsa', label: 'Simulador ECDSA & DER', icon: Terminal },
            { id: 'graph', label: 'Grafo de Relações', icon: Network },
            { id: 'ai', label: 'Relatórios IA (Gemini)', icon: Sparkles },
            { id: 'guide', label: 'Configuração (bitcoin.conf)', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 border-b-2 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer truncate whitespace-nowrap ${
                  isSelected 
                    ? 'border-emerald-500 text-white bg-zinc-900/40' 
                    : 'border-transparent text-zinc-550 hover:text-zinc-300 hover:bg-zinc-900/10'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-emerald-400' : 'text-zinc-650'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. CORE VIEWS DISPLAY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {activeTab === 'dashboard' && (
          <ForensicDashboard
            onSelectTx={selectTx}
            onSelectAddress={selectAddress}
            onSelectAIReport={selectAIReport}
          />
        )}
        {activeTab === 'explorer' && (
          <BlockExplorer
            selectedTxid={selectedTxid}
            onSelectTx={selectTx}
            onSelectAddress={selectAddress}
          />
        )}
        {activeTab === 'profiler' && (
          <WalletProfiler
            onSelectTx={selectTx}
            onSelectAIReport={selectAIReport}
          />
        )}
        {activeTab === 'ecdsa' && <ECDSAParserTool />}
        {activeTab === 'graph' && <WalletRelationGraph />}
        {activeTab === 'ai' && (
          <AIForensicReport
            initialTargetId={selectedAddress}
            initialTargetType="address"
          />
        )}
        {activeTab === 'guide' && <ConfigGuide />}
      </main>

      {/* 4. FOOTER CREDENTIAL LINES */}
      <footer className="p-6 bg-zinc-950 border-t border-zinc-900 mt-12 text-center text-[10px] text-zinc-600 font-mono tracking-wider">
        CORE-ENGINE FOR SECP256K1 CURVE ANALYSIS • BITCOIN HISTORICAL FORENSIC EXPLORER © 2026
      </footer>
    </div>
  );
}
