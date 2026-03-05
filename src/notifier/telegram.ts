import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';
import { logger } from '../logger/logger';

let bot: TelegramBot | null = null;

if (config.telegramBotToken && config.telegramChatId) {
  bot = new TelegramBot(config.telegramBotToken, { polling: false });
} else {
  logger.warn('⚠️ لم يتم تعيين Telegram Bot Token أو Chat ID، التنبيهات معطلة');
}

export async function sendTelegram(message: string): Promise<void> {
  if (!bot || !config.telegramChatId) return;

  try {
    await bot.sendMessage(config.telegramChatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    logger.error(`❌ فشل إرسال رسالة Telegram: ${error}`);
  }
}
