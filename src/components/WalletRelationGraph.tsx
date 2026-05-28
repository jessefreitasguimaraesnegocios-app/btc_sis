/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Network, Link2, Info, ArrowRight, ShieldAlert } from 'lucide-react';

interface SelectedWalletNode {
  id: string;
  name: string;
  address: string;
  group: string;
  balance: string;
  text: string;
}

export default function WalletRelationGraph() {
  const [selectedNode, setSelectedNode] = useState<SelectedWalletNode | null>({
    id: "satoshi",
    name: "Satoshi Nakamoto Class",
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    group: "Era Satoshi 2009",
    balance: "950.00 BTC",
    text: "O endereço gênese oficial contendo as moedas mineradas iniciais. É o marco zero do ecossistema blockchain."
  });

  const nodes = [
    { id: "satoshi", name: "Satoshi Nakamoto", x: 120, y: 150, group: "Satoshi", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", balance: "950.00 BTC", text: "Endereço gênese do bloco n° 0 de Satoshi Nakamoto, imutável e guardado desde 3 de Janeiro de 2009." },
    { id: "hal_finney", name: "Hal Finney Trust", x: 300, y: 110, group: "Early Trust", address: "12cb1541A1zP1eP5QGefi2DMPTfTL5SLmv", balance: "15.00 BTC", text: "Assinou o recebimento da primeira transação direta de Bitcoin da história em 12 de Janeiro de 2009." },
    { id: "laszlo", name: "Laszlo Pizza Sender", x: 280, y: 310, group: "Pizza Experiment", address: "1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H", balance: "0.00 BTC", text: "Carteira de Laszlo Hanyecz, enviou os famosos 10.000 BTC em troca de duas pizzas de pepperoni em 22 de Maio de 2010." },
    { id: "jeremy", name: "Jeremy Sturdivant", x: 450, y: 360, group: "Pizza Experiment", address: "1HELLOPiZzAPiZzAPiZzAPiZzAPiZzAPiZz", balance: "1,000.00 BTC", text: "Recebeu os 10.000 BTC originais das pizzas de Laszlo, subsequentemente dispersando o cluster na era GPU." },
    { id: "android_vuln", name: "PRNG Compromised (Android)", x: 500, y: 140, group: "Vulnerable Wallet", address: "1933phfhJyA4H3idgALZg9X9r2F6EStE4i", balance: "0.00 BTC", text: "Carteira vulnerável atacada devido ao erro catastrófico SecureRandom de 2013, que gerava o mesmo nonce K para duas transações." },
    { id: "hacker", name: "Intruder Drainer", x: 680, y: 170, group: "Attacker Spoils", address: "1HACKEReBfd41ee9cdeaeecbc39128fcaee91", balance: "0.019 BTC", text: "Entidade invasora que escaneou a blockchain, identificou o R duplicado da carteira vulnerável, derivou a chave privada matemática e limpou o saldo." }
  ];

  const links = [
    { source: "satoshi", target: "hal_finney", label: "Tx Bloco 9 (10 BTC)", value: "10 BTC", type: "Transaction" },
    { source: "laszlo", target: "jeremy", label: "Pizza Buy (10,000 BTC)", value: "10k BTC", type: "Commerce" },
    { source: "laszlo", target: "laszlo", label: "Reuso de R Interno", value: "Reuso R", type: "Vulnerability" },
    { source: "android_vuln", target: "hacker", label: "Varredura Crítica (Dreno)", value: "Exploração Math", type: "Exploit" }
  ];

  const handleNodeClick = (node: typeof nodes[0]) => {
    setSelectedNode({
      id: node.id,
      name: node.name,
      address: node.address,
      group: node.group,
      balance: node.balance,
      text: node.text
    });
  };

  return (
    <div className="space-y-6" id="wallet-relation-graph">
      <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg">
        <h3 className="text-md font-mono text-zinc-300 font-bold mb-2 flex items-center gap-2">
          <Network className="h-5 w-5 text-emerald-400" /> CONVEXÕES DE CARTEIRAS E MAPEAMENTO DE CLUSTERS
        </h3>
        <p className="text-xs text-zinc-400 font-mono leading-relaxed">
          Navegue pelas conexões do ledger por meio do gráfico vetorial interativo de fluxo. O motor heurístico identifica as moedas genesis, transações famosas e caminhos críticos de exploração ECDSA. Clique sobre qualquer nodo para analisar o perfil do caso.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Render Panel */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-lg p-4 flex flex-col justify-between min-h-[420px] relative select-none overflow-hidden">
          <div className="absolute top-4 left-4 flex gap-4 text-[10px] font-mono">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Satoshi Era</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Trust Pools</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Experimentos</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> Alertas Vulneráveis</span>
          </div>

          {/* SVG canvas */}
          <div className="w-full flex justify-center items-center py-6 h-full">
            <svg viewBox="0 0 800 450" className="w-full max-w-[700px] h-[380px]">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#52525b" />
                </marker>
                <marker id="arrow-red" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
              </defs>

              {/* Render links / paths */}
              {links.map((link, idx) => {
                const srcNode = nodes.find(n => n.id === link.source);
                const tgtNode = nodes.find(n => n.id === link.target);
                if (!srcNode || !tgtNode) return null;

                const isExploit = link.type === 'Exploit';
                
                // If loopback link (R reuse loop)
                if (srcNode.id === tgtNode.id) {
                  return (
                    <g key={idx}>
                      <path
                        d={`M ${srcNode.x} ${srcNode.y} C ${srcNode.x - 40} ${srcNode.y - 60}, ${srcNode.x + 40} ${srcNode.y - 60}, ${srcNode.x} ${srcNode.y}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="4"
                      />
                      <text x={srcNode.x} y={srcNode.y - 50} textAnchor="middle" fill="#f59e0b" className="text-[10px] font-mono leading-none font-bold">
                        {link.label}
                      </text>
                    </g>
                  );
                }

                return (
                  <g key={idx}>
                    <line
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={isExploit ? "#ef4444" : "#27272a"}
                      strokeWidth={isExploit ? "2" : "1.5"}
                      strokeDasharray={isExploit ? "5,5" : "0"}
                      className={isExploit ? "animate-[dash_2s_linear_infinite]" : ""}
                      markerEnd={isExploit ? "url(#arrow-red)" : "url(#arrow)"}
                    />
                    {/* Link label */}
                    <text
                      x={(srcNode.x + tgtNode.x) / 2}
                      y={(srcNode.y + tgtNode.y) / 2 - 8}
                      textAnchor="middle"
                      fill={isExploit ? "#ef4444" : "#71717a"}
                      className="text-[9px] font-mono font-bold"
                    >
                      {link.label}
                    </text>
                  </g>
                );
              })}

              {/* Render nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                let color = "fill-zinc-800 stroke-zinc-700";
                
                if (node.id === 'satoshi') color = "fill-purple-900/60 stroke-purple-500";
                else if (node.id === 'hal_finney') color = "fill-emerald-950/60 stroke-emerald-500";
                else if (node.id === 'laszlo' || node.id === 'jeremy') color = "fill-amber-950/60 stroke-amber-500";
                else if (node.id === 'android_vuln') color = "fill-red-950/60 stroke-red-500";
                else if (node.id === 'hacker') color = "fill-rose-950 stroke-rose-400";

                return (
                  <g key={node.id} onClick={() => handleNodeClick(node)} className="cursor-pointer">
                    {/* Outer glow ring for selection or vulnerable */}
                    {(isSelected || node.id === 'android_vuln') && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="24"
                        fill="none"
                        stroke={node.id === 'android_vuln' ? "#ef4444" : "#10b981"}
                        className={`stroke-2 ${node.id === 'android_vuln' ? 'animate-ping opacity-25' : 'opacity-60'}`}
                      />
                    )}
                    
                    {/* The node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="16"
                      className={`${color} stroke-[2] hover:opacity-80 transition-opacity`}
                    />
                    
                    {/* Node Text Label */}
                    <text
                      x={node.x}
                      y={node.y + 32}
                      textAnchor="middle"
                      fill={isSelected ? "#ffffff" : "#a1a1aa"}
                      className="text-[10px] font-mono font-bold leading-none pointer-events-none"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="text-[10px] p-2 bg-zinc-900/40 border-t border-zinc-900 font-mono text-zinc-500 text-center uppercase">
            Clique nas entidades no diagrama para analisar metadados de cluster e fluxos associados.
          </div>
        </div>

        {/* Selected Node Details sidecard */}
        {selectedNode && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-zinc-905 pb-3">
                <span className="text-[10px] text-zinc-550 font-mono uppercase block">{selectedNode.group}</span>
                <h4 className="text-sm font-mono font-bold text-white mt-1">{selectedNode.name}</h4>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">Log de Endereço</span>
                <p className="text-zinc-350 font-mono text-[11px] select-all break-all bg-zinc-900 p-2 border border-zinc-800 rounded">{selectedNode.address}</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase">Saldo Conservador</span>
                  <span className="text-zinc-300 font-mono text-xs font-bold block mt-1">{selectedNode.balance}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-zinc-550 font-mono uppercase block">Relatório Heurístico</span>
                <p className="text-zinc-400 font-mono text-xs leading-relaxed">{selectedNode.text}</p>
              </div>

              {selectedNode.id === 'android_vuln' && (
                <div className="p-3 bg-red-950/20 border border-red-900/30 rounded text-[11px] font-mono text-red-400 leading-relaxed flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Sinalização de Risco Ativo:</strong> Chave privada comprometida. O invasor calculou a chave usando assinaturas ECDSA com nonce idêntico.
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1"><Link2 className="h-3.5 w-3.5 text-zinc-600" /> Ativo</span>
              <span className="text-zinc-400">Verificação: 100% Cripto</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
