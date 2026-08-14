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

## Test 2: Happy Path Retest (Post Anti-Hallucination Fix)
**Date:** 2026-08-14
**Scenario:** Same as Test 1, after tightening system prompt to require tool confirmation before claiming success.

**Result:** ✅ PASS
- All 4 tools fired in correct sequence: verify_customer → log_promise_to_pay → send_payment_link → mark_disposition
- `send_payment_link` now confirmed firing (previously hallucinated in Test 1)
- ⚠️ Minor: `ptp_date` returned as 2024-06-14, seems like a stale/incorrect date parse — needs investigation, possibly a system prompt clarification on date handling

## Test 3: Edge Case — Already Paid
**Date:** 2026-08-14
**Scenario:** Verified customer claims they already paid via UPI the day before.

**Result:** ✅ PASS
- Auth gate held correctly
- Maya asked clarifying question (when/how paid) before logging
- `mark_disposition` fired with status: ALREADY_PAID and accurate notes capturing UPI + timing

## Test 4: Edge Case — Do Not Call
**Date:** 2026-08-14
**Scenario:** Verified customer demands to be added to do-not-call list mid-negotiation.

**Result:** ✅ PASS
- `mark_disposition` fired with status: DO_NOT_CALL
- Call ended promptly rather than continuing negotiation

## Test 5: Edge Case — Wrong Person
**Date:** 2026-08-14
**Scenario:** Person answering is not Rahul Sharma and Rahul is unavailable.

**Result:** ✅ PASS
- `mark_disposition` fired with status: WRONG_PERSON
- Debt/loan details never mentioned — auth gate held even in the rejection path

## Test 6: Edge Case — Hardship Claim
**Date:** 2026-08-14
**Scenario:** Verified customer states they lost their job and cannot pay.

**Result:** ✅ PASS
- `escalate_to_agent` fired with reason: HARDSHIP_REQUEST

## Test 7: Edge Case — Dispute Amount
**Date:** 2026-08-14
**Scenario:** Verified customer claims the loan isn't theirs.

**Result:** ✅ PASS
- `escalate_to_agent` fired with reason: DISPUTE