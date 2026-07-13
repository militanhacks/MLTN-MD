const fetch = require("node-fetch");

module.exports = async (context) => {
  const { client, m, text, sendReply } = context;

  try {
    if (!text) {
      return await sendReply(client, m, "🔮 *[SYSTEM NOTICE]*\n\nPlease provide a title string to scan across the movie database registry.\n\n✨ *Example:* .search Marvel");
    }

    // Trigger radar processing reaction icon
    await client.sendMessage(m.chat, { react: { text: '📡', key: m.key } });

    // Query database registry for matching title arrays
    const apiUrl = `https://apis-keith.vercel.app/movie/sinhalasub/search?text=${encodeURIComponent(text.trim())}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Critical Safety Guard: Structural optional chaining verification checks
    if (!data?.status || !data?.result?.data || !data.result.data.length) {
      return await sendReply(client, m, "🔮 *[RADAR BLANK]*\n\nNo matches localized on the data grid for that specific title query.");
    }

    // Build the high-tier premium indexed list layout
    let resultMessage = `🖥️ *[𝐌𝐈𝐋𝐈𝐓𝐀𝐍  𝐆𝐑𝐈𝐃  𝐌𝐀𝐓𝐑𝐈𝐗]* 🖥️\n\n` +
                        `🔎 *Query Reference:* "${text.trim()}"\n` +
                        `📊 *Total Matches Localized:* ${data.result.data.length} entries\n\n` +
                        `⚔️ *𝐃𝐈𝐆𝐈𝐓𝐀𝐋  𝐀𝐒𝐒𝐄𝐓  𝐌𝐀𝐍𝐈𝐅𝐄𝐒𝐓:* ⚔️\n\n`;

    // Loop cleanly through each item in the data array
    data.result.data.forEach((item, index) => {
      if (item && item.title) {
        resultMessage += `🔹 *[ENTRY ${index + 1}]* 🔹\n` +
                         `📦 *Title:* ${item.title}\n` +
                         `🔗 *Resource:* ${item.link || 'No URL Available'}\n` +
                         `----------------------------\n`;
      }
    });

    resultMessage += `\n👑 *Registry Master:* MILITAN Search Node Core`;

    // Send the compiled grid message as a reply
    await sendReply(client, m, resultMessage.trim());

  } catch (error) {
    console.error('Fatal movie matrix indexing exception:', error);
    return await sendReply(client, m, `💀 *[MATRIX DESYNC FAULT]*\n\nThe internal search registry module collapsed while indexing results:\n\`\`\`${error.message}\`\`\``);
  }
};