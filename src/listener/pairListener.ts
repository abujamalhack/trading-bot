import { ethers } from 'ethers';
import { config } from '../config';
import { logger } from '../logger/logger';
import { analyzePair } from '../analyzer';
import { canOpenPosition } from '../risk/manager';
import { executeBuy } from '../trader/executor';
import { addPosition } from '../positions/manager';
import { sendTelegram } from '../notifier/telegram';

export async function startListener(
  provider: ethers.WebSocketProvider,
  factory: ethers.Contract,
  router: ethers.Contract
): Promise<void> {
  logger.info('👂 بدء الاستماع لأحداث PairCreated...');

  factory.on('PairCreated', async (token0: string, token1: string, pairAddress: string, event: any) => {
    try {
      logger.info(`🚨 تم إنشاء زوج جديد: ${pairAddress}`);

      // تحديد التوكن الجديد (عادةً ما يكون غير WETH)
      const isToken0Weth = token0.toLowerCase() === config.wnativeAddress.toLowerCase();
      const isToken1Weth = token1.toLowerCase() === config.wnativeAddress.toLowerCase();

      if (!isToken0Weth && !isToken1Weth) {
        logger.debug('الزوج لا يحتوي على WETH، تجاهل.');
        return;
      }

      const tokenAddress = isToken0Weth ? token1 : token0;
      logger.info(`🎯 توكن مستهدف: ${tokenAddress}`);

      // تحليل السيولة والأمان
      const analysis = await analyzePair(tokenAddress, pairAddress, provider, router);
      if (!analysis) {
        logger.debug('فشل التحليل أو لم يستوفِ الشروط');
        return;
      }

      // التحقق من إدارة المخاطر
      const canOpen = await canOpenPosition(analysis);
      if (!canOpen.allowed) {
        logger.warn(`⛔ رفض فتح صفقة: ${canOpen.reason}`);
        return;
      }

      // تنفيذ الشراء
      const buyResult = await executeBuy(tokenAddress, router, provider);
      if (!buyResult.success) {
        logger.error(`❌ فشل الشراء: ${buyResult.error}`);
        await sendTelegram(`❌ *فشل شراء* التوكن ${tokenAddress}: ${buyResult.error}`);
        return;
      }

      logger.info(`✅ شراء ناجح! التجز: ${buyResult.txHash}`);

      // إضافة المركز إلى قاعدة البيانات
      const position = await addPosition({
        tokenAddress,
        pairAddress,
        entryPrice: buyResult.entryPrice!,
        amountIn: buyResult.amountIn!,
        amountOut: buyResult.amountOut!,
        txHash: buyResult.txHash,
      });

      logger.info(`💰 تم فتح مركز جديد برقم ${position.id}`);
      await sendTelegram(
        `💰 *مركز جديد مفتوح*\n` +
        `التوكن: \`${tokenAddress}\`\n` +
        `السعر: ${buyResult.entryPrice} native\n` +
        `المبلغ: ${ethers.formatEther(buyResult.amountOut!)} توكن\n` +
        `التجز: \`${buyResult.txHash}\``
      );
    } catch (error) {
      logger.error(`خطأ في معالجة حدث PairCreated: ${error}`);
    }
  });
}
