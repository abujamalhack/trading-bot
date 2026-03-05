import { Position } from '../types';
import { config } from '../config';
import { ethers } from 'ethers';

export function checkExitStrategies(
  position: Position,
  currentPrice: number
): { sell: boolean; amountToSell: bigint; reason?: string } {
  // حساب نسبة الربح/الخسارة
  const profitPercent = (currentPrice - position.entryPrice) / position.entryPrice;

  // وقف الخسارة الثابت
  if (profitPercent <= -config.stopLossPercent) {
    return { sell: true, amountToSell: position.remainingAmount, reason: 'stop loss' };
  }

  // خروج جزئي عند 25% (إذا لم يتم بيع أي جزء بعد)
  if (profitPercent >= config.takeProfit1 && position.soldPortions.length === 0) {
    // بيع النسبة المحددة من الكمية الأصلية
    const sellAmount = (position.amountOut * BigInt(Math.floor(config.takeProfit1Percent * 100))) / 100n;
    return { sell: true, amountToSell: sellAmount, reason: 'take profit 1' };
  }

  // خروج جزئي عند 50% (إذا تم بيع الجزء الأول فقط)
  if (profitPercent >= config.takeProfit2 && position.soldPortions.length === 1) {
    const sellAmount = (position.amountOut * BigInt(Math.floor(config.takeProfit2Percent * 100))) / 100n;
    return { sell: true, amountToSell: sellAmount, reason: 'take profit 2' };
  }

  // Trailing stop للكمية المتبقية بعد تفعيل الشرط
  if (profitPercent >= config.trailingStopActivation) {
    // إذا كان السعر الحالي أعلى من أعلى سعر سابق، نحدّث أعلى سعر
    if (currentPrice > position.highestPrice) {
      position.highestPrice = currentPrice;
    }
    // إذا هبط السعر من أعلى سعر بأكثر من المسافة المسموحة، نبيع الكمية المتبقية
    const dropFromPeak = (position.highestPrice - currentPrice) / position.highestPrice;
    if (dropFromPeak >= config.trailingStopDistance) {
      return { sell: true, amountToSell: position.remainingAmount, reason: 'trailing stop' };
    }
  }

  return { sell: false, amountToSell: 0n };
}
