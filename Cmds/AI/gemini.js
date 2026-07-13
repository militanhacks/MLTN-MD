const fetch = require("node-fetch");

module.exports = async (context) => {
  const { client, m, text, sendReply, sendMediaMessage } = context;

  const apis = [
    `https://vapis.my.id/api/gemini?q=${encodeURIComponent(text)}`,
    `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(text)}`,
    `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(text)}`,
    `https://api.dreaded.site/api/gemini2?text=${encodeURIComponent(text)}`,
    `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(text)}`,
    `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(text)}`
  ];

  try {
    if (!text) {
      return sendReply(client, m, "🔮 *[SYSTEM NOTICE]*\n\nInput query missing. State your question to the System interface.");
    }

    // Display a quick stylized loading cue
    // m.reply("⚡ *Connecting to the Great Archive core...*");

    for (const api of apis) {
      try {
        const data = await fetch(api);
        const msgg = await data.json();

        // Checking if the API response is successful
        if (msgg.message || msgg.data || msgg.answer || msgg.result) {
          const rawAnswer = msgg.message || msgg.data || msgg.answer || msgg.result;
          
          // Elevating the response with a sleek, premium interface layout
          const stylizedResponse = `👁️‍🗨️ *[𝐒𝐘𝐒𝐓𝐄𝐌  𝐈𝐍𝐓𝐄𝐑𝐅𝐀𝐂𝐄  𝐋𝐎𝐆]*\n` +
                                   `👑 *AUTHORITY:* MILITAN Core Engine\n` +
                                   `🌐 *DECRYPT STATUS:* Successful\n\n` +
                                   `${rawAnswer}`;
                                   
          await sendReply(client, m, stylizedResponse);
          return;
        }
      } catch (e) {
        // Continue to the next API link if one fails or times out
        continue;
      }
    }

    // If all APIs in the array fall through
    sendReply(client, m, "💀 *[CRITICAL DISCONNECT]*\n\nAll remote calculation archives are currently inaccessible. Your mana connection is unstable.");
  } catch (e) {
    sendReply(client, m, '⛔ *[INTERFACE ERROR]*\n\nAn unexpected anomaly broke the terminal stream:\n' + e);
  }
};