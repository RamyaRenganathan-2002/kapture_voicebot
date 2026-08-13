require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const callLogs = [];

app.post('/webhook', (req, res) => {
    const { message } = req.body;

    if (message && message.type === 'tool-calls') {
        const toolCall = message.toolCalls[0];
        const { name, arguments: args } = toolCall.function;
        const callId = toolCall.id;

        console.log(`[Tool Call]: ${name}`, args);

        let result = {};

        switch (name) {
            case 'verify_customer':
                // Mock check: accept last-4 PAN "1234" or DOB year "1995"
                if (args.verification_code === '1234' || args.verification_code === '1995') {
                    result = { verified: true, message: 'Identity verified successfully.' };
                } else {
                    result = { verified: false, message: 'Verification failed. Incorrect code.' };
                }
                break;

            case 'log_promise_to_pay':
                result = {
                    success: true,
                    ptp_id: `PTP-${Math.floor(1000 + Math.random() * 9000)}`,
                    confirmed_date: args.ptp_date,
                    amount: args.amount
                };
                break;

            case 'send_payment_link':
                result = {
                    success: true,
                    message: `Payment link sent via ${args.channel} to registered number.`
                };
                break;

            case 'escalate_to_agent':
                result = {
                    success: true,
                    escalation_id: `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
                    reason: args.reason
                };
                break;

            case 'mark_disposition':
                result = {
                    success: true,
                    disposition_logged: args.status,
                    timestamp: new Date().toISOString()
                };
                break;

            default:
                result = { success: false, message: 'Unknown function call' };
        }

        callLogs.push({ name, args, result, ts: new Date().toISOString() });

        return res.status(200).json({
            results: [
                {
                    toolCallId: callId,
                    result: JSON.stringify(result)
                }
            ]
        });
    }

    // Non tool-call events (call-start, call-end, transcript, etc.) — just ack
    return res.status(200).json({ status: 'acknowledged' });
});

// Handy debug endpoint to see what's been logged during testing
app.get('/logs', (req, res) => {
    res.json(callLogs);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Kapture Mock Collections Webhook Server running on port ${PORT}`);
});