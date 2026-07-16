const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

async function downloadMedia(mediaMessage, mediaType) {
  const stream = await downloadContentFromMessage(mediaMessage, mediaType);
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  return buffer;
}

module.exports = async (context) => {
  const { client, m } = context;

  const quotedMessage = m.msg?.contextInfo?.quotedMessage;

  if (!quotedMessage) {
    return m.reply("𓆩⚔️𓆪 *[𝐍𝐎 𝐓𝐀𝐑𝐆𝐄𝐓 𝐅𝐎𝐔𝐍𝐃]* 𓆩⚔️𓆪\n\n☠️ 𝘙𝘦𝘱𝘭𝘺 𝘵𝘰 𝘢 𝘷𝘪𝘦𝘸-𝘰𝘯𝘤𝘦 𝘱𝘩𝘰𝘵𝘰 𝘰𝘳 𝘷𝘪𝘥𝘦𝘰 𝘸𝘪𝘵𝘩 𝘵𝘩𝘪𝘴 𝘤𝘰𝘮𝘮𝘢𝘯𝘥 𝘵𝘰 𝘳𝘦𝘷𝘦𝘢𝘭 𝘪𝘵.");
  }

  try {
    const viewOnceMsg = quotedMessage.viewOnceMessageV2?.message
      || quotedMessage.viewOnceMessageV2Extension?.message
      || quotedMessage.viewOnceMessage?.message
      || quotedMessage;

    if (viewOnceMsg.imageMessage) {
      const buffer = await downloadMedia(viewOnceMsg.imageMessage, 'image');
      await client.sendMessage(m.chat, { image: buffer, caption: viewOnceMsg.imageMessage.caption || '' }, { quoted: m });
    } else if (viewOnceMsg.videoMessage) {
      const buffer = await downloadMedia(viewOnceMsg.videoMessage, 'video');
      await client.sendMessage(m.chat, { video: buffer, caption: viewOnceMsg.videoMessage.caption || '' }, { quoted: m });
    } else {
      return m.reply("𓆩❌𓆪 𝘕𝘰 𝘪𝘮𝘢𝘨𝘦 𝘰𝘳 𝘷𝘪𝘥𝘦𝘰 𝘧𝘰𝘶𝘯𝘥 𝘪𝘯 𝘵𝘩𝘢𝘵 𝘮𝘦𝘴𝘴𝘢𝘨𝘦.");
    }
  } catch (error) {
    console.error("vv.js error:", error);
    m.reply("𓆩⛔𓆪 𝘛𝘩𝘦 𝘴𝘩𝘢𝘥𝘰𝘸𝘴 𝘤𝘰𝘶𝘭𝘥𝘯'𝘵 𝘳𝘦𝘤𝘰𝘷𝘦𝘳 𝘵𝘩𝘢𝘵 𝘮𝘦𝘥𝘪𝘢: " + error.message);
  }
};