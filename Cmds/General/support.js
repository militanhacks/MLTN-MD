module.exports = async (context) => {
  const { client, m, url, botname = 'MLTN-MD' } = context;

  // 🌟 FIXED STRING: Properly structured the template literal text
  const messageCaption = `
*${botname.toUpperCase()} SYSTEM CORE*
╭───────────────────────────────╮
  🔮 Dimension Status: Operational
  🛡️ Secure Connection: Established
  👑 System Owner: MILITAN
╰───────────────────────────────╯ 
  `;

  // Prepare the image URL
  const image = {
    url: url || "https://files.catbox.moe/k0s0qs.webp" 
  };

  // Prepare the message object
  const message = {
    image: image,
    caption: messageCaption,
    contextInfo: {
        mentionedJid: [m.sender]
    }
  };

  // Send the message cleanly
  await client.sendMessage(m.chat, message, { quoted: m });
};