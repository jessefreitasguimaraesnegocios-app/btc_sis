/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Key, Shuffle, HelpCircle, Server, Terminal, Check, Info, AlertTriangle, Play, Sparkles } from 'lucide-react';

export default function ECDSAParserTool() {
  // Tool 1: Raw DER Script Decoder
  const [rawScript, setRawScript] = useState('304402209c9b9d3b2f56bca9ee8d69781a98059882aef1efcc7eb2eeea7e828f7316efef022067ae9bc81fcaeebd41faee819e04812de84abcfce912da041892decaeccbc93101');
  const [derResult, setDerResult] = useState<any>(null);
  const [decoding, setDecoding] = useState(false);

  // Tool 2: Cryptographic Private Key Solver
  const [rHex, setRHex] = useState('9c9b9d3b2f56bca9ee8d69781a98059882aef1efcc7eb2eeea7e828f7316efef');
  const [s1Hex, setS1Hex] = useState('67ae9bc81fcaeebd41faee819e04812de84abcfce912da041892decaeccbc931');
  const [s2Hex, setS2Hex] = useState('2faee19ee819e91fbfaecbcde39129e93bc928fcaee47291eecc871faee29de8');
  const [z1Hex, setZ1Hex] = useState('2caaeebd4210dcb41faee912e84cfabcf7102ccaecc921cf81dc903915bc8288');
  const [z2Hex, setZ2Hex] = useState('55eedc921cf81dc903915bc82882caaeebd4210dcb41faee912e84cfabcf710');
  
  const [solving, setSolving] = useState(false);
  const [recoverResult, setRecoverResult] = useState<any>(null);

  const handleDecodeDER = async () => {
    if (!rawScript.trim()) return;
    setDecoding(true);
    setDerResult(null);
    try {
      const res = await fetch('/api/parser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptSig: rawScript.trim() })
      });
      const data = await res.json();
      setDerResult(data);
    } catch (err: any) {
      setDerResult({ isValid: false, error: err.message || 'Falha ao conectar ao decodificador DER.' });
    } finally {
      setDecoding(false);
    }
  };

  const handleSolveMath = async () => {
    setSolving(true);
    setRecoverResult(null);
    try {
      const res = await fetch('/api/key-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ r: rHex, s1: s1Hex, s2: s2Hex, z1: z1Hex, z2: z2Hex })
      });
      const data = await res.json();
      setRecoverResult(data);
    } catch (err: any) {
      setRecoverResult({ recovered: false, error: err.message || 'Falha no motor BigInt algebra.' });
    } finally {
      setSolving(false);
    }
  };

  const loadVulnerableDataPreset = () => {
    setRHex('9c9b9d3b2f56bca9ee8d69781a98059882aef1efcc7eb2eeea7e828f7316efef');
    setS1Hex('67ae9bc81fcaeebd41faee819e04812de84abcfce912da041892decaeccbc931');
    setS2Hex('2faee19ee819e91fbfaecbcde39129e93bc928fcaee47291eecc871faee29de8');
    setZ1Hex('2caaeebd4210dcb41faee912e84cfabcf7102ccaecc921cf81dc903915bc8288');
    setZ2Hex('55eedc921cf81dc903915bc82882caaeebd4210dcb41faee912e84cfabcf710');
  };

  const loadLaszloPreset = () => {
    setRHex('e12de12da1abac5fcefcae1eaee5739c91a039bbf8719cd204fcaed1a9dec041');
    setS1Hex('67afbc91ee29ee3bd49efbc1a98edca7788dc11faeeaca39c9de2847ffde284');
    setS2Hex('6ef7ef745db88a10129bcfe63eab19edca02931aee8fcdebaaec42bf50bbf60');
    setZ1Hex('a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d');
    setZ2Hex('b1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d');
  };

  return (
    <div className="space-y-8" id="ecdsa-parser-tool">
      {/* Introduction */}
      <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-lg">
        <h2 className="text-md font-mono text-zinc-300 font-bold mb-2 flex items-center gap-2">
          <Key className="h-5 w-5 text-amber-500 animate-pulse" /> ECDSA CRIPTOGRAFIA DE INFRAESTRUTURA & COMBATOR
        </h2>
        <p className="text-xs text-zinc-400 font-mono leading-relaxed">
          Esta caixa de areia criptográfica demonstra na prática a matemática das assinaturas Bitcoin. Use o <strong className="text-zinc-200">Decodificador DER</strong> para extrair componentes ou utilize o <strong className="text-amber-400">Recuperador de Chave Privada</strong> para solucionar vazamento de nonces K em secp256k1 em tempo real!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PANEL 1: DER SIGNATURE DECODER */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs text-zinc-400 font-mono font-bold uppercase border-b border-zinc-900 pb-2 flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-emerald-500" /> DECODIFICADOR DER DE ASSINATURA HEX
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-550 font-mono uppercase block">ScriptSig/Signature Hex String</label>
              <textarea
                value={rawScript}
                onChange={(e) => setRawScript(e.target.value)}
                className="w-full h-[85px] px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs rounded focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-950"
              />
            </div>

            <button
              onClick={handleDecodeDER}
              disabled={decoding}
              className="w-full py-2 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500 text-emerald-400 text-xs font-mono font-bold rounded flex items-center justify-center gap-2 transition-all cursor-pointer h-[36px]"
            >
              Explanar e Decodificar DER
            </button>
          </div>

          {/* DER Parser results screen */}
          {derResult && (
            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded space-y-3 font-mono text-[11px]">
              {derResult.isValid ? (
                <div className="space-y-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Assinatura DER Válida Detectada!
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-zinc-500">
                    <div>Der Size: {derResult.parsedFields?.derLength}B</div>
                    <div>R Size: {derResult.parsedFields?.rLength}B</div>
                    <div>S Size: {derResult.parsedFields?.sLength}B</div>
                  </div>
                  <div className="space-y-1 pt-2">
                    <span className="text-[9px] text-zinc-500 uppercase block">Extracted R Value</span>
                    <span className="text-zinc-300 break-all select-all block leading-tight font-bold font-mono">{derResult.r}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase block">Extracted S Value</span>
                    <span className="text-zinc-300 break-all select-all block leading-tight font-mono">{derResult.s}</span>
                  </div>
                </div>
              ) : (
                <div className="text-rose-400 flex items-start gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Erro de Parse:</strong> {derResult.error}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PANEL 2: ALGEBRA MATH KEY RECOVERY */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6 space-y-4">
          <div className="border-b border-zinc-900 pb-2 flex justify-between items-center">
            <h3 className="text-xs text-zinc-400 font-mono font-bold uppercase flex items-center gap-1.5">
              <Shuffle className="h-4 w-4 text-amber-500" /> RECUPERAÇÃO MATEMÁTICA DE CHAVE PRIVADA (BIGINT)
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">secp256k1 Curve</span>
          </div>

          <p className="text-[11px] text-zinc-500 font-mono leading-relaxed">
            Se duas assinaturas exibirem o mesmo coeficiente <strong className="text-zinc-300 font-mono">r</strong> em transações diferentes, podemos derivar o nonce secreto <strong className="text-amber-500">k</strong> e recuperar expiratividade do endereço <strong className="text-red-500">d (Private Key)</strong> em frações de segundo.
          </p>

          <div className="flex gap-2">
            <button
              onClick={loadVulnerableDataPreset}
              className="px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-amber-400 text-[10px] font-mono rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Shuffle className="h-3 w-3" /> Android 2013 Preset (Vunerável)
            </button>
            <button
              onClick={loadLaszloPreset}
              className="px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-amber-400 text-[10px] font-mono rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Shuffle className="h-3 w-3" /> Laszlo Loopback Preset
            </button>
          </div>

          {/* Math Inputs */}
          <div className="space-y-3 font-mono text-[10px] text-zinc-450">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="uppercase block">Reused r Coefficient (Hex)</span>
                <input
                  type="text"
                  value={rHex}
                  onChange={(e) => setRHex(e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-350 rounded focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <span className="uppercase block">z1 Message Hash (Hex)</span>
                <input
                  type="text"
                  value={z1Hex}
                  onChange={(e) => setZ1Hex(e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-350 rounded focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <span className="uppercase block">s1 Signature Component (Hex)</span>
                <input
                  type="text"
                  value={s1Hex}
                  onChange={(e) => setS1Hex(e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-350 rounded focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <span className="uppercase block">z2 Message Hash (Hex)</span>
                <input
                  type="text"
                  value={z2Hex}
                  onChange={(e) => setZ2Hex(e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-350 rounded focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1 col-span-1 md:col-span-2">
                <span className="uppercase block">s2 Signature Component (Hex)</span>
                <input
                  type="text"
                  value={s2Hex}
                  onChange={(e) => setS2Hex(e.target.value)}
                  className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-350 rounded focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSolveMath}
              disabled={solving}
              className="w-full py-2 bg-amber-955 bg-amber-900/40 border border-amber-500 text-amber-400 font-bold hover:bg-amber-900/60 rounded flex items-center justify-center gap-2 transition-all cursor-pointer h-[36px]"
            >
              <Play className="h-4 w-4" /> Calcular Algebra Criptográfica secp256k1
            </button>
          </div>

          {/* Math recovery formula result log display */}
          {recoverResult && (
            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded space-y-3 font-mono">
              {recoverResult.recovered ? (
                <div className="space-y-3">
                  <div className="p-2 border border-red-500/30 bg-red-950/20 rounded">
                    <span className="text-red-400 text-xs font-bold uppercase block flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 animate-bounce" /> VULNERABILIDADE EXPLORADA COM SUCESSO!
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-1">
                      Os coeficientes de assinatura vazaram a chave privada correspondente.
                    </span>
                  </div>

                  {/* Private Key Output */}
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded space-y-1.5">
                    <span className="text-[9px] text-zinc-550 uppercase block">Chave Privada Recuperada (Hex)</span>
                    <span className="text-red-400 text-xs select-all break-all block font-bold font-mono tracking-wider">{recoverResult.recovered_private_key}</span>
                    <span className="text-[9px] text-zinc-550 uppercase block pt-2">Nonce Ephemeral Relacionado k (Hex)</span>
                    <span className="text-zinc-400 text-[10px] select-all break-all block font-mono">{recoverResult.k_value}</span>
                  </div>

                  {/* Step by step */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-550 uppercase block">Análise de Passos de Cálculo</span>
                    <div className="max-h-[140px] overflow-y-auto bg-zinc-950 border border-zinc-900 p-2 rounded text-[10px] text-zinc-400 space-y-1.5">
                      {recoverResult.step_by_step?.map((step: string, sIdx: number) => (
                        <div key={sIdx} className="flex gap-2">
                          <span className="text-amber-500 font-bold">[{sIdx + 1}]</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-rose-450 flex items-start gap-1.5 font-mono text-[11px]">
                  <AlertTriangle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Falha na Decomposição:</strong> {recoverResult.error || 'Solucionador criptográfico retornou erro.'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
