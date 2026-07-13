const getFBInfo = require("@xaviabot/fb-downloader");

module.exports = async (context) => {
    const { client, m, text, botname, sendReply, sendMediaMessage } = context;

    try {
        if (!text) {
            return await sendReply(client, m, '🔮 *[SYSTEM NOTICE]*\n\nNo source identifier provided. Please submit a valid Facebook video link.\n\n✨ *Format:* .fb https://fb.watch/...');
        }

        const fbUrl = text.match(/(https?:\/\/)?(www\.|web\.|m\.)?(facebook\.com|fb\.watch)\/[^\s]+/i)?.[0];
        if (!fbUrl) {
            return await sendReply(client, m, '❌ *[LINK PARSE ERROR]*\n\nThe target string could not be verified as a valid Facebook core layout link.');
        }

        await client.sendMessage(m.chat, { react: { text: '📥', key: m.key } });

        const result = await getFBInfo(fbUrl);

        const downloadUrl = result?.hd || result?.sd;
        if (!downloadUrl) {
            throw new Error('No downloadable HD or SD content available for this media layout.');
        }

        const videoQuality = result.hd ? 'High Definition (HD)' : 'Standard Definition (SD)';

        const caption = `📹 *[FACEBOOK STREAM EXTRACTED]* 📹\n\n` +
                        `📌 *Title:* ${result.title || 'Untitled Archive'}\n` +
                        `⚙️ *Quality:* ${videoQuality}\n` +
                        `🔗 *Source:* ${result.url || fbUrl}\n\n` +
                        `👑 *Downloaded Via:* ${botname || 'MILITAN Core'}`;

        await sendMediaMessage(client, m, {
            video: { url: downloadUrl },
            caption: caption,
            gifPlayback: false
        });

    } catch (error) {
        console.error('Facebook Download Fatal Error:', error);
        await sendReply(client, m, '💀 *[DOWNLOAD STREAM COLLAPSED]*\n\nThe scraping network layer rejected or timed out while processing this node element.');
    }
};