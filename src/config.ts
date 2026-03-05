import 'dotenv/config';
import { ethers } from 'ethers';

export interface Config {
  // الشبكة
  network: string;
  wnativeAddress: string;
  factoryAddress: string;
  routerAddress: string;
  rpcWsUrl: string;
  rpcHttpUrl: string;
  chainId: number;

  // المحفظة
  privateKey: string;
  walletAddress: string;

  // التداول
  minLiquidityUsd: number;
  maxSlippagePercent: number;
  gasPriceMultiplier: number;
  gasLimit: number;
  buyAmountNative: number;
  maxSellTax: number;
  maxBuyTax: number;
  checkHoneypot: boolean;

  // المخاطر
  riskPerTrade: number;
  maxConcurrentPositions: number;
  maxTradesPerHour: number;
  maxConsecutiveLosses: number;
  dailyLossLimitPercent: number;

  // استراتيجية الخروج
  takeProfit1: number;
  takeProfit1Percent: number;
  takeProfit2: number;
  takeProfit2Percent: number;
  trailingStopActivation: number;
  trailingStopDistance: number;
  stopLossPercent: number;

  // Oracle
  chainlinkEthUsdAddress: string;

  // GoPlus
  goplusApiKey?: string;

  // Telegram
  telegramBotToken: string;
  telegramChatId: string;

  // Paper Trading
  paperTrading: boolean;

  // قاعدة البيانات
  dbPath: string;

  // تسجيل
  logLevel: string;
}

function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  if (required && !value) throw new Error(`Missing required environment variable: ${name}`);
  return value || '';
}

function getEnvNumber(name: string, required = true): number {
  const value = getEnvVar(name, required);
  return value ? parseFloat(value) : 0;
}

function getEnvBoolean(name: string, required = true): boolean {
  const value = getEnvVar(name, required);
  return value ? value === 'true' : false;
}

export const config: Config = {
  network: getEnvVar('NETWORK'),
  wnativeAddress: getEnvVar('WNATIVE_ADDRESS'),
  factoryAddress: getEnvVar('FACTORY_ADDRESS'),
  routerAddress: getEnvVar('ROUTER_ADDRESS'),
  rpcWsUrl: getEnvVar('RPC_WS_URL'),
  rpcHttpUrl: getEnvVar('RPC_HTTP_URL', false),
  chainId: getEnvNumber('CHAIN_ID'),
  privateKey: getEnvVar('PRIVATE_KEY'),
  walletAddress: getEnvVar('WALLET_ADDRESS', false),
  minLiquidityUsd: getEnvNumber('MIN_LIQUIDITY_USD'),
  maxSlippagePercent: getEnvNumber('MAX_SLIPPAGE_PERCENT'),
  gasPriceMultiplier: getEnvNumber('GAS_PRICE_MULTIPLIER'),
  gasLimit: getEnvNumber('GAS_LIMIT'),
  buyAmountNative: getEnvNumber('BUY_AMOUNT_NATIVE'),
  maxSellTax: getEnvNumber('MAX_SELL_TAX'),
  maxBuyTax: getEnvNumber('MAX_BUY_TAX'),
  checkHoneypot: getEnvBoolean('CHECK_HONEYPOT'),
  riskPerTrade: getEnvNumber('RISK_PER_TRADE'),
  maxConcurrentPositions: getEnvNumber('MAX_CONCURRENT_POSITIONS'),
  maxTradesPerHour: getEnvNumber('MAX_TRADES_PER_HOUR'),
  maxConsecutiveLosses: getEnvNumber('MAX_CONSECUTIVE_LOSSES'),
  dailyLossLimitPercent: getEnvNumber('DAILY_LOSS_LIMIT_PERCENT'),
  takeProfit1: getEnvNumber('TAKE_PROFIT_1'),
  takeProfit1Percent: getEnvNumber('TAKE_PROFIT_1_PERCENT'),
  takeProfit2: getEnvNumber('TAKE_PROFIT_2'),
  takeProfit2Percent: getEnvNumber('TAKE_PROFIT_2_PERCENT'),
  trailingStopActivation: getEnvNumber('TRAILING_STOP_ACTIVATION'),
  trailingStopDistance: getEnvNumber('TRAILING_STOP_DISTANCE'),
  stopLossPercent: getEnvNumber('STOP_LOSS_PERCENT'),
  chainlinkEthUsdAddress: getEnvVar('CHAINLINK_ETH_USD_ADDRESS'),
  goplusApiKey: getEnvVar('GOPLUS_API_KEY', false),
  telegramBotToken: getEnvVar('TELEGRAM_BOT_TOKEN'),
  telegramChatId: getEnvVar('TELEGRAM_CHAT_ID'),
  paperTrading: getEnvBoolean('PAPER_TRADING'),
  dbPath: getEnvVar('DB_PATH'),
  logLevel: getEnvVar('LOG_LEVEL'),
};

export function validateConfig() {
  // التحقق من المفتاح الخاص
  try {
    new ethers.Wallet(config.privateKey);
  } catch {
    throw new Error('Private key is invalid');
  }

  // تحقق بسيط من عناوين العقود (يمكن إضافة المزيد)
  if (!ethers.isAddress(config.wnativeAddress)) {
    throw new Error('WNATIVE_ADDRESS is not a valid address');
  }
                                    }
