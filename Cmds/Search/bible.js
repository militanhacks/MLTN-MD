module.exports = async (context) => {
    const { client, m, text, sendReply, botname, sendMediaMessage } = context;

    try {
        if (!text) {
            return await sendReply(client, m, '📜 *[SYSTEM PROMPT]*\n\nPlease specify the sacred text reference.\n\n✨ *Example:* .bible john 3:16');
        }

        const reference = encodeURIComponent(text);
        const apiUrl = `https://bible-api.com/${reference}?translation=kjv`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        if (!data?.reference) throw new Error('Invalid scripture reference');

        // Beautifully structured scriptural display matching your sleek interface
        const bibleText = `⛩️ ━━━━━━━━━━━━━━━━━━━━ ⛩️\n` +
                          `📜  *𝐌𝐈𝐋𝐈𝐓𝐀𝐍  𝐌𝐃  𝐒𝐂𝐑𝐈𝐏𝐓𝐔𝐑𝐄𝐒*  📜\n` +
                          `⛩️ ━━━━━━━━━━━━━━━━━━━━ ⛩️\n\n` +
                          `📖 *📖 REFERENCE:* ${data.reference}\n` +
                          `✨ * VERSES:* ${data.verses.length}\n` +
                          `📚 * TRANSLATION:* ${data.translation_name}\n\n` +
                          `💬 *─── TEXT CHRONICLE ───*\n\n` +
                          `*${data.text.trim()}*\n\n` +
                          `📡 *DATABASE LINK:* MILITAN Engine Core`;

        await sendMediaMessage(client, m, { text: bibleText });

    } catch (error) {
        console.error('Bible Module Error:', error);
        const errorMessage = error.message.includes('Invalid') 
            ? '❌ *[VALIDATION ERROR]*\n\nScripture reference not found inside the ancient text logs. Example: .bible john 3:16' 
            : '⛔ *[CONNECTIVITY EXCEPTION]*\n\nFailed to sync with the remote archive stream. Try again later.';
        await sendReply(client, m, errorMessage);
    }
};