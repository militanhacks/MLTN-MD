const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const canvacord = require("canvacord");

module.exports = async (context) => {
    const { client, m, Tag, botname } = context;

    try {
        let img;
        let targetName = "Target";

        if (m.quoted) {
            targetName = `@${m.quoted.sender.split('@')[0]}`;
            try {
                img = await client.profilePictureUrl(m.quoted.sender, 'image');
            } catch {
                img = "https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg";
            }
            // Trigger stylized system reply for quoting a target
            m.reply(`⚠️ *[SYSTEM ALARM]*\n\nAnalyzing mana footprint of ${targetName}...\nEvaluating threat levels... 💀`);
            result = await canvacord.Canvacord.wasted(img);

        } else if (Tag && Tag.length > 0) {
            targetName = `@${Tag[0].split('@')[0]}`;
            try {
                img = await client.profilePictureUrl(Tag[0], 'image');
            } catch {
                img = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';
            }
            m.reply(`👁️ *[SYSTEM SEARCH]*\n\nTargeting ${targetName}...\nEngaging the shadow domain. 🌑`);
            result = await canvacord.Canvacord.wasted(img);

        } else {
            // Default to sender if nothing is quoted/tagged
            targetName = `@${m.sender.split('@')[0]}`;
            try {
                img = await client.profilePictureUrl(m.sender, 'image');
            } catch {
                img = 'https://telegra.ph/file/9521e9ee2fdbd0d6f4f1c.jpg';
            }
            m.reply(`🚨 *[CRITICAL ERROR]*\n\nNo raid target specified. Scanning your own hunter profile status...`);
            result = await canvacord.Canvacord.wasted(img);
        }

        // Final warning banner before dropping the sticker
        m.reply(`💀 *[RAID FAILURE]*\n\n"𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐟𝐚𝐢𝐥𝐞𝐝 𝐭𝐡𝐞 𝐜𝐥𝐞𝐚𝐫 𝐜𝐨𝐧𝐝𝐢𝐭𝐢𝐨𝐧𝐬."\nHunter status: *ELIMINATED*.`);

        let sticker = new Sticker(result, {
            pack: `💀 Raid Failed`,
            author: `${botname} System`,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 75,
            background: 'transparent'
        });

        const stikk = await sticker.toBuffer();
        await client.sendMessage(m.chat, { 
            sticker: stikk,
            mentions: Tag ? Tag : [m.quoted ? m.quoted.sender : m.sender]
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("🛡️ *[SYSTEM DEFENSE]*\n\nAn anomaly occurred. The target's data stream resisted the extraction process.");
    }
};