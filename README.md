# Kapture Collections Voicebot — "Maya"

An outbound AI voice agent for Kapture Finance that calls customers with overdue loan EMIs, verifies their identity, discloses the debt, negotiates a resolution, and logs the outcome — built on **Vapi.ai** with a **Node.js/Express** mock backend.

---

## 📁 Project Structure

```text
kapture-voicebot/
├── README.md
├── docs/
│   └── hld_document.md       # Architecture, state machine, tools, compliance, metrics
├── mock-server/
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── tests/
│   └── manual_test_log.md    # Full transcripts for all 9 tested scenarios
└── vapi/
    ├── system_prompt.txt
    └── tool_definitions.json
```

---

## 🛠️ Tech Stack

| Layer | Component / Technology | Configuration / Description |
|---|---|---|
| **Voice Orchestration** | [Vapi.ai](https://vapi.ai) | Call flow management & webhook dispatcher |
| **LLM** | GPT-4o-mini | Temperature: `0.1` |
| **Speech-to-Text (STT)** | Deepgram Nova-2 | High-accuracy transcription |
| **Text-to-Speech (TTS)** | ElevenLabs Flash v2.5 | Low-latency voice synthesis |
| **Mock Webhook Backend** | Node.js + Express | Local API server handling tool callbacks |
| **Tunneling** | ngrok | Public HTTP tunnel exposing `http://localhost:3000` |

> 📖 **Architecture & Design Details:** Rationale and deep-dive specifications are documented in [`docs/hld_document.md`](docs/hld_document.md#1-architecture--pipeline).

---

## 🚀 Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd kapture-voicebot
   ```

2. **Install backend dependencies & start server:**
   ```bash
   cd mock-server
   npm install
   node server.js
   ```

3. **Expose the mock backend via ngrok (in a separate terminal):**
   ```bash
   ngrok http 3000
   ```

4. **Configure Vapi Assistant:**
   - Create an assistant in the Vapi dashboard using [`vapi/system_prompt.txt`](vapi/system_prompt.txt).
   - Register the 5 tools from [`vapi/tool_definitions.json`](vapi/tool_definitions.json).
   - Point each tool's **Server URL** to `<your-ngrok-url>/webhook`.

5. **Test the Bot:**
   - Trigger test calls directly via Vapi's built-in web call feature or telephone endpoint.

---

## 🐛 What Broke & How I Debugged It

Full details available in [`docs/hld_document.md`](docs/hld_document.md) (Section 6.3) and test logs:

1. **PowerShell + `curl` Escaping:** Early manual tests failed due to PowerShell alias quirks — switched to `Invoke-RestMethod` for API testing.
2. **404 on Tool-Call Webhook:** Vapi tool requests failed because server endpoints were missing the `/webhook` path suffix on the ngrok base URL.
3. **Hallucinated Tool Actions:** Maya claimed a payment link was sent before `send_payment_link` actually executed. Resolved by enforcing prompt constraints requiring confirmed tool return payloads.
4. **Silence Timeout Discrepancy:** Vapi terminates silent calls at the platform level before prompt re-prompt rules engage. Documented as a platform-level constraint.

---

## ✅ Test Coverage

* **8 Manual Scenarios Tested** against live Vapi assistant + mock Express webhook:
  * **8 Full Passes**
* **Detailed Logs:** Full transcripts and test matrix located in [`tests/manual_test_log.md`](tests/manual_test_log.md).

---

## 🔮 What I'd Improve With More Time

- Adjust Vapi platform silence-timeout parameters to allow system prompt re-prompt logic to handle silent calls gracefully.
- Add real bilingual (English / Hindi) support and code-switching capabilities.
- Implement PII masking / anonymization middleware in the backend logger.
- Replace in-memory mock logs with a persistent database (e.g. PostgreSQL or MongoDB).
- Build an automated evaluation suite to benchmark conversation success rates.
