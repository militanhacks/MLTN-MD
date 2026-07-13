const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, sendReply } = context;

        try {
            // 86400 seconds = 24 hours
            await client.groupToggleEphemeral(m.chat, 86400);
            
            const successMessage = `⏳ *[VOID DECAY ENFORCED]* ⏳\n\n` +
                                   `The local instance data stream has been destabilized. All upcoming messages will automatically decompose.\n\n` +
                                   `⏱️ *Time Horizon:* 24 Hours (86,400s)\n` +
                                   `👑 *Overlord Stamp:* MILITAN Core Engine`;

            sendReply(client, m, successMessage);
            
        } catch (error) {
            console.error("Error enabling ephemeral messages:", error);
            sendReply(client, m, "💀 *[DECAY INITIALIZATION FAILED]*\n\nThe environmental matrix resisted the disintegration code. Check chat parameters.");
        }
    });
};