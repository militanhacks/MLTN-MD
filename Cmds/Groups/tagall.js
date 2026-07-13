const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, participants, text } = context;

        try {
            // Signal dispatch initialization
            await client.sendMessage(m.chat, { react: { text: '📢', key: m.key } });

            const cleanMessage = text ? text.trim() : 'Attention all squad units! No message attached.';

            // Start composing the high-tier grand assembly broadcast panel text layout
            let summonTxt = `📢 *[GRAND GUILD SUMMONS]* 📢\n\n` +
                            `👤 *convoker:* ${m.pushName || 'High-Rank Operator'}\n` +
                            `💬 *Directive:* "${cleanMessage}"\n\n` +
                            `⚔️ *𝐑𝐄𝐂𝐑𝐔𝐈𝐓  𝐒𝐐𝐔𝐀𝐃  𝐌𝐀𝐍𝐈𝐅𝐄𝐒𝐓:* ⚔️\n\n`;

            // Loop through the participants array tracking and indexing them 
            participants.forEach((mem, index) => {
                summonTxt += `${index + 1}. 🛡️ @${mem.id.split('@')[0]}\n`;
            });

            summonTxt += `\n👑 *Squad Grid:* MILITAN Operational Command`;

            // Map participant objects directly into raw click-to-view JID strings
            const mentionMap = participants.map(p => p.id);

            // Added critical await modifier to guarantee stable execution streaming
            await client.sendMessage(m.chat, { 
                text: summonTxt, 
                mentions: mentionMap 
            }, { quoted: m });

        } catch (error) {
            console.error("Error executing mass summon command:", error);
            // Non-breaking fallback alert notice
            await client.sendMessage(m.chat, { 
                text: "💀 *[SUMMONS COOLDOWN FAULT]*\n\nThe vocal calling system failed to interface with the participant database stream." 
            }, { quoted: m });
        }
    });
};