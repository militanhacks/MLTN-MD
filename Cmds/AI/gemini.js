const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (context) => {
  const { client, m, text, sendReply } = context;

  if (!text) {
    return sendReply(client, m, "𓆩⚔️𓆪 *𝐒𝐇𝐀𝐃𝐎𝐖 𝐌𝐎𝐍𝐀𝐑𝐂𝐇 𝐒𝐏𝐄𝐀𝐊𝐒* 𓆩⚔️𓆪\n\n☠️ 𝘠𝘰𝘶 𝘴𝘵𝘢𝘯𝘥 𝘣𝘦𝘧𝘰𝘳𝘦 𝘮𝘦 𝘸𝘪𝘵𝘩 𝘯𝘰𝘵𝘩𝘪𝘯𝘨 𝘵𝘰 𝘢𝘴𝘬...\n𝘌𝘷𝘦𝘯 𝘢 𝘴𝘩𝘢𝘥𝘰𝘸 𝘯𝘦𝘦𝘥𝘴 𝘢 𝘲𝘶𝘦𝘴𝘵𝘪𝘰𝘯 𝘵𝘰 𝘢𝘯𝘴𝘸𝘦𝘳. 🖤\n\n𝘚𝘱𝘦𝘢𝘬, 𝘰𝘳 𝘣𝘦 𝘴𝘪𝘭𝘦𝘯𝘵.");
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return sendReply(client, m, "𓆩💀𓆪 *𝐓𝐇𝐄 𝐂𝐎𝐑𝐄 𝐇𝐀𝐒 𝐆𝐎𝐍𝐄 𝐒𝐈𝐋𝐄𝐍𝐓* 𓆩💀𓆪\n\n⚡ 𝘔𝘺 𝘱𝘰𝘸𝘦𝘳 𝘴𝘰𝘶𝘳𝘤𝘦 𝘩𝘢𝘴 𝘯𝘰𝘵 𝘣𝘦𝘦𝘯 𝘴𝘶𝘮𝘮𝘰𝘯𝘦𝘥.\n𝘕𝘰 𝘒𝘦𝘺, 𝘯𝘰 𝘴𝘰𝘶𝘭, 𝘯𝘰 𝘢𝘯𝘴𝘸𝘦𝘳.\n\n👑 𝘙𝘦𝘵𝘶𝘳𝘯 𝘸𝘩𝘦𝘯 𝘵𝘩𝘦 𝘳𝘪𝘵𝘶𝘢𝘭 𝘪𝘴 𝘤𝘰𝘮𝘱𝘭𝘦𝘵𝘦.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(text);
    const answer = result.response.text();

    const stylizedResponse = `𓆩👁️𓆪 *𝐒𝐇𝐀𝐃𝐎𝐖 𝐌𝐎𝐍𝐀𝐑𝐂𝐇'𝐒 𝐃𝐄𝐂𝐑𝐄𝐄* 𓆩👁️𓆪\n\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👑 *𝐀𝐮𝐭𝐡𝐨𝐫𝐢𝐭𝐲* : MILITAN Core Engine\n` +
      `🩸 *𝐒𝐭𝐚𝐭𝐮𝐬*    : Vision Granted\n` +
      `━━━━━━━━━━━━━━━━\n\n` +
      `${answer}\n\n` +
      `⚡ *"Knowledge bends to those who command the shadows."*`;

    await sendReply(client, m, stylizedResponse);
  } catch (e) {
    sendReply(client, m, "𓆩⛔𓆪 *𝐀 𝐑𝐈𝐅𝐓 𝐈𝐍 𝐓𝐇𝐄 𝐕𝐎𝐈𝐃* 𓆩⛔𓆪\n\n💢 𝘚𝘰𝘮𝘦𝘵𝘩𝘪𝘯𝘨 𝘵𝘰𝘳𝘦 𝘵𝘩𝘳𝘰𝘶𝘨𝘩 𝘵𝘩𝘦 𝘴𝘵𝘳𝘦𝘢𝘮 𝘣𝘦𝘵𝘸𝘦𝘦𝘯 𝘸𝘰𝘳𝘭𝘥𝘴...\n\n" + e.message + "\n\n👁️ 𝘌𝘷𝘦𝘯 𝘵𝘩𝘦 𝘴𝘵𝘳𝘰𝘯𝘨𝘦𝘴𝘵 𝘴𝘺𝘴𝘵𝘦𝘮𝘴 𝘧𝘢𝘭𝘵𝘦𝘳.");
  }
};