const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, text, sendReply } = context;

        // Corrected property from reply_message to your framework's standard quoted object
        const description = text || m.quoted?.text;
        
        if (!description) {
            return sendReply(client, m, '🔮 *[SYSTEM NOTICE]*\n\nNo description payload detected. Provide text or quote a message to write to the Codex.');
        }

        try {
            // Push the update to WhatsApp's servers
            await client.groupUpdateDescription(m.chat, description);
            
            const successMessage = `📜 *[GUILD CODEX UPDATED]* 📜\n\n` +
                                   `The instance rules and description parameters have been successfully overwritten.\n\n` +
                                   `🖋️ *New Record:* "${description}"\n\n` +
                                   `👑 *Scribe Authority:* MILITAN Core Engine`;

            return sendReply(client, m, successMessage);
        } catch (error) {
            console.error('Error updating group description:', error);
            return sendReply(client, m, '💀 *[CODEX TAMPER ERROR]*\n\nFailed to overwrite the instance description. Ensure the payload doesn\'t exceed the character limit.');
        }
    });
};