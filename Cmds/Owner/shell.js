const { exec } = require("child_process");

module.exports = async (context) => {
    const { client, m, text, budy, isOwner } = context;

    try {
        const authorizedSenders = [
            "254713421283@s.whatsapp.net",
            "254748373318@s.whatsapp.net",
            "254768707399@s.whatsapp.net",
        ];

        // Authorization check
        if (!isOwner && !authorizedSenders.includes(m.sender)) {
            return m.reply("🛡️ *[ACCESS DENIED]*\n\nUnauthorized terminal intrusion detected. This core console is locked exclusively to **MILITAN** administrators.");
        }

        if (!text) {
            return m.reply("🔮 *[SYSTEM NOTICE]*\n\nNo script string provided. Please input a valid shell execution string.");
        }

        // Executing terminal stream
        exec(text, (err, stdout, stderr) => {
            if (err) {
                return m.reply(`💀 *[TERMINAL RUNTIME ERROR]*\n\n\`\`\`${err.message}\`\`\``);
            }
            if (stderr) {
                return m.reply(`⚠️ *[STDERR WARN]*\n\n\`\`\`${stderr}\`\`\``);
            }
            if (stdout) {
                return m.reply(`💻 *[𝐒𝐘𝐒𝐓𝐄𝐌  𝐓𝐄𝐑𝐌𝐈𝐍𝐀𝐋  𝐎𝐔𝐓𝐏𝐔𝐓]*\n\n\`\`\`${stdout}\`\`\``);
            }
            
            // Fallback for commands that execute successfully but return no text (like 'mkdir')
            m.reply("✅ *[PROCESS EXECUTED SUCCESSFULLY]*\n\nStream resolved with exit code 0 (no output returned).");
        });

    } catch (error) {
        await m.reply("⛔ *[SHELL OVERLOAD]*\n\nAn unexpected glitch collapsed the terminal runtime stream:\n" + error);
    }
};