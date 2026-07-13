const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) {
            return m.reply("🔮 *[SYSTEM NOTICE]*\n\nNo query parameters defined. What topic do you wish to cross-reference across the global data index?\n\n✨ *Example:* .google Quantum Computing Basics");
        }

        // Trigger network scanning reaction icon
        await client.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

        // Build request parameters safely with proper URI component encryption
        const apiKey = "AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI";
        const cxId = "baf9bdb0c631236e5";
        const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(text.trim())}&key=${apiKey}&cx=${cxId}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        // Critical Safety Fix: Defensive evaluation check since Google omits .items completely on 0 results
        if (!data || !data.items || data.items.length === 0) {
            return m.reply("🔮 *[INDEX BLANK]*\n\nGoogle's global registry returned zero active node matches for that query descriptor.");
        }

        // Build premium console manifest text layout
        let searchManifest = `🖥️ *[𝗚𝗢𝗢𝗚𝗟𝗘  𝗜𝗡𝗧𝗘𝗟𝗟𝗜𝗚𝗘𝗡𝗖𝗘  𝗠𝗔𝗧𝗥𝗜𝗫]* 🖥️\n\n` +
                             `🔎 *Query Term:* "${text.trim()}"\n` +
                             `📊 *Indexed Nodes:* ${data.items.length} top records mapped\n\n` +
                             `⚔️ *𝐃𝐈𝐆𝐈𝐓𝐀𝐋  𝐒𝐔𝐑𝐅𝐀𝐂𝐄  𝐑𝐄𝐒𝐔𝐋𝐓𝐒:* ⚔️\n\n`;

        // Loop systematically through each element item payload
        for (let i = 0; i < data.items.length; i++) {
            const item = data.items[i];
            searchManifest += `🔹 *[RECORD ${i + 1}]* 🔹\n` +
                              `🪧 *Title:* ${item.title || 'Untitled Grid'}\n` +
                              `🖥️ *Summary:* ${item.snippet ? item.snippet.replace(/\n/g, ' ') : 'No description trace archived.'}\n` +
                              `🌐 *Bypass Link:* ${item.link || 'Resource Link Uncached'}\n` +
                              `----------------------------\n`;
        }

        searchManifest += `\n👑 *Network Enforcer:* MILITAN Search Node Core`;

        await m.reply(searchManifest.trim());

    } catch (error) {
        console.error("Fatal exception inside Google Core infrastructure layer:", error);
        
        // Handle explicit quota/key errors elegantly without breaking context
        if (error.response?.status === 403) {
            return m.reply("💀 *[GATEWAY DENIED]*\n\nThe embedded Google API token has either expired or reached its maximum daily query allocation quota.");
        }
        
        await m.reply("💀 *[INTELLIGENCE REJECTION]*\n\nThe indexing gateway dropped the connection channel: " + error.message);
    }
};