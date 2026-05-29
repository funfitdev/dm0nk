import { render } from "@/utils/render.tsx";
import { getTheme } from "@/utils/cookie.tsx";
import { requireAuth } from "@/utils/auth.ts";
import {
  saveZerodhaToken,
  getCurrentToken,
} from "@/db/zerodha-tokens.ts";
import db from "@/db/index.ts";
import { instruments } from "@/db/schema.ts";
import { sql } from "drizzle-orm";
import * as ZerodhaView from "@/views/zerodha-view.tsx";

const KITE_LOGIN_URL = "https://kite.trade/connect/login";
const KITE_TOKEN_URL = "https://api.kite.trade/session/token";
const KITE_INSTRUMENTS_URL = "https://api.kite.trade/instruments";

// GET /zerodha/access-token — redirect to Zerodha login.
export async function start(req: Request) {
  const user = await requireAuth(req);
  if (user instanceof Response) return user;
  const theme = getTheme(req);
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return render(
      <ZerodhaView.CallbackError
        theme={theme}
        message="API_KEY is not set in the server environment."
      />,
    );
  }
  const url = `${KITE_LOGIN_URL}?v=3&api_key=${encodeURIComponent(apiKey)}`;
  return new Response(null, { status: 303, headers: { Location: url } });
}

// GET /zerodha/callback — exchange request_token for access_token.
export async function callback(req: Request) {
  const user = await requireAuth(req);
  if (user instanceof Response) return user;
  const theme = getTheme(req);
  const url = new URL(req.url);
  const requestToken = url.searchParams.get("request_token");
  const status = url.searchParams.get("status");

  if (status && status !== "success") {
    return render(
      <ZerodhaView.CallbackError
        theme={theme}
        message={`Zerodha reported status=${status}. The login was not completed.`}
      />,
    );
  }
  if (!requestToken) {
    return render(
      <ZerodhaView.CallbackError
        theme={theme}
        message="Missing request_token in the callback URL."
      />,
    );
  }

  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;
  if (!apiKey || !apiSecret) {
    return render(
      <ZerodhaView.CallbackError
        theme={theme}
        message="API_KEY / API_SECRET not configured on the server."
      />,
    );
  }

  const checksum = await sha256Hex(apiKey + requestToken + apiSecret);
  const body = new URLSearchParams({
    api_key: apiKey,
    request_token: requestToken,
    checksum,
  });

  let json: any;
  try {
    const res = await fetch(KITE_TOKEN_URL, {
      method: "POST",
      headers: {
        "X-Kite-Version": "3",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    json = await res.json();
  } catch (e) {
    return render(
      <ZerodhaView.CallbackError
        theme={theme}
        message={`Network error contacting Kite: ${(e as Error).message}`}
      />,
    );
  }

  if (json?.status !== "success" || !json?.data?.access_token) {
    const msg =
      json?.message ?? json?.error_type ?? "Unknown error from Kite.";
    return render(
      <ZerodhaView.CallbackError
        theme={theme}
        message={`Token exchange failed: ${msg}`}
      />,
    );
  }

  const data = json.data;
  const expiresAt = nextIstExpiry(new Date());

  const saved = await saveZerodhaToken({
    kite_user_id: data.user_id,
    user_name: data.user_name ?? null,
    user_shortname: data.user_shortname ?? null,
    email: data.email ?? null,
    broker: data.broker ?? null,
    access_token: data.access_token,
    public_token: data.public_token ?? null,
    refresh_token: data.refresh_token ?? null,
    enctoken: data.enctoken ?? null,
    login_time: data.login_time ? new Date(data.login_time) : null,
    expires_at: expiresAt,
    exchanges: data.exchanges ?? null,
    products: data.products ?? null,
    order_types: data.order_types ?? null,
    raw_response: data,
  });

  return render(<ZerodhaView.CallbackOk theme={theme} token={saved} />);
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(s),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Zerodha access tokens are valid until 06:00 IST the morning after issue.
// IST = UTC+5:30, so 06:00 IST = 00:30 UTC.
function nextIstExpiry(from: Date): Date {
  const result = new Date(from);
  result.setUTCHours(0, 30, 0, 0);
  if (result <= from) {
    result.setUTCDate(result.getUTCDate() + 1);
  }
  return result;
}

// POST /zerodha/instruments/sync — pull fresh instruments CSV from Kite,
// upsert into the instruments table. Replaces the day-trader filesystem
// .instruments.csv cache. Zerodha refreshes instrument data daily.
export async function syncInstruments(req: Request) {
  const user = await requireAuth(req);
  if (user instanceof Response) return user;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API_KEY not configured" }, { status: 500 });
  }

  const token = await getCurrentToken();
  if (!token) {
    return Response.json(
      { error: "No valid Zerodha access token. Visit /zerodha/access-token first." },
      { status: 412 },
    );
  }

  const t0 = Date.now();
  const res = await fetch(KITE_INSTRUMENTS_URL, {
    headers: {
      "X-Kite-Version": "3",
      Authorization: `token ${apiKey}:${token.access_token}`,
    },
  });
  if (!res.ok) {
    return Response.json(
      { error: `Kite responded ${res.status} ${res.statusText}` },
      { status: 502 },
    );
  }
  const csv = await res.text();
  const rows = parseInstrumentsCsv(csv);

  await db.transaction(async (tx) => {
    await tx.execute(sql`TRUNCATE TABLE instruments`);
    const cols = 12;
    const BATCH = Math.floor(65000 / cols);
    for (let i = 0; i < rows.length; i += BATCH) {
      await tx.insert(instruments).values(rows.slice(i, i + BATCH));
    }
  });

  return Response.json({
    ok: true,
    rows: rows.length,
    elapsed_ms: Date.now() - t0,
    synced_at: new Date().toISOString(),
  });
}

function parseInstrumentsCsv(csv: string): {
  instrument_token: number;
  exchange_token: number;
  tradingsymbol: string;
  name: string | null;
  last_price: number | null;
  expiry: string | null;
  strike: number | null;
  tick_size: number | null;
  lot_size: number | null;
  instrument_type: string | null;
  segment: string | null;
  exchange: string;
}[] {
  const lines = csv.split("\n");
  const header = lines[0]!.split(",");
  const idx = (col: string) => header.indexOf(col);
  const cTok = idx("instrument_token");
  const cExTok = idx("exchange_token");
  const cTsym = idx("tradingsymbol");
  const cName = idx("name");
  const cLast = idx("last_price");
  const cExp = idx("expiry");
  const cStr = idx("strike");
  const cTick = idx("tick_size");
  const cLot = idx("lot_size");
  const cType = idx("instrument_type");
  const cSeg = idx("segment");
  const cExch = idx("exchange");
  const out: ReturnType<typeof parseInstrumentsCsv> = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!;
    if (!line) continue;
    const cells = line.split(",");
    if (cells.length < header.length) continue;
    const numOrNull = (s: string) => (s === "" ? null : Number(s));
    const strOrNull = (s: string) => (s === "" ? null : s);
    out.push({
      instrument_token: Number(cells[cTok]),
      exchange_token: Number(cells[cExTok]),
      tradingsymbol: cells[cTsym]!,
      name: strOrNull(cells[cName] ?? ""),
      last_price: numOrNull(cells[cLast] ?? ""),
      expiry: strOrNull(cells[cExp] ?? ""),
      strike: numOrNull(cells[cStr] ?? ""),
      tick_size: numOrNull(cells[cTick] ?? ""),
      lot_size: numOrNull(cells[cLot] ?? "")
        ? Number(cells[cLot])
        : null,
      instrument_type: strOrNull(cells[cType] ?? ""),
      segment: strOrNull(cells[cSeg] ?? ""),
      exchange: cells[cExch]!,
    });
  }
  return out;
}
