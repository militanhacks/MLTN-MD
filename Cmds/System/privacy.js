const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    // Pass execution control cleanly into the secure owner validation gate
    await ownerMiddleware(context, async () => {
        const { client, m } = context;

        try {
            // Trigger processing signal reaction icon
            await client.sendMessage(m.chat, { react: { text: '🛡️', key: m.key } });

            // Decode the bot's current active JID identity path
            const myselfJid = await client.decodeJid(client.user.id);
            
            // Query the official WhatsApp server layer for active account visibility parameters
            const privacyData = await client.fetchPrivacySettings(true).catch(err => {
                console.error("Failed to query privacy matrix records:", err);
                return null;
            });

            if (!privacyData) {
                return m.reply("❌ *[GATEWAY REJECTION]*\n\nWhatsApp servers refused or timed out the query transaction request for privacy settings data arrays.");
            }

            const {
                readreceipts,
                profile,
                status,
                online,
                last,
                groupadd,
                calladd
            } = privacyData;

            // Clean parsing normalization utility
            const normalize = (val) => val ? String(val).toUpperCase() : 'UNKNOWN';

            // Build premium master status dashboard text layout
            const settingsCaption = `🛡️ *[𝗠𝗜𝗟𝗜𝗧𝗔𝗡  𝗣𝗥𝗜𝗩𝗔𝗖𝗬  𝗠𝗔𝗧𝗥𝗜𝗫]* 🛡️\n\n` +
                                    `👤 *Identity Name:* ${client.user.name || 'MILITAN Terminal'}\n` +
                                    `🌐 *Online Vis:* \`${normalize(online)}\`\n` +
                                    `🖼️ *Profile Vis:* \`${normalize(profile)}\`\n` +
                                    `⏳ *Last Seen Vis:* \`${normalize(last)}\`\n` +
                                    `👁️ *Read Receipts:* \`${normalize(readreceipts)}\`\n` +
                                    `👥 *Group Add Permissions:* \`${normalize(groupadd)}\`\n` +
                                    `📝 *Status Story Vis:* \`${normalize(status)}\`\n` +
                                    `📞 *Call Constraints:* \`${normalize(calladd)}\`\n\n` +
                                    `👑 *Security Engine:* MILITAN Core Node`;

            // Secure asset lookups with updated high-availability fallback CDN
            const avatarUrl = await client.profilePictureUrl(myselfJid, 'image')
                .catch(() => "https://files.catbox.moe/p8b7p5.jpg");

            // Direct payload delivery invocation
            await client.sendMessage(m.chat, { 
                image: { url: avatarUrl }, 
                caption: settingsCaption 
            }, { quoted: m });

        } catch (error) {
            console.error("Fatal exception captured inside Privacy Inspector Command:", error);
            m.reply(`💀 *[CRITICAL MATRIX EXCEPTION]*\n\nThe configuration parsing pipeline collapsed:\n\`\`\`${error.message}\`\`\``);
        }
    });
};