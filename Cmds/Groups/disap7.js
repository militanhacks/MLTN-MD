const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, sendReply } = context;

        try {
            // 604800 seconds = 7 days
            await client.groupToggleEphemeral(m.chat, 604800);
            
            const successMessage = `⏳ *[WEEKLY DECAY ENFORCED]* ⏳\n\n` +
                                   `The local instance data stream has been bound to a cyclical decay loop. All logs will disintegrate after one week.\n\n` +
                                   `⏱️ *Time Horizon:* 7 Days (604,800s)\n` +
                                   `👑 *Overlord Stamp:* MILITAN Core Engine`;

            sendReply(client, m, successMessage);
            
        } catch (error) {
            console.error("Error enabling ephemeral messages:", error);
            sendReply(client, m, "💀 *[DECAY INITIALIZATION FAILED]*\n\nThe environmental matrix resisted the week-long disintegration code.");
        }
    });
};