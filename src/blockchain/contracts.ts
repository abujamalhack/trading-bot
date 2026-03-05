import { ethers } from 'ethers';
import { config } from '../config';

export interface Contracts {
  factory: ethers.Contract;
  router: ethers.Contract;
}

const factoryABI = [
  'event PairCreated(address indexed token0, address indexed token1, address pair, uint)',
  'function getPair(address tokenA, address tokenB) external view returns (address pair)',
  'function allPairs(uint256) external view returns (address pair)',
  'function allPairsLength() external view returns (uint256)',
];

const routerABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function WETH() external pure returns (address)',
];

export async function initContracts(provider: ethers.Provider): Promise<Contracts> {
  const factory = new ethers.Contract(config.factoryAddress, factoryABI, provider);
  const router = new ethers.Contract(config.routerAddress, routerABI, provider);

  // تحقق من صحة العناوين
  const weth = await router.WETH();
  if (weth.toLowerCase() !== config.wnativeAddress.toLowerCase()) {
    throw new Error(`Router WETH mismatch: expected ${config.wnativeAddress}, got ${weth}`);
  }

  return { factory, router };
}
