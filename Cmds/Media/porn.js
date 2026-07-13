const fetchHentaiVideos = require(__dirname + "/../../lib/hentaivideo");

module.exports = async (context) => {
    const { client, m } = context;
  
    try {
        // Trigger processing cue
        await client.sendMessage(m.chat, { react: { text: '🔞', key: m.key } });

        const videos = await fetchHentaiVideos();
    
        if (!videos || !videos.length) {
            return await client.sendMessage(m.chat, 
                { text: "🔮 *[ARCHIVE EMPTY]*\n\nThe restricted database link returned zero active indices. Try initializing later." },
                { quoted: m }
            );
        }

        // Pick a random data element array unit
        const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    
        if (!selectedVideo || !selectedVideo.media?.video_url) {
            throw new Error('Target stream node contains a malformed or broken video resource URL.');
        }

        // Defensive variable tracking to prevent toLocaleString() crashes on null values
        const totalViews = selectedVideo.views_count ? selectedVideo.views_count.toLocaleString() : '0';
        const categoryLabel = selectedVideo.category || 'Restricted Category';

        // Build premium terminal status prompt text layout
        const caption = `🎬 *[FORBIDDEN ARCHIVE DECRYPTED]* 🎬\n\n` +
                        `📌 *Title:* ${selectedVideo.title || 'Classified Archive'}\n` +
                        `📁 *Category:* ${categoryLabel}\n` +
                        `👁️ *Views:* ${totalViews}\n\n` +
                        `👑 *Gateway Master:* MILITAN Underworld Engine`;

        // Send compiled media package directly into conversation context
        await client.sendMessage(m.chat, {
            video: { url: selectedVideo.media.video_url },
            caption: caption,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (error) {
        console.error('NSFW Video Processing Error:', error);
        await client.sendMessage(m.chat, 
            { text: `💀 *[DECRYPTION EXCEPTION]*\n\nFailed to extract the restricted asset stream link:\n\`\`\`${error.message}\`\`\`` },
            { quoted: m }
        );
    }
};