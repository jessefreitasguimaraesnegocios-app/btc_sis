/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Cpu, Calendar, Compass, ArrowUpRight, ArrowDownLeft, Link, Sparkles } from 'lucide-react';
import { WalletProfile, Transaction, ClusterInfo } from '../types';

interface WalletProfilerProps {
  onSelectTx: (txid: string) => void;
  onSelectAIReport: (id: string, type: 'address' | 'tx') => void;
}

export default function WalletProfiler({ onSelectTx, onSelectAIReport }: WalletProfilerProps) {
  const [addressInput, setAddressInput] = useState('1933phfhJyA4H3idgALZg9X9r2F6EStE4i'); // Default to Android Compromised
  const [profile, setProfile] = useState<WalletProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cluster, setCluster] = useState<ClusterInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletProfile = async (address: string) => {
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/wallets/${address.trim()}`);
      if (!response.ok) {
        throw new Error('Endereço não localizado no indexador offline do explorer.');
      }
      const data = await response.json();
      setProfile(data.wallet);
      setTransactions(data.transactions);
      setCluster(data.cluster);
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar perfil de carteira.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletProfile(addressInput);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWalletProfile(addressInput);
  };

  const getRiskScoreBadge = (score: number) => {
    if (score >= 80) return <span className="px-2 py-0.5 border border-red-500 bg-red-950/40 text-red-400 font-mono text-[10px] rounded uppercase animate-pulse">Crítico (Explorado)</span>;
    if (score >= 40) return <span className="px-2 py-0.5 border border-yellow-500 bg-yellow-950/40 text-yellow-400 font-mono text-[10px] rounded uppercase">Médio (Reuso R Interno)</span>;
    return <span className="px-2 py-0.5 border border-emerald-500 bg-emerald-950/40 text-emerald-400 font-mono text-[10px] rounded uppercase">Seguro / Baixo Risco</span>;
  };

  const btcValue = (satoshis: number) => (satoshis / 100000000).toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 8 }) + ' BTC';

  // Format short address helper
  const shortAddr = (addr: string) => `${addr.slice(0, 10)}...${addr.slice(-10)}`;

  return (
    <div className="space-y-6" id="wallet-profiler">
      {/* Search block */}
      <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg">
        <h2 className="text-md font-mono text-zinc-300 font-bold mb-4 flex items-center gap-2">
          <Compass className="h-4 w-4 text-emerald-500 animate-spin" /> PROFILADOR DE CARTEIRAS FORENSES
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Insira endereço Bitcoin legacy de transações históricas (Ex: 1933phfhJyA4...)"
            className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs rounded focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-zinc-900 border border-zinc-800 hover:border-emerald-500 text-emerald-400 rounded text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Search className="h-4 w-4" /> Investigar
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] text-zinc-500 font-mono">Presets Históricos:</span>
          <button
            type="button"
            onClick={() => { setAddressInput('1933phfhJyA4H3idgALZg9X9r2F6EStE4i'); fetchWalletProfile('1933phfhJyA4H3idgALZg9X9r2F6EStE4i'); }}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-red-400/80 hover:border-red-500 rounded text-[10px] font-mono transition-colors"
          >
            Android Vulnerable (Balance: 0)
          </button>
          <button
            type="button"
            onClick={() => { setAddressInput('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'); fetchWalletProfile('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'); }}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-emerald-400/80 hover:border-emerald-500 rounded text-[10px] font-mono transition-colors"
          >
            Satoshi Genesis
          </button>
          <button
            type="button"
            onClick={() => { setAddressInput('1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H'); fetchWalletProfile('1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H'); }}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-yellow-400/80 hover:border-yellow-500 rounded text-[10px] font-mono transition-colors"
          >
            Laszlo Pizza (10,000 BTC spent)
          </button>
          <button
            type="button"
            onClick={() => { setAddressInput('1MTGOXClassicalColdWalletAddressL3'); fetchWalletProfile('1MTGOXClassicalColdWalletAddressL3'); }}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-500 rounded text-[10px] font-mono transition-colors"
          >
            Mt.Gox Cold Wallet
          </button>
        </div>
      </div>

      {/* Errors */}
      {error && (
        <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs font-mono rounded flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Profiler main loading state */}
      {loading && (
        <div className="p-12 text-center bg-zinc-950 border border-zinc-900 rounded-lg flex flex-col justify-center items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent animate-spin rounded-full"></div>
          <p className="font-mono text-xs text-zinc-500">Mapeando UTXOs retroativos do Ledger...</p>
        </div>
      )}

      {/* Profile data bento grids */}
      {!loading && profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bento card 1: Meta Profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-4 gap-2">
                <div>
                  <h3 className="text-xs text-zinc-500 font-mono font-bold leading-none uppercase">Endereço Fiscalizado</h3>
                  <p className="text-emerald-400 font-mono text-sm font-bold select-all mt-1">{profile.address}</p>
                </div>
                <div>
                  {getRiskScoreBadge(profile.wallet_score)}
                </div>
              </div>

              {/* Stats values */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-900/40 rounded border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Saldo Atual</span>
                  <span className="text-zinc-200 font-mono text-xs font-bold block mt-1">{btcValue(profile.balance)}</span>
                </div>
                <div className="p-4 bg-zinc-900/40 rounded border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Total Recebido</span>
                  <span className="text-emerald-400 font-mono text-xs font-bold block mt-1">+{btcValue(profile.total_received)}</span>
                </div>
                <div className="p-4 bg-zinc-900/40 rounded border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Total Enviado</span>
                  <span className="text-red-400 font-mono text-xs font-bold block mt-1">-{btcValue(profile.total_sent)}</span>
                </div>
                <div className="p-4 bg-zinc-900/40 rounded border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Primeiro Bloco</span>
                  <span className="text-zinc-400 font-mono text-xs block mt-1">Block #{profile.first_seen_block}</span>
                </div>
                <div className="p-4 bg-zinc-900/40 rounded border border-zinc-900 col-span-1 md:col-span-2">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Primeira Atividade Detectada</span>
                  <span className="text-zinc-400 font-mono text-xs block mt-1 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                    {new Date(profile.first_seen_date).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Action AI report */}
              <button
                type="button"
                onClick={() => onSelectAIReport(profile.address, 'address')}
                className="w-full py-2 bg-purple-950/20 border border-purple-800/40 hover:border-purple-600 rounded text-xs font-mono text-purple-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-purple-400" /> Gerar Auditoria de Cluster de IA para este Endereço
              </button>
            </div>

            {/* Related transactions log */}
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg">
              <h4 className="text-xs text-zinc-400 font-mono font-bold uppercase mb-4">Registro Histórico de Transações do Endereço (Vera 2009-2015)</h4>
              
              {transactions.length === 0 ? (
                <p className="p-4 border border-zinc-900 bg-zinc-900/10 text-center font-mono text-xs text-zinc-600 rounded">Nenhuma transação catalogada diretamente na base forense do bloco 0 ao 350k.</p>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {transactions.map((tx) => {
                    const isSender = tx.inputs.some(inp => inp.address.toLowerCase() === profile.address.toLowerCase());
                    const outputAmt = tx.outputs.reduce((sum, o) => sum + (o.address.toLowerCase() === profile.address.toLowerCase() ? o.value : 0), 0);
                    const inputAmt = tx.inputs.reduce((sum, i) => sum + (i.address.toLowerCase() === profile.address.toLowerCase() ? 100000000 : 0), 0); // approx
                    
                    return (
                      <div key={tx.txid} className="p-3 bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 rounded flex justify-between items-center transition-colors">
                        <div className="space-y-1">
                          <button
                            onClick={() => onSelectTx(tx.txid)}
                            className="text-xs text-emerald-400 font-mono hover:underline text-left block font-bold"
                          >
                            {tx.txid.slice(0, 16)}...{tx.txid.slice(-16)}
                          </button>
                          <span className="text-[10px] text-zinc-500 font-mono block">Mined Block #{tx.block_height} • {new Date(tx.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          {isSender ? (
                            <span className="font-mono text-xs text-red-400 flex items-center gap-1 font-bold justify-end">
                              <ArrowUpRight className="h-3 w-3" /> ENVIADO
                            </span>
                          ) : (
                            <span className="font-mono text-xs text-emerald-400 flex items-center gap-1 font-bold justify-end animate-pulse">
                              <ArrowDownLeft className="h-3 w-3" /> RECEBIDO
                            </span>
                          )}
                          <span className="text-[11px] font-mono font-bold text-zinc-300 block">
                            {isSender ? `-${btcValue(inputAmt || 50000000)}` : `+${btcValue(outputAmt)}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bento Card 2: Cluster Entity Information / Related Graph Nodes */}
          <div className="space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg space-y-4">
              <h4 className="text-xs text-zinc-400 font-mono font-bold uppercase border-b border-zinc-900 pb-2">Entidade / Agrupamento Heurístico</h4>
              
              {cluster ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase block">Identificação Pública</span>
                    <span className="text-purple-400 font-mono font-bold text-xs block">{cluster.name}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase block">Risco Geral da Entidade</span>
                    <span className={`px-2 py-0.5 font-mono text-[9px] border inline-block rounded uppercase ${
                      cluster.risk_status === 'Satoshi-Era' ? 'border-purple-500 bg-purple-950/20 text-purple-400' :
                      cluster.risk_status === 'High' ? 'border-red-500 bg-red-950/20 text-red-400' : 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                    }`}>
                      {cluster.risk_status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase block">Descrição da Entidade</span>
                    <p className="text-zinc-400 font-mono text-[11px] leading-relaxed">{cluster.description}</p>
                  </div>

                  <div className="p-3 bg-purple-950/10 border border-purple-900/30 rounded">
                    <span className="text-[10px] text-purple-300 font-mono uppercase block">Saldo Consolidado do Cluster</span>
                    <span className="text-zinc-200 font-mono text-xs font-bold block mt-1">{btcValue(cluster.total_balance)}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase block">Endereços Confirmados no Cluster</span>
                    <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                      {cluster.addresses.map((addr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => { setAddressInput(addr); fetchWalletProfile(addr); }}
                          className={`w-full text-left p-1 text-[11px] font-mono rounded truncate transition-colors block border ${
                            addr.toLowerCase() === profile.address.toLowerCase() ? 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400' : 'border-transparent hover:bg-zinc-900 text-zinc-400'
                          }`}
                        >
                          {addr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 border border-zinc-900 bg-zinc-900/20 text-center font-mono text-xs text-zinc-500 rounded">
                    Esta carteira está rotulada como <strong className="text-zinc-400">Endereço de Investigação Solitário</strong>. Nenhum agrupamento por co-gastos multi-entrada foi identificado até o momento.
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono leading-relaxed">
                    A heurística de clusterização une múltiplos endereços que aparecem como entradas de uma mesma transação, assumindo que pertencem ao mesmo proprietário de forma muito confiável.
                  </p>
                </div>
              )}
            </div>

            {/* Compliance Info Card */}
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg text-xs leading-relaxed text-zinc-400 space-y-3 font-mono">
              <h4 className="text-xs text-zinc-350 uppercase font-bold text-center border-b border-zinc-900 pb-2 flex justify-center items-center gap-2">
                <Cpu className="h-4 w-4" /> REGRAS DE CONFORMIDADE AML
              </h4>
              <p>
                Wallets datadas dos anos iniciais do protocolo (2009-2010), denominadas <strong className="text-purple-400">Carteiras Satoshi</strong>, possuem risco de liquidez regulatória acrescida devido à sua procedência histórica não identificada.
              </p>
              <p>
                Qualquer transação detectada derivando desse cluster deve disparar alarmes imediatos aos indexadores fiscais mundiais devido ao impacto latente do suprimento Satoshi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
