const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, sendReply } = context;

        try {
            // 0 turns off disappearing messages completely
            await client.groupToggleEphemeral(m.chat, 0);
            
            const successMessage = `⏳ *[TIMELINE ANCHORED]* ⏳\n\n` +
                                   `The system has stabilized the local data stream. Disappearing messages are now completely disabled.\n\n` +
                                   `📜 *Status:* Permanent Record Active\n` +
                                   `👑 *Authority:* MILITAN Core Engine`;

            sendReply(client, m, successMessage);
            
        } catch (error) {
            console.error("Error disabling ephemeral messages:", error);
            sendReply(client, m, "💀 *[TIMELINE ALTERATION FAILED]*\n\nThe temporal frequency of this chat could not be stabilized. Verify bot permissions.");
        }
    });
};