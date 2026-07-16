const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

module.exports = async (context) => {
  const { client, m, text, sendReply } = context;

  if (!text) {
    return sendReply(client, m, "𓆩⚔️𓆪 *𝐒𝐇𝐀𝐃𝐎𝐖 𝐌𝐎𝐍𝐀𝐑𝐂𝐇 𝐒𝐏𝐄𝐀𝐊𝐒* 𓆩⚔️𓆪\n\n☠️ 𝘠𝘰𝘶 𝘴𝘵𝘢𝘯𝘥 𝘣𝘦𝘧𝘰𝘳𝘦 𝘮𝘦 𝘸𝘪𝘵𝘩 𝘯𝘰𝘵𝘩𝘪𝘯𝘨 𝘵𝘰 𝘢𝘴𝘬...\n𝘌𝘷𝘦𝘯 𝘢 𝘴𝘩𝘢𝘥𝘰𝘸 𝘯𝘦𝘦𝘥𝘴 𝘢 𝘲𝘶𝘦𝘴𝘵𝘪𝘰𝘯 𝘵𝘰 𝘢𝘯𝘴𝘸𝘦𝘳. 🖤");
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: text }],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices[0].message.content;

    const stylizedResponse = `𓆩👁️𓆪 *𝐒𝐇𝐀𝐃𝐎𝐖 𝐌𝐎𝐍𝐀𝐑𝐂𝐇'𝐒 𝐃𝐄𝐂𝐑𝐄𝐄* 𓆩👁️𓆪\n\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👑 *𝐀𝐮𝐭𝐡𝐨𝐫𝐢𝐭𝐲* : MILITAN Core Engine\n` +
      `🩸 *𝐒𝐭𝐚𝐭𝐮𝐬*    : Vision Granted\n` +
      `━━━━━━━━━━━━━━━━\n\n` +
      `${answer}\n\n` +
      `⚡ *"Knowledge bends to those who command the shadows."*`;

    await sendReply(client, m, stylizedResponse);
  } catch (e) {
    sendReply(client, m, "𓆩⛔𓆪 *𝐀 𝐑𝐈𝐅𝐓 𝐈𝐍 𝐓𝐇𝐄 𝐕𝐎𝐈𝐃* 𓆩⛔𓆪\n\n💢 𝘚𝘰𝘮𝘦𝘵𝘩𝘪𝘯𝘨 𝘵𝘰𝘳𝘦 𝘵𝘩𝘳𝘰𝘶𝘨𝘩 𝘵𝘩𝘦 𝘴𝘵𝘳𝘦𝘢𝘮 𝘣𝘦𝘵𝘸𝘦𝘦𝘯 𝘸𝘰𝘳𝘭𝘥𝘴...\n\n" + (e.response?.data?.error?.message || e.message));
  }
};