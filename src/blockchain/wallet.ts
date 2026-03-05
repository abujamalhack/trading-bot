import { ethers } from 'ethers';
import { config } from '../config';
import { getProvider } from './provider';

let wallet: ethers.Wallet | null = null;

export function getWallet(): ethers.Wallet {
  if (!wallet) {
    const provider = getProvider();
    wallet = new ethers.Wallet(config.privateKey, provider);
  }
  return wallet;
}
