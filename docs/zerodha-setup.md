# Zerodha Account & Kite Connect API Setup

Step-by-step guide to open a Zerodha trading account and obtain API credentials for automated day trading.

---

## Part 1: Open a Zerodha Trading + Demat Account

### Prerequisites (keep handy)

- **PAN card** (mandatory)
- **Aadhaar card** (linked to the mobile number you'll use — needed for eSign OTP)
- **Bank account details** — account number, IFSC, and a cancelled cheque OR recent bank statement (last 3 months)
- **Signature** on plain white paper (photo/scan)
- **Passport-size photo**
- **Income proof** — only required if you want to enable F&O / Currency / Commodity segments:
  - Latest 6-month bank statement, OR
  - Latest salary slip, OR
  - ITR acknowledgement, OR
  - Form 16, OR
  - Demat holding statement

### Steps

1. Go to [https://zerodha.com/open-account/](https://zerodha.com/open-account/).
2. Enter your **mobile number** → verify OTP.
3. Enter your **email** → verify OTP.
4. Pay the account opening fee:
   - ₹200 for equity (Demat + Trading)
   - ₹500 if adding Commodity (MCX)
5. Enter **PAN** and **date of birth** — Zerodha pulls KYC data from CVL/CAMS/NSDL.
6. Enter bank details (account number + IFSC).
7. Select segments you want:
   - **Equity (NSE/BSE)** — required for stocks
   - **F&O (NFO/BFO)** — required for futures & options (needs income proof)
   - **Currency (CDS/BCD)** — optional
   - **Commodity (MCX)** — optional
8. Upload documents:
   - PAN
   - Signature
   - Bank proof (cheque or statement)
   - Income proof (if F&O selected)
9. Complete **IPV (In-Person Verification)** — short selfie video reading an OTP.
10. **eSign** the application using Aadhaar OTP.
11. Submit.

### Timeline

- Account typically opens in **24–72 hours** after submission.
- You'll receive login credentials via email (Client ID + password).
- First login forces a password reset + TOTP (2FA) setup — install Google Authenticator or equivalent.

---

## Part 2: Subscribe to Kite Connect (Developer API)

Kite Connect is a **separate paid subscription** — a regular Zerodha account does NOT include API access.

### Pricing (as of 2026)

Zerodha uses a **credit-based model**:

- **Connect app**: ~₹2,000 for **500 credits / 30 days** — includes trading APIs, historical data, and WebSocket live quotes.
- **Personal (Free)**: trading APIs only, **no historical data, no WebSocket** → not suitable for day trading.
- **Publisher (Free)**: HTML/JS embed buttons only, no programmatic API access.
- Each API call consumes credits. 500/30 days is usually enough for personal intraday use; you can top up if needed.

### Steps

1. Go to [https://developers.kite.trade/](https://developers.kite.trade/).
2. Click **Sign up** or **Login** — use your Zerodha Kite credentials (Client ID + password + TOTP).
3. Once logged in, you land on the **My apps** dashboard.
4. Click **Create a new app**.
5. Fill in the app form:
   - **Type**: `Connect` (required for day trading — the Personal and Publisher tiers don't expose live market data or WebSockets)
   - **App name**: e.g. `day-trader`
   - **Zerodha Client ID**: your Kite login ID (e.g. `AB1234`)
   - **Redirect URL**: does **not** need to be a hosted/public web app. It just needs to be a URL you can observe after login. Options:
     - **Localhost** (simplest): `http://127.0.0.1:5000/callback` — run a tiny Flask server during login, or just read the `request_token` from the browser URL bar after Zerodha redirects (the error page from a non-running server still shows the full URL).
     - **Any URL you control**: e.g. a static GitHub Pages URL, even `https://example.com` — you'll just grab the token manually from the browser URL.
     - **A deployed web app**: only needed if other users will log in through your app (SaaS use case).
   - **Postback URL** (optional): webhook URL for order updates. Leave blank for personal use.
   - **Description**: short blurb (e.g. "Personal algo trading for intraday strategies").
6. Pay for the **Connect** tier (500 credits / 30 days).
7. On creation you receive:
   - **API Key** (public, used in URLs)
   - **API Secret** (private — store securely, never commit to git)

> Note: Historical data is **included** in the Connect tier — no separate subscription required.

---

## Part 3: Generate an Access Token (Daily Login Flow)

Kite Connect uses a **daily re-login model** — the `access_token` expires every day at **~6:00 AM IST**, and there's no refresh token. You must re-authenticate each trading day.

### Flow

1. Redirect the user (you) to:
   ```
   https://kite.zerodha.com/connect/login?api_key=YOUR_API_KEY&v=3
   ```
2. Log in with Zerodha credentials + TOTP.
3. Zerodha redirects back to your **Redirect URL** with a `request_token` query param:
   ```
   http://127.0.0.1:5000/callback?request_token=XXXXX&action=login&status=success
   ```
4. Exchange the `request_token` for an `access_token` by POSTing to `https://api.kite.trade/session/token` with:
   - `api_key`
   - `request_token`
   - `checksum` = SHA-256(api_key + request_token + api_secret)
5. Store the returned `access_token` — valid for the current trading day only.

### Example — Python

```bash
pip install kiteconnect
```

```python
from kiteconnect import KiteConnect

api_key = "your_api_key"
api_secret = "your_api_secret"

kite = KiteConnect(api_key=api_key)

# Step 1: print the login URL, open it in a browser, log in
print(kite.login_url())

# Step 2: after Zerodha redirects you, grab the request_token from the URL
request_token = "paste_request_token_here"

# Step 3: exchange it for an access_token
data = kite.generate_session(request_token, api_secret=api_secret)
access_token = data["access_token"]

# Step 4: set it on the client for subsequent calls
kite.set_access_token(access_token)

# Now you can query the API
print(kite.profile())
print(kite.margins())
```

### Automating the Daily Login

Since TOTP-based 2FA is mandatory, full automation requires storing the **TOTP secret** and generating the 6-digit code programmatically. Libraries like `pyotp` can do this. You'll need to:

1. When setting up TOTP in Zerodha, save the **base32 secret** (shown as a QR code) — not just scan it into Authenticator.
2. Use `pyotp.TOTP(secret).now()` to generate the current code at login time.
3. Script the login form submission + request_token extraction.

> ⚠️ Storing your TOTP secret on disk reduces 2FA security. Keep the machine hardened and the secret in an OS keychain or encrypted store — not in plaintext config files.

---

## Part 4: What You Can Do with the API

- Place / modify / cancel orders (regular, CO, AMO, GTT, Iceberg)
- Query holdings, positions, margins, order book, trade book
- Stream live quotes via **WebSocket** (up to 3,000 instruments per connection)
- Fetch historical OHLC candles (with the historical data add-on)
- Get instrument master dump (all tradable symbols + tokens)

### Rate Limits

- Orders: **10 requests/sec**
- Quote/LTP: **1 request/sec** per instrument batch
- Historical data: **3 requests/sec**
- WebSocket: **3,000 instruments / connection**
- Order modifications: **25 per order**
- Daily order cap: **2,000 MIS + 2,000 CO orders / account**

---

## Part 5: Regulatory & Compliance Notes

- **SEBI algo trading rules (tightened 2025):** retail algo users must register high-frequency or order-per-second strategies above a threshold with the exchange through the broker. Casual personal automation is currently in a grey area but may tighten further — check current SEBI circulars before scaling.
- **Order tagging:** Zerodha flags API-placed orders as algo orders to the exchange. This is automatic; no action required from you.
- **Broker liability:** you're responsible for every order placed via your API key. Guard the `api_secret` and `access_token` like passwords.

---

## Useful Links

- Kite Connect developer portal: [https://developers.kite.trade/](https://developers.kite.trade/)
- API documentation: [https://kite.trade/docs/connect/v3/](https://kite.trade/docs/connect/v3/)
- Python SDK: [https://github.com/zerodha/pykiteconnect](https://github.com/zerodha/pykiteconnect)
- Community forum: [https://kite.trade/forum/](https://kite.trade/forum/)
- Zerodha support: [https://support.zerodha.com/](https://support.zerodha.com/)
