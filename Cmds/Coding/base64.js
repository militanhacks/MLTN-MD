module.exports = async (context) => {
  try {
    const { client, m, text } = context;

    if (!text) {
      return m.reply("🔮 *[SYSTEM NOTICE]*\n\nNo text string provided. Input the characters you wish to lock behind the system cipher.");
    }

    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Highly stylized cryptographic readout layout
    const response = `🔐 *[𝐒𝐘𝐒𝐓𝐄𝐌  𝐂𝐈𝐏𝐇𝐄𝐑  𝐄𝐍𝐂𝐑𝐘𝐏𝐓𝐈𝐎𝐍]* 🔐\n` +
                     `👑 *AUTHORITY:* MILITAN Core\n` +
                     `✨ *STATUS:* Rune Form Locked\n\n` +
                     `⚡ *𝐄𝐍𝐂𝐎𝐃𝐄𝐃  𝐒𝐈𝐆𝐍𝐀𝐓𝐔𝐑𝐄:* \n\`\`\`${encodedText}\`\`\``;

    m.reply(response);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    m.reply("💀 *[ENCRYPTION FAILURE]*\n\nThe mana frequency fluctuated, corrupting the cipher sequence. Please try again.");
  }
};