const ownerMiddleware = require('../../Middleware/ownerMiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, participants, text } = context;

        // Extract the country code parameter from args[0] cleanly
        const countryCode = args[0] ? args[0].replace('+', '').trim() : null;

        if (!countryCode || isNaN(countryCode)) {
            return m.reply("🔮 *[SYSTEM NOTICE]*\n\nPlease provide a targeted country code prefix for the regional mention.\n\n✨ *Format:* .tagcode [code] [message]\n⚡ *Example:* .tagcode 254 Expedition initialization!");
        }

        // Clean up the text payload to strip out the leading country code string parameter
        // This stops the code number from duplicating inside your clean message field
        const regionalMessage = text ? text.replace(args[0], '').trim() : 'Attention target regional units! No message attached.';

        // Filter participants based on country code match parameters
        const filteredParticipants = participants.filter(member => {
            const memberPhoneNumber = member.id.split('@')[0];
            return memberPhoneNumber.startsWith(countryCode);
        });

        // Fail-safe escape condition
        if (filteredParticipants.length === 0) {
            return m.reply(`🔮 *[REGIONAL SECTOR BLANK]*\n\nNo active hunter units found matching the prefix (+${countryCode}) inside this chat instance.`);
        }

        // Start composing the high-tier targeted assembly broadcast panel text layout
        let regionalTxt = `📡 *[TARGETED BATTALION SUMMONS]* 📡\n\n` +
                          `🌍 *Sector Target:* Region Code (+${countryCode})\n` +
                          `👤 *convoker:* ${m.pushName || 'High-Rank Operator'}\n` +
                          `💬 *Directive:* "${regionalMessage}"\n\n` +
                          `⚔️ *𝐑𝐄𝐆𝐈𝐎𝐍𝐀𝐋  𝐒𝐐𝐔𝐀𝐃  𝐌𝐀𝐍𝐈𝐅𝐄𝐒𝐓:* ⚔️\n\n`;

        // Loop through the filtered array to append individual click-to-view tag links
        filteredParticipants.forEach((mem, index) => {
            regionalTxt += `${index + 1}. 🛡️ @${mem.id.split('@')[0]}\n`;
        });

        regionalTxt += `\n👑 *Squad Grid:* MILITAN Regional Ops Command`;

        try {
            // Added critical await modifier to guarantee stable execution streaming
            await client.sendMessage(m.chat, { 
                text: regionalTxt, 
                mentions: filteredParticipants.map(a => a.id) 
            }, { quoted: m });

        } catch (error) {
            console.error("Error executing regional tag code summon:", error);
            await m.reply("💀 *[SUMMONS COOLDOWN FAULT]*\n\nThe local broadcast array dropped the tracking packets mid-stream.");
        }
    });
};