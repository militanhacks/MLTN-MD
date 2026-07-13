const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, sendReply } = context;

        try {
            // 7776000 seconds = 90 days
            await client.groupToggleEphemeral(m.chat, 7776000);
            
            const successMessage = `⏳ *[QUARTERLY ERA DECAY ENFORCED]* ⏳\n\n` +
                                   `The local instance data stream has been bound to an extended seasonal breakdown loop. All logs will dissolve after 90 days.\n\n` +
                                   `⏱️ *Time Horizon:* 90 Days (7,776,000s)\n` +
                                   `👑 *Overlord Stamp:* MILITAN Core Engine`;

            sendReply(client, m, successMessage);
            
        } catch (error) {
            console.error("Error enabling ephemeral messages:", error);
            sendReply(client, m, "💀 *[DECAY INITIALIZATION FAILED]*\n\nThe environmental matrix resisted the long-term disintegration code.");
        }
    });
};