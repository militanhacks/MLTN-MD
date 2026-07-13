const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, sendReply } = context;

        // Extract target user cleanly from either a mention or a quoted message
        let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;

        if (!user) {
            return sendReply(client, m, "🔮 *[SYSTEM NOTICE]*\n\nTarget not designated. You must tag or quote a user to strip their authority.");
        }

        // Owner protection core line
        if (user === "254713421283@s.whatsapp.net") {
            return sendReply(client, m, "🛡️ *[REJECTION]*\n\nImmunity active. The System cannot strip the authority of the True Monarch **MILITAN**!");
        }

        try {
            // Execute the administrative demotion action on WhatsApp
            await client.groupParticipantsUpdate(m.chat, [user], 'demote'); 

            const successMessage = `⚔️ *[RANK STRIPPED]* ⚔️\n\n` +
                                   `Entity @${user.split('@')[0]} has been stripped of their authority tokens.\n\n` +
                                   `📉 *Current Status:* Regular Hunter\n` +
                                   `👑 *Enforced By:* MILITAN Core`;

            // Sent with clean formatting and an active mention tag
            await client.sendMessage(m.chat, { 
                text: successMessage, 
                mentions: [user] 
            }, { quoted: m });

        } catch (error) {
            console.error("Error demoting user:", error);
            sendReply(client, m, "💀 *[EXECUTION EXCEPTION]*\n\nThe target's mana signature resisted the rank modification protocol.");
        }
    });
};