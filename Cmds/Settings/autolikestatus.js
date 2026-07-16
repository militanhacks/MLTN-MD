const { setSetting } = require('../Utility/settingsdb');

module.exports = async (context) => {
  const { m, text } = context;

  const input = (text || '').trim().toLowerCase();

  if (input !== 'true' && input !== 'false') {
    return m.reply(
      "𓆩⚔️𓆪 *[𝐈𝐍𝐂𝐎𝐑𝐑𝐄𝐂𝐓 𝐃𝐄𝐂𝐑𝐄𝐄]* 𓆩⚔️𓆪\n\n" +
      "✨ *Correct Form:*\n" +
      "🔹 `.autolikestatus true`\n" +
      "🔹 `.autolikestatus false`"
    );
  }

  try {
    await setSetting('AUTOLIKE_STATUS', input);
    await m.reply(
      `𓆩⚙️𓆪 *[𝐒𝐘𝐒𝐓𝐄𝐌 𝐑𝐄𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐄𝐃]* 𓆩⚙️𓆪\n\n` +
      `🔹 *AUTOLIKE_STATUS* is now set to \`${input}\`\n\n` +
      `⚡ 𝘛𝘢𝘬𝘦𝘴 𝘦𝘧𝘧𝘦𝘤𝘵 𝘪𝘮𝘮𝘦𝘥𝘪𝘢𝘵𝘦𝘭𝘺 — 𝘯𝘰 𝘳𝘦𝘴𝘵𝘢𝘳𝘵 𝘯𝘦𝘦𝘥𝘦𝘥.`
    );
  } catch (error) {
    console.error('autolikestatus error:', error);
    await m.reply(`𓆩💀𓆪 *[𝐕𝐄𝐒𝐒𝐄𝐋 𝐑𝐄𝐉𝐄𝐂𝐓𝐄𝐃]* 𓆩💀𓆪\n\n\`\`\`${error.message}\`\`\``);
  }
};