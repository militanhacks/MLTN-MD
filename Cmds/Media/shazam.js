const acrcloud = require("acrcloud");

module.exports = async (context) => {
    const { client, m, mime } = context;

    try {
        // 1. Verify that the incoming message contains an audio or video file layout
        if (!mime || !/video|audio/.test(mime)) {
            return m.reply("🔮 *[SYSTEM NOTICE]*\n\nNo acoustic pattern detected. Please reply to or tag a short audio/video clip to analyze.");
        }

        // Trigger processing indicator
        await client.sendMessage(m.chat, { react: { text: '📡', key: m.key } });

        // Isolate the target message context (quoted message or direct message)
        let mediaMessage = m.quoted ? m.quoted : m;

        // Download the media binary buffer into server memory
        let buffer = await mediaMessage.download();
        if (!buffer) {
            throw new Error("Failed to capture binary media buffer streams.");
        }

        // 2. Initialize the official ACRCloud integration gateway
        let acr = new acrcloud({
            host: 'identify-ap-southeast-1.acrcloud.com',
            access_key: '26afd4eec96b0f5e5ab16a7e6e05ab37',
            access_secret: 'wXOZIqdMNZmaHJP1YDWVyeQLg579uK2CfY6hWMN8'
        });

        // Broadcast active scanning message
        await m.reply("⚡ *[SONIC RADAR ENGAGED]*\n\nIntercepting audio frequencies. Processing acoustic wave patterns against the global registry...");

        // Dispatch the binary buffer directly to ACRCloud servers for identification
        let { status, metadata } = await acr.identify(buffer);

        // Escape if code is anything other than 0 (0 means successful identification match)
        if (status?.code !== 0 || !metadata?.music || metadata.music.length === 0) {
            return m.reply("🔮 *[SCAN COMPLETED]*\n\nAcoustic tracking unresolved. The frequency patterns do not match any known record on the database grid.");
        }

        // 3. Destructure and parse metadata keys safely using fallback layouts
        let trackInfo = metadata.music[0];
        let title = trackInfo.title || 'Unknown Asset';
        let artists = trackInfo.artists ? trackInfo.artists.map(v => v.name).join(', ') : 'Unknown Artist';
        let album = trackInfo.album?.name || 'Single Track Instance';
        let genres = trackInfo.genres ? trackInfo.genres.map(v => v.name).join(', ') : 'Undefined Genus';
        let releaseDate = trackInfo.release_date || 'Unknown Timeline';

        // Build premium terminal status prompt text layout
        let scanResult = `📡 *[SONIC SIGNATURE LOCALIZED]* 📡\n\n` +
                          `🎵 *Title:* ${title}\n` +
                          `👤 *Artist(s):* ${artists}\n` +
                          `💿 *Album:* ${album}\n` +
                          `🎸 *Genre:* ${genres}\n` +
                          `📅 *Release Era:* ${releaseDate}\n\n` +
                          `👑 *Analysis Engine:* MILITAN Intelligence Matrix`;

        await m.reply(scanResult.trim());

    } catch (error) {
        console.error("Fatal exception during audio identification sequence:", error);
        await m.reply("💀 *[SCANNER FAULT]*\n\nThe acoustic array encountered severe white noise or an unstable network buffer connection.");
    }
};