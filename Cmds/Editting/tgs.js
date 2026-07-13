const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

const sleep = (ms) => {
    return new Promise((resolve) => { setTimeout(resolve, ms) });
};

module.exports = async (context) => {
    const { client, m, author, text, botname } = context;

    if (!text) {
        return await client.sendMessage(m.chat, { 
            text: "🔮 *[SYSTEM NOTICE]*\n\nPlease provide a valid Telegram sticker pack link.\n\n✨ *Format:* .tgsticker https://t.me/addstickers/PackName" 
        }, { quoted: m });
    }

    // Secure extraction using match regex to prevent undefined splits from crashing the bot
    const packMatch = text.match(/\/addstickers\/([a-zA-Z0-9_]+)/);
    if (!packMatch || !packMatch[1]) {
        return await client.sendMessage(m.chat, { 
            text: "❌ *[INVALID LINK]*\n\nCould not extract the pack identifier name. Ensure the URL contains the standard `/addstickers/` path." 
        }, { quoted: m });
    }

    const packName = packMatch[1];
    const botToken = "7025486524:AAGNJ3lMa8610p7OAIycwLtNmF9vG8GfboM";
    const apiEndpoint = `https://api.telegram.org/bot${botToken}/getStickerSet?name=${encodeURIComponent(packName)}`;

    try {
        // Signal processing beginning
        await client.sendMessage(m.chat, { react: { text: '📦', key: m.key } });

        const response = await axios.get(apiEndpoint);
        const packData = response.data?.result;

        if (!packData || !packData.stickers || packData.stickers.length === 0) {
            return await client.sendMessage(m.chat, { text: "🔮 *[DATA SHIELD]*\n\nTarget sticker set appears empty or invalid on Telegram's servers." }, { quoted: m });
        }

        const isAnimated = packData.is_animated || packData.is_video;
        const totalStickers = packData.stickers.length;

        // Limiting mass download spam to protect server resources (cap at 30 if pack is massive)
        const processLimit = Math.min(totalStickers, 30);

        let statusMsg = `⚡ *[TELEGRAM GATEWAY ENGAGED]* ⚡\n\n` +
                        `📦 *Pack Name:* ${packData.name}\n` +
                        `🎭 *Type:* ${isAnimated ? 'Animated / Video (Experimental)' : 'Static Standard'}\n` +
                        `📊 *Total Assets:* ${totalStickers} units\n\n` +
                        `📥 *Manifest:* Pulling the first ${processLimit} buffers into the conversion stream...`;

        await client.sendMessage(m.chat, { text: statusMsg }, { quoted: m });

        if (isAnimated) {
            await client.sendMessage(m.chat, { text: "⚠️ *[COMPATIBILITY NOTICE]*\n\nAnimated Telegram vector formats (.tgs) may render static if the underlying system environment layers lack conversion codecs." }, { quoted: m });
        }

        for (let i = 0; i < processLimit; i++) {
            try {
                // Fetch internal file path from telegram API mapping
                const fileRef = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${packData.stickers[i].file_id}`);
                const filePath = fileRef.data?.result?.file_path;

                if (!filePath) continue;

                // Download the actual file buffer from servers
                const assetBuffer = await axios({
                    method: 'get',
                    url: `https://api.telegram.org/file/bot${botToken}/${filePath}`,
                    responseType: 'arraybuffer',
                });

                const sticker = new Sticker(assetBuffer.data, {
                    pack: botname || "MILITAN Engine",
                    author: author || "Core",
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    id: `tg-${i}`,
                    quality: 45 // Slightly reduced to fast-track mobile loading speeds
                });

                const stickerBuffer = await sticker.toBuffer();

                await client.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });

                // Anti-spam anti-ban sleep cooldown safety rate limit
                await sleep(1500);

            } catch (loopErr) {
                console.error(`Error processing asset sequence index ${i}:`, loopErr.message);
                // Fail silently inside the loop to allow remaining stickers to process smoothly
            }
        }

        await client.sendMessage(m.chat, { 
            text: `👑 *[STREAM RESOLVED]*\n\nAll targeted sticker entities have been fully pushed to the instance.\n\n🛡️ *Enforcer:* MILITAN Core` 
        }, { quoted: m });

    } catch (error) {
        console.error('Telegram Sticker compilation fatal exception:', error);
        await client.sendMessage(m.chat, { 
            text: `💀 *[GATEWAY EXCEPTION]*\n\nThe API stream rejected the packet request or timed out during server file streaming.` 
        }, { quoted: m });
    }
};