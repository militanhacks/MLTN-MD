const fetch = require("node-fetch");

module.exports = async (context) => {
  const { client, m, text, botname, sendReply, sendMediaMessage } = context;

  try {
    if (!text) {
      return await sendReply(client, m, "🔮 *[SYSTEM NOTICE]*\n\nPlease specify a query string to look up subtitles on the network archive.\n\n✨ *Example:* .sub search Interstellar");
    }

    // Trigger analysis radar reaction icon
    await client.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    // Node Phase 1: Query database registry for matching title indices
    const searchApiUrl = `https://apis-keith.vercel.app/movie/sinhalasub/search?text=${encodeURIComponent(text.trim())}`;
    const searchResponse = await fetch(searchApiUrl);
    const searchData = await searchResponse.json();

    // Critical Fix: Added careful optional chaining on array checks to prevent crash risks
    if (!searchData?.status || !searchData?.result?.data?.length) {
      return await sendReply(client, m, "🔮 *[RADAR BLANK]*\n\nNo movie profiles or matching subtitle tracks localized for that designation query.");
    }

    // Isolate primary data element pointer path
    const targetLink = searchData.result.data[0].link;

    // Node Phase 2: Fetch detailed production data arrays
    const downloadApiUrl = `https://apis-keith.vercel.app/movie/sinhalasub/movie?url=${encodeURIComponent(targetLink)}`;
    const downloadResponse = await fetch(downloadApiUrl);
    const downloadData = await downloadResponse.json();

    if (downloadData?.status && downloadData?.result?.data) {
      const videoData = downloadData.result.data;

      // Handle structural safety configurations for deep arrays gracefully
      const genresList = Array.isArray(videoData.category) ? videoData.category.join(", ") : "General Cinema";
      const tmdbRating = videoData.tmdbRate || "N/A";
      const totalVotes = videoData.sinhalasubVote || "0";

      // Build premium movie profile display text layout
      const profileCaption = `🎬 *[𝐌𝐈𝐋𝐈𝐓𝐀𝐍  𝐌𝐎𝐕𝐈𝐄  𝐈𝐍𝐃𝐄𝐗]* 🎬\n\n` +
                             `📦 *Title:* ${videoData.title || 'Unknown Asset'}\n` +
                             `📅 *Release:* ${videoData.date || 'Unknown Timeline'}\n` +
                             `🌍 *Region:* ${videoData.country || 'International Link'}\n` +
                             `⭐ *Rating:* ${tmdbRating} / 10 [${totalVotes} votes]\n` +
                             `🎭 *Genres:* ${genresList}\n` +
                             `✍️ *Sub Author:* ${videoData.subtitle_author || 'Anonymous Operator'}\n\n` +
                             `👑 *Terminal Matrix:* ${botname || 'MILITAN Core'}`;

      // Dispatch visual profile media pack directly into chat context instance
      const posterUrl = videoData.image || "https://files.catbox.moe/p8b7p5.jpg";
      await sendMediaMessage(client, m, {
        image: { url: posterUrl },
        caption: profileCaption,
      }, { quoted: m });

      // Node Phase 3: Map out external file delivery nodes
      let downloadOptions = `📥 *[𝐕𝐈𝐃𝐄𝐎  𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃  𝐌𝐀𝐓𝐑𝐈𝐗]* 📥\n\n` +
                            `The following high-speed direct mirror nodes are available for this instance:\n`;

      const serverQualities = ["pixeldrain_dl", "ddl_dl", "meda_dl"];
      let mirrorsFound = false;
      
      serverQualities.forEach((serverKey) => {
        if (videoData[serverKey] && Array.isArray(videoData[serverKey])) {
          videoData[serverKey].forEach((file) => {
            if (file && file.link) {
              mirrorsFound = true;
              // Modern WhatsApp Link formatting (Plain, readable URLs instead of broken Markdown syntax)
              downloadOptions += `\n⚙️ *Quality:* ${file.quality || 'Standard'}\n` +
                                 `⚖️ *Size:* ${file.size || 'Unknown MB'}\n` +
                                 `🔗 *Stream Link:* ${file.link}\n` +
                                 `----------------------------\n`;
            }
          });
        }
      });

      if (!mirrorsFound) {
        downloadOptions += "\n⚠️ No direct digital mirrors cached on external servers for this entry.";
      } else {
        downloadOptions += `\n🛡️ *Resolution Integrity:* 100% Operational Grid`;
      }

      await sendReply(client, m, downloadOptions.trim());
    } else {
      return await sendReply(client, m, "💀 *[INDEX FETCH TIMEOUT]*\n\nThe profile parsing layer timed out while trying to translate details from the link source.");
    }
  } catch (error) {
    console.error('Fatal movie indexing utility exception:', error);
    return await sendReply(client, m, `💀 *[CORE CRITICAL FAULT]*\n\nThe internal search matrix engine pipeline collapsed:\n\`\`\`${error.message}\`\`\``);
  }
};