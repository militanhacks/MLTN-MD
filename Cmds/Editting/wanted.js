const canvacord = require("canvacord");

module.exports = async (context) => {
    const { client, m, Tag, botname } = context;

    try {
        let img;
        let targetName = "Unknown Entity";

        if (m.quoted) {
            targetName = `@${m.quoted.sender.split('@')[0]}`;
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image');
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg";
            }
            m.reply(`🚨 *[HUNTER ASSOCIATION ALERT]*\n\nTracking high-threat target: ${targetName}...\nGenerating international arrest mandate.`);
            result = await canvacord.Canvacord.wanted(img);

        } else if (Tag && Tag.length > 0) {
            targetName = `@${Tag[0].split('@')[0]}`;
            try {
                img = await client.profilePictureUrl(Tag[0], 'image');
            } catch {
                img = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';
            }
            m.reply(`⚔️ *[BOUNTY INITIALIZED]*\n\nLocking onto coordinate data for ${targetName}...\nPreparing the Red Name warrant.`);
            result = await canvacord.Canvacord.wanted(img);
        } else {
            // Default to sender if no target is provided
            targetName = `@${m.sender.split('@')[0]}`;
            try {
                img = await client.profilePictureUrl(m.sender, 'image');
            } catch {
                img = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';
            }
            m.reply(`⚠️ *[SYSTEM NOTICE]*\n\nNo target declared. Processing your own hunter identification...`);
            result = await canvacord.Canvacord.wanted(img);
        }

        // Custom Solo Leveling style caption layout
        let cap = `⚠️ *[S-RANK BOUNTY DECLARED]* ⚠️\n\n` +
                  `👤 *TARGET:* ${targetName}\n` +
                  `💀 *STATUS:* WANTED (Dead or Alive)\n` +
                  `🔮 *ISSUED BY:* ${botname} System\n\n` +
                  `*"Any Hunter who successfully eliminates or captures this target will be heavily rewarded with high-grade magic crystals."*`;

        await client.sendMessage(m.chat, { 
            image: result, 
            caption: cap,
            mentions: Tag ? Tag : [m.quoted ? m.quoted.sender : m.sender]
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("🛡️ *[SYSTEM RESTRICTION]*\n\nFailed to issue the bounty warrant. The target's magical signature is completely hidden.");
    }
};