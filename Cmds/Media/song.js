module.exports = async (context) => {
    const { 
        downloadYouTube, downloadSoundCloud, downloadSpotify, 
        searchYouTube, searchSoundCloud, searchSpotify, 
        client, m, text, botname, sendReply, sendMediaMessage 
    } = context;

    try {
        if (!text) {
            return await sendReply(client, m, "🔮 *[SYSTEM NOTICE]*\n\nNo acoustic track signature specified. What audio wavelength do you wish to harvest?");
        }

        // Trigger analysis reaction
        await client.sendMessage(m.chat, { react: { text: '🌀', key: m.key } });

        let result = null;
        let downloadResult = null;
        let platform = '';

        // Node Phase 1: Try YouTube Core Routing
        try {
            result = await searchYouTube(text);
            downloadResult = result ? await downloadYouTube(result.url) : null;
            if (downloadResult) platform = 'YouTube Network';
        } catch (e) {
            console.error("YouTube stream capture bypass error:", e.message);
        }

        // Node Phase 2: Waterfall down into Spotify Encryption Grid if Phase 1 failed
        if (!downloadResult) {
            try {
                result = await searchSpotify(text);
                downloadResult = result ? await downloadSpotify(result.url) : null;
                if (downloadResult) platform = 'Spotify Grid';
            } catch (e) {
                console.error("Spotify stream capture bypass error:", e.message);
            }
        }

        // Node Phase 3: Waterfall down into SoundCloud Frequency Pools if Phase 2 failed
        if (!downloadResult) {
            try {
                result = await searchSoundCloud(text);
                downloadResult = result ? await downloadSoundCloud(result.url) : null;
                if (downloadResult) platform = 'SoundCloud Waves';
            } catch (e) {
                console.error("SoundCloud stream capture bypass error:", e.message);
            }
        }

        // Catch-all failure fallback escape loop condition
        if (!result || !downloadResult || !downloadResult.downloadUrl) {
            return await sendReply(client, m, "🔮 *[HARVEST FAILURE]*\n\nThe targeted wave signature could not be localized or extracted from any active matrix grids.");
        }

        // Trigger processing download reaction
        await client.sendMessage(m.chat, { react: { text: '📥', key: m.key } });

        // Build premium terminal status prompt text layout
        const caption = `🎵 *[RESONANCE HARVEST SYSTEM]* 🎵\n\n` +
                        `📦 *Title:* ${result.title || 'Unknown Asset'}\n` +
                        `🌍 *Source:* ${platform}\n` +
                        `⚡ *Codec Format:* ${downloadResult.format || 'MPEG-Audio'}\n` +
                        `${result.artist ? `👤 *Artist:* ${result.artist}\n` : ''}` +
                        `🔗 *Link:* ${result.url}\n\n` +
                        `👑 *Enforcer:* ${botname || 'MILITAN Engine'}`;

        // Step A: Dispatch the metadata card panel featuring thumbnail image assets if available
        const thumbnailUrl = downloadResult.thumbnail || result.thumbnail;
        if (thumbnailUrl) {
            await sendMediaMessage(client, m, {
                image: { url: thumbnailUrl },
                caption: caption
            });
        } else {
            await sendReply(client, m, caption);
        }

        // Step B: Stream the native playable push-to-listen media player component layer
        await sendMediaMessage(client, m, {
            audio: { url: downloadResult.downloadUrl },
            mimetype: "audio/mp4",
            ptt: false // Set to true if you prefer it to arrive looking like a WhatsApp Voice Note
        });

        // Step C: Stream the clean persistent hard-storage document file container download
        const cleanFileName = `${(result.title || 'Audio_Track').replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`;
        await sendMediaMessage(client, m, {
            document: { url: downloadResult.downloadUrl },
            mimetype: "audio/mp3",
            fileName: cleanFileName
        });

    } catch (error) {
        console.error('Fatal multi-downloader runtime exception:', error);
        return await sendReply(client, m, `💀 *[HARVESTER EXCEPTION]*\n\nThe stream extraction pipeline collapsed during processing:\n\n\`\`\`${error.message}\`\`\``);
    }
};