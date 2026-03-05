import { ethers } from 'ethers';

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
}

export interface SecurityAnalysis {
  isHoneypot: boolean;
  buyTax: number;
  sellTax: number;
  owner: string | null;
  ownershipRenounced: boolean;
  canMint: boolean;
  proxy: boolean;
  raw: any;
}

export interface LiquidityInfo {
  pairAddress: string;
  token0: string;
  token1: string;
  reserve0: bigint;
  reserve1: bigint;
  liquidityUSD: number;
}

export interface TradeSignal {
  tokenAddress: string;
  pairAddress: string;
  liquidityUSD: number;
  security: SecurityAnalysis;
}

export interface Position {
  id?: number;
  tokenAddress: string;
  pairAddress: string;
  entryPrice: number;       // السعر عند الشراء (بالـ native token)
  amountIn: bigint;         // المبلغ المُنفق (native)
  amountOut: bigint;        // كمية التوكنات المستلمة
  entryTime: Date;
  status: 'open' | 'closed' | 'partial';
  remainingAmount: bigint;  // الكمية المتبقية
  highestPrice: number;     // أعلى سعر وصل إليه (لـ trailing)
  soldPortions: Array<{
    price: number;
    amount: bigint;
    time: Date;
    txHash?: string;
  }>;
}

export interface TradeRecord {
  id?: number;
  positionId: number;
  type: 'buy' | 'sell' | 'partial_sell';
  price: number;
  amount: bigint;
  txHash?: string;
  timestamp: Date;
  isPaper: boolean; // تمييز صفقات Paper
}
