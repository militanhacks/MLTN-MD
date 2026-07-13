const yts = require("yt-search");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = async (context) => {
  const { client, m, text, fetchJson } = context;

  try {
    if (!text) {
      return m.reply("🔮 *[SYSTEM NOTICE]*\n\nNo audio search track specified. What sonic resonance do you wish to manifest?\n\n✨ *Example:* .play Solo Leveling OST");
    }

    // React with searching signal
    await client.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    const search = await yts(text);
    
    // Safety check to ensure search arrays actually returned matching video metadata assets
    if (!search || !search.all || search.all.length === 0) {
      return m.reply("🔮 *[RADAR BLANK]*\n\nNo matching echo found on the YouTube data grid for that designation query.");
    }

    const firstVideo = search.all[0];
    const link = firstVideo.url;

    // Build the system interface status prompt panel text layout
    let manifestMsg = `🎵 *[SONIC INFILTRATION ENGAGED]* 🎵\n\n` +
                      `📦 *Asset:* ${firstVideo.title}\n` +
                      `⏱️ *Duration:* ${firstVideo.timestamp} mins\n` +
                      `👤 *Channel:* ${firstVideo.author.name}\n\n` +
                      `📡 *Processing:* Initializing stream hooks across decentralized download arrays...`;

    await m.reply(manifestMsg);

    const apis = [
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(link)}`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(link)}`
    ];

    for (const api of apis) {
      try {
        let data = await fetchJson(api);

        // Broad success parameters evaluation conditional block
        if (data && (data.status === 200 || data.success || data.result)) {
          // Comprehensive checking layout structure to map multiple external API structures cleanly
          let videoUrl = data.result?.downloadUrl || data.url || data.result?.url || data.downloadUrl;
          
          if (!videoUrl) continue;

          let outputFileName = `${firstVideo.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`;
          let outputPath = path.join(__dirname, outputFileName);

          // Stream audio data down from target download node
          const response = await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream"
          });

          if (response.status !== 200) continue;

          // React with downloading/processing icon
          await client.sendMessage(m.chat, { react: { text: '📥', key: m.key } });

          // Stream pipe conversion handler block via fluent-ffmpeg engine
          ffmpeg(response.data)
            .toFormat("mp3")
            .audioBitrate(128) // Fixed stable compression for rapid cellular transmission
            .on("error", (err) => {
              console.error("FFmpeg extraction failure block:", err.message);
              // Do not crash the parent execution script stream
            })
            .on("end", async () => {
              try {
                // Dispatch finalized audio binary document payload directly into client conversation
                await client.sendMessage(
                  m.chat,
                  {
                    document: { url: outputPath },
                    mimetype: "audio/mp3",
                    fileName: outputFileName,
                    caption: `👑 *[STREAM RESOLVED]*\n\nAudio tracking file derived completely via **MILITAN Core**.`
                  },
                  { quoted: m }
                );
              } catch (sendErr) {
                console.error("File delivery error:", sendErr);
              } finally {
                // Critical security cleanup loop item — unlinks the local file sync to prevent drive stack storage overflow
                if (fs.existsSync(outputPath)) {
                  fs.unlinkSync(outputPath);
                }
              }
            })
            .save(outputPath);

          return; // Kill execution thread context — process successfully routed
        }
      } catch (e) {
        console.error(`Fallback node index failed transmission:`, e.message);
        continue; // Step systematically onto secondary elements in array if endpoint rejects
      }
    }

    // Catch-all escape condition block
    m.reply("💀 *[GATEWAY TIMEOUT]*\n\nAll external bypass APIs are locked or experiencing extreme bandwidth saturation. Try re-initializing shortly.");

  } catch (error) {
    console.error("Fatal audio compilation system failure:", error);
    m.reply("💀 *[CORE RUNTIME FAULT]*\n\nThe internal audio processing stream collapsed:\n" + error.message);
  }
};