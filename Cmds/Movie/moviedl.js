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
                const messageContent = update.messages[0];
                if (!messageContent || !messageContent.message) return;

                // Validate if this incoming message is a direct reply tracking back to our poster card ID
                const contextInfo = messageContent.message.extendedTextMessage?.contextInfo;
                if (contextInfo?.stanzaId !== originalMessageId) return;

                const responseText = (messageContent.message.conversation || messageContent.message.extendedTextMessage?.text || "").trim();
                const keith = messageContent.key.remoteJid;

                let targetQualityLabel = "";
                if (responseText === '1') {
                    targetQualityLabel = "SD 480p";
                } else if (responseText === '2') {
                    targetQualityLabel = "HD 720p";
                } else if (responseText === '3') {
                    targetQualityLabel = "FHD 1080p";
                } else {
                    return client.sendMessage(keith, { text: "⚠️ *[SELECTION ERROR]*\n\nInvalid choice parameter. Reply with either 1, 2, or 3." }, { quoted: messageContent });
                }

                // Defensive check to avoid processing undefined array errors
                const downloadLinksList = movieData.ddl_dl || [];
                const matchedNode = downloadLinksList.find(link => link && link.quality === targetQualityLabel);

                if (!matchedNode || !matchedNode.link) {
                    return client.sendMessage(keith, { text: `🔮 *[STREAM NODE ABSENT]*\n\nThe target resolution *${targetQualityLabel}* was not cached by the provider for this title.` }, { quoted: messageContent });
                }

                // Trigger network loading reaction marker
                await client.sendMessage(keith, { react: { text: '📥', key: messageContent.key } });

                // Dispatch finalized file package cleanly as a direct document payload
                await client.sendMessage(keith, {
                    document: { url: matchedNode.link },
                    mimetype: "video/mp4",
                    fileName: `${movieData.title.replace(/[^a-zA-Z0-9]/g, '_')}_[${targetQualityLabel.replace(' ', '_')}].mp4`,
                    caption: `👑 *[TRANSFER RESOLVED]*\n\nFile download initialized safely via **MILITAN Engine Core**.`,
                }, { quoted: messageContent });

                // CRITICAL CLEANUP: Instantly kill the event listener channel once a selection has been successfully processed
                client.ev.off("messages.upsert", movieReplyHandler);

            } catch (err) {
                console.error("Error executing inside isolated movie handler loop:", err);
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
        m.reply('💀 *[GATEWAY FAULT]*\n\nThe scraping database router timed out or rejected the parameters connection query: ' + error.message);
    }
};