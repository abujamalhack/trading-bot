import { ethers } from 'ethers';
import { config } from '../config';
import { logger } from '../logger/logger';
import { getEthUsdPrice } from '../oracle/chainlink';

const pairABI = [
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
];

export async function getLiquidityInUSD(
  pairAddress: string,
  provider: ethers.Provider
): Promise<number | null> {
  try {
    const pairContract = new ethers.Contract(pairAddress, pairABI, provider);
    const [token0, token1, reserves] = await Promise.all([
      pairContract.token0(),
      pairContract.token1(),
      pairContract.getReserves(),
    ]);

    // الحصول على سعر ETH/USD الحي من Chainlink
    const ethPriceUSD = await getEthUsdPrice();
    if (!ethPriceUSD) {
      logger.warn('⚠️ لا يمكن الحصول على سعر ETH من Oracle');
      return null;
    }

    // تحديد أي reserve يخص WETH
    const isToken0Weth = token0.toLowerCase() === config.wnativeAddress.toLowerCase();
    const isToken1Weth = token1.toLowerCase() === config.wnativeAddress.toLowerCase();

    if (!isToken0Weth && !isToken1Weth) return null;

    const wethReserve = isToken0Weth ? reserves.reserve0 : reserves.reserve1;
    const wethReserveNum = Number(ethers.formatEther(wethReserve));

    // السيولة بالدولار = reserve WETH * 2 (لأن الزوج متوازن) * سعر ETH
    const liquidityUSD = wethReserveNum * 2 * ethPriceUSD;

    logger.debug(`سيولة الزوج ${pairAddress}: $${liquidityUSD.toFixed(2)}`);
    return liquidityUSD;
  } catch (error) {
    logger.error(`فشل حساب السيولة: ${error}`);
    return null;
  }
}
