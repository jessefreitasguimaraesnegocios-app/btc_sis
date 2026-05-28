/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Block, Transaction, SignatureRecord, WalletProfile, WalletRelation, ClusterInfo } from '../types';

// The Secp256k1 Curve Order N for ECDSA Calculations
export const SECP256K1_N = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");

// 1. Classical Blocks (Satoshi Era, 2009-2015)
export const mockBlocks: Block[] = [
  {
    height: 0,
    hash: "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    timestamp: "2009-01-03T18:15:05Z",
    tx_count: 1,
    miner: "Satoshi Genesis Miner",
    size: 285,
    fees: 0
  },
  {
    height: 1,
    hash: "00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048",
    timestamp: "2009-01-09T02:54:25Z",
    tx_count: 1,
    miner: "Satoshi Nakamoto",
    size: 215,
    fees: 0
  },
  {
    height: 9,
    hash: "00000000000000001cb74ef5c03c519d61e934ee5112526c8fbfcfcf191f6e2f",
    timestamp: "2009-01-12T03:30:25Z",
    tx_count: 2,
    miner: "Satoshi Nakamoto",
    size: 512,
    fees: 10000
  },
  {
    height: 170,
    hash: "00000000d11497d4ef5c03c519d61e934ee5112526c8fbfcfcf191f6e2f12cb1",
    timestamp: "2009-01-12T12:00:00Z",
    tx_count: 3,
    miner: "Anonymous Early Pool",
    size: 890,
    fees: 30000
  },
  {
    height: 57043,
    hash: "00000000001a1e04db100bba774431a1a5b8da46e5ca187fcf302fc80e9d5fbf",
    timestamp: "2010-05-22T18:16:00Z",
    tx_count: 18,
    miner: "Early GPU Farm",
    size: 4520,
    fees: 500000
  },
  {
    height: 224445,
    hash: "00000000000001a88df9fbe05d1c4415fa016c026d36e2f1ea2038b7ef66b1c2",
    timestamp: "2013-03-05T08:24:12Z",
    tx_count: 124,
    miner: "F2Pool Early",
    size: 61500,
    fees: 4500000
  },
  {
    height: 224446,
    hash: "00000000000000dbcf2bef91ad41a29381ea2038b7ef66b1c2104192d192cde2",
    timestamp: "2013-03-05T08:31:05Z",
    tx_count: 112,
    miner: "F2Pool Early",
    size: 58900,
    fees: 3900000
  },
  {
    height: 322500,
    hash: "00000000000000000cfb63f2bef98d1c44158913b1e92c20a8fe55d3ca231d6c",
    timestamp: "2014-09-25T14:45:33Z",
    tx_count: 421,
    miner: "GHash.IO Dual Mined",
    size: 218450,
    fees: 12500000
  },
  {
    height: 350000,
    hash: "00000000000000000db9ba774431a421b830a58a46e5ca187fcf302fc80d6fde",
    timestamp: "2015-03-31T06:12:44Z",
    tx_count: 894,
    miner: "AntPool Classic",
    size: 489200,
    fees: 35000000
  }
];

// Helper to fill in simple block listings
const additionalBlocks: Block[] = Array.from({ length: 30 }, (_, i) => {
  const height = 10 + i * 5000;
  return {
    height,
    hash: `00000000000000000d89bf3e${height.toString(16).padStart(8, '0')}12cc9381ea7bc43df99ea92dfa1`,
    timestamp: new Date(2009 + (i * 0.2), 0, 1).toISOString(),
    tx_count: Math.floor(Math.sqrt(height) * 1.5) + 2,
    miner: i % 3 === 0 ? "SlushPool Legacy" : i % 3 === 1 ? "BTC Guild" : "Eligius Pool",
    size: 1540 + height * 2,
    fees: 50 * height
  };
});

export const allBlocks = [...mockBlocks, ...additionalBlocks].sort((a, b) => a.height - b.height);

// 2. Classical Transactions
export const mockTransactions: Transaction[] = [
  // Coinbase Genesis Block
  {
    txid: "0e3e23b320cd3d29a05fced42db8ec021e1e075cd55cd52912a7bf83c3e212f4",
    block_height: 0,
    timestamp: "2009-01-03T18:15:05Z",
    fee: 0,
    size: 204,
    input_count: 1,
    output_count: 1,
    inputs: [
      {
        index: 0,
        txid_prev: "0000000000000000000000000000000000000000000000000000000000000000",
        vout_prev: 4294967295,
        address: "Coinbase Mined",
        scriptSig: "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73", // "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
        is_segwit: false
      }
    ],
    outputs: [
      {
        index: 0,
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", // Satoshi Genesis Address
        value: 5000000000, // 50 BTC
        scriptPubKey: "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac"
      }
    ]
  },
  // Satoshi to Hal Finney (First real TX, Block 9) -> TXID: f4183...
  {
    txid: "f418305929856e40f48f136e3976e007421ac97588e38ee127b3e64841a0279a",
    block_height: 9,
    timestamp: "2009-01-12T03:30:25Z",
    fee: 0,
    size: 275,
    input_count: 1,
    output_count: 2,
    inputs: [
      {
        index: 0,
        txid_prev: "0e3e23b320cd3d29a05fced42db8ec021e1e075cd55cd52912a7bf83c3e212f4",
        vout_prev: 0,
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        scriptSig: "304402202cde2ea12cde2ea104192d192cf4ef5c03c519d61e934ee5112526c8fbfcfcf102203909a67962e0ea1f61deb64bf6bc3f4cef38c4f35504e51ec112de5c384df7ba0b01", // Simulated DER Signature (R, S)
        pubkey: "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac",
        r_value: "2cde2ea12cde2ea104192d192cf4ef5c03c519d61e934ee5112526c8fbfcfcf1",
        s_value: "3909a67962e0ea1f61deb64bf6bc3f4cef38c4f35504e51ec112de5c384df7ba0b",
        message_hash: "00000000d11497d4ef5c03c519d61e934ee5112526c8fbfcfcf191f6e2f12cb11a",
        is_segwit: false
      }
    ],
    outputs: [
      {
        index: 0,
        address: "12cb1541A1zP1eP5QGefi2DMPTfTL5SLmv", // Hal Finney Address
        value: 1000000000, // 10 BTC
        scriptPubKey: "OP_DUP OP_HASH160 12cb1541A1zP1eP5QGef OP_EQUALVERIFY OP_CHECKSIG"
      },
      {
        index: 1,
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", // Satoshi Change
        value: 4000000000, // 40 BTC
        scriptPubKey: "OP_DUP OP_HASH160 1A1zP1eP5QGefi2DMPTf OP_EQUALVERIFY OP_CHECKSIG"
      }
    ]
  },
  // Pizza Tx (Block 57,043)
  {
    txid: "a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d",
    block_height: 57043,
    timestamp: "2010-05-22T18:16:00Z",
    fee: 99000000,
    size: 478,
    input_count: 2,
    output_count: 2,
    inputs: [
      {
        index: 0,
        txid_prev: "8cdd9ca48fd2a6ba0ea2bbec8bfbad112ded3fc48e367fcbcf20a89d5fdf190e",
        vout_prev: 1,
        address: "1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H", // Laszlo Hanyecz Address
        scriptSig: "3045022100e12de12da1abac5fcefcae1eaee5739c91a039bbf8719cd204fcaed1a9dec0410220678afbc91ee29ee3bd49efbc1a98edca7788dc11faeeaca39c9de2847ffde28401",
        pubkey: "04781faee819eecc29eedb48ea112de12de938bcaec189bfaec21029cde471faee39cbfee3819e91fbfaecbc39129e93bc928fcaee47291eecc871faee912e8401a89cde94",
        r_value: "e12de12da1abac5fcefcae1eaee5739c91a039bbf8719cd204fcaed1a9dec041",
        s_value: "678afbc91ee29ee3bd49efbc1a98edca7788dc11faeeaca39c9de2847ffde284",
        message_hash: "a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d",
        is_segwit: false
      },
      {
        index: 1,
        txid_prev: "f15e8dfbc398aa381ea20cdaef912dcb4192bbfcaecbd41faee932dc921ceaa4",
        vout_prev: 0,
        address: "1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H", // Laszlo Same spend co-input
        scriptSig: "3045022100e12de12da1abac5fcefcae1eaee5739c91a039bbf8719cd204fcaed1a9dec04102206ef7ef745db88a10129bcfe63eab19edca02931aee8fcdebaaec42bf50bbf601",
        pubkey: "04781faee819eecc29eedb48ea112de12de938bcaec189bfaec21029cde471faee39cbfee3819e91fbfaecbc39129e93bc928fcaee47291eecc871faee912e8401a89cde94",
        r_value: "e12de12da1abac5fcefcae1eaee5739c91a039bbf8719cd204fcaed1a9dec041", // Reuse in the SAME multi-input tx! (Common early bug or pre-computed signature test)
        s_value: "6ef7ef745db88a10129bcfe63eab19edca02931aee8fcdebaaec42bf50bbf601",
        message_hash: "b1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d",
        is_segwit: false
      }
    ],
    outputs: [
      {
        index: 0,
        address: "1HELLOPiZzAPiZzAPiZzAPiZzAPiZzAPiZz", // Jeremy Sturdivant (Pizza receiver seller)
        value: 1000000000000, // 10,000 BTC
        scriptPubKey: "OP_DUP OP_HASH160 1HELLOPiZzAPiZzAPiZz OP_EQUALVERIFY OP_CHECKSIG"
      },
      {
        index: 1,
        address: "1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H", // Change
        value: 4000000000, // 40 BTC
        scriptPubKey: "OP_DUP OP_HASH160 1XPT8Hyp9PT8Hyp9PT8H OP_EQUALVERIFY OP_CHECKSIG"
      }
    ]
  },
  
  // VULNERABLE NONCE REUSE TX 1 (Android SecureRandom Exploit, Block 224,445)
  // Address: 1933phfhJyA4H3idgALZg9X9r2F6EStE4i
  {
    txid: "926ae9308d2d6fbf639fae6aa0fbfbc6bfbed7fa91ad41a29381ea2038b7ef66",
    block_height: 224445,
    timestamp: "2013-03-05T08:24:12Z",
    fee: 10000,
    size: 258,
    input_count: 1,
    output_count: 2,
    inputs: [
      {
        index: 0,
        txid_prev: "03498bde919a338291fcaeebd4210dcb41faee912e84cfabcf7102ccaecc921c",
        vout_prev: 1,
        address: "1933phfhJyA4H3idgALZg9X9r2F6EStE4i",
        scriptSig: "304402209c9b9d3b2f56bca9ee8d69781a98059882aef1efcc7eb2eeea7e828f7316efef022067ae9bc81fcaeebd41faee819e04812de84abcfce912da041892decaeccbc93101",
        pubkey: "044391e605d8479e0a297779f7cc91e6ad1c49830872688bcaec184d0b263df330691e8dd41f6e2f1e6f498fd41a29381ea2038b7ef66b1c2104192d192cde2ea1",
        r_value: "9c9b9d3b2f56bca9ee8d69781a98059882aef1efcc7eb2eeea7e828f7316efef",
        s_value: "67ae9bc81fcaeebd41faee819e04812de84abcfce912da041892decaeccbc931",
        message_hash: "2caaeebd4210dcb41faee912e84cfabcf7102ccaecc921cf81dc903915bc8288", // z1
        is_segwit: false
      }
    ],
    outputs: [
      {
        index: 0,
        address: "1A77b47b4cfbcfeebd5a41eaee91dcb41feed",
        value: 5000000, // 0.05 BTC
        scriptPubKey: "OP_DUP OP_HASH160 1A77b47b4cfb OP_EQUALVERIFY OP_CHECKSIG"
      },
      {
        index: 1,
        address: "1933phfhJyA4H3idgALZg9X9r2F6EStE4i", // Change back to vulnerable address
        value: 2000000, // 0.02 BTC
        scriptPubKey: "OP_DUP OP_HASH160 1933phfhJyA4H3idgALZg9X OP_EQUALVERIFY OP_CHECKSIG"
      }
    ]
  },
  
  // VULNERABLE NONCE REUSE TX 2 (Android SecureRandom Exploit, Block 224,446)
  // Reuses the identical R value: 9c9b9d3b...
  // Leads directly to recovery of private key: d = 5f3d32cb... (mathematical solution)
  {
    txid: "40fbfbc6bfbed7fa9e2a22bece1c8d50fbdca0decca91ad41a293c202029abc",
    block_height: 224446,
    timestamp: "2013-03-05T08:31:05Z",
    fee: 10000,
    size: 258,
    input_count: 1,
    output_count: 1,
    inputs: [
      {
        index: 0,
        txid_prev: "926ae9308d2d6fbf639fae6aa0fbfbc6bfbed7fa91ad41a29381ea2038b7ef66",
        vout_prev: 1,
        address: "1933phfhJyA4H3idgALZg9X9r2F6EStE4i",
        scriptSig: "304402209c9b9d3b2f56bca9ee8d69781a98059882aef1efcc7eb2eeea7e828f7316efef02202faee19ee819e91fbfaecbcde39129e93bc928fcaee47291eecc871faee29de801",
        pubkey: "044391e605d8479e0a297779f7cc91e6ad1c49830872688bcaec184d0b263df330691e8dd41f6e2f1e6f498fd41a29381ea2038b7ef66b1c2104192d192cde2ea1",
        r_value: "9c9b9d3b2f56bca9ee8d69781a98059882aef1efcc7eb2eeea7e828f7316efef", // REUSED
        s_value: "2faee19ee819e91fbfaecbcde39129e93bc928fcaee47291eecc871faee29de8",
        message_hash: "55eedc921cf81dc903915bc82882caaeebd4210dcb41faee912e84cfabcf7102", // z2
        is_segwit: false
      }
    ],
    outputs: [
      {
        index: 0,
        address: "1HACKEReBfd41ee9cdeaeecbc39128fcaee91", // Coins swiped out due to vulnerability
        value: 1990000, 
        scriptPubKey: "OP_DUP OP_HASH160 1HACKEReBfd4 OP_EQUALVERIFY OP_CHECKSIG"
      }
    ]
  }
];

// Helper to fill in dummy/simulated txs
const generateMoreTransactions = (): Transaction[] => {
  const list: Transaction[] = [];
  // For the active blocks, generate a few transactions
  allBlocks.forEach((block) => {
    if (block.height === 0 || block.height === 9 || block.height === 57043 || block.height === 224445 || block.height === 224446) {
      return; // already hardcoded
    }
    const txcount = Math.min(block.tx_count, 4);
    for (let t = 0; t < txcount; t++) {
      const txid = `txid_sim_blk${block.height}_tx${t}_${Math.random().toString(16).slice(2, 10)}aeebd3fc48e367fcbcf20a89d5f`;
      list.push({
        txid,
        block_height: block.height,
        timestamp: block.timestamp,
        fee: 1000 + t * 500,
        size: 220 + t * 80,
        input_count: 1,
        output_count: 1,
        inputs: [
          {
            index: 0,
            txid_prev: `prev_txid_${block.height - 1000 > 0 ? block.height - 1000 : 9}`,
            vout_prev: 0,
            address: t % 2 === 0 ? "1LbcPp55j7ycY9st3v4fA3p6cJ8L1376A9" : "1MTGOXClassicalColdWalletAddressL3",
            scriptSig: `304502210089bf${t}2cfdaec051eaebd3fc48e367f0812deccbcbaaec219eb91cfbd847e0aef0220391faeebd3fc4${t}29eedb48ea112de12de938bcaec189bfaec21029cde47101`,
            pubkey: `0489bfec${t}12cc9381ea2038b7ef66b1c2104192cd2ea192cde2ea12cde2ea104192d192cf4ef5c03c519d61e934ee5112526c8fbfcfcf191f6e2f12cb11a9eecc39cdefbcdaee`,
            r_value: `89bf${t}2cfdaec051eaebd3fc48e367f0812deccbcbaaec219eb91cfbd847e0aef`,
            s_value: `391faeebd3fc4${t}29eedb48ea112de12de938bcaec189bfaec21029cde471`,
            message_hash: `eebd3fc4${t}fee912e84cfabcf7102ccaecc921cf81dc903915bc8288`,
            is_segwit: false
          }
        ],
        outputs: [
          {
            index: 0,
            address: t % 2 === 1 ? "1LbcPp55j7ycY9st3v4fA3p6cJ8L1376A9" : "1HalFinneyEarlyMinedAddress72bc",
            value: 2500000000 - (t * 10000000),
            scriptPubKey: "OP_DUP OP_HASH160 1LbcPp55j7ycY9st3 OP_EQUALVERIFY OP_CHECKSIG"
          }
        ]
      });
    }
  });
  return list;
};

export const allTransactions = [...mockTransactions, ...generateMoreTransactions()];

// 3. Signature Extraction Index
export const mockSignatures: SignatureRecord[] = allTransactions
  .flatMap((tx) => {
    return tx.inputs
      .filter((inp) => inp.pubkey && inp.r_value && inp.s_value)
      .map((inp) => {
        const isDuplicated = inp.address === "1933phfhJyA4H3idgALZg9X9r2F6EStE4i" || inp.address === "1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H";
        const isLaszlo = inp.address === "1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H";
        const score = isDuplicated ? 100 : isLaszlo ? 40 : 5;
        
        let dupTx = undefined;
        if (inp.address === "1933phfhJyA4H3idgALZg9X9r2F6EStE4i") {
          dupTx = tx.txid === mockTransactions[3].txid ? mockTransactions[4].txid : mockTransactions[3].txid;
        } else if (isLaszlo) {
          dupTx = mockTransactions[2].txid; // inside same tx
        }

        return {
          txid: tx.txid,
          block_height: tx.block_height,
          timestamp: tx.timestamp,
          address: inp.address,
          pubkey: inp.pubkey!,
          r_value: inp.r_value!,
          s_value: inp.s_value!,
          message_hash: inp.message_hash || tx.txid,
          duplicated_r: isDuplicated,
          duplicate_txid: dupTx,
          risk_score: score
        };
      });
  });

// 4. Wallets (Historical Accounts)
export const mockWallets: WalletProfile[] = [
  {
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", // Satoshi Nakamoto
    first_seen_block: 0,
    first_seen_date: "2009-01-03T18:15:05Z",
    last_seen_block: 170,
    total_received: 100000000000, // 1000 BTC
    total_sent: 5000000000, // 50 BTC
    balance: 95000000000, // 950 BTC
    cluster_id: "satoshi_nakamoto_genesis",
    wallet_score: 0 // Low risk, legendary
  },
  {
    address: "12cb1541A1zP1eP5QGefi2DMPTfTL5SLmv", // Hal Finney
    first_seen_block: 9,
    first_seen_date: "2009-01-12T03:30:25Z",
    last_seen_block: 170,
    total_received: 2000000000, // 20 BTC
    total_sent: 500000000, // 5 BTC
    balance: 1500000000, // 15 BTC
    cluster_id: "hal_finney_early",
    wallet_score: 5 // Low
  },
  {
    address: "1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H", // Laszlo Hanyecz
    first_seen_block: 728,
    first_seen_date: "2010-01-20T10:00:00Z",
    last_seen_block: 57043,
    total_received: 10040000000, // 100.4 BTC
    total_sent: 10040000000,
    balance: 0,
    cluster_id: "laszlo_pizza_2010",
    wallet_score: 30 // Medium risk due to inside-transaction duplicate R test
  },
  {
    address: "1HELLOPiZzAPiZzAPiZzAPiZzAPiZzAPiZz", // Jeremy Sturdivant
    first_seen_block: 57043,
    first_seen_date: "2010-05-22T18:16:00Z",
    last_seen_block: 57043,
    total_received: 1000000000000, // 10k BTC
    total_sent: 0,
    balance: 1000000000000,
    cluster_id: "laszlo_pizza_2010",
    wallet_score: 10
  },
  {
    address: "1933phfhJyA4H3idgALZg9X9r2F6EStE4i", // Compromised android signature adress
    first_seen_block: 224445,
    first_seen_date: "2013-03-05T08:24:12Z",
    last_seen_block: 224446,
    total_received: 7000000, // 0.07 BTC
    total_sent: 7000000, // fully swiped!
    balance: 0,
    cluster_id: "vulnerable_android_2013",
    wallet_score: 100 // EXTREME RISK, PRIVATE KEY RECOVERED!
  },
  {
    address: "1HACKEReBfd41ee9cdeaeecbc39128fcaee91", // Intruder Thief Address
    first_seen_block: 224446,
    first_seen_date: "2013-03-05T08:31:05Z",
    last_seen_block: 350000,
    total_received: 1990000,
    total_sent: 0,
    balance: 1990000,
    cluster_id: "attacker_spoils",
    wallet_score: 80 // ATTACKER
  },
  {
    address: "1MTGOXClassicalColdWalletAddressL3", // Mt. Gox historic addresses
    first_seen_block: 102000,
    first_seen_date: "2011-06-15T09:12:00Z",
    last_seen_block: 350000,
    total_received: 550000000000, // 5500 BTC
    total_sent: 250000000000, // 2500 BTC
    balance: 300000000000, // 3000 BTC
    cluster_id: "mt_gox_historical",
    wallet_score: 55 // High, MT GOX related, forensic target
  },
  {
    address: "1LbcPp55j7ycY9st3v4fA3p6cJ8L1376A9", // Standard random address
    first_seen_block: 310000,
    first_seen_date: "2014-06-10T11:22:33Z",
    last_seen_block: 350000,
    total_received: 8520000000, // 85.2 BTC
    total_sent: 1200000000,
    balance: 7320000000,
    cluster_id: null,
    wallet_score: 15
  }
];

// 5. Wallet Relations
export const mockRelations: WalletRelation[] = [
  {
    id: "rel1",
    wallet_a: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    wallet_b: "12cb1541A1zP1eP5QGefi2DMPTfTL5SLmv",
    relation_type: "Direct Transaction",
    confidence_score: 100
  },
  {
    id: "rel2",
    wallet_a: "1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H",
    wallet_b: "1HELLOPiZzAPiZzAPiZzAPiZzAPiZzAPiZz",
    relation_type: "Direct Transaction",
    confidence_score: 100
  },
  {
    id: "rel3",
    wallet_a: "1933phfhJyA4H3idgALZg9X9r2F6EStE4i",
    wallet_b: "1HACKEReBfd41ee9cdeaeecbc39128fcaee91",
    relation_type: "Direct Transaction",
    confidence_score: 100
  },
  {
    id: "rel4",
    wallet_a: "1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H",
    wallet_b: "1HELLOPiZzAPiZzAPiZzAPiZzAPiZzAPiZz",
    relation_type: "Multi-Input Heuristic", // Co-spent co-inputs proves control of cluster
    confidence_score: 95
  },
  {
    id: "rel5",
    wallet_a: "1933phfhJyA4H3idgALZg9X9r2F6EStE4i",
    wallet_b: "1A77b47b4cfbcfeebd5a41eaee91dcb41feed",
    relation_type: "Change Address Match",
    confidence_score: 85
  }
];

// 6. Clusters Profile
export const mockClusters: ClusterInfo[] = [
  {
    cluster_id: "satoshi_nakamoto_genesis",
    name: "Satoshi Nakamoto Cluster",
    addresses: ["1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "1Satoshi111111111111111111111111"],
    total_balance: 95000000000,
    risk_status: "Satoshi-Era",
    description: "Legendary addresses controlled directly by Satoshi Nakamoto containing his genesis block assets and early mined block rewards."
  },
  {
    cluster_id: "hal_finney_early",
    name: "Hal Finney Trust",
    addresses: ["12cb1541A1zP1eP5QGefi2DMPTfTL5SLmv", "1HalFinneyEarlyMinedAddress72bc"],
    total_balance: 1530000000,
    risk_status: "Low",
    description: "Heir assets of cryptographic pioneer Hal Finney. Contains early blocks distributed from Satoshi."
  },
  {
    cluster_id: "laszlo_pizza_2010",
    name: "Laszlo Pizza Cluster",
    addresses: ["1XPT8Hyp9PT8Hyp9PT8Hyp9PT8Hyp9PT8H", "1HELLOPiZzAPiZzAPiZzAPiZzAPiZzAPiZz"],
    total_balance: 1000000000000,
    risk_status: "Medium",
    description: "Famous addresses related to Laszlo Hanyecz making the first commercial purchase in Bitcoin history for two Papa John's Pizzas."
  },
  {
    cluster_id: "vulnerable_android_2013",
    name: "SecureRandom Compromised Pools",
    addresses: ["1933phfhJyA4H3idgALZg9X9r2F6EStE4i"],
    total_balance: 0,
    risk_status: "High",
    description: "Vulnerable group of wallets affected by the August 2013 Android PRNG flaw. Nonce values (K) were reused across multiple transactions, making private key recovery trivial."
  },
  {
    cluster_id: "mt_gox_historical",
    name: "MT.GOX Liquidator Cold Wallets",
    addresses: ["1MTGOXClassicalColdWalletAddressL3"],
    total_balance: 300000000000,
    risk_status: "High",
    description: "Historical vaults connected to MT.GOX exchanges, containing remaining pool assets under liquidator or early historical hacks."
  }
];
