#!/usr/bin/env bun
// One-shot importer: copies day-trader/.monitor.db + knowledge/*.md → Postgres.
// Run with:
//   bun scripts/import-day-trader.ts
// DATABASE_URL must point at the destination DB. Migrations are applied first.

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { readdir, readFile } from "node:fs/promises";
import {
  monitorSessions,
  config,
  watchRules,
  polls,
  positionSnapshots,
  actions,
  trades,
  dailySummary,
  wouldHaveTaken,
  tapeSnapshots,
  knowledgeEntries,
} from "../src/db/schema.ts";

const SOURCE_DB =
  process.env.DAY_TRADER_DB ??
  "/Users/funfitdev/workspace/day-trader/.monitor.db";
const KNOWLEDGE_DIR =
  process.env.DAY_TRADER_KNOWLEDGE ??
  "/Users/funfitdev/workspace/day-trader/knowledge";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

console.log(`Source SQLite:    ${SOURCE_DB}`);
console.log(`Source knowledge: ${KNOWLEDGE_DIR}`);
console.log(`Target Postgres:  ${url.replace(/:[^:@]+@/, ":***@")}`);

const sqlite = new Database(SOURCE_DB, { readonly: true });
const pgClient = postgres(url);
const db = drizzle(pgClient);

console.log("Applying migrations...");
await migrate(db, { migrationsFolder: "./drizzle" });

// Parse SQLite ISO strings (no TZ) as IST → Date.
// Day-trader writes datetime.now().isoformat() in IST.
function parseIstTs(s: string | null | undefined): Date | null {
  if (!s) return null;
  if (/[Z+]/.test(s)) return new Date(s);
  return new Date(s.replace(" ", "T") + "+05:30");
}

const bool = (v: number | null | undefined): boolean | null =>
  v == null ? null : v === 1;

// PG bind-param limit is 65534. Pick the largest batch that stays under it.
const PG_PARAM_LIMIT = 65000;
async function batchInsert<T extends Record<string, unknown>>(
  table: unknown,
  rows: T[],
  name: string,
) {
  if (rows.length === 0) {
    console.log(`  ${name}: 0`);
    return;
  }
  const cols = Object.keys(rows[0]!).length;
  const batch = Math.max(1, Math.floor(PG_PARAM_LIMIT / cols));
  for (let i = 0; i < rows.length; i += batch) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(table as any).values(rows.slice(i, i + batch));
  }
  console.log(`  ${name}: ${rows.length}`);
}

// 1. monitor_sessions (renamed from sessions)
console.log("Importing tables:");
{
  const rows = sqlite
    .query("SELECT id, started_at, ended_at FROM sessions ORDER BY id")
    .all() as { id: number; started_at: string; ended_at: string | null }[];
  await batchInsert(
    monitorSessions,
    rows.map((r) => ({
      id: r.id,
      started_at: parseIstTs(r.started_at)!,
      ended_at: parseIstTs(r.ended_at),
    })),
    "monitor_sessions",
  );
}

// 2. config
{
  const rows = sqlite
    .query("SELECT key, value, updated_at FROM config")
    .all() as { key: string; value: string; updated_at: string }[];
  await batchInsert(
    config,
    rows.map((r) => ({
      key: r.key,
      value: r.value,
      updated_at: parseIstTs(r.updated_at)!,
    })),
    "config",
  );
}

// 3. watch_rules
{
  const rows = sqlite.query("SELECT * FROM watch_rules ORDER BY id").all() as any[];
  await batchInsert(
    watchRules,
    rows.map((r) => ({
      id: r.id,
      symbol: r.symbol,
      exchange: r.exchange,
      sl_pct: r.sl_pct,
      tp_pct: r.tp_pct,
      sl_price: r.sl_price,
      tp_price: r.tp_price,
      status: r.status,
      notes: r.notes,
      created_at: parseIstTs(r.created_at)!,
      updated_at: parseIstTs(r.updated_at)!,
      entry_ts: parseIstTs(r.entry_ts),
      peak_ltp: r.peak_ltp,
      be_armed: bool(r.be_armed)!,
      time_stop_min: r.time_stop_min,
      giveback_pct: r.giveback_pct,
      auto_manage: bool(r.auto_manage)!,
      sl_mode: r.sl_mode,
    })),
    "watch_rules",
  );
}

// 4. polls (~160K)
{
  const rows = sqlite.query("SELECT * FROM polls ORDER BY id").all() as any[];
  await batchInsert(
    polls,
    rows.map((r) => ({
      id: r.id,
      session_id: r.session_id,
      ts: parseIstTs(r.ts)!,
      total_pnl: r.total_pnl,
      n_positions: r.n_positions,
    })),
    "polls",
  );
}

// 5. position_snapshots (~6K)
{
  const rows = sqlite
    .query("SELECT * FROM position_snapshots ORDER BY id")
    .all() as any[];
  await batchInsert(
    positionSnapshots,
    rows.map((r) => ({
      id: r.id,
      poll_id: r.poll_id,
      ts: parseIstTs(r.ts)!,
      symbol: r.symbol,
      exchange: r.exchange,
      side: r.side,
      qty: r.qty,
      avg_price: r.avg_price,
      ltp: r.ltp,
      pnl_rs: r.pnl_rs,
      pnl_pct: r.pnl_pct,
      flag: r.flag,
      rule_id: r.rule_id,
    })),
    "position_snapshots",
  );
}

// 6. actions (~46K)
{
  const rows = sqlite.query("SELECT * FROM actions ORDER BY id").all() as any[];
  await batchInsert(
    actions,
    rows.map((r) => ({
      id: r.id,
      session_id: r.session_id,
      ts: parseIstTs(r.ts)!,
      action_type: r.action_type,
      symbol: r.symbol,
      exchange: r.exchange,
      qty: r.qty,
      side: r.side,
      order_id: r.order_id,
      error: r.error,
      pnl_rs: r.pnl_rs,
      pnl_pct: r.pnl_pct,
      day_pnl: r.day_pnl,
      rule_id: r.rule_id,
    })),
    "actions",
  );
}

// 7. trades
{
  const rows = sqlite.query("SELECT * FROM trades ORDER BY id").all() as any[];
  await batchInsert(
    trades,
    rows.map((r) => ({
      id: r.id,
      date: r.date,
      symbol: r.symbol,
      exchange: r.exchange,
      side: r.side,
      setup_tag: r.setup_tag,
      buy_ts: parseIstTs(r.buy_ts)!,
      buy_price: r.buy_price,
      buy_qty: r.buy_qty,
      buy_value: r.buy_value,
      buy_order_id: r.buy_order_id,
      sell_ts: parseIstTs(r.sell_ts)!,
      sell_price: r.sell_price,
      sell_qty: r.sell_qty,
      sell_value: r.sell_value,
      sell_order_id: r.sell_order_id,
      gross_pnl: r.gross_pnl,
      brokerage: r.brokerage,
      stt: r.stt,
      txn_charges: r.txn_charges,
      sebi_charges: r.sebi_charges,
      stamp_duty: r.stamp_duty,
      gst: r.gst,
      total_charges: r.total_charges,
      net_pnl: r.net_pnl,
      held_min: r.held_min,
      sl_initial: r.sl_initial,
      tp_initial: r.tp_initial,
      sl_final: r.sl_final,
      peak_ltp: r.peak_ltp,
      risk_initial: r.risk_initial,
      realized_r: r.realized_r,
      exit_reason: r.exit_reason,
      rule_id: r.rule_id,
      notes: r.notes,
      created_at: parseIstTs(r.created_at)!,
    })),
    "trades",
  );
}

// 8. daily_summary
{
  const rows = sqlite.query("SELECT * FROM daily_summary").all() as any[];
  await batchInsert(
    dailySummary,
    rows.map((r) => ({
      date: r.date,
      n_trades: r.n_trades,
      n_wins: r.n_wins,
      n_losses: r.n_losses,
      gross_pnl: r.gross_pnl,
      total_charges: r.total_charges,
      net_pnl: r.net_pnl,
      win_rate: r.win_rate,
      avg_win: r.avg_win,
      avg_loss: r.avg_loss,
      largest_win: r.largest_win,
      largest_loss: r.largest_loss,
      notes: r.notes,
      updated_at: parseIstTs(r.updated_at),
    })),
    "daily_summary",
  );
}

// 9. would_have_taken
{
  const rows = sqlite
    .query("SELECT * FROM would_have_taken ORDER BY id")
    .all() as any[];
  await batchInsert(
    wouldHaveTaken,
    rows.map((r) => ({
      id: r.id,
      date: r.date,
      ts: parseIstTs(r.ts)!,
      symbol: r.symbol,
      exchange: r.exchange,
      setup: r.setup,
      side: r.side,
      entry: r.entry,
      sl: r.sl,
      tp: r.tp,
      qty: r.qty,
      reject_reason: r.reject_reason,
      reject_detail: r.reject_detail,
      is_in_universe: bool(r.is_in_universe)!,
      is_sector_leader: bool(r.is_sector_leader),
      sector_index: r.sector_index,
      sector_chg_pct: r.sector_chg_pct,
      nifty_chg_pct: r.nifty_chg_pct,
      vix_value: r.vix_value,
      sess_high_after: r.sess_high_after,
      sess_low_after: r.sess_low_after,
      eod_close: r.eod_close,
      hit_tp: bool(r.hit_tp),
      hit_sl: bool(r.hit_sl),
      hyp_net_pnl: r.hyp_net_pnl,
      backfilled_at: parseIstTs(r.backfilled_at),
      notes: r.notes,
    })),
    "would_have_taken",
  );
}

// 10. tape_snapshots
{
  const rows = sqlite
    .query("SELECT * FROM tape_snapshots ORDER BY id")
    .all() as any[];
  await batchInsert(
    tapeSnapshots,
    rows.map((r) => ({
      id: r.id,
      ts: parseIstTs(r.ts)!,
      symbol: r.symbol,
      ltp: r.ltp,
      day_open: r.day_open,
      day_high: r.day_high,
      day_low: r.day_low,
      prev_close: r.prev_close,
      pct_change: r.pct_change,
      volume: r.volume,
      note: r.note,
    })),
    "tape_snapshots",
  );
}

// 11. knowledge_entries (knowledge/*.md)
{
  const files = await readdir(KNOWLEDGE_DIR);
  let n = 0;
  for (const file of files) {
    const m = file.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
    if (!m) continue;
    const content = await readFile(`${KNOWLEDGE_DIR}/${file}`, "utf8");
    await db
      .insert(knowledgeEntries)
      .values({ date: m[1], content })
      .onConflictDoNothing();
    n++;
  }
  console.log(`  knowledge_entries: ${n}`);
}

// Bump sequences so future identity inserts continue past the imported IDs.
const seqs: [string, string][] = [
  ["trader_sessions", "trader_sessions_id_seq"],
  ["trader_watch_rules", "trader_watch_rules_id_seq"],
  ["trader_polls", "trader_polls_id_seq"],
  ["trader_position_snapshots", "trader_position_snapshots_id_seq"],
  ["trader_actions", "trader_actions_id_seq"],
  ["trader_trades", "trader_trades_id_seq"],
  ["trader_would_have_taken", "trader_would_have_taken_id_seq"],
  ["trader_tape_snapshots", "trader_tape_snapshots_id_seq"],
];
for (const [tbl, seq] of seqs) {
  await pgClient.unsafe(
    `SELECT setval('${seq}', COALESCE((SELECT MAX(id) FROM ${tbl}), 1))`,
  );
}
console.log("sequences advanced past imported max(id)");

await pgClient.end();
sqlite.close();
console.log("done");
