import { ethers } from 'ethers';
import { config } from '../config';
import { logger } from '../logger/logger';
import { sendTelegram } from '../notifier/telegram';

let provider: ethers.WebSocketProvider | null = null;
let httpProvider: ethers.JsonRpcProvider | null = null;

export async function initProvider(): Promise<ethers.WebSocketProvider> {
  if (provider) return provider;

  try {
    provider = new ethers.WebSocketProvider(config.rpcWsUrl);

    // التحقق من الاتصال
    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(config.chainId)) {
      throw new Error(`Chain ID mismatch: expected ${config.chainId}, got ${network.chainId}`);
    }

    logger.info(`✅ متصل بالشبكة: ${config.network} (${config.chainId})`);
    await sendTelegram(`✅ متصل بالشبكة: *${config.network}*`);

    // إعادة الاتصال عند قطع الاتصال
    provider._websocket.on('close', async (code: number, reason: string) => {
      logger.warn(`⚠️ تم قطع اتصال WebSocket: ${reason} (${code}). محاولة إعادة الاتصال...`);
      await sendTelegram(`⚠️ *انقطع اتصال WebSocket*. جاري إعادة الاتصال...`);

      setTimeout(async () => {
        try {
          provider = null;
          await initProvider();
          logger.info('✅ تمت إعادة الاتصال بنجاح');
          await sendTelegram('✅ *تمت إعادة الاتصال* بنجاح.');
        } catch (e) {
          logger.error(`❌ فشل إعادة الاتصال: ${e}`);
          await sendTelegram(`❌ *فشل إعادة الاتصال*: ${e}`);
        }
      }, 5000);
    });

    provider._websocket.on('error', async (error: any) => {
      logger.error(`❌ خطأ في WebSocket: ${error}`);
      await sendTelegram(`❌ *خطأ في WebSocket*: ${error.message || error}`);
    });

    return provider;
  } catch (error) {
    logger.error(`❌ فشل الاتصال بـ WebSocket: ${error}`);
    await sendTelegram(`❌ *فشل الاتصال بالشبكة*: ${error}`);
    throw error;
  }
}

export function getProvider(): ethers.WebSocketProvider {
  if (!provider) throw new Error('Provider not initialized');
  return provider;
}

export function getHttpProvider(): ethers.JsonRpcProvider {
  if (!httpProvider && config.rpcHttpUrl) {
    httpProvider = new ethers.JsonRpcProvider(config.rpcHttpUrl);
  }
  if (!httpProvider) {
    // إذا لم يكن هناك HTTP URL، نستخدم WebSocket (لكن WebSocket قد لا يدعم بعض الاستعلامات)
    httpProvider = provider as unknown as ethers.JsonRpcProvider;
  }
  return httpProvider;
}
