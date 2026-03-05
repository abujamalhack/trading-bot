import { ethers } from 'ethers';
import { config } from '../config';
import { logger } from '../logger/logger';
import { getAmountsOut, swapExactETHForTokens } from './swap';
import { simulateTrade } from './paper';
import { sendTelegram } from '../notifier/telegram';
import { getWallet } from '../blockchain/wallet';

export async function executeBuy(
  tokenAddress: string,
  router: ethers.Contract,
  provider: ethers.Provider
): Promise<{
  success: boolean;
  txHash?: string;
  amountIn?: bigint;
  amountOut?: bigint;
  entryPrice?: number;
  error?: string;
}> {
  try {
    const amountIn = ethers.parseEther(config.buyAmountNative.toString());
    const path = [config.wnativeAddress, tokenAddress];

    // تقدير الكمية الخارجة مع مراعاة الانزلاق
    const amountsOut = await getAmountsOut(router, amountIn, path);
    const amountOutMin = (amountsOut[1] * BigInt(100 - config.maxSlippagePercent)) / 100n;

    const deadline = Math.floor(Date.now() / 1000) + 60 * 5; // 5 دقائق

    logger.info(`🚀 تنفيذ شراء: ${config.buyAmountNative} native -> ${tokenAddress}`);

    // إذا كان Paper Trading مفعلاً، نحاكي العملية فقط
    if (config.paperTrading) {
      const simulated = await simulateTrade('buy', tokenAddress, amountIn, amountOutMin, path, deadline);
      if (simulated.success) {
        return {
          success: true,
          amountIn,
          amountOut: amountsOut[1],
          entryPrice: Number(amountIn) / Number(amountsOut[1]),
        };
      } else {
        return { success: false, error: 'Paper trade simulation failed' };
      }
    }

    // تنفيذ حقيقي
    const wallet = getWallet();
    const tx = await swapExactETHForTokens(router, amountIn, amountOutMin, path, deadline);

    logger.info(`⏳ انتظار تأكيد المعاملة: ${tx.hash}`);
    const receipt = await tx.wait();

    if (receipt?.status === 1) {
      logger.info(`✅ تأكيد في بلوك ${receipt.blockNumber}`);

      // حساب سعر الدخول (كمية native / كمية token)
      const amountOut = amountsOut[1]; // القيمة الفعلية قد تختلف قليلاً، لكنها تقريبية
      const entryPrice = Number(amountIn) / Number(amountOut);

      return {
        success: true,
        txHash: tx.hash,
        amountIn,
        amountOut,
        entryPrice,
      };
    } else {
      return { success: false, error: 'Transaction failed (status 0)' };
    }
  } catch (error: any) {
    logger.error(`❌ خطأ أثناء الشراء: ${error.message}`);
    return { success: false, error: error.message };
  }
}

export async function executeSell(
  tokenAddress: string,
  amountToSell: bigint,
  provider: ethers.Provider,
  router: ethers.Contract
): Promise<{
  success: boolean;
  txHash?: string;
  amountOut?: bigint;
  price?: number;
  error?: string;
}> {
  try {
    const path = [tokenAddress, config.wnativeAddress];
    const amountsOut = await getAmountsOut(router, amountToSell, path);
    const amountOutMin = (amountsOut[1] * BigInt(100 - config.maxSlippagePercent)) / 100n;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 5;

    logger.info(`🚀 تنفيذ بيع: ${ethers.formatEther(amountToSell)} توكن -> native`);

    if (config.paperTrading) {
      const simulated = await simulateTrade('sell', tokenAddress, amountToSell, amountOutMin, path, deadline);
      if (simulated.success) {
        return {
          success: true,
          amountOut: amountsOut[1],
          price: Number(amountsOut[1]) / Number(amountToSell),
        };
      } else {
        return { success: false, error: 'Paper trade simulation failed' };
      }
    }

    // تنفيذ حقيقي
    const wallet = getWallet();
    const tx = await swapExactTokensForETH(router, tokenAddress, amountToSell, amountOutMin, path, deadline);

    logger.info(`⏳ انتظار تأكيد البيع: ${tx.hash}`);
    const receipt = await tx.wait();

    if (receipt?.status === 1) {
      const price = Number(amountsOut[1]) / Number(amountToSell);
      return {
        success: true,
        txHash: tx.hash,
        amountOut: amountsOut[1],
        price,
      };
    } else {
      return { success: false, error: 'Sell transaction failed' };
    }
  } catch (error: any) {
    logger.error(`❌ خطأ أثناء البيع: ${error.message}`);
    return { success: false, error: error.message };
  }
      }
