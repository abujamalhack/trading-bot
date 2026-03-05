import fs from 'fs';
import path from 'path';
import { logger } from '../logger/logger';
import { getAllOpenPositions } from '../db/database';
import { config } from '../config';
import { sendTelegram } from '../notifier/telegram';

const PID_FILE = path.join(__dirname, '../../bot.pid');

export function stopBot() {
  if (fs.existsSync(PID_FILE)) {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'));
    try {
      process.kill(pid, 'SIGTERM');
      fs.unlinkSync(PID_FILE);
      logger.info('🛑 تم إيقاف البوت');
      sendTelegram('🛑 *تم إيقاف البوت*');
    } catch (err) {
      logger.error(`❌ فشل إيقاف البوت: ${err}`);
    }
  } else {
    logger.warn('⚠️ لا يوجد ملف PID، قد لا يكون البوت قيد التشغيل');
  }
}

export async function getStatus() {
  logger.info('📊 حالة البوت:');
  const positions = await getAllOpenPositions();
  logger.info(`عدد المراكز المفتوحة: ${positions.length}`);
  positions.forEach(p => {
    logger.info(`- ${p.tokenAddress} : متبقي ${p.remainingAmount.toString()} توكن`);
  });

  // إرسال الحالة إلى Telegram
  let msg = `📊 *حالة البوت*\n`;
  msg += `الشبكة: ${config.network}\n`;
  msg += `Paper Trading: ${config.paperTrading ? 'مفعل' : 'معطل'}\n`;
  msg += `المراكز المفتوحة: ${positions.length}\n`;
  positions.forEach(p => {
    msg += `- \`${p.tokenAddress.slice(0, 6)}...\`: متبقي ${p.remainingAmount.toString()} توكن\n`;
  });
  await sendTelegram(msg);
}

export function setPaperTrading(mode: 'on' | 'off') {
  const newValue = mode === 'on';
  // سنقوم بتحديث ملف .env أو متغير البيئة
  // للتبسيط، نحدث config.paperTrading مباشرة (لكنه لن يستمر بعد إعادة التشغيل)
  config.paperTrading = newValue;
  logger.info(`📝 Paper Trading الآن ${newValue ? 'مفعل' : 'معطل'}`);
  sendTelegram(`📝 *Paper Trading* الآن ${newValue ? 'مفعل' : 'معطل'}`);
}

export function setNetwork(network: 'base' | 'arbitrum' | 'polygon') {
  // تحديث network في config (مؤقت)
  config.network = network;
  logger.info(`🌐 تم تغيير الشبكة إلى ${network}`);
  sendTelegram(`🌐 *تم تغيير الشبكة* إلى ${network}`);
}
