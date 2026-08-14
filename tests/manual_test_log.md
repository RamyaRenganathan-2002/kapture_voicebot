# Manual Test Log — Maya Voicebot

## Test 1: Happy Path (Promise to Pay)
**Date:** 2026-08-14
**Scenario:** Standard verified customer agrees to pay by a future date.

**Result:** ✅ PASS
- Auth gate held — no debt mentioned before `verify_customer` succeeded
- Debt disclosed correctly after verification (₹8,499, 12 days overdue)
- `log_promise_to_pay` fired successfully (PTP date: 21 Aug 2026)
- ⚠️ `send_payment_link` — need to confirm this actually fired in server logs, Maya claimed it sent but not confirmed in transcript

**Notes:** Clean conversation flow, natural tone, correct closing.