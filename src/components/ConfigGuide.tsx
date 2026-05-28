/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Check, Terminal, Database, Key } from 'lucide-react';

export default function ConfigGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const bitcoinConfText = `server=1
txindex=1
daemon=1
rpcuser=forensic_investigator
rpcpassword=super_secure_sha256_password_key_99
rpcport=8332
rpcallowip=127.0.0.1
maxconnections=40
dbcache=4096`;

  const pgMigrationsText = `-- Create Tables for Bitcoin Historical Forensic Indexer (Blocks 0-350,000)

CREATE TABLE blocks (
    height INT PRIMARY KEY,
    hash VARCHAR(64) UNIQUE NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    tx_count INT NOT NULL,
    miner VARCHAR(100),
    size INT NOT NULL,
    fees BIGINT NOT NULL
);

CREATE TABLE transactions (
    txid VARCHAR(64) PRIMARY KEY,
    block_height INT REFERENCES blocks(height) ON DELETE CASCADE,
    fee BIGINT NOT NULL,
    size INT NOT NULL,
    input_count INT NOT NULL,
    output_count INT NOT NULL
);

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    txid VARCHAR(64) REFERENCES transactions(txid) ON DELETE CASCADE,
    block_height INT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    address VARCHAR(100) NOT NULL,
    pubkey TEXT NOT NULL,
    r_value VARCHAR(64) NOT NULL,
    s_value VARCHAR(64) NOT NULL,
    message_hash VARCHAR(64) NOT NULL,
    duplicated_r BOOLEAN DEFAULT FALSE,
    risk_score INT DEFAULT 0
);

CREATE TABLE wallets (
    address VARCHAR(100) PRIMARY KEY,
    first_seen_block INT NOT NULL,
    first_seen_date TIMESTAMP NOT NULL,
    last_seen_block INT NOT NULL,
    total_received BIGINT DEFAULT 0,
    total_sent BIGINT DEFAULT 0,
    balance BIGINT DEFAULT 0,
    cluster_id VARCHAR(50),
    wallet_score INT DEFAULT 0
);

CREATE TABLE relations (
    id SERIAL PRIMARY KEY,
    wallet_a VARCHAR(100) NOT NULL,
    wallet_b VARCHAR(100) NOT NULL,
    relation_type VARCHAR(50) NOT NULL,
    confidence_score INT NOT NULL,
    CONSTRAINT unique_wallet_rel UNIQUE (wallet_a, wallet_b, relation_type)
);

-- ULTRA-PERFORMANCE INDEX ENGINES
CREATE INDEX idx_signatures_r_value ON signatures (r_value);
CREATE INDEX idx_signatures_pubkey ON signatures (pubkey);
CREATE INDEX idx_signatures_address ON signatures (address);
CREATE INDEX idx_signatures_block_height ON signatures (block_height);
CREATE INDEX idx_transactions_block_height ON transactions (block_height);
CREATE INDEX idx_relations_wallets ON relations (wallet_a, wallet_b);
CREATE INDEX idx_wallets_balance_score ON wallets (balance DESC, wallet_score DESC);`;

  const pythonExtractorText = `import json
import psycopg2
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException

# PostgreSQL Connection
conn = psycopg2.connect("dbname=forensics user=investigator password=secure_pwd host=localhost")
cur = conn.cursor()

# Bitcoin Core Connection
rpc_connection = AuthServiceProxy("http://forensic_investigator:super_secure_sha256_password_key_99@127.0.0.1:8332")

def parse_der_signatures(script_sig_hex):
    # Decodes standard chunks to find ECDSA raw (R, S) coefficients
    try:
        if not script_sig_hex or "30" not in script_sig_hex:
            return None
        # Locate DER sequence identifier 
        der_start = script_sig_hex.index("30")
        der_bytes = bytes.fromhex(script_sig_hex[der_start:])
        
        # Parse integers (0x02)
        if der_bytes[0] == 0x30:
            total_sig_len = der_bytes[1]
            if der_bytes[2] == 0x02:
                r_len = der_bytes[3]
                r_val = der_bytes[4 : 4 + r_len].hex()
                s_tag_idx = 4 + r_len
                if der_bytes[s_tag_idx] == 0x02:
                    s_len = der_bytes[s_tag_idx + 1]
                    s_val = der_bytes[s_tag_idx + 2 : s_tag_idx + 2 + s_len].hex()
                    return r_val, s_val
    except Exception as e:
        return None
    return None

def extract_block(block_height):
    block_hash = rpc_connection.getblockhash(block_height)
    block_data = rpc_connection.getblock(block_hash, 2) # verbose mode 2 gives transactions
    
    # Save block meta
    cur.execute(
        "INSERT INTO blocks VALUES (%s, %s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
        (block_height, block_hash, block_data['time'], len(block_data['tx']), 'Satoshi Pool', block_data['size'], 0)
    )
    
    # Process transactions
    for tx in block_data['tx']:
        txid = tx['txid']
        cur.execute(
          "INSERT INTO transactions VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
          (txid, block_height, 0, tx['size'], len(tx['vin']), len(tx['vout']))
        )
        # Parse scripts for signatures
        for vin in tx['vin']:
            if 'scriptSig' in vin and 'hex' in vin['scriptSig']:
                script_hex = vin['scriptSig']['hex']
                sig_data = parse_der_signatures(script_hex)
                if sig_data:
                    r, s = sig_data
                    address = vin.get('address', 'Unknown')
                    # Find duplicate Rs (Nonce Reuse Alerts)
                    cur.execute("SELECT txid FROM signatures WHERE r_value = %s", (r,))
                    dup = cur.fetchone()
                    is_duplicated = True if dup else False
                    risk = 100 if is_duplicated else 5
                    
                    cur.execute(
                        "INSERT INTO signatures (txid, block_height, timestamp, address, pubkey, r_value, s_value, message_hash, duplicated_r, risk_score) VALUES (%s, %s, to_timestamp(%s), %s, %s, %s, %s, %s, %s, %s)",
                        (txid, block_height, block_data['time'], address, 'extracted_pub', r, s, txid, is_duplicated, risk)
                    )
    conn.commit()

print("[INVESTIGATION] Starting forensic extraction for Satoshi-era target blocks...")
extract_block(224445)`;

  return (
    <div className="space-y-8" id="config-guide">
      {/* Introduction Card */}
      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-lg">
        <h2 className="text-xl font-medium text-emerald-400 mb-2 flex items-center gap-2 font-mono">
          <Terminal className="h-5 w-5" /> ARQUITETURA DE IMPLANTAÇÃO LOCAL
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Para extrair e analisar assinaturas criptográficas correspondentes ao período histórico <strong className="text-white">2009 → 2015 (Blocos 0 a 350.000)</strong>,
          é necessário configurar uma conexão direta com uma instância local do <strong className="text-emerald-500 font-mono">Bitcoin Core</strong> sincronizada e um banco relacional <strong className="text-emerald-500 font-mono">PostgreSQL</strong> de alta performance. Siga as especificações operacionais abaixo:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BITCOIN CONF */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-500" /> bitcoin.conf configuration
            </span>
            <button
              onClick={() => handleCopy(bitcoinConfText, 'btc')}
              className="text-xs hover:text-white text-zinc-500 flex items-center gap-1 font-mono transition-colors"
            >
              {copied === 'btc' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copiar
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-zinc-950 font-mono text-xs text-zinc-400 overflow-x-auto flex-1 leading-relaxed">
            <pre>{bitcoinConfText}</pre>
          </div>
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-900 text-xs text-zinc-500">
            <strong>Nota técnica:</strong> <code className="text-zinc-350">txindex=1</code> reconstrói o índice auxiliar de transações completo na rede interna. Sem este parâmetro, apenas transações do mempool ou utxos do bloco ativo estarão visíveis via chamadas RPC.
          </div>
        </div>

        {/* POSTGRESQL SCHEMA */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-500" /> PostgreSQL Forensic Database Schema
            </span>
            <button
              onClick={() => handleCopy(pgMigrationsText, 'pg')}
              className="text-xs hover:text-white text-zinc-500 flex items-center gap-1 font-mono transition-colors"
            >
              {copied === 'pg' ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copiar
                </>
              )}
            </button>
          </div>
          <div className="p-4 bg-zinc-950 font-mono text-xs text-zinc-500 overflow-y-auto max-h-[280px] leading-relaxed">
            <pre>{pgMigrationsText}</pre>
          </div>
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-900 text-xs text-zinc-500">
            <strong>Otimização Forense:</strong> O índice <code className="text-zinc-350">idx_signatures_r_value</code> permite buscas exatas em frações de milissegundo ao vasculhar milhões de assinaturas ECDSA em busca de coeficientes R idênticos.
          </div>
        </div>
      </div>

      {/* PYTHON BLOCK INDEXER SCRIPT */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden">
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
          <span className="text-xs font-mono font-bold text-green-400 flex items-center gap-2">
            <Terminal className="h-4 w-4" /> Script Extrator e Identificador de Nonces Reutilizados (Python RPC)
          </span>
          <button
            onClick={() => handleCopy(pythonExtractorText, 'script')}
            className="text-xs hover:text-white text-zinc-500 flex items-center gap-1 font-mono transition-colors"
          >
            {copied === 'script' ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copiar
              </>
            )}
          </button>
        </div>
        <div className="p-4 bg-zinc-950 font-mono text-xs text-zinc-405 overflow-x-auto max-h-[350px] leading-relaxed">
          <pre>{pythonExtractorText}</pre>
        </div>
        <div className="p-4 bg-zinc-900/50 border-t border-zinc-900 text-xs text-zinc-550 leading-relaxed">
          Este script Python se conecta via RPC HTTP ao nó principal Bitcoin Core, recupera detalhes exatos das transações do bloco especificado, analisa o script de assinatura (<code className="text-white">scriptSig</code>) buscando o padrão DER de enquadramento, extrai os vetores de R e S para salvamento em lote no PostgreSQL e dispara alertas se encontrar o mesmo $R$ no banco!
        </div>
      </div>
    </div>
  );
}
