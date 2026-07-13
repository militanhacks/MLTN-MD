const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, url, pushname } = context;

        if (!text) {
            return m.reply("🔮 *[SYSTEM NOTICE]*\n\nPlease supply a detailed operational report or anomaly message to pass to the Guild Masters.");
        }
        
        // Developer contacts
        const developerContacts = [
            '254713421283@s.whatsapp.net',
            '254748373318@s.whatsapp.net',
            '254768707399@s.whatsapp.net'
        ];

        await m.reply("🛡️ *[TRANSMITTING DISTRESS SIGNAL]*\n\nBypassing standard firewalls... Routing urgent report to the MILITAN command desk.");

        for (let contact of developerContacts) {
            let txt = `🚨 *[CRITICAL GUILD REPORT]* 🚨\n\n` +
                      `🀄 *ANOMALY DETAILS:* \`\`\`${text}\`\`\`\n\n` +
                      `👤 *REPORTED BY:* ${pushname}\n` +
                      `⚔️ *AUTHORITY STAMP:* MILITAN Core`;

            try {
                await client.sendMessage(contact, {
                    image: {
                        url: url
                    },
                    caption: txt
                });
            } catch (error) {
                console.error(`Failed sending to ${contact}:`, error);
            }
        }
        
        await m.reply("✅ *[TRANSMISSION COMPLETE]*\n\nThe report has been securely logged into the high-rank network database.");
    });
};