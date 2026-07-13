module.exports = async (context) => {
  const { client, m, sendReply, author, botname } = context;

  try {
    const imageUrl = "https://files.catbox.moe/k0s0qs.webp"; 

    // ✦ REEDIT FRAME 1: Deploy base image platform with initial tracker setup (Cleaned of ad banners)
    const { key } = await client.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: '⚡ *Locating Host Repository Assets...*',
      contextInfo: {
        mentionedJid: [m.sender]
      }
    }, { quoted: m });

    // Fetch repository data dynamically from GitHub API
    let repoInfo = { stars: 0, forks: 0, lastUpdate: new Date(), createdAt: new Date(), url: "https://github.com/militanhacks/MLTN-MD" };
    
    try {
      const response = await fetch("tps://api.github.com/repos/Keithkeizzah/KEITH-MDht");
      const repoData = await response.json();
      if (repoData && repoData.id) {
        repoInfo.stars = repoData.stargazers_count || 0;
        repoInfo.forks = repoData.forks_count || 0;
        repoInfo.lastUpdate = repoData.updated_at;
        repoInfo.createdAt = repoData.created_at;
        repoInfo.url = repoData.html_url || repoInfo.url;
      }
    } catch (apiError) {
      console.error("GitHub Fetch Warning:", apiError);
    }

    const createdDate = new Date(repoInfo.createdAt).toLocaleDateString("en-GB");
    const lastUpdateDate = new Date(repoInfo.lastUpdate).toLocaleDateString("en-GB");

    // ✦ REEDIT FRAME 2: Morphing caption text cleanly without ads
    await new Promise(resolve => setTimeout(resolve, 800));
    await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: '⛩️ *Extracting Sovereign Metrics & Statistics...*', edit: key });

    const messageCaption = `✦━━━━━━━━━━━━━━✦
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

𝐀𝐑𝐈𝐒𝐄. 𝐓𝐇𝐄 𝐇𝐔𝐍𝐓 𝐁𝐄𝐆𝐈𝐍𝐒 ⚡`;

    // ✦ FINAL REEDIT FRAME: Final database layout morph completion
    await new Promise(resolve => setTimeout(resolve, 600));
    await client.sendMessage(m.chat, { image: { url: imageUrl }, caption: messageCaption, edit: key });

  } catch (error) {
    console.error("Error:", error);
    await sendReply(client, m, `System Error: ${error.message}`);
  }
};