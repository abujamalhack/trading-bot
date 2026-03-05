import { ethers } from 'ethers';
import { config } from '../config';

export interface Contracts {
  factory: ethers.Contract;
  router: ethers.Contract;
}

// ABI للـ Factory
const factoryABI = [
  'event PairCreated(address indexed token0, address indexed token1, address pair, uint)',
  'function getPair(address tokenA, address tokenB) external view returns (address pair)',
  'function allPairs(uint256) external view returns (address pair)',
  'function allPairsLength() external view returns (uint256)',
];

// ABI للـ Router
const routerABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function WETH() external pure returns (address)',
];

// متغيرات مؤقتة لتخزين العقود بعد التهيئة (للاستخدام في getRouter)
let cachedFactory: ethers.Contract | null = null;
let cachedRouter: ethers.Contract | null = null;

/**
 * تهيئة عقود الـ Factory والـ Router والتحقق من صحتها.
 * @param provider - مزود الاتصال بالشبكة (WebSocket أو HTTP)
 * @returns كائن يحتوي على factory و router
 */
export async function initContracts(provider: ethers.Provider): Promise<Contracts> {
  const factory = new ethers.Contract(config.factoryAddress, factoryABI, provider);
  const router = new ethers.Contract(config.routerAddress, routerABI, provider);

  // تحقق من صحة العناوين: التأكد من أن WETH في الـ router يطابق wnativeAddress في الإعدادات
  const weth = await router.WETH();
  if (weth.toLowerCase() !== config.wnativeAddress.toLowerCase()) {
    throw new Error(`Router WETH mismatch: expected ${config.wnativeAddress}, got ${weth}`);
  }

  // تخزين العقود في الذاكرة المؤقتة
  cachedFactory = factory;
  cachedRouter = router;

  return { factory, router };
}

/**
 * الحصول على كائن الـ Router (بعد التهيئة). إذا لم يتم تهيئته بعد، يتم تهيئته أولاً.
 * @param provider - مزود الاتصال بالشبكة (مطلوب فقط إذا لم يتم التهيئة مسبقاً)
 * @returns عقد الـ Router
 */
export async function getRouter(provider: ethers.Provider): Promise<ethers.Contract> {
  if (!cachedRouter) {
    await initContracts(provider);
  }
  if (!cachedRouter) {
    throw new Error('Failed to initialize router');
  }
  return cachedRouter;
}

/**
 * الحصول على كائن الـ Factory (بعد التهيئة).
 * @param provider - مزود الاتصال بالشبكة (مطلوب فقط إذا لم يتم التهيئة مسبقاً)
 * @returns عقد الـ Factory
 */
export async function getFactory(provider: ethers.Provider): Promise<ethers.Contract> {
  if (!cachedFactory) {
    await initContracts(provider);
  }
  if (!cachedFactory) {
    throw new Error('Failed to initialize factory');
  }
  return cachedFactory;
}
