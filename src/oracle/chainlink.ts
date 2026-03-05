import { ethers } from 'ethers';
import { config } from '../config';
import { getHttpProvider } from '../blockchain/provider';
import { logger } from '../logger/logger';

const aggregatorABI = [
  'function latestAnswer() external view returns (int256)',
  'function decimals() external view returns (uint8)',
];

let priceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 60 ثانية

export async function getEthUsdPrice(): Promise<number | null> {
  // التحقق من وجود cached price حديث
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
    return priceCache.price;
  }

  try {
    const provider = getHttpProvider();
    const aggregator = new ethers.Contract(config.chainlinkEthUsdAddress, aggregatorABI, provider);

    const [answer, decimals] = await Promise.all([
      aggregator.latestAnswer(),
      aggregator.decimals(),
    ]);

    const price = Number(answer) / 10 ** decimals;
    priceCache = { price, timestamp: Date.now() };
    logger.debug(`سعر ETH/USD من Oracle: $${price}`);
    return price;
  } catch (error) {
    logger.error(`❌ فشل جلب السعر من Chainlink: ${error}`);
    return null;
  }
}
