const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, text, sendReply } = context;

        // Clean up and validate country code input
        const countryCode = text?.trim().replace('+', '');
        if (!countryCode || isNaN(countryCode)) {
            return sendReply(client, m, '🔮 *[SYSTEM NOTICE]*\n\nSpecify the target country code prefix.\n\n✨ *Example:* .kickcode 254');
        }

        // Retrieve group metadata and participants
        const metadata = await client.groupMetadata(m.chat);
        const participants = metadata.participants;

        // Filter participants based on country code and exclude admins
        const toKick = participants.filter(participant => 
            participant.id.startsWith(`${countryCode}`) && !participant.admin
        ).map(participant => participant.id);

        // Handle case where no matching participants are found
        if (toKick.length === 0) {
            return sendReply(client, m, `🔮 *[PURGE RADAR]*\n\nNo non-admin members found matching the prefix (+${countryCode}) inside this Guild zone.`);
        }

        await sendReply(client, m, `⚡ *[PURGE SEQUENCE INITIALIZED]*\n\nTargeting ${toKick.length} entities with prefix (+${countryCode}). Executing system displacement...`);

        // Kick the filtered participants
        for (const jid of toKick) {
            try {
                await client.groupParticipantsUpdate(m.chat, [jid], 'remove');
                // Clean individual log message
                await sendReply(client, m, `⚔️ *[EXTERMINATED]:* @${jid.split('@')[0]}`, { mentions: [jid] });
                await delay(2000); // Anti-ban rate limit delay
            } catch (err) {
                console.error(`Failed to purge ${jid}:`, err);
            }
        }

        // Send clear completion message after kicking members
        const finalMessage = `👑 *[SYSTEM PURGE COMPLETE]* 👑\n\n` +
                             `All targeted entities (+${countryCode}) have been thoroughly cleared from the instance.\n\n` +
                             `🛡️ *Enforcer Authority:* MILITAN Operational Command`;

        await sendReply(client, m, finalMessage);
    });
};

// Helper function for delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}