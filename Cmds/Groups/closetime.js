const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    try {
        await middleware(context, async () => {
            const { client, m, args, text, botname, sendReply } = context;

            // Check if args[0] and args[1] are provided
            if (!args[0] || !args[1]) {
                return sendReply(client, m, '🔮 *[SYSTEM NOTICE]*\n\nMissing duration parameters.\n\n✨ *Format:* .close [number] [unit]\n⚡ *Example:* .close 10 minutes');
            }

            let timer;
            // Clean the unit and strip trailing 's' to easily support plurals (e.g., "minutes" -> "minute")
            const timeUnit = args[1].toLowerCase().replace(/s$/, '');

            // Determine the time in milliseconds based on the unit provided
            switch (timeUnit) {
                case 'second':
                    timer = args[0] * 1000;
                    break;
                case 'minute':
                    timer = args[0] * 60000;
                    break;
                case 'hour':
                    timer = args[0] * 3600000;
                    break;
                case 'day':
                    timer = args[0] * 86400000;
                    break;
                default:
                    return sendReply(client, m, '❌ *[VALIDATION ERROR]*\n\nPlease select a valid time unit: seconds, minutes, hours, or days.\n\n✨ *Example:* .close 5 minutes');
            }

            // Notify that the countdown timer has started
            const progressMsg = `⏳ *[DUNGEON GATE TIMER INITIALIZED]*\n\n` +
                                `The System has scheduled a structural lockdown sequence.\n\n` +
                                `⏱️ *Time Window:* ${args[0]} ${args[1]}\n` +
                                `🛡️ *Authority:* MILITAN Command Protocol`;
                                
            sendReply(client, m, progressMsg);

            // Set the timeout for closing the group
            setTimeout(async () => {
                try {
                    const closeMessage = `🔒 *[GATE CLOSURE COMPLETE]* 🔒\n\n` +
                                         `The instance countdown has expired. The Guild chat gates are now officially sealed to standard members.\n\n` +
                                         `👤 *Enforced By:* ${botname}\n` +
                                         `👑 *Monarch Code:* MILITAN`;
                                         
                    await client.groupSettingUpdate(m.chat, 'announcement');
                    sendReply(client, m, closeMessage);
                } catch (err) {
                    console.error("Delayed lock error:", err);
                }
            }, timer);

            // Send a premium status reaction to confirm the setup execution
            await client.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        });
    } catch (error) {
        console.error(error);
        sendReply(client, m, '💀 *[CORE EXCEPTION]*\n\nThe scheduler timeline collided with a database error.');
    }
};