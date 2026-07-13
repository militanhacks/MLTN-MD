const { Catbox } = require("node-catbox");
const fs = require('fs-extra');

// Initialize Catbox API client instance wrapper
const catbox = new Catbox();

// Clean upload function abstracting external server communication protocols
async function uploadToCatbox(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error("Target binary cache file has not been materialized on the local drive layer.");
    }
    try {
        const uploadResult = await catbox.uploadFile({ path: filePath });
        if (uploadResult) {
            return uploadResult;
        } else {
            throw new Error("The target host server returned a blank token stream.");
        }
    } catch (error) {
        throw new Error(String(error));
    }
}

module.exports = async (context) => {
    const { client, m, sendReply } = context;

    // Use standard message structure fallbacks for robust cross-framework compatibility
    const quoted = m.quoted ? m.quoted : null;

    if (!quoted) {
        return await sendReply(client, m, "🔮 *[SYSTEM NOTICE]*\n\nNo media payload detected. Please quote or reply to an image, video, sticker, or audio file to convert it into a static link.");
    }

    const mime = (quoted.msg || quoted).mimetype || '';
    if (!mime) {
        return await sendReply(client, m, "❌ *[MIME UNVERIFIED]*\n\nThe target interaction block contains no recognizable media mimetype structures.");
    }

    let filePath = null;

    try {
        // Trigger parsing reaction icon
        await client.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

        // Correct Baileys media download implementation passing the complete message block wrapper
        filePath = await client.downloadAndSaveMediaMessage(quoted);
        
        if (!filePath) {
            throw new Error("The binary media stream extractor failed to generate a local cached path file.");
        }

        // Inform user uplink transmission pipeline is live
        await sendReply(client, m, "📡 *[UPLINK TRANSMISSION LIVE]*\n\nMedia successfully cached locally. Injecting data packets directly into the Catbox CDN cluster...");

        // Push binary to CDN cloud servers
        const publicUrl = await uploadToCatbox(filePath);

        // Build premium terminal status prompt text layout
        const successMessage = `🔗 *[MATRIX CDN LINK GENERATED]* 🔗\n\n` +
                               `📦 *Hosted Asset:* ${publicUrl}\n` +
                               `🛡️ *Data Type:* ${mime}\n\n` +
                               `👑 *Network Master:* MILITAN Core cloud`;

        await sendReply(client, m, successMessage);

    } catch (error) {
        console.error('Catbox Cloud Uplink Error:', error);
        await sendReply(client, m, `💀 *[UPLINK COLLAPSE FAULT]*\n\nThe asset streaming pipeline broke or timed out mid-transfer:\n\`\`\`${error.message}\`\`\``);
    } finally {
        // CRITICAL STORAGE CLEANUP: Drops local cache file to avoid crashing the server disk
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (unlinkErr) {
                console.error("Local file system cache trace deletion failure:", unlinkErr);
            }
        }
    }
};