import { ethers } from 'ethers';
import { config } from '../config';
import { logger } from '../logger/logger';
import { getWallet } from '../blockchain/wallet';
import { simulateTrade } from './paper';

export async function getAmountsOut(
  router: ethers.Contract,
  amountIn: bigint,
  path: string[]
): Promise<bigint[]> {
  return await router.getAmountsOut(amountIn, path);
}

export async function swapExactETHForTokens(
  router: ethers.Contract,
  amountIn: bigint,
  amountOutMin: bigint,
  path: string[],
  deadline: number
): Promise<ethers.TransactionResponse> {
  const wallet = getWallet();
  const tx = await router.swapExactETHForTokens(
    amountOutMin,
    path,
    wallet.address,
    deadline,
    {
      value: amountIn,
      gasLimit: config.gasLimit,
      gasPrice: await getOptimalGasPrice(wallet.provider),
    }
  );
  return tx;
}

export async function swapExactTokensForETH(
  router: ethers.Contract,
  tokenAddress: string,
  amountIn: bigint,
  amountOutMin: bigint,
  path: string[],
  deadline: number
): Promise<ethers.TransactionResponse> {
  const wallet = getWallet();
  // يجب الموافقة على إنفاق التوكن أولاً
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ['function approve(address spender, uint256 amount) external returns (bool)'],
    wallet
  );
  const approveTx = await tokenContract.approve(await router.getAddress(), amountIn);
  await approveTx.wait();

  const tx = await router.swapExactTokensForETH(
    amountIn,
    amountOutMin,
    path,
    wallet.address,
    deadline,
    {
      gasLimit: config.gasLimit,
      gasPrice: await getOptimalGasPrice(wallet.provider),
    }
  );
  return tx;
}

async function getOptimalGasPrice(provider: ethers.Provider): Promise<bigint> {
  const feeData = await provider.getFeeData();
  if (!feeData.gasPrice) throw new Error('Cannot get gas price');
  // تطبيق المضاعف
  const multiplier = Math.floor(config.gasPriceMultiplier * 100);
  return (feeData.gasPrice * BigInt(multiplier)) / 100n;
}
