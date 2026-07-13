module.exports = async (context) => {
  const { client, m } = context;

  const quotedMessage = m.msg?.contextInfo?.quotedMessage;

  if (quotedMessage && !m.quoted.chat.includes("status@broadcast")) {
    return m.reply("❌ *[SKILL FAILURE]*\n\nTarget is not a status update broadcast. The system cannot extract memory traces from private chats.");
  }

  if (quotedMessage && m.quoted.chat.includes("status@broadcast")) {
    m.reply("⚡ *[SKILL ACTIVATION: SHADOW STEAL]*\n\nCloning targeted status memory data from the void... ⏳");

    try {
      if (quotedMessage.imageMessage) {
        let imageCaption = quotedMessage.imageMessage.caption;
        let imageUrl = await client.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
        
        let cap = imageCaption ? `${imageCaption}\n\n` : "";
        cap += `🔮 *[DATA EXTRACTED BY MILITAN]*`;

        await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: cap }, { quoted: m });
      }

      if (quotedMessage.videoMessage) {
        let videoCaption = quotedMessage.videoMessage.caption;
        let videoUrl = await client.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
        
        let cap = videoCaption ? `${videoCaption}\n\n` : "";
        cap += `🔮 *[DATA EXTRACTED BY MILITAN]*`;

        await client.sendMessage(m.chat, { video: { url: videoUrl }, caption: cap }, { quoted: m });
      }
    } catch (error) {
      console.error("Status download error:", error);
      m.reply("💀 *[EXTRACTION INTERRUPTED]*\n\nThe target status stream dissipated before the system could fully replicate it.");
    }
  } else {
    m.reply("🔮 *[SYSTEM NOTICE]*\n\nYou must quote/reply to a temporary status story update to duplicate it.");
  }
};module.exports = async (context) => {
  const { client, m } = context;

  const quotedMessage = m.msg?.contextInfo?.quotedMessage;

  if (quotedMessage && !m.quoted.chat.includes("status@broadcast")) {
    return m.reply("❌ *[SKILL FAILURE]*\n\nTarget is not a status update broadcast. The system cannot extract memory traces from private chats.");
  }

  if (quotedMessage && m.quoted.chat.includes("status@broadcast")) {
    m.reply("⚡ *[SKILL ACTIVATION: SHADOW STEAL]*\n\nCloning targeted status memory data from the void... ⏳");

    try {
      if (quotedMessage.imageMessage) {
        let imageCaption = quotedMessage.imageMessage.caption;
        let imageUrl = await client.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
        
        let cap = imageCaption ? `${imageCaption}\n\n` : "";
        cap += `🔮 *[DATA EXTRACTED BY MILITAN]*`;

        await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: cap }, { quoted: m });
      }

      if (quotedMessage.videoMessage) {
        let videoCaption = quotedMessage.videoMessage.caption;
        let videoUrl = await client.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
        
        let cap = videoCaption ? `${videoCaption}\n\n` : "";
        cap += `🔮 *[DATA EXTRACTED BY MILITAN]*`;

        await client.sendMessage(m.chat, { video: { url: videoUrl }, caption: cap }, { quoted: m });
      }
    } catch (error) {
      console.error("Status download error:", error);
      m.reply("💀 *[EXTRACTION INTERRUPTED]*\n\nThe target status stream dissipated before the system could fully replicate it.");
    }
  } else {
    m.reply("🔮 *[SYSTEM NOTICE]*\n\nYou must quote/reply to a temporary status story update to duplicate it.");
  }
};