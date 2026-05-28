/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sparkles, Brain, ShieldAlert, Cpu, Check, Loader2, ArrowRight } from 'lucide-react';

interface AIForensicReportProps {
  initialTargetId?: string;
  initialTargetType?: 'address' | 'tx';
}

export default function AIForensicReport({ initialTargetId = '', initialTargetType = 'address' }: AIForensicReportProps) {
  const [targetId, setTargetId] = useState(initialTargetId);
  const [targetType, setTargetType] = useState<'address' | 'tx'>(initialTargetType);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestAIReport = async () => {
    if (!targetId.trim()) {
      setError('Por favor, especifique um identificador válido (endereço ou TXID).');
      return;
    }
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch('/api/ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId: targetId.trim() })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao consultar o serviço de IA.');
      }
      
      setReport(data.report);
    } catch (err: any) {
      setError(err.message || 'Falha na conexão com o servidor forense.');
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (id: string, type: 'address' | 'tx') => {
    setTargetId(id);
    setTargetType(type);
  };

  return (
    <div className="space-y-6" id="ai-forensic-report">
      <div className="p-6 bg-zinc-950 border border-zinc-850 rounded-lg">
        <h2 className="text-lg font-medium text-purple-400 mb-2 flex items-center gap-2 font-mono">
          <Sparkles className="h-5 w-5 text-purple-400" /> ANÁLISE FORENSE INTELIGENTE (IA COGNITIVA)
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Gere um relatório abrangente gerido pela <strong className="text-purple-300">Inteligência Artificial (Gemini 3.5 Flash)</strong>. O modelo correlaciona clusters do período Satoshi, analisa transações, decodifica padrões ECDSA e investiga vazamentos de nonces em profundidade.
        </p>

        {/* Suggest presets */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-500 font-mono">Investigações recomendadas:</span>
          <button
            onClick={() => loadPreset('1933phfhJyA4H3idgALZg9X9r2F6EStE4i', 'address')}
            className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-purple-300 hover:border-purple-500 rounded text-xs font-mono transition-all"
          >
            Endereço Vulnerável (Android 2013)
          </button>
          <button
            onClick={() => loadPreset('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'address')}
            className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-purple-300 hover:border-purple-500 rounded text-xs font-mono transition-all"
          >
            Satoshi Nakamoto Gênesis
          </button>
          <button
            onClick={() => loadPreset('926ae9308d2d6fbf639fae6aa0fbfbc6bfbed7fa91ad41a29381ea2038b7ef66', 'tx')}
            className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-purple-300 hover:border-purple-500 rounded text-xs font-mono transition-all"
          >
            Transação com R Duplicado (Vulnerável)
          </button>
        </div>
      </div>

      {/* Input panel */}
      <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs text-zinc-400 font-mono font-bold block">Selecione o Alvo</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTargetType('address')}
              className={`px-3 py-2 text-xs font-mono border rounded transition-all ${targetType === 'address' ? 'bg-purple-950/40 text-purple-300 border-purple-500/60' : 'bg-zinc-900 text-zinc-450 border-zinc-800'}`}
            >
              Address / Cluster ID
            </button>
            <button
              onClick={() => setTargetType('tx')}
              className={`px-3 py-2 text-xs font-mono border rounded transition-all ${targetType === 'tx' ? 'bg-purple-950/40 text-purple-300 border-purple-500/60' : 'bg-zinc-900 text-zinc-450 border-zinc-800'}`}
            >
              TXID Transação
            </button>
          </div>
        </div>

        <div className="flex-[2] w-full space-y-2">
          <label className="text-xs text-zinc-400 font-mono font-bold block">Identificador</label>
          <input
            type="text"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder={targetType === 'address' ? 'Ex: 1933phfhJyA4H3idgALZg... ' : 'Ex: 926ae9308d2d6fbf639f...'}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono rounded focus:border-purple-500 focus:outline-none"
          />
        </div>

        <button
          onClick={requestAIReport}
          disabled={loading}
          className="w-full md:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white font-mono text-xs font-bold rounded flex items-center justify-center gap-2 border border-purple-500 cursor-pointer disabled:cursor-not-allowed h-[36px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processando...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" /> Investigar com Gemini
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-950/20 border border-red-900 text-red-400 text-xs font-mono rounded flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-400 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Output Panel */}
      {loading && (
        <div className="p-12 border border-zinc-900 bg-zinc-950/50 rounded-lg flex flex-col justify-center items-center gap-4">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          <div className="text-center space-y-1">
            <p className="font-mono text-xs text-purple-300 font-bold animate-pulse">Consultando Redes Coparativas do Ledger...</p>
            <p className="text-xs text-zinc-500 font-mono">O agente de IA está extraindo blocos históricos e correlacionando vetores.</p>
          </div>
        </div>
      )}

      {report && (
        <div className="border border-purple-500 bg-zinc-950 rounded-lg overflow-hidden shadow-lg shadow-purple-950/10">
          <div className="px-4 py-3 bg-purple-950/40 border-b border-purple-500/40 flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-400" /> Relatório Criptográfico Integrado
            </span>
            <span className="text-[10px] font-mono border border-purple-500/30 px-2 py-0.5 rounded text-purple-400">
              Analista Virtual Gemini Live
            </span>
          </div>
          <div className="p-6 text-sm text-zinc-350 leading-relaxed font-sans prose prose-invert prose-purple max-w-none">
            {report.split('\n\n').map((para, idx) => {
              if (para.startsWith('###')) {
                return (
                  <h3 key={idx} className="text-md font-mono font-bold text-purple-300 mt-4 mb-2 border-b border-zinc-900 pb-1">
                    {para.replace('###', '').trim()}
                  </h3>
                );
              }
              if (para.startsWith('*')) {
                return (
                  <ul key={idx} className="list-disc pl-5 mb-4 space-y-1">
                    {para.split('\n').map((li, liIdx) => (
                      <li key={liIdx} className="text-zinc-350 text-xs font-mono">
                        {li.replace(/^\*\s*/, '').trim()}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="mb-4 text-zinc-300 font-mono text-xs">
                  {para}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
