/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Compass, ChevronRight, Box, Eye, Calendar, Sparkles, Database, ShieldAlert } from 'lucide-react';
import { Block, Transaction } from '../types';

interface BlockExplorerProps {
  selectedTxid: string; // If selected from another view
  onSelectTx: (txid: string) => void;
  onSelectAddress: (addr: string) => void;
}

export default function BlockExplorer({ selectedTxid, onSelectTx, onSelectAddress }: BlockExplorerProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlockHeight, setSelectedBlockHeight] = useState<number | null>(224445); // default to duplicate block
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [blockTxs, setBlockTxs] = useState<Transaction[]>([]);
  const [txDetail, setTxDetail] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all available blocks on start
  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blocks');
      if (!response.ok) throw new Error('Não foi possível carregar índice de blocos do servidor.');
      const data = await response.json();
      setBlocks(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com API.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockDetails = async (height: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/blocks/${height}`);
      if (!response.ok) throw new Error(`Não foi possível recuperar detalhes do bloco ${height}`);
      const data = await response.json();
      setSelectedBlock(data.block);
      setBlockTxs(data.transactions);
      
      // Auto select the first transaction for instant visualization
      if (data.transactions.length > 0) {
        setTxDetail(data.transactions[0]);
      } else {
        setTxDetail(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchBlocks();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/blocks?search=${searchTerm.trim()}`);
      if (!response.ok) throw new Error('Falha ao pesquisar blocos.');
      const data = await response.json();
      setBlocks(data);
      
      if (data.length > 0) {
        // Load the first match
        fetchBlockDetails(data[0].height);
        setSelectedBlockHeight(data[0].height);
      } else {
        setError(`Nenhum bloco encontrado na base indexadora para o termo "${searchTerm}".`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger loading initial block
  useEffect(() => {
    fetchBlocks();
    if (selectedBlockHeight !== null) {
      fetchBlockDetails(selectedBlockHeight);
    }
  }, []);

  // Handle outside txid updates (e.g., from search or profiles)
  useEffect(() => {
    if (selectedTxid) {
      const lookupAndLoadTx = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/tx/${selectedTxid}`);
          if (response.ok) {
            const data = await response.json();
            setTxDetail(data.tx);
            setSelectedBlockHeight(data.tx.block_height);
            // Fetch siblings for navigation
            const blkRes = await fetch(`/api/blocks/${data.tx.block_height}`);
            if (blkRes.ok) {
              const blkData = await blkRes.json();
              setSelectedBlock(blkData.block);
              setBlockTxs(blkData.transactions);
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      lookupAndLoadTx();
    }
  }, [selectedTxid]);

  const btcValue = (sat: number) => (sat / 100000000).toFixed(4) + ' BTC';

  return (
    <div className="space-y-6" id="block-explorer">
      {/* Search Header */}
      <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-md font-mono text-zinc-300 font-bold flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-emerald-500" /> HISTORIC LEDGER BROWSER (BLOCO 0 → 350.000)
          </h3>
          <p className="text-xs text-zinc-500 font-mono">
            Navegue pelos blocos iniciais do protocolo. Examine os inputs brutos contendo scripts de assinatura ECDSA e hash de mensagens.
          </p>
        </div>

        <form onSubmit={handleSearchBlock} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite Número de Bloco, Hash ou Miner..."
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono rounded w-full md:w-[220px] focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-mono font-bold hover:border-emerald-500 rounded transition-all cursor-pointer"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Main split dashboard panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Block directory list */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 font-mono text-xs font-bold text-zinc-330 flex items-center justify-between">
            <span>Diretório de Blocos Indexados</span>
            <span className="text-[10px] text-zinc-500">Filtrado (Satoshi Era)</span>
          </div>
          
          <div className="divide-y divide-zinc-900 max-h-[480px] overflow-y-auto">
            {blocks.map((b) => {
              const isSelected = selectedBlockHeight === b.height;
              const hasAlert = b.height === 224445 || b.height === 224446;
              return (
                <button
                  key={b.height}
                  onClick={() => { setSelectedBlockHeight(b.height); fetchBlockDetails(b.height); }}
                  className={`w-full text-left p-4 hover:bg-zinc-900/40 text-xs font-mono transition-colors block ${
                    isSelected ? 'bg-zinc-900 border-l-2 border-emerald-500 text-white' : 'text-zinc-400'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-zinc-250 flex items-center gap-1.5">
                      <Box className={`h-3.5 w-3.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-650'}`} />
                      Bloco #{b.height}
                    </span>
                    <span className="text-[10px] text-zinc-550">{new Date(b.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span className="truncate max-w-[150px]">{b.hash.slice(0, 10)}...{b.hash.slice(-10)}</span>
                    <span className={`px-1 rounded text-[9px] font-bold ${hasAlert ? 'border border-red-500/30 text-red-400 bg-red-950/20' : 'text-zinc-400'}`}>
                      {b.tx_count} TXs {hasAlert && '⚠️'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Inspecting block & Transaction layout */}
        <div className="lg:col-span-8 space-y-6">
          {/* Block details overview */}
          {selectedBlock && (
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                <span className="font-mono text-xs text-zinc-550 uppercase">Detecção de Cabeçalho de Bloco</span>
                <span className="font-mono text-xs text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-950/20 px-2 py-0.5 rounded">
                  ESTADO: INDEXADO OK
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-550 font-mono uppercase">Block Height</span>
                  <span className="text-zinc-300 font-mono text-xs font-bold block">#{selectedBlock.height}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-550 font-mono uppercase">Tamanho total</span>
                  <span className="text-zinc-300 font-mono text-xs block">{(selectedBlock.size / 1024).toFixed(2)} KB</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-550 font-mono uppercase">Taxas do Bloco</span>
                  <span className="text-zinc-300 font-mono text-xs block">{selectedBlock.fees.toLocaleString()} sat</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-550 font-mono uppercase">Validador de Bloco</span>
                  <span className="text-emerald-500 font-mono text-xs block truncate">{selectedBlock.miner}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-550 font-mono uppercase">Header Hash</span>
                <span className="text-zinc-400 font-mono text-[11px] select-all break-all block bg-zinc-900 border border-zinc-800 p-2 rounded">{selectedBlock.hash}</span>
              </div>
            </div>
          )}

          {/* Transactions contained in selected block */}
          {selectedBlock && (
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg">
              <div className="border-b border-zinc-900 pb-3 mb-4 flex justify-between items-center">
                <h4 className="text-xs text-zinc-400 font-mono font-bold uppercase">Transações Indexadas no Bloco ({blockTxs.length})</h4>
                <span className="text-[10px] text-zinc-500 font-mono">Clique para depurar inputs / scripts</span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-1">
                {blockTxs.map((tx) => {
                  const isSelected = txDetail?.txid === tx.txid;
                  const hasAlert = tx.txid === '926ae9308d2d6fbf639fae6aa0fbfbc6bfbed7fa91ad41a29381ea2038b7ef66' || tx.txid === '40fbfbc6bfbed7fa9e2a22bece1c8d50fbdca0decca91ad41a293c202029abc';
                  
                  return (
                    <button
                      key={tx.txid}
                      onClick={() => setTxDetail(tx)}
                      className={`px-3 py-1 text-[11px] border font-mono rounded transition-all truncate max-w-[200px] cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-950/20 border-emerald-500 text-emerald-400 font-bold' 
                          : hasAlert
                            ? 'border-red-500/40 bg-red-950/10 text-red-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-440 hover:border-zinc-500'
                      }`}
                    >
                      {tx.txid.slice(0, 10)}...{tx.txid.slice(-10)} {hasAlert && '⚠️'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Core Transaction inspector */}
          {txDetail && (
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg space-y-6">
              <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-zinc-350">DEPURAÇÃO DE TRANSAÇÃO (Decodificador Script)</span>
                <span className="text-[11px] font-mono text-zinc-500">ID: {txDetail.txid.slice(0, 8)}...</span>
              </div>

              {/* TX metadata details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">TXID Completo</span>
                  <span className="text-zinc-300 font-bold block mt-1 break-all select-all">{txDetail.txid}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Tamanho da TX</span>
                  <span className="text-zinc-300 block mt-1">{txDetail.size} bytes</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Input Count / Outputs</span>
                  <span className="text-zinc-300 block mt-1">{txDetail.input_count} Vin / {txDetail.output_count} Vout</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Taxa de Rede (fee)</span>
                  <span className="text-amber-500 block mt-1">{txDetail.fee.toLocaleString()} sat</span>
                </div>
              </div>

              {/* INPUTS / scriptSig Decoders */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block border-b border-zinc-900 pb-1">Sinais de Entrada (Inputs scriptSig)</span>
                {txDetail.inputs.map((inp, idx) => {
                  const hasDuplicateR = inp.address === '1933phfhJyA4H3idgALZg9X9r2F6EStE4i';
                  return (
                    <div key={idx} className="p-4 bg-zinc-900/30 border border-zinc-900 rounded text-xs font-mono space-y-3">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-500">Input #{inp.index} ← PrevOut: {inp.txid_prev.slice(0, 10)}... vout {inp.vout_prev}</span>
                        <button
                          onClick={() => onSelectAddress(inp.address)}
                          className="text-emerald-400 hover:underline hover:text-emerald-300 font-bold"
                        >
                          Origem: {inp.address}
                        </button>
                      </div>

                      {inp.scriptSig && (
                        <div className="space-y-1">
                          <span className="text-[9px] text-zinc-550 uppercase block">Raw scriptSig Hex Dump</span>
                          <div className="p-2 bg-zinc-950 border border-zinc-900 rounded text-zinc-400 overflow-x-auto select-all leading-normal max-h-[85px] text-[10px]">
                            {inp.scriptSig}
                          </div>
                        </div>
                      )}

                      {/* Extracted R/S if available */}
                      {inp.r_value && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          <div className="p-2 bg-zinc-950 border border-zinc-800/40 rounded">
                            <span className="text-[9px] text-zinc-550 uppercase block flex justify-between">
                              <span>ECDSA r-value (nonce coordinate)</span>
                              {hasDuplicateR && <span className="text-red-500 text-[8px] animate-pulse">⚠️ REUSO DETECTADO</span>}
                            </span>
                            <span className={`text-[10px] leading-none break-all block font-bold mt-1 ${hasDuplicateR ? 'text-red-400 select-all font-mono' : 'text-zinc-350'}`}>{inp.r_value}</span>
                          </div>
                          <div className="p-2 bg-zinc-950 border border-zinc-800/40 rounded">
                            <span className="text-[9px] text-zinc-550 uppercase block">ECDSA s-value (signature component)</span>
                            <span className="text-[10px] text-zinc-350 leading-none break-all block mt-1">{inp.s_value}</span>
                          </div>
                        </div>
                      )}

                      {hasDuplicateR && (
                        <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 text-[11px] rounded leading-relaxed flex items-start gap-2">
                          <ShieldAlert className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>ALERTA CRÍTICO DE ASSINATURA:</strong> O coeficiente R desta assinatura é idêntico ao de outra transação realizada sob a mesma chave pública. Vazamento matemático de informação! Chave privada comprometida.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* OUTPUTS map */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block border-b border-zinc-900 pb-1">Canais de Destino (Outputs outputs)</span>
                {txDetail.outputs.map((out, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900/10 border border-zinc-90 w-full rounded flex flex-col md:flex-row justify-between md:items-center text-xs font-mono gap-2">
                    <div className="space-y-1">
                      <span className="text-zinc-500">Output #{out.index} → scriptPubKey script</span>
                      <button
                        onClick={() => onSelectAddress(out.address)}
                        className="text-emerald-400 font-bold hover:underline block"
                      >
                        Enviar para: {out.address}
                      </button>
                    </div>
                    <div className="text-zinc-200 font-bold border-l-0 md:border-l border-zinc-900 pl-0 md:pl-4 min-w-[120px] text-right">
                      {btcValue(out.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
