/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Block {
  height: number;
  hash: string;
  timestamp: string;
  tx_count: number;
  miner: string;
  size: number; // in bytes
  fees: number; // in satoshis
}

export interface Transaction {
  txid: string;
  block_height: number;
  timestamp: string;
  fee: number; // satoshis
  size: number; // bytes
  input_count: number;
  output_count: number;
  inputs: TxInput[];
  outputs: TxOutput[];
}

export interface TxInput {
  index: number;
  txid_prev: string;
  vout_prev: number;
  address: string;
  scriptSig: string;
  pubkey?: string;
  r_value?: string;
  s_value?: string;
  message_hash?: string;
  is_segwit: boolean;
}

export interface TxOutput {
  index: number;
  address: string;
  value: number; // satoshis
  scriptPubKey: string;
}

export interface SignatureRecord {
  txid: string;
  block_height: number;
  timestamp: string;
  address: string;
  pubkey: string;
  r_value: string;
  s_value: string;
  message_hash: string;
  duplicated_r: boolean;
  duplicate_txid?: string; // transaction reusing the same R
  risk_score: number; // 0 (none) - 100 (high)
}

export interface WalletProfile {
  address: string;
  first_seen_block: number;
  first_seen_date: string;
  last_seen_block: number;
  total_received: number; // satoshis
  total_sent: number; // satoshis
  balance: number; // satoshis
  cluster_id: string | null;
  wallet_score: number; // risk score, 0-100
}

export interface WalletRelation {
  id: string;
  wallet_a: string;
  wallet_b: string;
  relation_type: 'Multi-Input Heuristic' | 'Direct Transaction' | 'Change Address Match' | 'Co-spend Witness';
  confidence_score: number; // 0 - 100
}

export interface ClusterInfo {
  cluster_id: string;
  name: string;
  addresses: string[];
  total_balance: number;
  risk_status: 'Low' | 'Medium' | 'High' | 'Satoshi-Era';
  description: string;
}

export interface DecodedSignature {
  isValid: boolean;
  r: string;
  s: string;
  pubkey: string;
  error?: string;
  parsedFields?: {
    derLength: number;
    rLength: number;
    sLength: number;
  };
}

export interface KeyRecoveryResult {
  recovered: boolean;
  recovered_private_key?: string;
  step_by_step: string[];
  k_value?: string;
}
