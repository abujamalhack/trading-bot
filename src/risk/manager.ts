import { config } from '../config';
import { logger } from '../logger/logger';
import {
  getOpenPositionsCount,
  getTradesLastHour,
  getConsecutiveLosses,
  getTodayLossPercent,
  recordTrade,
} from '../db/database';
import { sendTelegram } from '../notifier/telegram';

export async function canOpenPosition(analysis: any): Promise<{ allowed: boolean; reason: string }> {
  // 1. عدد المراكز المفتوحة
  const openCount = await getOpenPositionsCount();
  if (openCount >= config.maxConcurrentPositions) {
    return { allowed: false, reason: `الحد الأقصى للمراكز المفتوحة: ${config.maxConcurrentPositions}` };
  }

  // 2. عدد الصفقات في الساعة
  const tradesLastHour = await getTradesLastHour();
  if (tradesLastHour >= config.maxTradesPerHour) {
    return { allowed: false, reason: `تجاوز الحد الأقصى للصفقات في الساعة: ${config.maxTradesPerHour}` };
  }

  // 3. الخسائر المتتالية
  const consecutiveLosses = await getConsecutiveLosses();
  if (consecutiveLosses >= config.maxConsecutiveLosses) {
    return { allowed: false, reason: `تجاوز عدد الخسائر المتتالية: ${config.maxConsecutiveLosses}` };
  }

  // 4. حد الخسارة اليومي
  const todayLossPercent = await getTodayLossPercent();
  if (todayLossPercent >= config.dailyLossLimitPercent) {
    return { allowed: false, reason: `تجاوز حد الخسارة اليومي: ${todayLossPercent}%` };
  }

  return { allowed: true, reason: 'OK' };
}

export async function updateRiskAfterTrade(positionId: number, type: 'buy' | 'sell' | 'partial_sell', pnl?: number) {
  if (type === 'sell' || type === 'partial_sell') {
    if (pnl && pnl < 0) {
      // خسارة
      await recordTrade({ positionId, type, price: 0, amount: 0n, timestamp: new Date(), isPaper: config.paperTrading });
      // يمكن تحديث الخسائر المتتالية هنا
    } else if (pnl && pnl > 0) {
      // ربح - إعادة تعيين الخسائر المتتالية
      // سيتم التعامل معه في دالة منفصلة
    }
  }
}
