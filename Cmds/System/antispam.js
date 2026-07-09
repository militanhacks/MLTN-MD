const { performance } = require('perf_hooks');
const ownerMiddleware = require("../../utility/botUtil/Ownermiddleware");
module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, text } = context;
    if (!chats[m.chat]?.antiSpam || m.isBaileys || m.mtype === 'protocolMessage' || m.mtype === 'pollUpdateMessage' || m.mtype === 'reactionMessage') {
      return;
    }
    if (!m.msg || !m.message || m.key.remoteJid !== m.chat || users[m.sender]?.banned || chats[m.chat]?.isBanned) {
      return;
    }
    client.spam = client.spam || {};
    client.spam[m.sender] = client.spam[m.sender] || { count: 0, lastspam: 0 };
    const now = performance.now();
    const timeDifference = now - client.spam[m.sender].lastspam;
    if (timeDifference < 10000) {
      client.spam[m.sender].count++;
      if (client.spam[m.sender].count >= 5) {
        users[m.sender].banned = true;
        client.spam[m.sender].lastspam = now + 5000;

        // 💥 Immediate Punishment Warning Card
        const messageType = m.mtype.replace(/message$/i, '').replace('audio', m.msg.ptt ? 'PTT' : 'audio').replace(/^./, v => v.toUpperCase()) || 'Unknown';
        m.reply(`🌑 *[ SYSTEM LAW: EXECUTIVE DECREE ]*\n\n` +
                `_Your primitive attempt to flood this server with [ ${messageType} ] traffic has been neutralized._\n\n` +
                `👑 _Survival is winning — everything else is just noise. Enjoy the silence of the void._ ⛓️`);

        // ⏳ Reset the ban and spam count after the cooldown period
        setTimeout(() => {
          users[m.sender].banned = false;
          client.spam[m.sender].count = 0;
          m.reply(`🌐 *[ CORE RESTORATION COMPLETE ]*\n` +
                  `═\n` +
                  `🔓 _Firewall lockdown lifted. Localized node distortion normalized. Data streams are clean and operational._`);
        }, 5000);
      }
    } else {
      // Reset the spam count if enough time has passed
      client.spam[m.sender].count = 0;
    }

    // Update the last spam timestamp for the sender
    client.spam[m.sender].lastspam = now;
  });
};