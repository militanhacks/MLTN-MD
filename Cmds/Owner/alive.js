module.exports = async (context) => {
  const { client, m, botname } = context;

  const audioFiles = [
    'https://files.catbox.moe/hpwsi2.mp3',
    'https://files.catbox.moe/xci982.mp3',
    'https://files.catbox.moe/utbujd.mp3',
    'https://files.catbox.moe/w2j17k.m4a',
    'https://files.catbox.moe/851skv.m4a',
    'https://files.catbox.moe/qnhtbu.m4a',
    'https://files.catbox.moe/lb0x7w.mp3',
    'https://files.catbox.moe/efmcxm.mp3',
    'https://files.catbox.moe/gco5bq.mp3',
    'https://files.catbox.moe/26oeeh.mp3',
    'https://files.catbox.moe/a1sh4u.mp3',
    'https://files.catbox.moe/vuuvwn.m4a',
    'https://files.catbox.moe/wx8q6h.mp3',
    'https://files.catbox.moe/uj8fps.m4a',
    'https://files.catbox.moe/dc88bx.m4a',
    'https://files.catbox.moe/tn32z0.m4a'
  ];

  const vn = audioFiles[Math.floor(Math.random() * audioFiles.length)];
  const name = m.pushName || client.getName(m.sender);
  const img = 'https://imgur.com/V4rQBZR.png';

  const con = {
    key: {
      fromMe: false,
      participant: `${m.sender.split('@')[0]}@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: '254748387615@s.whatsapp.net' } : {}),
    },
    message: {
      contactMessage: {
        displayName: name,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Hunter\nEND:VCARD`,
      },
    },
  };

  const doc = {
    audio: {
      url: vn,
    },
    mimetype: 'audio/mpeg',
    ptt: false,
    fileName: 'system_wake',
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: '⚠️ [SYSTEM ALERT: MANA PULSE DETECTED]',
        body: `Hunter ${name} — Status: Active | Brand: MILITAN ⚡`,
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  };

  await client.sendMessage(m.chat, doc, { quoted: con });
};