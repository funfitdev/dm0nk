import {
  pgTable,
  text,
  integer,
  bigint,
  uuid,
  boolean,
  doublePrecision,
  timestamp,
  date,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ============================================================================
// auth_* — authentication / user management
// ============================================================================

export const users = pgTable("auth_users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("auth_sessions", {
  id: uuid("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
});

// ============================================================================
// cms_* — content management
// ============================================================================

export const posts = pgTable("cms_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull().default(""),
  published: boolean("published").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const postMeta = pgTable(
  "cms_post_meta",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    post_id: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    meta_key: text("meta_key").notNull(),
    meta_value: text("meta_value").notNull().default(""),
  },
  (table) => [
    uniqueIndex("cms_post_meta_post_id_meta_key_unique").on(
      table.post_id,
      table.meta_key,
    ),
  ],
);

// ============================================================================
// kite_* — Zerodha Kite Connect broker API state
// ============================================================================

export const zerodhaTokens = pgTable("kite_tokens", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  kite_user_id: text("kite_user_id").notNull(),
  user_name: text("user_name"),
  user_shortname: text("user_shortname"),
  email: text("email"),
  broker: text("broker"),
  access_token: text("access_token").notNull(),
  public_token: text("public_token"),
  refresh_token: text("refresh_token"),
  enctoken: text("enctoken"),
  login_time: timestamp("login_time", { withTimezone: true }),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  exchanges: text("exchanges").array(),
  products: text("products").array(),
  order_types: text("order_types").array(),
  raw_response: jsonb("raw_response"),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const instruments = pgTable(
  "kite_instruments",
  {
    instrument_token: bigint("instrument_token", { mode: "number" }).primaryKey(),
    exchange_token: bigint("exchange_token", { mode: "number" }).notNull(),
    tradingsymbol: text("tradingsymbol").notNull(),
    name: text("name"),
    last_price: doublePrecision("last_price"),
    expiry: date("expiry"),
    strike: doublePrecision("strike"),
    tick_size: doublePrecision("tick_size"),
    lot_size: integer("lot_size"),
    instrument_type: text("instrument_type"),
    segment: text("segment"),
    exchange: text("exchange").notNull(),
    synced_at: timestamp("synced_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_kite_instruments_tsym").on(t.tradingsymbol),
    index("idx_kite_instruments_exch").on(t.exchange),
  ],
);

// ============================================================================
// trader_* — autonomous trading agent data (migrated from day-trader)
// ============================================================================

export const monitorSessions = pgTable("trader_sessions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  started_at: timestamp("started_at", { withTimezone: true }).notNull(),
  ended_at: timestamp("ended_at", { withTimezone: true }),
});

export const config = pgTable("trader_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const watchRules = pgTable(
  "trader_watch_rules",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    symbol: text("symbol").notNull(),
    exchange: text("exchange").notNull().default("NSE"),
    sl_pct: doublePrecision("sl_pct"),
    tp_pct: doublePrecision("tp_pct"),
    sl_price: doublePrecision("sl_price"),
    tp_price: doublePrecision("tp_price"),
    status: text("status").notNull().default("active"),
    notes: text("notes"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull(),
    entry_ts: timestamp("entry_ts", { withTimezone: true }),
    peak_ltp: doublePrecision("peak_ltp"),
    be_armed: boolean("be_armed").notNull().default(false),
    time_stop_min: integer("time_stop_min").notNull().default(30),
    giveback_pct: doublePrecision("giveback_pct").notNull().default(50.0),
    auto_manage: boolean("auto_manage").notNull().default(true),
    sl_mode: text("sl_mode").notNull().default("ltp"),
  },
  (t) => [
    index("idx_trader_watch_rules_active").on(t.symbol, t.exchange, t.status),
  ],
);

export const polls = pgTable(
  "trader_polls",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    session_id: integer("session_id")
      .notNull()
      .references(() => monitorSessions.id),
    ts: timestamp("ts", { withTimezone: true }).notNull(),
    total_pnl: doublePrecision("total_pnl").notNull(),
    n_positions: integer("n_positions").notNull(),
  },
  (t) => [index("idx_trader_polls_ts").on(t.ts)],
);

export const positionSnapshots = pgTable(
  "trader_position_snapshots",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    poll_id: integer("poll_id")
      .notNull()
      .references(() => polls.id),
    ts: timestamp("ts", { withTimezone: true }).notNull(),
    symbol: text("symbol").notNull(),
    exchange: text("exchange").notNull(),
    side: text("side").notNull(),
    qty: integer("qty").notNull(),
    avg_price: doublePrecision("avg_price").notNull(),
    ltp: doublePrecision("ltp").notNull(),
    pnl_rs: doublePrecision("pnl_rs").notNull(),
    pnl_pct: doublePrecision("pnl_pct").notNull(),
    flag: text("flag"),
    rule_id: integer("rule_id").references(() => watchRules.id),
  },
  (t) => [
    index("idx_trader_position_snapshots_ts").on(t.ts),
    index("idx_trader_position_snapshots_sym").on(t.symbol),
  ],
);

export const actions = pgTable(
  "trader_actions",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    session_id: integer("session_id")
      .notNull()
      .references(() => monitorSessions.id),
    ts: timestamp("ts", { withTimezone: true }).notNull(),
    action_type: text("action_type").notNull(),
    symbol: text("symbol"),
    exchange: text("exchange"),
    qty: integer("qty"),
    side: text("side"),
    order_id: text("order_id"),
    error: text("error"),
    pnl_rs: doublePrecision("pnl_rs"),
    pnl_pct: doublePrecision("pnl_pct"),
    day_pnl: doublePrecision("day_pnl"),
    rule_id: integer("rule_id").references(() => watchRules.id),
  },
  (t) => [index("idx_trader_actions_ts").on(t.ts)],
);

export const trades = pgTable(
  "trader_trades",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    date: date("date").notNull(),
    symbol: text("symbol").notNull(),
    exchange: text("exchange").notNull(),
    side: text("side").notNull(),
    setup_tag: text("setup_tag"),
    buy_ts: timestamp("buy_ts", { withTimezone: true }).notNull(),
    buy_price: doublePrecision("buy_price").notNull(),
    buy_qty: integer("buy_qty").notNull(),
    buy_value: doublePrecision("buy_value").notNull(),
    buy_order_id: text("buy_order_id"),
    sell_ts: timestamp("sell_ts", { withTimezone: true }).notNull(),
    sell_price: doublePrecision("sell_price").notNull(),
    sell_qty: integer("sell_qty").notNull(),
    sell_value: doublePrecision("sell_value").notNull(),
    sell_order_id: text("sell_order_id"),
    gross_pnl: doublePrecision("gross_pnl").notNull(),
    brokerage: doublePrecision("brokerage").notNull(),
    stt: doublePrecision("stt").notNull(),
    txn_charges: doublePrecision("txn_charges").notNull(),
    sebi_charges: doublePrecision("sebi_charges").notNull(),
    stamp_duty: doublePrecision("stamp_duty").notNull(),
    gst: doublePrecision("gst").notNull(),
    total_charges: doublePrecision("total_charges").notNull(),
    net_pnl: doublePrecision("net_pnl").notNull(),
    held_min: doublePrecision("held_min").notNull(),
    sl_initial: doublePrecision("sl_initial"),
    tp_initial: doublePrecision("tp_initial"),
    sl_final: doublePrecision("sl_final"),
    peak_ltp: doublePrecision("peak_ltp"),
    risk_initial: doublePrecision("risk_initial"),
    realized_r: doublePrecision("realized_r"),
    exit_reason: text("exit_reason"),
    rule_id: integer("rule_id").references(() => watchRules.id),
    notes: text("notes"),
    created_at: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (t) => [
    index("idx_trader_trades_date").on(t.date),
    index("idx_trader_trades_symbol").on(t.symbol),
  ],
);

export const dailySummary = pgTable("trader_daily_summary", {
  date: date("date").primaryKey(),
  n_trades: integer("n_trades").notNull().default(0),
  n_wins: integer("n_wins").notNull().default(0),
  n_losses: integer("n_losses").notNull().default(0),
  gross_pnl: doublePrecision("gross_pnl").notNull().default(0),
  total_charges: doublePrecision("total_charges").notNull().default(0),
  net_pnl: doublePrecision("net_pnl").notNull().default(0),
  win_rate: doublePrecision("win_rate"),
  avg_win: doublePrecision("avg_win"),
  avg_loss: doublePrecision("avg_loss"),
  largest_win: doublePrecision("largest_win"),
  largest_loss: doublePrecision("largest_loss"),
  notes: text("notes"),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

export const wouldHaveTaken = pgTable(
  "trader_would_have_taken",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    date: date("date").notNull(),
    ts: timestamp("ts", { withTimezone: true }).notNull(),
    symbol: text("symbol").notNull(),
    exchange: text("exchange").notNull().default("NSE"),
    setup: text("setup").notNull(),
    side: text("side").notNull(),
    entry: doublePrecision("entry").notNull(),
    sl: doublePrecision("sl").notNull(),
    tp: doublePrecision("tp").notNull(),
    qty: integer("qty").notNull(),
    reject_reason: text("reject_reason").notNull(),
    reject_detail: text("reject_detail"),
    is_in_universe: boolean("is_in_universe").notNull().default(true),
    is_sector_leader: boolean("is_sector_leader"),
    sector_index: text("sector_index"),
    sector_chg_pct: doublePrecision("sector_chg_pct"),
    nifty_chg_pct: doublePrecision("nifty_chg_pct"),
    vix_value: doublePrecision("vix_value"),
    sess_high_after: doublePrecision("sess_high_after"),
    sess_low_after: doublePrecision("sess_low_after"),
    eod_close: doublePrecision("eod_close"),
    hit_tp: boolean("hit_tp"),
    hit_sl: boolean("hit_sl"),
    hyp_net_pnl: doublePrecision("hyp_net_pnl"),
    backfilled_at: timestamp("backfilled_at", { withTimezone: true }),
    notes: text("notes"),
  },
  (t) => [
    index("idx_trader_would_have_taken_date").on(t.date),
    index("idx_trader_would_have_taken_symbol").on(t.symbol),
    index("idx_trader_would_have_taken_setup").on(t.setup),
    index("idx_trader_would_have_taken_reason").on(t.reject_reason),
  ],
);

export const tapeSnapshots = pgTable(
  "trader_tape_snapshots",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    ts: timestamp("ts", { withTimezone: true }).notNull(),
    symbol: text("symbol").notNull(),
    ltp: doublePrecision("ltp").notNull(),
    day_open: doublePrecision("day_open"),
    day_high: doublePrecision("day_high"),
    day_low: doublePrecision("day_low"),
    prev_close: doublePrecision("prev_close"),
    pct_change: doublePrecision("pct_change"),
    volume: bigint("volume", { mode: "number" }),
    note: text("note"),
  },
  (t) => [
    index("idx_trader_tape_snapshots_ts").on(t.ts),
    index("idx_trader_tape_snapshots_sym").on(t.symbol, t.ts),
  ],
);

export const knowledgeEntries = pgTable("trader_knowledge_entries", {
  date: date("date").primaryKey(),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
