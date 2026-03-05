import { config } from '../config';

export function checkBasicSecurity(security: any): { safe: boolean; reason?: string } {
  // فحص honeypot
  if (security.is_honeypot === '1') {
    return { safe: false, reason: 'Honeypot detected (cannot sell)' };
  }

  // فحص الضرائب
  const buyTax = parseFloat(security.buy_tax || '0');
  const sellTax = parseFloat(security.sell_tax || '0');
  if (buyTax > config.maxBuyTax || sellTax > config.maxSellTax) {
    return { safe: false, reason: `High taxes: buy ${buyTax}% / sell ${sellTax}%` };
  }

  // فحص الملكية والـ mint
  if (security.owner_change_balance === '1') {
    return { safe: false, reason: 'Owner can mint or change balance' };
  }

  // فحص الـ proxy (اختياري)
  if (security.is_proxy === '1') {
    // يمكن أن يكون proxy مقبولاً أحياناً، لكن نحذّر
    // return { safe: false, reason: 'Proxy contract, potentially risky' };
  }

  return { safe: true };
}
