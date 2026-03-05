import Database from 'better-sqlite3';
import { config } from '../config';
import { Position, TradeRecord } from '../types';
import { logger } from '../logger/logger';
import fs from 'fs';
import path from 'path';

let db: Database.Database;

export function initDatabase() {
  const dbDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(config.dbPath);

  // إنشاء الجداول إذا لم تكن موجودة
  db.exec(`
    CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tokenAddress TEXT NOT NULL,
      pairAddress TEXT NOT NULL,
      entryPrice REAL NOT NULL,
      amountIn TEXT NOT NULL,
      amountOut TEXT NOT NULL,
      entryTime INTEGER NOT NULL,
      status TEXT NOT NULL,
      remainingAmount TEXT NOT NULL,
      highestPrice REAL NOT NULL,
      soldPortions TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      positionId INTEGER,
      type TEXT NOT NULL,
      price REAL NOT NULL,
      amount TEXT NOT NULL,
      txHash TEXT,
      timestamp INTEGER NOT NULL,
      isPaper BOOLEAN NOT NULL DEFAULT 0,
      FOREIGN KEY(positionId) REFERENCES positions(id)
    );

    CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp);
    CREATE INDEX IF NOT EXISTS idx_trades_isPaper ON trades(isPaper);
  `);

  logger.info('✅ قاعدة البيانات جاهزة');
}

// ========== Positions ==========
export function savePosition(position: Omit<Position, 'id'>): number {
  const stmt = db.prepare(`
    INSERT INTO positions (tokenAddress, pairAddress, entryPrice, amountIn, amountOut, entryTime, status, remainingAmount, highestPrice, soldPortions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    position.tokenAddress,
    position.pairAddress,
    position.entryPrice,
    position.amountIn.toString(),
    position.amountOut.toString(),
    position.entryTime.getTime(),
    position.status,
    position.remainingAmount.toString(),
    position.highestPrice,
    JSON.stringify(position.soldPortions)
  );
  return result.lastInsertRowid as number;
}

export function getPosition(id: number): Position | null {
  const stmt = db.prepare('SELECT * FROM positions WHERE id = ?');
  const row = stmt.get(id);
  if (!row) return null;
  return mapRowToPosition(row);
}

export function getAllOpenPositions(): Position[] {
  const stmt = db.prepare("SELECT * FROM positions WHERE status = 'open' OR status = 'partial'");
  const rows = stmt.all();
  return rows.map(mapRowToPosition);
}

export function updatePosition(position: Position) {
  const stmt = db.prepare(`
    UPDATE positions SET
      status = ?,
      remainingAmount = ?,
      highestPrice = ?,
      soldPortions = ?
    WHERE id = ?
  `);
  stmt.run(
    position.status,
    position.remainingAmount.toString(),
    position.highestPrice,
    JSON.stringify(position.soldPortions),
    position.id
  );
}

export function getOpenPositionsCount(): number {
  const stmt = db.prepare("SELECT COUNT(*) as count FROM positions WHERE status = 'open' OR status = 'partial'");
  const row = stmt.get() as { count: number };
  return row.count;
}

// ========== Trades ==========
export function saveTrade(trade: Omit<TradeRecord, 'id'>): number {
  const stmt = db.prepare(`
    INSERT INTO trades (positionId, type, price, amount, txHash, timestamp, isPaper)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    trade.positionId,
    trade.type,
    trade.price,
    trade.amount.toString(),
    trade.txHash || null,
    trade.timestamp.getTime(),
    trade.isPaper ? 1 : 0
  );
  return result.lastInsertRowid as number;
}

export function getTradesLastHour(): number {
  const oneHourAgo = Date.now() - 3600000;
  const stmt = db.prepare('SELECT COUNT(*) as count FROM trades WHERE timestamp >= ? AND isPaper = 0');
  const row = stmt.get(oneHourAgo) as { count: number };
  return row.count;
}

export function getConsecutiveLosses(): number {
  // نحتاج إلى آخر الصفقات المغلقة (type = 'sell') التي كانت خاسرة
  // هذا يتطلب حساب pnl من position، سنبسطها الآن ونرجع 0
  // يمكن تطويرها لاحقاً
  return 0;
}

export function getTodayLossPercent(): number {
  // حساب إجمالي الخسائر اليوم مقسوماً على الرصيد
  // يحتاج إلى معرفة الرصيد الأولي، للتبسيط نرجع 0
  return 0;
}

// ========== Helpers ==========
function mapRowToPosition(row: any): Position {
  return {
    id: row.id,
    tokenAddress: row.tokenAddress,
    pairAddress: row.pairAddress,
    entryPrice: row.entryPrice,
    amountIn: BigInt(row.amountIn),
    amountOut: BigInt(row.amountOut),
    entryTime: new Date(row.entryTime),
    status: row.status,
    remainingAmount: BigInt(row.remainingAmount),
    highestPrice: row.highestPrice,
    soldPortions: JSON.parse(row.soldPortions),
  };
}
