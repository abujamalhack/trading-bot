import axios from 'axios';
import { config } from '../config';
import { logger } from '../logger/logger';

export interface GoPlusResponse {
  code: number;
  message: string;
  result: {
    [tokenAddress: string]: {
      token_name: string;
      token_symbol: string;
      owner_address: string;
      owner_change_balance?: string; // يمكن أن تشير إلى إمكانية mint
      is_honeypot: string; // '1' if true
      sell_tax: string;
      buy_tax: string;
      cannot_sell_all?: string;
      slippage_modifiable?: string;
      is_anti_whale?: string;
      is_blacklisted?: string;
      is_whitelisted?: string;
      is_in_dex?: string;
      dex_liquidity?: string;
      is_proxy?: string;
    };
  };
}

export async function fetchTokenSecurity(tokenAddress: string): Promise<any | null> {
  try {
    const url = `https://api.gopluslabs.io/api/v1/token_security/${config.chainId}?contract_addresses=${tokenAddress}`;
    const response = await axios.get<GoPlusResponse>(url, {
      headers: config.goplusApiKey ? { 'Authorization': config.goplusApiKey } : {},
      timeout: 10000,
    });

    if (response.data.code !== 1) {
      logger.warn(`⚠️ GoPlus API returned error: ${response.data.message}`);
      return null;
    }

    const result = response.data.result[tokenAddress.toLowerCase()];
    if (!result) return null;

    return result;
  } catch (error) {
    logger.error(`❌ فشل الاتصال بـ GoPlus API: ${error}`);
    return null;
  }
}
