const { botname } = require(__dirname + "/../../settings");
const speed = require("performance-now");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loading(m, client) {
  const loadingSymbols = ["🖤", "⚔️", "🩸", "👁️", "🌑", "👑"];
  let { key } = await client.sendMessage(m.chat, { text: '𓆩⚔️𓆪 *Measuring the Monarch\'s reflexes...* 𓆩⚔️𓆪' });

  for (let i = 0; i < loadingSymbols.length; i++) {
    await client.sendMessage(m.chat, { text: loadingSymbols[i], edit: key });
    await delay(500);
  }

  await client.sendMessage(m.chat, { delete: key });
}

module.exports = async (context) => {
  const { client, m } = context;

  try {
    const timestamp = speed();
    const pingSpeed = speed() - timestamp;

    let customContactMessage = {
      key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' },
      message: {
        contactMessage: {
          displayName: botname,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${botname}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        },
      },
    };

    await client.sendMessage(m.chat, { text: `⚡ *${pingSpeed.toFixed(4)}ms* — even shadows move faster than light.` }, { quoted: customContactMessage });

    await loading(m, client);

  } catch (error) {
    console.error("Error sending message:", error);
    m.reply('⛔ The shadows faltered mid-response.');
  }
};