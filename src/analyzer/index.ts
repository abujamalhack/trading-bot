import { ethers } from 'ethers';
import { config } from '../config';
import { logger } from '../logger/logger';
import { fetchTokenSecurity } from './goplus';
import { getLiquidityInUSD } from './liquidity';
import { checkBasicSecurity } from './security';

export async function analyzePair(
  tokenAddress: string,
  pairAddress: string,
  provider: ethers.Provider,
  router: ethers.Contract
): Promise<{
  tokenAddress: string;
  pairAddress: string;
  liquidityUSD: number;
  security: any;
} | null> {
  try {
    // 1. التحقق من السيولة
    const liquidityUSD = await getLiquidityInUSD(pairAddress, provider);
    if (!liquidityUSD || liquidityUSD < config.minLiquidityUsd) {
      logger.debug(`سيولة غير كافية: $${liquidityUSD || 0} < $${config.minLiquidityUsd}`);
      return null;
    }

    // 2. التحقق من الأمان عبر GoPlus
    let security = null;
    if (config.checkHoneypot) {
      security = await fetchTokenSecurity(tokenAddress);
      if (!security) {
        logger.warn(`لا توجد بيانات أمان من GoPlus للتوكن ${tokenAddress}`);
        // يمكن السماح بالمرور مع تحذير، أو الرفض حسب الإعدادات
      } else {
        const basicCheck = checkBasicSecurity(security);
        if (!basicCheck.safe) {
          logger.warn(`⚠️ فشل فحص الأمان: ${basicCheck.reason}`);
          return null;
        }
      }
    }

    return {
      tokenAddress,
      pairAddress,
      liquidityUSD,
      security,
    };
  } catch (error) {
    logger.error(`خطأ في تحليل الزوج: ${error}`);
    return null;
  }
}
