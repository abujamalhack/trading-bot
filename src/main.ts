import 'dotenv/config';
import { logger } from './logger/logger';
import { initDatabase } from './db/database';
import { initProvider, getProvider } from './blockchain/provider';
import { initContracts } from './blockchain/contracts';
import { startListener } from './listener/pairListener';
import { monitorPositions } from './positions/manager';
import { config, validateConfig } from './config';
import { sendTelegram } from './notifier/telegram';

export async function startBot() {
  try {
    logger.info('🚀 بدء تشغيل نظام التداول الآلي...');
    await sendTelegram('🚀 *نظام التداول الآلي* قيد التشغيل الآن.');

    // تحقق من صحة الإعدادات
    validateConfig();
    logger.info('✅ تم التحقق من الإعدادات');

    // تهيئة قاعدة البيانات
    initDatabase();
    logger.info('✅ تم تهيئة قاعدة البيانات');

    // تهيئة مزود WebSocket والاتصال بالشبكة
    const provider = await initProvider();
    logger.info('✅ تم الاتصال بالشبكة عبر WebSocket');

    // تهيئة العقود (Factory, Router)
    const { factory, router } = await initContracts(provider);
    logger.info('✅ تم تهيئة العقود الذكية');

    // بدء الاستماع إلى الأحداث
    await startListener(provider, factory, router);

    // بدء مراقبة المراكز المفتوحة (كل 10 ثوانٍ)
    setInterval(async () => {
      try {
        await monitorPositions(getProvider());
      } catch (error) {
        logger.error(`خطأ في مراقبة المراكز: ${error}`);
      }
    }, 10000);

    logger.info('✅ البوت يعمل الآن...');
  } catch (error) {
    logger.error(`❌ فشل بدء التشغيل: ${error}`);
    await sendTelegram(`❌ *فشل بدء التشغيل*: ${error}`);
    process.exit(1);
  }
}
