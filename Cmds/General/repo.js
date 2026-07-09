module.exports = async (context) => {
  const { client, m, sendReply, author, botname, sendMediaMessage } = context;

  try {
    
    const response = await fetch("https://api.github.com/repos/Keithkeizzah/KEITH-MD");
    const repoData = await response.json();

    
    const repoInfo = {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      lastUpdate: repoData.updated_at,
      owner: repoData.owner.login,
      createdAt: repoData.created_at,
      url: repoData.html_url
    };

    
    const createdDate = new Date(repoInfo.createdAt).toLocaleDateString("en-GB");
    const lastUpdateDate = new Date(repoInfo.lastUpdate).toLocaleDateString("en-GB");

    
    const messageCaption = `
✦━━━━━━━━━━━━━━✦
⛧ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 ⛧
✦━━━━━━━━━━━━━━✦

💀 ${botname} 𝐡𝐚𝐬 𝐚𝐰𝐚𝐤𝐞𝐧𝐞𝐝 👁️‍🗨️
🔮 𝐒𝐮𝐦𝐦𝐨𝐧𝐞𝐝 𝐛𝐲 𝐭𝐡𝐞 𝐒𝐡𝐚𝐝𝐨𝐰 𝐌𝐨𝐧𝐚𝐫𝐜𝐡 — ${author} 👑
⚔️ 𝐍𝐨 𝐨𝐫𝐝𝐢𝐧𝐚𝐫𝐲 𝐡𝐮𝐧𝐭𝐞𝐫 𝐛𝐮𝐢𝐥𝐭 𝐭𝐡𝐢𝐬 𝐜𝐨𝐝𝐞 — 𝐨𝐧𝐥𝐲 𝐭𝐡𝐨𝐬𝐞 𝐰𝐡𝐨 𝐚𝐫𝐨𝐬𝐞 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐬𝐡𝐚𝐝𝐨𝐰𝐬 🌑

🌟 𝐒𝐭𝐚𝐫 𝐭𝐡𝐢𝐬 𝐫𝐞𝐩𝐨 𝐭𝐨 𝐣𝐨𝐢𝐧 𝐭𝐡𝐞 𝐫𝐚𝐧𝐤𝐬 🌟

╭─❍͙۪۫ ⋆ ❍͙۪۫─╮
🗡️ *Stars:* ${repoInfo.stars} ⭐
🗡️ *Forks:* ${repoInfo.forks} 🍴
🗡️ *Release Date:* ${createdDate} 📅
🗡️ *Last Update:* ${lastUpdateDate} ⏳
🗡️ *Owner:* ${author} 👑
🗡️ *Repository:* ${repoInfo.url} 🔗
╰─❍͙۪۫ ⋆ ❍͙۪۫─╯

𝐀𝐑𝐈𝐒𝐄. 𝐓𝐇𝐄 𝐇𝐔𝐍𝐓 𝐁𝐄𝐆𝐈𝐍𝐒 ⚡
`;

    
    const imageUrl = "https://files.catbox.moe/k0s0qs.webp"; 

    
    await sendMediaMessage(client, m, {
      image: imageUrl,
      text: messageCaption
    });

  } catch (error) {
    console.error("Error:", error);
    await sendReply(client, m, 'An unexpected error occurred while generating the repo information.');
  }
};
