module.exports = async (context) => {
  const { client, m, text, sendReply, isOwner, prefix } = context;
  const botState = require('../../lib/botState');

  if (!isOwner) {
    return sendReply(client, m, "𓆩⛔𓆪 *𝐎𝐍𝐋𝐘 𝐓𝐇𝐄 𝐌𝐎𝐍𝐀𝐑𝐂𝐇 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 𝐓𝐇𝐈𝐒* 𓆩⛔𓆪\n\n☠️ 𝘛𝘩𝘪𝘴 𝘱𝘰𝘸𝘦𝘳 𝘪𝘴 𝘯𝘰𝘵 𝘺𝘰𝘶𝘳𝘴 𝘵𝘰 𝘸𝘪𝘦𝘭𝘥.");
  }

  const choice = (text || '').toLowerCase().trim();

  if (choice === 'public' || choice === 'private') {
    botState.mode = choice;
    return sendReply(client, m,
      `𓆩👑𓆪 *𝐒𝐘𝐒𝐓𝐄𝐌 𝐑𝐄𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐄𝐃* 𓆩👑𓆪\n\n` +
      `🌑 𝐓𝐡𝐞 𝐫𝐞𝐚𝐥𝐦 𝐢𝐬 𝐧𝐨𝐰 𝐬𝐞𝐭 𝐭𝐨 *${choice.toUpperCase()}* 𝐦𝐨𝐝𝐞.\n\n` +
      `${choice === 'private' ? '🔒 𝘖𝘯𝘭𝘺 𝘵𝘩𝘦 𝘔𝘰𝘯𝘢𝘳𝘤𝘩 𝘮𝘢𝘺 𝘤𝘰𝘮𝘮𝘢𝘯𝘥 𝘵𝘩𝘦 𝘴𝘩𝘢𝘥𝘰𝘸𝘴 𝘯𝘰𝘸.' : '🌐 𝘈𝘭𝘭 𝘸𝘩𝘰 𝘥𝘢𝘳𝘦 𝘮𝘢𝘺 𝘯𝘰𝘸 𝘴𝘶𝘮𝘮𝘰𝘯 𝘵𝘩𝘦 𝘴𝘩𝘢𝘥𝘰𝘸𝘴.'}`
    );
  }

  return sendReply(client, m,
    `𓆩⚔️𓆪 *𝐂𝐇𝐎𝐎𝐒𝐄 𝐘𝐎𝐔𝐑 𝐃𝐄𝐂𝐑𝐄𝐄* 𓆩⚔️𓆪\n\n` +
    `➤ *${prefix}mode public*\n➤ *${prefix}mode private*`
  );
};