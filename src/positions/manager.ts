import { Position } from '../types';
import {
  savePosition,
  updatePosition,
  getPosition,
  getAllOpenPositions,
  saveTrade,
} from '../db/database';
import { checkExitStrategies } from './strategies';
import { logger } from '../logger/logger';
import { ethers } from 'ethers';
import { config } from '../config';
import { executeSell } from '../trader/executor';
import { sendTelegram } from '../notifier/telegram';
import { getEthUsdPrice } from '../oracle/chainlink';
import { getRouter } from '../blockchain/contracts';

export async function addPosition(positionData: {
  tokenAddress: string;
  pairAddress: string;
  entryPrice: number;
  amountIn: bigint;
  amountOut: bigint;
  txHash?: string;
}): Promise<Position> {
  const position: Omit<Position, 'id'> = {
    tokenAddress: positionData.tokenAddress,
    pairAddress: positionData.pairAddress,
    entryPrice: positionData.entryPrice,
    amountIn: positionData.amountIn,
    amountOut: positionData.amountOut,
    entryTime: new Date(),
    status: 'open',
    remainingAmount: positionData.amountOut,
    highestPrice: positionData.entryPrice,
    soldPortions: [],
  };

  const id = await savePosition(position);
  await saveTrade({
    positionId: id,
    type: 'buy',
    price: positionData.entryPrice,
    amount: positionData.amountOut,
    txHash: positionData.txHash,
    timestamp: new Date(),
    isPaper: config.paperTrading,
  });

  return { id, ...position };
}

export async function updatePositionAfterSell(
  positionId: number,
  soldAmount: bigint,
  sellPrice: number,
  txHash?: string
) {
  const position = await getPosition(positionId);
  if (!position) return;

  const newRemaining = position.remainingAmount - soldAmount;
  const soldPortion = {
    price: sellPrice,
    amount: soldAmount,
    time: new Date(),
    txHash,
  };
  position.soldPortions.push(soldPortion);

  if (newRemaining <= 0n) {
    position.status = 'closed';
    position.remainingAmount = 0n;
  } else {
    position.remainingAmount = newRemaining;
    position.status = 'partial';
  }

  // تحديث أعلى سعر إذا كان السعر الحالي أعلى
  if (sellPrice > position.highestPrice) {
    position.highestPrice = sellPrice;
  }

  await updatePosition(position);
  await saveTrade({
    positionId,
    type: newRemaining <= 0n ? 'sell' : 'partial_sell',
    price: sellPrice,
    amount: soldAmount,
    txHash,
    timestamp: new Date(),
    isPaper: config.paperTrading,
  });

  logger.info(`📊 تم تحديث المركز ${positionId}: بقي ${ethers.formatEther(position.remainingAmount)} توكن`);
  await sendTelegram(
    `📊 *تحديث المركز #${positionId}*\n` +
    `تم بيع ${ethers.formatEther(soldAmount)} توكن بسعر ${sellPrice}\n` +
    `المتبقي: ${ethers.formatEther(position.remainingAmount)} توكن`
  );
}

// دالة لفحص جميع المراكز المفتوحة بشكل دوري
export async function monitorPositions(provider: ethers.Provider) {
  const openPositions = await getAllOpenPositions();
  if (openPositions.length === 0) return;

  // نحتاج إلى router
  const { router } = await import('../blockchain/contracts').then(m =>
    m.initContracts(provider)
  );

  for (const pos of openPositions) {
    try {
      // الحصول على السعر الحالي للتوكن (مقابل native)
      const currentPrice = await getCurrentPrice(pos.tokenAddress, router);
      if (currentPrice === null) continue;

      const shouldExit = checkExitStrategies(pos, currentPrice);
      if (shouldExit.sell) {
        const amountToSell = shouldExit.amountToSell;
        if (amountToSell > 0n) {
          const sellResult = await executeSell(
            pos.tokenAddress,
            amountToSell,
            provider,
            router
          );
          if (sellResult.success) {
            await updatePositionAfterSell(
              pos.id!,
              amountToSell,
              sellResult.price!,
              sellResult.txHash
            );
          }
        }
      }
    } catch (error) {
      logger.error(`خطأ في مراقبة المركز ${pos.id}: ${error}`);
    }
  }
}

async function getCurrentPrice(
  tokenAddress: string,
  router: ethers.Contract
): Promise<number | null> {
  try {
    const amountIn = ethers.parseEther('0.01'); // كمية صغيرة للاختبار
    const path = [tokenAddress, config.wnativeAddress];
    const amountsOut = await router.getAmountsOut(amountIn, path);
    // السعر = كمية native المستلمة / كمية token المباعة
    const price = Number(amountsOut[1]) / Number(amountIn);
    return price;
  } catch (error) {
    logger.debug(`لا يمكن الحصول على سعر التوكن ${tokenAddress}: ${error}`);
    return null;
  }
  }
