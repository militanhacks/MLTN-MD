const axios = require('axios');

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("🔮 *[SYSTEM NOTICE]*\n\nPlease provide a valid SinhalaSub movie URL.\n\n✨ *Format:* .movie https://sinhalasub.lk/movies/title");
    }

    if (!text.includes('sinhalasub.lk/movies/')) {
        return m.reply("❌ *[INVALID DOMAIN]*\n\nThe target URL must belong to the verified `sinhalasub.lk` index network.");
    }

    try {
        // Trigger network query reaction
        await client.sendMessage(m.chat, { react: { text: '🎬', key: m.key } });

        const apiUrl = `https://apis-keith.vercel.app/movie/sinhalasub/movie?url=${encodeURIComponent(text.trim())}`;
        const response = await axios.get(apiUrl);
        const movieData = response.data?.result?.data;

        if (!movieData || !movieData.title) {
            return m.reply("🔮 *[DATA REGISTRY BLANK]*\n\nFailed to extract usable metadata arrays from the upstream endpoint.");
        }

        // Build premium interactive selection panel text layout
        const caption = `🎬 *[𝐌𝐈𝐋𝐈𝐓𝐀𝐍  𝐌𝐎𝐕𝐈𝐄  𝐂𝐄𝐍𝐓𝐑𝐀𝐋]* 🎬\n\n` +
                        `📦 *Title:* ${movieData.title}\n` +
                        `🎭 *Type:* Direct Download Matrix\n\n` +
                        `👇 *Reply directly to this card with an option index number:* \n\n` +
                        `1️⃣ ᳆ *SD Quality* [480p]\n` +
                        `2️⃣ ᳆ *HD Quality* [720p]\n` +
                        `3️⃣ ᳆ *FHD Quality* [1080p]\n\n` +
                        `⏳ *Stream Timeout:* 5 Minutes | 👑 *Core Engine*`;

        // Send poster image and capture message object reference to track replies
        const posterUrl = movieData.image || "https://files.catbox.moe/p8b7p5.jpg";
        const infoMessage = await client.sendMessage(m.chat, {
            image: { url: posterUrl },
            caption: caption.trim(),
        }, { quoted: m });

        const originalMessageId = infoMessage.key.id;

        // Dynamic Event Isolation and Self-Unmounting Handler Block
        const movieReplyHandler = async (update) => {
            try {
                const receivedMessage = update.messages[0];
                if (!receivedMessage || !receivedMessage.message) return;

                // Validate if this incoming message is a direct reply tracking back to our poster card ID
                const contextInfo = receivedMessage.message.extendedTextMessage?.contextInfo;
                if (contextInfo?.stanzaId !== originalMessageId) return;

                const responseText = (receivedMessage.message.conversation || receivedMessage.message.extendedTextMessage?.text || "").trim();
                const remoteJid = receivedMessage.key.remoteJid;

                const qualityMap = {
                    '1': "SD 480p",
                    '2': "HD 720p",
                    '3': "FHD 1080p",
                };

                const selectedQuality = qualityMap[responseText];
                if (!selectedQuality) {
                    return client.sendMessage(remoteJid, { text: "⚠️ *[SELECTION ERROR]*\n\nInvalid choice parameter. Reply with either 1, 2, or 3." }, { quoted: receivedMessage });
                }

                // Defensive check to avoid processing undefined download link paths
                const downloadLinksList = movieData.ddl_dl || [];
                const downloadNode = downloadLinksList.find(link => link && link.quality === selectedQuality);

                if (!downloadNode || !downloadNode.link) {
                    return client.sendMessage(remoteJid, { text: `🔮 *[STREAM NODE ABSENT]*\n\nThe target resolution *${selectedQuality}* was not cached by the provider for this title.` }, { quoted: receivedMessage });
                }

                // Trigger network loading reaction marker
                await client.sendMessage(remoteJid, { react: { text: '📥', key: receivedMessage.key } });

                // Dispatch finalized file package directly into active container
                await client.sendMessage(remoteJid, {
                    document: { url: downloadNode.link },
                    mimetype: "video/mp4",
                    fileName: `${movieData.title.replace(/[^a-zA-Z0-9]/g, '_')}_[${selectedQuality.replace(' ', '_')}].mp4`,
                    caption: `👑 *[TRANSFER RESOLVED]*\n\nFile download initialized safely via **MILITAN Engine Core**.`,
                }, { quoted: receivedMessage });

                // CRITICAL CLEANUP: Unmount the listener instantly when the download matches and starts
                client.ev.off("messages.upsert", movieReplyHandler);

            } catch (err) {
                console.error("Error executing background movie loop logic step:", err);
            }
        };

        // Mount the temporary listener channel tracking context
        client.ev.on("messages.upsert", movieReplyHandler);

        // Auto-kill structural safety gate: Drops tracking hook after 5 minutes to release system RAM
        setTimeout(() => {
            client.ev.off("messages.upsert", movieReplyHandler);
        }, 5 * 60 * 1000);

    } catch (error) {
        console.error("Fatal movie downloader macro failure exception:", error);
        m.reply('💀 *[GATEWAY FAULT]*\n\nThe scraping database router timed out or rejected the parameters connection query.');
    }
};