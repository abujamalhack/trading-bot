import { ethers } from 'ethers';
import { config } from '../config';
import { logger } from '../logger/logger';
import { sendTelegram } from '../notifier/telegram';

// سجل لصفقات Paper
const paperTrades: any[] = [];

export async function simulateTrade(
  type: 'buy' | 'sell',
  tokenAddress: string,
  amount: bigint,
  amountOutMin: bigint,
  path: string[],
  deadline: number
): Promise<{ success: boolean }> {
  logger.info(`📝 [Paper] ${type === 'buy' ? 'شراء' : 'بيع'} محاكى للتوكن ${tokenAddress}`);
  
  // تسجيل الصفقة
  paperTrades.push({
    type,
    tokenAddress,
    amount: amount.toString(),
    amountOutMin: amountOutMin.toString(),
    path,
    deadline,
    time: new Date(),
  });

  // إرسال تنبيه Telegram (اختياري)
  await sendTelegram(
    `📝 *Paper Trade*\n` +
    `النوع: ${type === 'buy' ? 'شراء' : 'بيع'}\n` +
    `التوكن: \`${tokenAddress}\`\n` +
    `الكمية: ${ethers.formatEther(amount)} ${type === 'buy' ? 'native' : 'token'}`
  );

  return { success: true };
}
