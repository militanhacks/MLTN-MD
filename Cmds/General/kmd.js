module.exports = async (context) => {
  const { client, m } = context;

  const videoUrls = [
    "https://files.catbox.moe/8gdmwt.mp4",
    "https://files.catbox.moe/rvsa8e.mp4",
    "https://files.catbox.moe/9vi52x.mp4",
    "https://files.catbox.moe/qvs84n.mp4",
    "https://files.catbox.moe/j1xeqm.mp4",
    "https://files.catbox.moe/5b7b5d.mp4",
    "https://files.catbox.moe/krd77m.mp4",
    "https://files.catbox.moe/kdk22x.mp4",
    "https://files.catbox.moe/anbl9w.mp4",
    "https://files.catbox.moe/a9491n.mp4",
    "https://telegra.ph/file/08f740224ed39233f92cb.mp4"
  ];

  try {
    const response = await fetch("https://api.github.com/repos/militanhacks/MLTN-MD");
    const repoData = await response.json();

    if (repoData) {
      const { stargazers_count, forks_count } = repoData;

      const messageText = `
𓆩👑𓆪 *𝐒𝐇𝐀𝐃𝐎𝐖 𝐀𝐑𝐌𝐘 𝐂𝐄𝐍𝐒𝐔𝐒* 𓆩👑𓆪

━━━━━━━━━━━━━━━━
🩸 𝐓𝐨𝐭𝐚𝐥 𝐒𝐡𝐚𝐝𝐨𝐰𝐬 𝐄𝐧𝐥𝐢𝐬𝐭𝐞𝐝 : ${forks_count}
⭐ 𝐒𝐨𝐮𝐥𝐬 𝐖𝐡𝐨 𝐁𝐨𝐰𝐞𝐝 : ${stargazers_count}
━━━━━━━━━━━━━━━━

⚡ 𝘛𝘩𝘦 𝘢𝘳𝘮𝘺 𝘨𝘳𝘰𝘸𝘴 𝘸𝘪𝘵𝘩 𝘦𝘷𝘦𝘳𝘺 𝘴𝘰𝘶𝘭 𝘵𝘩𝘢𝘵 𝘫𝘰𝘪𝘯𝘴 𝘵𝘩𝘦 𝘴𝘩𝘢𝘥𝘰𝘸𝘴.

👑 *𝐒𝐭𝐚𝐲 𝐥𝐨𝐲𝐚𝐥 𝐭𝐨 𝐌𝐋𝐓𝐍-𝐌𝐃*

⛧ 𝑹𝒆𝒈𝒂𝒓𝒅𝒔, 𝒕𝒉𝒆 𝑺𝒉𝒂𝒅𝒐𝒘 𝑴𝒐𝒏𝒂𝒓𝒄𝒉 ⛧
      `;

      const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

      const messageToSend = {
        video: {
          url: randomVideoUrl
        },
        caption: messageText,
        externalAdReply: {
          title: "𓆩⚔️𓆪 𝐌𝐋𝐓𝐍-𝐌𝐃 𓆩⚔️𓆪",
          body: "Powered by the Shadow Monarch",
          mediaType: 1,
        }
      };

      await client.sendMessage(m.chat, messageToSend);
    } else {
      console.error("Could not fetch data from GitHub API.");
    }
  } catch (error) {
    console.error("Error fetching data or sending message:", error);
  }
};